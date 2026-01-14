import express from 'express';
const patientRouter = express.Router();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

patientRouter.get('/', async (req, res) => {
  // get patients from the database, contain to 100 rows and filter out duplicates
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
  return res.status(200).json(newestPatients);
});

patientRouter.delete('/', async (req, res) => {
  await prisma.patient.deleteMany({});
  return res.status(200).json({ message: 'Records deleted' });
});

export default patientRouter;
