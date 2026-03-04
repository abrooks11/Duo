import { makeAuthenticatedRingPost } from './../auth/authUtils';
import { Request, Response, NextFunction } from 'express';
import { AppError, handleControllerError } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';

const log = createChildLogger('sms');

export const sendSms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phoneNumber, message } = req.body;
    const encodedMessage = encodeURIComponent(message);

    log.debug(`Sending SMS to ${phoneNumber}`);

    const smsResponse = await makeAuthenticatedRingPost(
      `https://portal.ringrx.com/messaging/send_message?to=${phoneNumber}&message=${encodedMessage}`,
      req.ringToken!,
      req.refreshRingToken!
    );

    if (!smsResponse.ok) {
      return next(new AppError('Failed to send SMS via RingRX', smsResponse.status, `RingRX SMS API error: ${smsResponse.status}`));
    }

    const smsData: any = await smsResponse.json();

    if (smsData.sms_id) {
      res.locals.isSuccessful = true;
      res.locals.smsId = smsData.sms_id;
    } else {
      return next(new AppError('SMS sent but no confirmation received', 500, 'RingRX did not return sms_id'));
    }

    return next();
  } catch (error) {
    handleControllerError(error, 'sendSms', next, 'Error sending text message');
  }
};
