import express from 'express';
import { sendSms } from './smsController.ts';
const smsRouter = express.Router();

// FEAT: SEND SMS MESSAGE 


smsRouter.post('/', sendSms, (req, res) => {
  console.log('smsRouter: res.locals', res.locals);
  return res.status(200).json({ message: 'sms sent successfully' });
});


export default smsRouter;
