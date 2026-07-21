import express from 'express';
import tebraController from './tebraController.ts';

const { testTebraApi, getAppointments, syncAppointments } = tebraController;

const tebraRouter = express.Router();

tebraRouter.post('/test', testTebraApi);

tebraRouter.get('/appointments', getAppointments);

tebraRouter.post('/sync', syncAppointments);

export default tebraRouter;
