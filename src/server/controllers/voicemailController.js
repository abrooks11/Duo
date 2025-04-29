import {
  createVoicemail,
  getDbVoicemail,
  changeFolder,
  updateVoicemailNote,
} from '../services/voicemailServices.ts';

export const getVoicemail = async (req, res, next) => {
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

    // FETCH VOICEMAIL FROM RINGRX
    const inboxResponse = await fetch(
      `https://portal.ringrx.com/voicemails?message_folder=inbox`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const trashResponse = await fetch(
      `https://portal.ringrx.com/voicemails?message_folder=trash`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const inboxData = await inboxResponse.json();
    const trashData = await trashResponse.json();

    // UPLOAD VOICEMAIL TO DATABASE
    if (inboxData.length > 0) {
      await Promise.all(
        inboxData.map((voicemail) => createVoicemail(voicemail))
      );
    }
    if (trashData.length > 0) {
      await Promise.all(
        trashData.map((voicemail) => createVoicemail(voicemail))
      );
    }

    // FETCH VOICEMAIL FROM DB
    const voicemail = await getDbVoicemail();
    res.locals.voicemail = voicemail;
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
export const addNoteToVoicemail = async (req, res, next) => {
  try {
    const { vmId } = req.params;
    const { note } = req.body;
    // CHECK DATABASE FOR VOICEMAIL WITH MATCHING ID 
    // IF NO MATCH, RETURN ERROR
    // IF MATCH, UPDATE IN DATABASE 
    const result = await updateVoicemailNote(vmId, note)
    console.log({result});
    
    next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error adding note to voicemail' }, // message to client
      log: `Error in voicemailController: ${error}`, // log to server
    });
  }
};

export const deleteVoicemail = async (req, res, next) => {
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

    const deleted = await fetch(`https://portal.ringrx.com/voicemails/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    await changeFolder(id);

    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error deleting voicemail' }, // message to client
      log: `Error in voicemailController: ${error}`, // log to server
    });
  }
};