import { Response } from 'express';

export const loginToRingRx = async (): Promise<string> => {
  // PREP LOGIN CREDENTIALS
  const loginParams = {
    username: process.env.RING_USER_NAME,
    password: process.env.RING_PASSWORD,
  };

  const params = new URLSearchParams(loginParams).toString();

  // CREATE TOKEN
  const loginResponse = await fetch(
    `https://portal.ringrx.com/auth/token?${params}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  // Check if login response was successful (response.ok)
  if (!loginResponse.ok) {
    throw new Error('Failed to authenticate with RingRX API');
  }

  // Parse the JSON response from RingRX
  const loginData = await loginResponse.json();

  // Extract the token from the response (adjust property name based on actual API response)
  const token = loginData.access_token;

  // Return the token string
  return token;
};

export const refreshRingToken = async (res: Response): Promise<string> => {
  // Call loginToRingRX() to get a fresh token
  const token = await loginToRingRx();

  // Set cookie on the response object
  res.cookie('ring-token', token, {
    httpOnly: true,
    secure: true, // for HTTPS
    sameSite: 'strict',
    path: '/',
    // maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Return the token so caller can use it immediately
  return token;
};

export const makeAuthenticatedRingRequest = async (
  url: string,
  ringToken: string,
  refreshTokenFunc: () => Promise<string>
): Promise<Response> => {
  // Make initial fetch request to the provided URL
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ringToken}`,
      'Content-Type': 'application/json',
    },
  });

  // Check if response status indicates authentication failure
  if (response.status === 401 || response.status === 403) {
    // Token is expired or invalid
    // Call the refreshTokenFunc to get a new token
    const newToken = await refreshTokenFunc();

    // Retry the request with the new token
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${newToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  return response;
};

export const makeAuthenticatedRingDelete = async (
  url: string,
  ringToken: string,
  refreshTokenFunc: () => Promise<string>
): Promise<Response> => {
  let response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${ringToken}`,
      'Content-Type': 'application/json',
    },
  });

  // Check if response status indicates authentication failure
  if (response.status === 401 || response.status === 403) {
    // Token is expired or invalid
    // Call the refreshTokenFunc to get a new token
    const newToken = await refreshTokenFunc();

    // Retry the request with the new token
    response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${newToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  return response;
};

export const makeAuthenticatedRingPost = async (
  url: string,
  ringToken: string,
  refreshTokenFunc: () => Promise<string>,
  body?: any
): Promise<Response> => {
  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ringToken}`,
      'Content-Type': 'application/json',
    },
  };

  // Add body if provided
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  // Make initial POST request to the provided URL
  let response = await fetch(url, fetchOptions);

  // Check if response status indicates authentication failure
  // If status is 401 (Unauthorized) OR 403 (Forbidden):
  //   - Token is expired or invalid
  //   - Call the refreshTokenFunc to get a new token
  //   - Retry the request
  if (response.status === 401 || response.status === 403) {
    // Token is expired or invalid
    // Call the refreshTokenFunc to get a new token
    const newToken = await refreshTokenFunc();

    // Update the Authorization header with new token
    fetchOptions.headers = {
      Authorization: `Bearer ${newToken}`,
      'Content-Type': 'application/json',
    };

    // Retry the POST request with the new token
    response = await fetch(url, fetchOptions);
  }

  // Return the final response (either original if successful, or retry response)
  return response;
};