import express from 'express';
import { ensureRingAuth } from './../auth/authMiddleware';
import { sendSms } from './smsController.ts';
import { sendSuccess } from '../../shared/errorHandlers.js';

const smsRouter = express.Router();

smsRouter.post('/', ensureRingAuth, sendSms, (req, res) => {
  return sendSuccess(res, null, 'sms sent successfully');
});

export default smsRouter;
