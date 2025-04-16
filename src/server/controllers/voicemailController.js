export const getVoicemail = async (req, res, next) => {
  try {
    const token = req.cookies['ring-token']; // Get the token from cookies
    const folder = req.body.folder

    if (!token) {
      return next({
        status: 401,
        message: { err: 'Authentication required' },
        log: 'Missing or invalid ring-token cookie',
      });
    }
    const response = await fetch(
      `https://portal.ringrx.com/voicemails?message_folder=${folder}`,
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
    next({
      status: 500,
      message: { err: 'Error fetching voicemail' }, // message to client
      log: `Error in voicemailController: ${error}`, // log to server
    });
  }
};
