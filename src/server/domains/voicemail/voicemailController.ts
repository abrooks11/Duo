import { NextFunction } from 'express';

import { VoicemailSchema } from './voicemailTypes.ts';

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

export const getVoicemail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ACQUIRE AUTH - check if token exists, if not, get it
    let ringToken = req.cookies['ring-token']; // Get the token from cookies
    console.log("RING TOKEN: ", ringToken)
    
    if (ringToken) {
      // LOGIN TO RINGRX AND GET TOKEN

      // PREP PARAMS
      const loginParams = {
        username: process.env.RING_USER_NAME,
        password: process.env.RING_PASSWORD,
      };

      const params = new URLSearchParams(loginParams).toString();

      // CREATE TOKEN
      const loginResponse = await fetch(
        `https://portal.ringrx.com/auth/token?${params}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!loginResponse.ok) {
        return next({
          status: 401,
          message: { err: 'Failed to authenticate with RingRX' },
          log: 'RingRX login failed',
        });
      }

      const loginData = await loginResponse.json();

      ringToken = loginData.access_token

    res.cookie('ring-token', ringToken, {
      httpOnly: true,
      secure: true, // for HTTPS
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours, adjust as needed
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

    console.log("delete voicemail status:", deleteVoicemailFromRingRXResponse.status)

    // const deleteVoicemailData: any = await deleteVoicemailFromRingRXResponse.json()

    // if (deleteVoicemailData.data !== 204) {
    // // global error handler 
    // }
    
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