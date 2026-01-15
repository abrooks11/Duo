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

/** getVoicemail
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 *
 *
 */

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
      return next({
        status: ringResponse.status,
        message: { err: 'Failed to fetch voicemail from RingRX' },
        log: `RingRX API error: ${ringResponse.status}`,
      });
    }

    const ringData: any = await ringResponse.json();

    // SAVE RING VOICEMAIL TO DATABASE
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

    // SAVE RING VOICEMAIL TO DATABASE
    if (trashData.length > 0) {
      await Promise.all(
        trashData.map((voicemail: any) => createVoicemail(voicemail))
      );
    }

    // FETCH SAVED VOICEMAIL FROM DB
    const voicemailList: VoicemailSchema[] = await getDbVoicemail();

    res.locals.voicemailList = voicemailList;

    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error fetching voicemail' }, // message to client
      log: `Error in voicemailController: ${error}`, // log to server
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updateVoicemail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { vmId } = req.params;
    const { note, reason } = req.body;

    let response;
    // CHECK DATABASE FOR VOICEMAIL WITH MATCHING ID
    // IF NO MATCH, RETURN ERROR
    // IF MATCH, UPDATE IN DATABASE
    if (note) {
      response = await updateVoicemailNote(vmId, note);
    }
    if (reason) {
      response = await updateVoicemailReason(vmId, reason);
    }

    res.locals.updateResponse = response;
    next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error adding note to voicemail' }, // message to client
      log: `Error in voicemailController: ${error}`, // log to server
    });
  }
};

export const deleteVoicemail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the voicemail ID from URL parameters
    const id = req.params.vmId;

    // Call makeAuthenticatedRingDelete to delete the voicemail from RingRX

    //  SEND REQUEST TO RING RX TO DELETE VOICEMAIL
    const deleteResponse = await makeAuthenticatedRingDelete(
      `https://portal.ringrx.com/voicemails/${id}`,
      req.ringToken!,
      req.refreshRingToken!
    );

    console.log('delete voicemail status:', deleteResponse.status);
    // Check if the delete request was successful
    if (!deleteResponse.ok && deleteResponse.status !== 204) {
      return next({
        status: deleteResponse.status,
        message: { err: 'Failed to delete voicemail from RingRX' },
        log: `RingRX delete API error: ${deleteResponse.status}`,
      });
    }

    // Move the voicemail to trash in the database
    await moveVoicemailToTrash(id);

    // Call next() to proceed to response handler
    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error deleting voicemail' }, // message to client
      log: `Error in voicemailController: ${error}`, // log to server
    });
  }
};
