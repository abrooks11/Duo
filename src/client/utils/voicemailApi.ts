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
console.log('sending note to server: ', note)
const response = await fetch(`${baseURL}/voicemail/${vmId}`, {
  method: "PATCH", 
  headers: {
    'Content-Type': 'application/json'
  }, 
  body: JSON.stringify({vmId, note}), 
  credentials: 'include'
})

const data = await response.json()
console.log(data);
}

export const deleteVoicemail = async (id: string) => {
  console.log('sending to server');
  
  const response = await fetch(`${baseURL}/voicemail/${id}`, {
    method: 'DELETE', 
    headers: {
      'Content-Type': 'application/json'
    }, 
    credentials: 'include'
  }
  )

  const data = await response.json()
  console.log(data);
  return 
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

