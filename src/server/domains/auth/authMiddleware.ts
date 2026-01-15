import { Request, Response, NextFunction } from 'express';





export const createRingToken = async () => {
  try {
    const loginParams = {
      username: process.env.RING_USER_NAME,
      password: process.env.RING_PASSWORD,
    };

    const params = new URLSearchParams(loginParams).toString();

    // create token
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
      maxAge: 24 * 60 * 60 * 1000, // 24 hours, adjust as needed
    });

    return
  } catch (error) {
    
  }
};
