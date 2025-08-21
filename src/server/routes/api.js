// import express
import express from 'express';
// create a router
const apiRouter = express.Router();

// import custom routes
// resource routes
import appointmentRouter from './appointmentRouter.js';
import claimRouter from './claimRouter.js';
import patientRouter from './patientRouter.js';
import paymentRouter from './paymentRouter.js';
import voicemailRouter from './voicemailRouter.js';

// service routes
import authRouter from './authRouter.js';
import uploadRouter from './uploadRouter.js';
import openAiRouter from './openAiRouter.js';
import insuranceRouter from './insuranceRouter.js';

// apiRouter.post("/upload/:resourceType/:sheetName", userActionsController.uploadFile, (req, res) => {
//   res.status(200).send("File was uploaded successfully");
// });

apiRouter.use('/upload', uploadRouter);

// clinic resource routes
apiRouter.use('/appointments', appointmentRouter);
apiRouter.use('/claims', claimRouter);
apiRouter.use('/patients', patientRouter);
apiRouter.use('/payments', paymentRouter);

// voicemail routes
apiRouter.use('/login', authRouter);
apiRouter.use('/voicemail', voicemailRouter);

// LLM routes
apiRouter.use('/openai', openAiRouter);

apiRouter.use('/insurance', insuranceRouter)

export default apiRouter;
