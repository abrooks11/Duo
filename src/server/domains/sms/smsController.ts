import { NextFunction } from 'express';

export const sendSms = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const { phoneNumber, message } = req.body;
      const encodedMessage = encodeURIComponent(message);

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
      const smsResponse = await fetch(
        `https://portal.ringrx.com/messaging/send_message?to=${phoneNumber}&message=${encodedMessage}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ringToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const smsData: any = await smsResponse.json();

if (smsData.sms_id) {
  res.locals.isSuccessful = true;
}
  
  return next();
    } catch (error) {
    next({
      status: 500,
      message: { err: 'Error sending text message' }, // message to client
      log: `Error in smsController: ${error}`, // log to server
    });

}
}
