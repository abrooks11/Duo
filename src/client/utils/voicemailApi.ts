import { toast } from "react-toastify";

const baseURL = 'http://localhost:3000/api';

export const requestVoicemail = async () => {
  // get auth cookie
  const getAuthToken = await fetch(`${baseURL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  await getAuthToken.json();
  // get voicemail 
  const getVoicemail = await fetch(`${baseURL}/voicemail`, {
    method: "POST", 
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  });
  const data = await getVoicemail.json();
  // console.log('message data:', data.data);
  return data.data;
};

export const updateVoicemailNote = async (vmId: string, note: string) => {
  // console.log('Attempting to update note to ', note)
  const response = await fetch(`${baseURL}/voicemail/${vmId}`, {
  method: "PATCH", 
  headers: {
    'Content-Type': 'application/json'
  }, 
  body: JSON.stringify({vmId, note}), 
  credentials: 'include'
})

await response.json()
if (response.status === 200) {
  toast.success("Message note successfully updated")
}
return {status: response.status}
}

export const updateVoicemailReason = async (vmId: string, reason: string) => {
// console.log('Attempting to update reason to ', reason)

const response = await fetch(`${baseURL}/voicemail/${vmId}`, {
  method: "PATCH", 
  headers: {
    'Content-Type': 'application/json'
  }, 
  body: JSON.stringify({vmId, reason}), 
  credentials: 'include'
})

await response.json()

if (response.status === 200) {
  toast.success("Message reason successfully updated")
}
return {status: response.status}

}

export const deleteVoicemail = async (id: string) => {
  // console.log('Attempting to move message to trash');
  
  const response = await fetch(`${baseURL}/voicemail/${id}`, {
    method: 'DELETE', 
    headers: {
      'Content-Type': 'application/json'
    }, 
    credentials: 'include'
  }
  )

  await response.json()

  if (response.status === 200) {
    toast.success("Message successfully moved to Trash")
  }
  return {status: response.status}
}

export const requestAiResponse = async (type: string, transcript: string) => {
  try {
    // console.log({type, transcript})
    const response = await fetch(`${baseURL}/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, transcript }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error requesting AI response:', error);
  }
};

