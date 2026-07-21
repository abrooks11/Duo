import { Request, Response, NextFunction } from 'express';

import { VoicemailSchema } from './voicemailTypes.ts';
import { makeAuthenticatedRingRequest, makeAuthenticatedRingDelete } from '../auth/authUtils.ts';

import {
  createVoicemail,
  getDbVoicemail,
  moveVoicemailToTrash,
  updateVoicemailNote,
  updateVoicemailReason,
} from './voicemailServices';

import { AppError, handleControllerError } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';

const log = createChildLogger('voicemail');

export const getVoicemail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ringResponse = await makeAuthenticatedRingRequest(
      'https://portal.ringrx.com/voicemails?message_folder=inbox',
      req.ringToken!,
      req.refreshRingToken!
    );

    if (!ringResponse.ok) {
      return next(new AppError('Failed to fetch voicemail from RingRX', ringResponse.status, `RingRX API error: ${ringResponse.status}`));
    }

    const ringData: any = await ringResponse.json();

    if (ringData.length > 0) {
      await Promise.all(
        ringData.map((voicemail: any) => createVoicemail(voicemail))
      );
    }

    const trashResponse = await makeAuthenticatedRingRequest(
      'https://portal.ringrx.com/voicemails?message_folder=trash',
      req.ringToken!,
      req.refreshRingToken!
    );

    const trashData: any = await trashResponse.json();

    if (trashData.length > 0) {
      await Promise.all(
        trashData.map((voicemail: any) => createVoicemail(voicemail))
      );
    }

    const voicemailList: VoicemailSchema[] = await getDbVoicemail();

    res.locals.voicemailList = voicemailList;

    return next();
  } catch (error) {
    handleControllerError(error, 'getVoicemail', next, 'Error fetching voicemail');
  }
};

export const updateVoicemail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { vmId } = req.params;
    const { note, reason } = req.body;

    let response;
    if (note) {
      response = await updateVoicemailNote(vmId, note);
    }
    if (reason) {
      response = await updateVoicemailReason(vmId, reason);
    }

    res.locals.updateResponse = response;
    next();
  } catch (error) {
    handleControllerError(error, 'updateVoicemail', next, 'Error adding note to voicemail');
  }
};

export const deleteVoicemail = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.vmId;

    const deleteResponse = await makeAuthenticatedRingDelete(
      `https://portal.ringrx.com/voicemails/${id}`,
      req.ringToken!,
      req.refreshRingToken!
    );

    log.debug(`Delete voicemail status: ${deleteResponse.status}`);

    if (!deleteResponse.ok && deleteResponse.status !== 204) {
      return next(new AppError('Failed to delete voicemail from RingRX', deleteResponse.status, `RingRX delete API error: ${deleteResponse.status}`));
    }

    await moveVoicemailToTrash(id);

    return next();
  } catch (error) {
    handleControllerError(error, 'deleteVoicemail', next, 'Error deleting voicemail');
  }
};
