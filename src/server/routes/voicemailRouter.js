import express from 'express';
import { getVoicemail } from '../controllers/voicemailController.js';

const voicemailRouter = express.Router();

voicemailRouter.get('/', getVoicemail, (req, res) => {
  return res.status(200).json({ data: res.locals.voicemail });
});

export default voicemailRouter;
