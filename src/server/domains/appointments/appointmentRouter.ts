import express from 'express';
import appointmentController from './appointmentController.js';
import { sendSuccess } from '../../shared/errorHandlers.js';

const { getAppointments, updateCopay, updateNote, deleteAll } = appointmentController;
const { getAppointmentSms, createAppointmentSms } = appointmentController;

const appointmentRouter = express.Router();

appointmentRouter.get('/', getAppointments, (_req, res) => {
  return sendSuccess(res, res.locals.appointments);
});

appointmentRouter.post('/copay', updateCopay, (_req, res) => {
  return sendSuccess(res, null, 'Copay updated');
});

appointmentRouter.patch('/:id/notes', updateNote);

// APPOINTMENT SMS ROUTES
appointmentRouter.get('/sms/:appointmentId', getAppointmentSms, (_req, res) => {
  return sendSuccess(res, res.locals.appointmentSms);
});
appointmentRouter.post('/sms/:appointmentId', createAppointmentSms, (_req, res) => {
  return sendSuccess(res, null, 'Notification logged');
});


if (process.env.NODE_ENV !== 'production') {
  appointmentRouter.delete('/', deleteAll);
}

export default appointmentRouter;
