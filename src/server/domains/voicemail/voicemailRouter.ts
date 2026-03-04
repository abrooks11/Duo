import express from 'express';
import {
  getVoicemail,
  deleteVoicemail,
  updateVoicemail,
} from './voicemailController';

import { ensureRingAuth } from '../auth/authMiddleware';
import { sendSuccess } from '../../shared/errorHandlers.js';

const voicemailRouter = express.Router();

voicemailRouter.get('/', ensureRingAuth, getVoicemail, (req, res) => {
  return sendSuccess(res, res.locals.voicemailList);
});

voicemailRouter.patch('/:vmId', updateVoicemail, (req, res) => {
  return sendSuccess(res, res.locals.updateResponse);
});

voicemailRouter.delete('/:vmId', ensureRingAuth, deleteVoicemail, (req, res) => {
  return sendSuccess(res, null, 'Message moved to trash');
});
export default voicemailRouter;
