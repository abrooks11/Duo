import express from 'express';

// import controller functions
import { generateResponse } from '../controllers/openAiController.js';

const openAiRouter = express.Router();

openAiRouter.post('/', generateResponse, (req, res) => {
  return res.status(200).json({ response: res.locals.aiResponse });
});

export default openAiRouter;
