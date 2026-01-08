import type { SMS } from '../../../types/types';
const baseURL = 'http://localhost:3000/api';

export const sendSms = async (smsData: SMS) => {
  // get auth cookie
  const { phoneNumber, message } = smsData;
  console.log('fetching cookie . . . ');
  const getAuthToken = await fetch(`${baseURL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  await getAuthToken.json();

  console.log('sending sms to ', phoneNumber);
  // try {
  const sendSms = await fetch(`${baseURL}/sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber, message }),
    credentials: 'include',
  });
  console.log('SMS set');
  const data = await sendSms.json();
  console.log('message data:', data);
  return data;
  // } catch (error) {
  //   console.error(error.message);
  // }
};
