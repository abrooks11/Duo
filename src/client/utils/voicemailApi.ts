const baseURL = 'http://localhost:3000/api';

export const requestVoicemail = async () => {
  const getAuthToken = await fetch(`${baseURL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const authData = await getAuthToken.json();

  const getVoicemail = await fetch(`${baseURL}/voicemail`, {
    credentials: 'include',
  });
  const data = await getVoicemail.json();
  // console.log('message data:', data.data);
  return data.data;
};

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
