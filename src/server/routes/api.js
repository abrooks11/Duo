// import express
import express from 'express';
// create a router
const apiRouter = express.Router();

// import custom routes
import uploadRouter from './uploadRouter.js';
import appointmentRouter from './appointmentRouter.js';
import claimRouter from './claimRouter.js';
import patientRouter from './patientRouter.js';
import authRouter from './authRouter.js';
import voicemailRouter from './voicemailRouter.js';
import openAiRouter from './openAiRouter.js';

// apiRouter.post("/upload/:dataType/:sheetName", userActionsController.uploadFile, (req, res) => {
//   res.status(200).send("File was uploaded successfully");
// });

apiRouter.use('/upload', uploadRouter);

// clinic resource routes
apiRouter.use('/appointments', appointmentRouter);
apiRouter.use('/claims', claimRouter);
apiRouter.use('/patients', patientRouter);

// voicemail routes
apiRouter.use('/login', authRouter);
apiRouter.use('/voicemail', voicemailRouter);

// LLM routes
apiRouter.use('/openai', openAiRouter);

export default apiRouter;
