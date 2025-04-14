import express from 'express';
import { login } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/', login, (req, res) => {
  return res.status(200).json({success: true}) ;
});

export default authRouter;
