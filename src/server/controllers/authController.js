export const login = async (req, res, next) => {
  try {
    const loginParams = {
      username: process.env.RING_USER_NAME,
      password: process.env.RING_PASSWORD,
    };
    const params = new URLSearchParams(loginParams).toString();

    // fetch voicemail from ringRX
    const response = await fetch(
      `https://portal.ringrx.com/auth/token?${params}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    // console.log('RESPONSE', response);
    // console.log('DATA', data);

    res.cookie('ring-token', data.access_token, {
      httpOnly: true,
      secure: true, // for HTTPS
      sameSite: 'strict',
      path: '/',
    });

    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error authorizing Ring API' }, // message to client
      log: `Error in authController: ${error}`, // log to server
    });
    // res.status(500).json({ error: 'Failed to authenticate with Ring API' });
  }
};
