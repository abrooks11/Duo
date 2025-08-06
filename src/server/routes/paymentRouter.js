import express from 'express';
import paymentController from '../controllers/paymentController.js';

const paymentRouter = express.Router();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const { getUnpaidEOBs, postInsuranceEOBs, postBankPayments } = paymentController;

paymentRouter.get('/', getUnpaidEOBs, (req, res) => {
  // const eobs = res.locals.eobs;
  return res.status(200).json({ message: 'success' });
});

// paymentRouter.post('/payment', (req, res) => {
//   const {source} = res.body
//   // if source is bank --> postBankPayments
//   // if source is insurance -- postBankPayments
//   console.log({source});
//   return res.status(200).json({message: 'Upload successful'})
// })

paymentRouter.delete('/', async (req, res) => {
  await prisma.payment.deleteMany({});
  return res.status(200).json({ message: 'Records deleted' });
});


export default paymentRouter;
