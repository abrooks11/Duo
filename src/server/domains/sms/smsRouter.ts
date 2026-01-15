import express from 'express';
import { ensureRingAuth } from './../auth/authMiddleware';
import { sendSms } from './smsController.ts';
const smsRouter = express.Router();

// FEAT: SEND SMS MESSAGE 


smsRouter.post('/', ensureRingAuth, sendSms, (req, res) => {
  console.log('smsRouter: res.locals', res.locals);
  return res.status(200).json({ message: 'sms sent successfully' });
});


export default smsRouter;
