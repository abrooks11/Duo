import express from 'express';
import {login} from '../../shared/auth/ringController'
import { sendMessage } from './smsController';
const smsRouter = express.Router();

// FEAT: SEND SMS MESSAGE 


smsRouter.post('/', sendMessage, (req, res) => {
  console.log('smsRouter: res.locals', res.locals)
  return res.status(200).json({ message: "sms successful" });
});


export default smsRouter;
