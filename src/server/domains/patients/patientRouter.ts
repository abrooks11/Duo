import express from 'express';
import { sendSuccess, asyncHandler } from '../../shared/errorHandlers.js';
import { syncPatientBalances, syncPatients } from '../tebra-api/tebraSync.js';
import prisma from '../../prisma.js';

const patientRouter = express.Router();

patientRouter.get('/', asyncHandler(async (_req, res) => {
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

patientRouter.get('/:id', asyncHandler(async (req, res) => {
  console.log(req.params)
  const patient = await prisma.patient.findUnique({
    where: {
      id: Number(req.params.id)
    },
  });
  console.log(patient)
  return sendSuccess(res, patient);
}));

patientRouter.post('/sync', asyncHandler(async (_req, res) => {
  const fromDate = '2026-01-01';
  const toDate = '2026-12-31';
  const result = await syncPatients(fromDate, toDate);
  return sendSuccess(res, result, `Synced ${result.synced} patients`);
}));

patientRouter.post('/sync-balances', asyncHandler(async (_req, res) => {
  const result = await syncPatientBalances();
  return sendSuccess(res, result, `Updated balances for ${result.synced} patients`);
}));

patientRouter.delete('/', asyncHandler(async (_req, res) => {
  await prisma.patient.deleteMany({});
  return sendSuccess(res, null, 'Records deleted');
}));

export default patientRouter;
