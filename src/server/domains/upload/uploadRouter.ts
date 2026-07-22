import express from 'express';
import multer from 'multer';
const upload = multer();

import excelServices from './excelServices.ts';

import prisma from '../../prisma.js';

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

            if (id === undefined) continue;

            // First check if the record exists and get its current lastModifiedDate
            const existingPatient = await prisma.patient.findUnique({
              where: { id },
            });

            if (existingPatient) {
              // Record exists, check if incoming data is more recent
              const existingDate = new Date(existingPatient.lastModifiedDate);
              const incomingDate = new Date(patientObj.lastModifiedDate as string);

              if (incomingDate > existingDate) {
                // Incoming data is more recent, update the record
                await prisma.patient.update({
                  where: { id },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data: patientData as any,
                });
                log.debug('Updated patient record with more recent data');
              } else {
                // console.log('Skipping update - existing data is more recent');
              }
            } else {
              // Record doesn't exist, create it
              await prisma.patient.create({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data: patientObj as any,
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
              const currentPatient = patientId !== undefined
                ? await prisma.patient.findUnique({ where: { id: patientId } })
                : null;

              if (!currentPatient) {
                log.debug(`Skipping appointment - Patient ${patientFullName} ${patientId} not found`);
                continue;
              }

              // ADJUST TIMES TO MATCH CURRENT TIME ZONE (NEEDED B/C EXCEL REPORT HAS DIFFERENT TIMEZONE)
              appointmentData.createdDate = new Date(
                new Date(appointmentData.createdDate as string).getTime() +
                  2 * 60 * 60 * 1000
              );
              appointmentData.lastModifiedDate = new Date(
                new Date(appointmentData.lastModifiedDate as string).getTime() +
                  2 * 60 * 60 * 1000
              );
              appointmentData.startDate = new Date(
                new Date(appointmentData.startDate as string).getTime() +
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
                const incomingDate = new Date(String(appointmentData.lastModifiedDate));

                if (incomingDate > currentDate) {
                  // Incoming data is more recent, update the record
                  await prisma.appointment.update({
                    where: { id: id },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data: {
                      patientId,
                      ...appointmentData,
                      notes: String(appointmentData.notes),
                    } as any,
                  });
                  log.debug('Updated appointment record with more recent data');
                } else {
                  // console.log('Skipping update - existing data is more recent');
                }
              } else {
                // Record doesn't exist, create it
                appointmentData.notes = String(appointmentData.notes); // edge case: only numbers in the notes section
                await prisma.appointment.create({
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data: {
                    id,
                    ...appointmentData,
                    patient: { connect: { id: patientId } },
                  } as any,
                });
                // console.log('Created new appointment record');
              }
            }
          }
          break;
        case 'deposit':
          // Parse reference from HCCLAIMPMT format: e.g. "HCCLAIMPMT*PAYER*REF123*..."
          // Reference is the 3rd segment (index 2) when split by '*'
          const getReferenceNumber = (str: string): string | null => {
            const parts = str.split('*');
            return parts.length >= 3 ? parts[2] : null;
          };

          const deposits = excelData
            .filter((row) => (row.description?.includes('HCCLAIMPMT') || row.description?.includes('TRN*1')) && row.credit != null)
            .map((deposit) => {
              const { date, description, credit } = deposit;
              if (!description) return null;
              const referenceNumber = getReferenceNumber(description);
              if (!referenceNumber) return null;
              return {
                id: referenceNumber,
                createdDate: new Date(),       // record creation timestamp
                postDate: new Date(date as string),      // actual bank posting date from statement
                description: description,
                reference: referenceNumber,
                payerName: getPayerName(description),
                amount: String(credit),
              };
            })
            .filter((d): d is NonNullable<typeof d> => d !== null);
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
                id: id ?? 0,
                createdDate: createdDate ? new Date(createdDate) : new Date(),
                lastModifiedDate: lastModifiedDate
                  ? new Date(lastModifiedDate)
                  : new Date(),
                reference: String(reference) || null,
                payerType: 'Insurance',
                payerName: getPayerName(payerName || ''),
                paymentMethod: paymentMethod ?? '',
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
              const updateData = {
                lastModifiedDate: incomingEOB.lastModifiedDate,
                payerName: incomingEOB.payerName,
                paymentMethod: incomingEOB.paymentMethod,
                amount: incomingEOB.amount,
              };
              if (incomingEOB.reference) {
                await prisma.eob.upsert({
                  where: { reference: incomingEOB.reference },
                  update: updateData,
                  create: incomingEOB,
                });
              } else {
                // No reference — fall back to upsert by numeric id
                await prisma.eob.upsert({
                  where: { id: incomingEOB.id },
                  update: updateData,
                  create: incomingEOB,
                });
              }
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
