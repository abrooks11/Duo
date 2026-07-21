import express from 'express';
import appointmentController from './appointmentController.js';
import { sendSuccess } from '../../shared/errorHandlers.js';

const { getAppointments, updateCopay, updateNote, deleteAll } = appointmentController;

const appointmentRouter = express.Router();

appointmentRouter.get('/', getAppointments, (_req, res) => {
  return sendSuccess(res, res.locals.appointments);
});

appointmentRouter.post('/copay', updateCopay, (_req, res) => {
  return sendSuccess(res, null, 'Copay updated');
});

appointmentRouter.patch('/:id/notes', updateNote);

if (process.env.NODE_ENV !== 'production') {
  appointmentRouter.delete('/', deleteAll);
}

export default appointmentRouter;
