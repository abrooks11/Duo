import express from 'express';
import {
  getVoicemail,
  deleteVoicemail,
  updateVoicemail,
} from './voicemailController';

import { ensureRingAuth } from '../auth/authMiddleware';

const voicemailRouter = express.Router();

voicemailRouter.get('/', ensureRingAuth, getVoicemail, (req, res) => {
  // console.log("VOICEMAIL", res.locals.voicemail)
  return res.status(200).json({ data: res.locals.voicemailList });
});

voicemailRouter.patch('/:vmId', updateVoicemail, (req, res) => {
  return res.status(200).json({ message: res.locals.updateResponse });
});

voicemailRouter.delete('/:vmId', ensureRingAuth, deleteVoicemail, (req, res) => {
  return res.status(200).json({ message: 'Message moved to trash' });
});
export default voicemailRouter;
