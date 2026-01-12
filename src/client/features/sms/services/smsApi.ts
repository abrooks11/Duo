import { toast } from 'react-toastify';


import type { SMS } from '../../../types/types';
const baseURL = 'http://localhost:3000/api';

export const sendSms = async (smsData: SMS) => {
  // get auth cookie
  
  const getAuthToken = await fetch(`${baseURL}/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    
    await getAuthToken.json();
    
    const { phoneNumber, message } = smsData;
  console.log('sending sms to ', phoneNumber);
  // try {
  const smsResponse = await fetch(`${baseURL}/sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber, message }),
    credentials: 'include',
  });

    if (smsResponse.status === 200) {
      toast.success('Text message sent successfully');
    } 
    return smsResponse.status;


  // } catch (error) {
  //   console.error(error.message);
  // }
};
