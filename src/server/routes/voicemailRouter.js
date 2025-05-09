import express from 'express';
import {
  getVoicemail,
  deleteVoicemail,
  updateVoicemail,
} from '../controllers/voicemailController.js';

const voicemailRouter = express.Router();

voicemailRouter.post('/', getVoicemail, (req, res) => {
  return res.status(200).json({ data: res.locals.voicemail });
});

voicemailRouter.patch('/:vmId', updateVoicemail, (req, res) => {
  return res.status(200).json({ message: res.locals.updateResponse });
});

voicemailRouter.delete('/:vmId', deleteVoicemail, (req, res) => {
  return res.status(200).json({ message: 'Message moved to trash' });
});
export default voicemailRouter;
