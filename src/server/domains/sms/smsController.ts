import { Sms, SmsRequest, SmsResponse } from './smsTypes';
import {
  createVoicemail,
  getDbVoicemail,
  changeFolder,
  updateVoicemailNote,
  updateVoicemailReason,
} from '../../services/voicemailServices.ts';

export const sendMessage = async (req: SmsRequest, res: SmsResponse, next) => {

    try {
      const { phoneNumber, message } = req.body;
      console.log('SMS controller called');
      console.log({ phoneNumber, message });

      // ACQUIRE AUTH
      const ringToken = req.cookies['ring-token']; // Get the token from cookies
      if (!ringToken) {
        return next({
          status: 401,
          message: { err: 'Authentication required' },
          log: 'Missing or invalid ring-token cookie',
        });
      }

      // SEND SMS
      const ringResponse = await fetch(
        `https://portal.ringrx.com/messaging/send_message?to=${phoneNumber}&message=${message}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ringToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const ringData = await ringResponse.json();
      console.log(ringData)
      // res.locals.voicemail = voicemail;
          return next();
    } catch (error) {
    next({
      status: 500,
      message: { err: 'Error fetching voicemail' }, // message to client
      log: `Error in voicemailController: ${error}`, // log to server
    });

}
}
// export const getVoicemail = async (req, res, next) => {
//   try {
//     // ACQUIRE AUTH
//     const ringToken = req.cookies['ring-token']; // Get the token from cookies
//     if (!ringToken) {
//       return next({
//         status: 401,
//         message: { err: 'Authentication required' },
//         log: 'Missing or invalid ring-token cookie',
//       });
//     }

//     // FETCH VOICEMAIL FROM RINGRX
//     const ringResponse = await fetch(
//       `https://portal.ringrx.com/voicemails?message_folder=inbox`,
//       {
//         headers: {
//           Authorization: `Bearer ${ringToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const ringData = await ringResponse.json();

//     // SAVE RING VOICEMAIL TO DATABASE
//     if (ringData.length > 0) {
//       await Promise.all(
//         ringData.map((voicemail) => createVoicemail(voicemail))
//       );
//     }
//     // FETCH VOICEMAIL FROM RINGRX
//     const trashResponse = await fetch(
//       `https://portal.ringrx.com/voicemails?message_folder=trash`,
//       {
//         headers: {
//           Authorization: `Bearer ${ringToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const trashData = await trashResponse.json();

//     // SAVE RING VOICEMAIL TO DATABASE
//     if (trashData.length > 0) {
//       await Promise.all(
//         trashData.map((voicemail) => createVoicemail(voicemail))
//       );
//     }

//     // FETCH SAVED VOICEMAIL FROM DB
//     const voicemail = await getDbVoicemail();
//     res.locals.voicemail = voicemail;
//     return next();
//   } catch (error) {
//     next({
//       status: 500,
//       message: { err: 'Error fetching voicemail' }, // message to client
//       log: `Error in voicemailController: ${error}`, // log to server
//     });
//   }
// };

// /**
//  * 
//  * @param {*} req 
//  * @param {*} res 
//  * @param {*} next 
//  */
// export const updateVoicemail = async (req, res, next) => {
//   try {
//     const { vmId } = req.params;
//     const { note, reason } = req.body;
//     console.log({note, reason})
//     let response; 
//     // CHECK DATABASE FOR VOICEMAIL WITH MATCHING ID 
//     // IF NO MATCH, RETURN ERROR
//     // IF MATCH, UPDATE IN DATABASE 
//     if (note) {
//       response = await updateVoicemailNote(vmId, note)
//     }
//     if (reason) {
//       response = await updateVoicemailReason(vmId, reason)
//     }
    
//     res.locals.updateResponse = response 
//     next();
//   } catch (error) {
//     next({
//       status: 500,
//       message: { err: 'Error adding note to voicemail' }, // message to client
//       log: `Error in voicemailController: ${error}`, // log to server
//     });
//   }
// };

// export const deleteVoicemail = async (req, res, next) => {
//   try {
//     // ACQUIRE AUTH
//     const token = req.cookies['ring-token']; // Get the token from cookies
//     if (!token) {
//       return next({
//         status: 401,
//         message: { err: 'Authentication required' },
//         log: 'Missing or invalid ring-token cookie',
//       });
//     }

//     const id = req.params.vmId;

//     const deleted = await fetch(`https://portal.ringrx.com/voicemails/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     await changeFolder(id);

//     return next();
//   } catch (error) {
//     next({
//       status: 500,
//       message: { err: 'Error deleting voicemail' }, // message to client
//       log: `Error in voicemailController: ${error}`, // log to server
//     });
//   }
// };