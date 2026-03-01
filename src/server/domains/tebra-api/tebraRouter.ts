import express from 'express';
import tebraController from './tebraController.ts';
import { sendSuccess } from '../../shared/errorHandlers.js';

const { testTebraApi, getAppointments, syncAppointments } = tebraController;

const tebraRouter = express.Router();

tebraRouter.post('/test', testTebraApi);

tebraRouter.get('/appointments', getAppointments);

tebraRouter.post('/sync', syncAppointments);

export default tebraRouter;
