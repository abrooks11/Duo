import { toast } from 'react-toastify';

const baseURL = 'http://localhost:3000/api';

export const sendSms = async (phoneNumber: string, message:string): Promise<number> => {
    
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

};
