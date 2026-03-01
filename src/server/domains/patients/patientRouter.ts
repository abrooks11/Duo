import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, asyncHandler } from '../../shared/errorHandlers.js';

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

patientRouter.delete('/', asyncHandler(async (req, res) => {
  await prisma.patient.deleteMany({});
  return sendSuccess(res, null, 'Records deleted');
}));

export default patientRouter;
