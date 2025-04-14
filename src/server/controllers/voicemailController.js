export const getVoicemail = async (req, res, next) => {
  try {
    const token = req.cookies['ring-token']; // Get the token from cookies
    if (!token) {
      return next('Invalid token');
    }
    const response = await fetch(
      `https://portal.ringrx.com/voicemails?message_folder=inbox`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    // console.log('MESSAGE DATA', data);
    res.locals.voicemail = data;
    return next();
  } catch (error) {
    console.error('ERROR: getVoicemail middleware', error);
  }
};
