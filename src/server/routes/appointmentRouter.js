import express from 'express';
import appointmentController from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const { getAppointments, updateCopay } = appointmentController;

appointmentRouter.get('/', getAppointments, (req, res) => {
  const appointments = res.locals.appointments;
  return res.status(200).json(appointments);
});

appointmentRouter.post('/copay', updateCopay, (req, res) => {
  return res.status(200).json({message: 'Copay updated'})
})

appointmentRouter.delete('/', async (req, res) => {
  await prisma.appointment.deleteMany({});
  return res.status(200).json({ message: 'Records deleted' });
});


export default appointmentRouter;
