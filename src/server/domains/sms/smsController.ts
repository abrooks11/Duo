import { makeAuthenticatedRingPost } from './../auth/authUtils';
import { Request, Response, NextFunction } from 'express';

export const sendSms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phoneNumber, message } = req.body;
    const encodedMessage = encodeURIComponent(message);

    console.log('SMS controller called');
    console.log({ phoneNumber, message });

    // Make initial POST request to RingRX SMS endpoint
    const smsResponse = await makeAuthenticatedRingPost(
      `https://portal.ringrx.com/messaging/send_message?to=${phoneNumber}&message=${encodedMessage}`,
      req.ringToken!,
      req.refreshRingToken!
      // No body needed since data is in query params
    );

 
    // Check if the SMS request was successful
    if (!smsResponse.ok) {
      return next({
        status: smsResponse.status,
        message: { err: 'Failed to send SMS via RingRX' },
        log: `RingRX SMS API error: ${smsResponse.status}`,
      });
    }

    // Parse the JSON response from RingRX
    const smsData: any = await smsResponse.json();

    // Check if RingRX returned an SMS ID (indicates successful send)
    if (smsData.sms_id) {
      // Set success flag on res.locals for next middleware/handler
      res.locals.isSuccessful = true;
      // Optionally store the SMS ID for logging/tracking
      res.locals.smsId = smsData.sms_id;
    } else {
      // SMS send failed - no SMS ID returned
      return next({
        status: 500,
        message: { err: 'SMS sent but no confirmation received' },
        log: 'RingRX did not return sms_id',
      });
    }

    // Call next() to proceed to response handler
    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error sending text message' }, // message to client
      log: `Error in smsController: ${error}`, // log to server
    });
  }
};
