import express from 'express';
import multer from 'multer';
const upload = multer();

import excelServices from './excelServices.ts';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { sendSuccess, sendError } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';

const log = createChildLogger('upload');
const uploadRouter = express.Router();

/**
 * @param {} str
 * @returns
 *
 * Helper function that takes a string and returns the insurance company name that aligns with the provider portal for further claims information
 */
const getPayerName = (str: string): string => {
  if (str.includes('BCBS') || str.includes('BC/BS')) {
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
  } else if (str.includes('NOVITAS') || str.includes('MEDICARE')) {
    return 'MEDICARE';
  } else if (str.includes('MERITAIN')) {
    return 'MERITAIN';
  } else if (str.includes('OSCAR')) {
    return 'OSCAR';
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
      log.debug({ params: req.params }, 'Upload request received');
      const { resourceType, sheetName } = req.params;
      // console.log("UPLOAD ROUTER req.file", req.file);
      // const { file } = req.file; // for browser
      const excelData = await excelServices.readFile(
        req.file.buffer,
        resourceType,
        sheetName
      );

      if (!excelData) {
        return next({
          status: 400,
          message: { err: 'Failed to read Excel data' },
          log: 'Excel data is undefined',
        });
      }

      log.info(`Excel data: ${excelData.length} total rows`);

      switch (resourceType) {
        case 'patient':
          log.info('Upserting patients...');

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
                log.debug('Updated patient record with more recent data');
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
          log.info(`Filtered appointment rows: ${filteredRows.length}`);
          log.info('Upserting appointments...');

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
                log.debug(`Skipping appointment - Patient ${patientFullName} ${patientId} not found`);
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
                  log.debug('Updated appointment record with more recent data');
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
        case 'deposit':
          const getReferenceNumber = (str: string): string => {
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

          // map over excel data to prep data for batch upload
          // console.log('INPUT DATA:', excelData[0]);

          const deposits = excelData
            .filter((row) => row.description.includes('HCCLAIMPMT'))
            .map((deposit) => {
              // init constants,  parse the reference and payerName from the description
              const { date, description, credit } = deposit;
              const referenceNumber = getReferenceNumber(description);
              return {
                id: referenceNumber, // String
                createdDate: new Date(date), // DateTime
                reference: referenceNumber, // String @unique
                payerName: getPayerName(description), // String
                amount: credit != null ? String(credit) : null, // Decimal
              };
            });
          log.info(`Filtered deposits: ${deposits.length}`);

          // FOR EACH NEW DEPOSIT, CHECK IF IT EXISTS ON THE DEPOSITS TABLE, IF SO, SKIP,

          const newDeposits = await prisma.deposit.createMany({
            data: deposits,
            skipDuplicates: true,
          });
          log.info(`Deposits uploaded: ${newDeposits.count}`);

          break;
        case 'eob':
          /**
           * STEPS:
           * 1 - Filter Excel data for non-zero, insurance payments
           * 2 - Add/Update payments to database
           */

          interface ExcelEOB {
            id?: number;
            createdDate?: string | Date;
            lastModifiedDate?: string | Date;
            payerType?: string;
            payerName?: string;
            amount?: number | string;
            [key: string]: any;
          }

          interface EOB {
            id: number;
            createdDate: Date;
            lastModifiedDate: Date;
            reference: string | null;
            payerType: string;
            payerName: string;
            paymentMethod: string;
            amount: number;
          }
          // 1 - FILTER EXCEL DATA
          const eobs: EOB[] = excelData
            .filter((row: any): row is ExcelEOB => {
              return row && row.payerType === 'Insurance' && row.amount > 0;
            })
            .map((eob: ExcelEOB): EOB => {
              const {
                id,
                createdDate,
                lastModifiedDate,
                payerName,
                paymentMethod,
                reference,
                amount,
              } = eob;
              return {
                id: id,
                createdDate: createdDate ? new Date(createdDate) : new Date(),
                lastModifiedDate: lastModifiedDate
                  ? new Date(lastModifiedDate)
                  : new Date(),
                reference: String(reference) || null,
                payerType: 'Insurance',
                payerName: getPayerName(payerName || ''),
                paymentMethod,
                amount:
                  typeof amount === 'number'
                    ? amount
                    : parseFloat(String(amount)) || 0,
              };
            });

          // console.log('EOB EXCEL DATA[0]:', excelData[0]);
          log.debug({ sample: eobs[0] }, 'First EOB record');

          // 2 - ADD/UPDATE TO DATABASE
          for (const incomingEOB of eobs) {
            const existingEOB = await prisma.eob.findUnique({
              where: { id: incomingEOB.id },
            });

            if (
              !existingEOB ||
              incomingEOB.lastModifiedDate > existingEOB?.lastModifiedDate
            ) {
              const eob = await prisma.eob.upsert({
                where: {
                  reference: incomingEOB.reference
                },
                update: {
                  lastModifiedDate: incomingEOB.lastModifiedDate,
                  reference: incomingEOB.reference,
                  payerName: incomingEOB.payerName,
                  paymentMethod: incomingEOB.paymentMethod,
                  amount: incomingEOB.amount,
                },
                create: incomingEOB,
              });
            }
          }

          break;
        default:
          return sendError(res, 'Invalid resource type', 400);
        }

      return sendSuccess(res, null, 'File was uploaded successfully');
    } catch (error) {
      log.error({ error }, 'Upload failed');
      next({
        status: 500,
        message: { err: 'Error uploading file' },
        log: `Error in uploadRouter: ${error}`,
      });
    }
  }
);

export default uploadRouter;
