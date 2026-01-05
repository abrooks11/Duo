import { VoicemailSchema } from '../types/voicemail.types.ts';

import {
  createVoicemail,
  getDbVoicemail,
  moveVoicemailToTrash,
  updateVoicemailNote,
  updateVoicemailReason,
} from '../services/voicemailServices.ts';
import { NextFunction } from 'express';


/** getVoicemail
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 * 
 * 
 */

export const getVoicemail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ACQUIRE AUTH
    const ringToken = req.cookies['ring-token']; // Get the token from cookies
    if (!ringToken) {
      return next({
        status: 401,
        message: { err: 'Authentication required' },
        log: 'Missing or invalid ring-token cookie',
      });
    }

    // FETCH VOICEMAIL FROM RINGRX
    const ringResponse = await fetch(
      `https://portal.ringrx.com/voicemails?message_folder=inbox`,
      {
        headers: {
          Authorization: `Bearer ${ringToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const ringData: any = await ringResponse.json();

    // SAVE RING VOICEMAIL TO DATABASE
    if (ringData.length > 0) {
      await Promise.all(
        ringData.map((voicemail: any) => createVoicemail(voicemail))
      );
    }
    // FETCH VOICEMAIL FROM RINGRX
    const trashResponse = await fetch(
      `https://portal.ringrx.com/voicemails?message_folder=trash`,
      {
        headers: {
          Authorization: `Bearer ${ringToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const trashData: any = await trashResponse.json();

    // SAVE RING VOICEMAIL TO DATABASE
    if (trashData.length > 0) {
      await Promise.all(
        trashData.map((voicemail:any) => createVoicemail(voicemail))
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
export const updateVoicemail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vmId } = req.params;
    const { note, reason } = req.body;

    let response; 
    // CHECK DATABASE FOR VOICEMAIL WITH MATCHING ID 
    // IF NO MATCH, RETURN ERROR
    // IF MATCH, UPDATE IN DATABASE 
    if (note) {
      response = await updateVoicemailNote(vmId, note)
    }
    if (reason) {
      response = await updateVoicemailReason(vmId, reason)
    }
    
    res.locals.updateResponse = response 
    next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error adding note to voicemail' }, // message to client
      log: `Error in voicemailController: ${error}`, // log to server
    });
  }
};

export const deleteVoicemail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ACQUIRE AUTH
    const token = req.cookies['ring-token']; // Get the token from cookies
    if (!token) {
      return next({
        status: 401,
        message: { err: 'Authentication required' },
        log: 'Missing or invalid ring-token cookie',
      });
    }

    const id = req.params.vmId;

    //  SEND REQUEST TO RING RX TO DELETE VOICEMAIL
    const deleteVoicemailFromRingRXResponse = await fetch(`https://portal.ringrx.com/voicemails/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const deleteVoicemailData: any = await deleteVoicemailFromRingRXResponse.json()

    if (deleteVoicemailData.data !== 204) {
    // global error handler 
    }
    
    await moveVoicemailToTrash(id);

    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error deleting voicemail' }, // message to client
      log: `Error in voicemailController: ${error}`, // log to server
    });
  }
};