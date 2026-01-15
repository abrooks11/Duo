// import express
import express from 'express';
// create a router
const apiRouter = express.Router();

// import custom routes
// resource routes
import appointmentRouter from '../domains/appointments/appointmentRouter.ts';
import claimRouter from '../domains/claims/claimRouter.ts';
import patientRouter from '../domains/patients/patientRouter.ts';
import paymentRouter from '../domains/payments/paymentRouter.ts';
import voicemailRouter from '../domains/voicemail/voicemailRouter.ts';

// service routes
import uploadRouter from '../domains/upload/uploadRouter.ts';
import openAiRouter from '../domains/ai/openAiRouter.ts';
import insuranceRouter from '../domains/estimates/insuranceRouter.ts';
import smsRouter from '../domains/sms/smsRouter.ts';

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
apiRouter.use('/voicemail', voicemailRouter);

// LLM routes
apiRouter.use('/openai', openAiRouter);

apiRouter.use('/insurance', insuranceRouter)

// UNDER DEVELOPMENT
apiRouter.use('/sms', smsRouter)

export default apiRouter;
