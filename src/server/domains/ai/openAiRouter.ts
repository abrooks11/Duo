import express from 'express';
import { generateResponse } from './openAiController.js';
import { sendSuccess } from '../../shared/errorHandlers.js';

const openAiRouter = express.Router();

openAiRouter.post('/', generateResponse, (req, res) => {
  return sendSuccess(res, res.locals.aiResponse);
});

export default openAiRouter;
