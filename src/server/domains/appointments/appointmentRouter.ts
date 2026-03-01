import express from 'express';
import appointmentController from './appointmentController.js';
import { sendSuccess } from '../../shared/errorHandlers.js';
import { asyncHandler } from '../../shared/errorHandlers.js';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const { getAppointments, updateCopay, updateNote } = appointmentController;

const appointmentRouter = express.Router();

appointmentRouter.get('/', getAppointments, (req, res) => {
  return sendSuccess(res, res.locals.appointments);
});

appointmentRouter.post('/copay', updateCopay, (req, res) => {
  return sendSuccess(res, null, 'Copay updated');
});

appointmentRouter.patch('/:id/notes', updateNote);

appointmentRouter.delete('/', asyncHandler(async (req, res) => {
  await prisma.appointment.deleteMany({});
  return sendSuccess(res, null, 'Records deleted');
}));

export default appointmentRouter;
