import express from 'express';
import tebraController from './tebraController.ts';

const { testTebraApi, getAppointments, syncAppointments } = tebraController;

const tebraRouter = express.Router();

tebraRouter.post('/test', testTebraApi, (req, res) => {
  return res.status(200).json({ message: 'api working' });
});

tebraRouter.get('/appointments', getAppointments, (req, res) => {
  // Response already sent in controller
});

tebraRouter.post('/sync', syncAppointments);

export default tebraRouter;
