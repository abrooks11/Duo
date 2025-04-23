import {
  createVoicemail,
  getDbVoicemail,
} from '../services/voicemailServices.ts';

export const getVoicemail = async (req, res, next) => {
  try {
    // ACQUIRE AUTH
    const token = req.cookies['ring-token']; // Get the token from cookies
    const folder = req.body.folder;

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
    console.log('Ring Inbox:', inboxData.length);
    console.log('Ring Trash:', trashData.length);

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
