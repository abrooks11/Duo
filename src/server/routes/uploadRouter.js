// ! fileUpload in server.js for browser
// ! multer in uploadRouter for postman

// import express
import express from 'express';
import multer from 'multer';
const upload = multer();

import excelServices from '../services/excelServices.js';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// create a router
const uploadRouter = express.Router();

uploadRouter.post(
  '/:resourceType/:sheetName',
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return next({
          log: 'Error in uploadRouter: No file received',
          status: 400,
          message: { err: 'Please upload a file' },
        });
      }
      console.log('UPLOAD ROUTER req.params', req.params);
      const { resourceType, sheetName } = req.params;
      // console.log("UPLOAD ROUTER req.file", req.file);
      // const { file } = req.file; // for browser
      const excelData = await excelServices.readFile(
        req.file.buffer,
        resourceType,
        sheetName
      );
      console.log('excelData:', excelData.length);

      switch (resourceType) {
        case 'patient':
          console.log('UPSERTING PATIENTS. . . ');

          for (const patientObj of excelData) {
            const { id, ...patientData } = patientObj;

            // First check if the record exists and get its current lastModifiedDate
            const existingPatient = await prisma.patient.findUnique({
              where: { id: id },
            });

            if (existingPatient) {
              // Record exists, check if incoming data is more recent
              const existingDate = new Date(existingPatient.lastModifiedDate);
              const incomingDate = new Date(patientObj.lastModifiedDate);

              if (incomingDate > existingDate) {
                // Incoming data is more recent, update the record
                await prisma.patient.update({
                  where: { id: id },
                  data: patientData,
                });
                console.log('Updated patient record with more recent data');
              } else {
                // console.log('Skipping update - existing data is more recent');
              }
            } else {
              // Record doesn't exist, create it
              await prisma.patient.create({
                data: patientObj,
              });
              // console.log('Created new patient record');
            }
          }
          break;
        case 'appointment':
          const filteredRows = excelData.filter((row) => {
            return row.type === 'Patient';
          });
          console.log('FILTERED APPOINTMENT ROWS', filteredRows.length);
          console.log(typeof filteredRows[0].createdDate);

          console.log('UPSERTING APPOINTMENTS. . . ');

          for (const appointmentObj of filteredRows) {
            // separate key fields from rest of appointment data
            const { id, type, patientId, patientFullName, ...appointmentData } =
              appointmentObj;
            // validate row data
            if (
              typeof id === 'number' &&
              type === 'Patient' &&
              appointmentData.appointmentReason !== 'OTHER'
            ) {
              // check that matching patient exists
              const currentPatient = await prisma.patient.findUnique({
                where: { id: patientId },
              });

              if (!currentPatient) {
                console.log(
                  `Skipping appointment - Patient ${patientFullName} ${patientId} not found`
                );
                continue;
              }

              // ADJUST TIMES TO MATCH CURRENT TIME ZONE (NEEDED B/C EXCEL REPORT HAS DIFFERENT TIMEZONE)
              appointmentData.createdDate = new Date(
                new Date(appointmentData.createdDate).getTime() +
                  2 * 60 * 60 * 1000
              );
              appointmentData.lastModifiedDate = new Date(
                new Date(appointmentData.lastModifiedDate).getTime() +
                  2 * 60 * 60 * 1000
              );
              appointmentData.startDate = new Date(
                new Date(appointmentData.startDate).getTime() +
                  2 * 60 * 60 * 1000
              );

              const currentAppointment = await prisma.appointment.findUnique({
                where: { id: id },
              });

              if (currentAppointment) {
                // Record exists, check if incoming data is more recent
                const currentDate = new Date(
                  currentAppointment.lastModifiedDate
                );
                const incomingDate = new Date(appointmentData.lastModifiedDate);

                if (incomingDate > currentDate) {
                  // Incoming data is more recent, update the record
                  await prisma.appointment.update({
                    where: { id: id },
                    data: {
                      patientId,
                      ...appointmentData,
                      notes: String(appointmentData.notes),
                    },
                  });
                  console.log('Updated patient record with more recent data');
                } else {
                  // console.log('Skipping update - existing data is more recent');
                }
              } else {
                // Record doesn't exist, create it
                appointmentData.notes = String(appointmentData.notes); // edge case: only numbers in the notes section
                await prisma.appointment.create({
                  data: {
                    id,
                    ...appointmentData,
                    patient: { connect: { id: patientId } },
                  },
                });
                // console.log('Created new appointment record');
              }
            }
          }
          break;
        case 'payment':
          const getReferenceNumber = (str) => {
            let count = 2; // number of times to slice a *

            while (count > 0) {
              let startIndex = str.indexOf('*');
              str = str.slice(startIndex + 1);
              --count;
            }

            let endIndex = str.indexOf('*');
            str = str.slice(0, endIndex);

            return str;
          };

          const getPayerName = (str) => {
            if (str.includes('BCBS')) {
              return 'BC/BS';
            } else if (str.includes('AETNA')) {
              return 'AETNA';
            } else if (str.includes('AARP')) {
              return 'AARP';
            } else if (str.includes('CIGNA')) {
              return 'CIGNA';
            } else if (str.includes('ECHO')) {
              return 'ECHO';
            } else if (str.toLowerCase().includes('freedom')) {
              return 'FREEDOM LIFE';
            } else if (str.includes('GEHA')) {
              return 'GEHA';
            } else if (str.includes('NOVITAS')) {
              return 'MEDICARE';
            } else if (str.includes('WPS')) {
              return 'WPS';
            } else if (str.includes('PAY PLUS')) {
              return 'ZELIS';
            } else if (
              str.toLowerCase().includes('united') ||
              str.toLowerCase().includes('uhc')
            ) {
              return 'UNITED';
            } else {
              return str;
            }
          };

          // map over excel data to prep data for batch upload
          // console.log('INPUT DATA:', excelData[0]);

          const payments = excelData
            .filter((row) => row.description.includes('HCCLAIMPMT'))
            .map((payment) => {
              // init constants,  parse the reference and payerName from the description
              const { date, description, credit } = payment;
              const referenceNumber = getReferenceNumber(description);
              return {
                id: referenceNumber, // String
                createdDate: new Date(date), // DateTime
                reference: referenceNumber, // String @unique
                payerName: getPayerName(description), // String
                amount: credit, // Float
              };
            });
          console.log('filteredPayments', payments.length);
          // console.log('filteredPayments', payments);

          const newPayments = await prisma.payment.createMany({
            data: payments,
            skipDuplicates: true,
          });
          console.log('PAYMENTS UPLOADED', newPayments.count);

          break;
        case 'eob':
          // FILTER RESULT: only include non-zero insurance payments that have reference numbers
          console.log('EOB EXCEL DATA[0]:', excelData[0]);

          const eobs = excelData
            .filter((row) => {
              const { payerType, amount, referenceNumber } = row;
              if (payerType === 'Insurance' && amount > 0 && referenceNumber) {
                return row;
              }
            })
            .map((eob) => {
              return String(eob.referenceNumber);
            });

          console.log('EOB[0]', eobs[0]);

          const updatedPayments = await prisma.payment.updateMany({
            where: { id: { in: eobs } },
            data: { isPaid: true },
          });

          console.log('PAYMENTS UPDATED', updatedPayments.count);

          break;
      }

      return res
        .status(200)
        .json({ message: 'File was uploaded successfully' });
    } catch (error) {
      console.error('UPLOAD ROUTER error', error);
      // pass the error to the global error handler
      next({
        status: 501,
        message: { err: 'Error uploading file' },
        log: `Error in uploadRouter: ${error}`,
      });
    }
  }
);

export default uploadRouter;
