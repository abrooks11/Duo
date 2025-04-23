import express from 'express';
import { getVoicemail, deleteVoicemail } from '../controllers/voicemailController.js';

const voicemailRouter = express.Router();

voicemailRouter.post('/', getVoicemail, (req, res) => {
  return res.status(200).json({ data: res.locals.voicemail });
});

voicemailRouter.delete('/:vmId', deleteVoicemail, (req, res) => {
  return res.status(200).json({ message: "Voicemail deleted" });
})
export default voicemailRouter;
