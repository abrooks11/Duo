import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, asyncHandler } from '../../shared/errorHandlers.js';
import { syncPatients } from '../tebra-api/tebraSync.js';

const patientRouter = express.Router();
const prisma = new PrismaClient();

patientRouter.get('/', asyncHandler(async (req, res) => {
  const newestPatients = await prisma.patient.findMany({
    take: 100,
    where: {
      NOT: [
        { patientFullName: { contains: 'duplicate', mode: 'insensitive' } },
        { patientFullName: { contains: 'zzz', mode: 'insensitive' } },
        { primaryInsurancePolicyCompanyName: null },
      ],
    },
    orderBy: {
      createdDate: 'desc',
    },
  });
  return sendSuccess(res, newestPatients);
}));

patientRouter.post('/sync', asyncHandler(async (req, res) => {
  const fromDate = '2026-01-01';
  const toDate = '2026-12-31';
  const result = await syncPatients(fromDate, toDate);
  return sendSuccess(res, result, `Synced ${result.synced} patients`);
}));

patientRouter.delete('/', asyncHandler(async (req, res) => {
  await prisma.patient.deleteMany({});
  return sendSuccess(res, null, 'Records deleted');
}));

export default patientRouter;
