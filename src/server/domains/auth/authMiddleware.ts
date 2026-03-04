import { Request, Response, NextFunction } from 'express';

// Import utility functions from ringAuth
import {refreshRingToken} from './authUtils.ts'

// ============================================================================
// TYPE EXTENSION: Extend Express Request interface
// PURPOSE: Add custom properties that will be attached by middleware
// ============================================================================

// Declare global namespace to extend Express types
// Inside Express.Request interface, add:
//   - ringToken?: string (optional because it might not exist before middleware)
//   - refreshRingToken?: () => Promise<string> (function to refresh token)
declare global {
  namespace Express {
    interface Request {
      ringToken?: string;
      refreshRingToken?: () => Promise<string>;
    }
  }
}

export const ensureRingAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define a helper function to refresh the token when needed
    // This function will:
    //   - Call refreshRingToken from utils, passing the res object
    //   - Update req.ringToken with the new token
    //   - Return the new token
    // This helper will be attached to req so controllers can use it
    const refreshTokenHelper = async (): Promise<string> => {
      const newToken = await refreshRingToken(res);
      req.ringToken = newToken;
      return newToken;
    };

    // Attempt to get existing token from cookies
    let ringToken = req.cookies['ring-token'];
    // Check if token exists

    if (!ringToken) {
      ringToken = await refreshTokenHelper();
    }

    // Attach token to request object for use in controllers
    req.ringToken = ringToken;

    // Attach refresh function to request object for use in controllers
    // Set req.refreshRingToken = the helper function we defined
    // This allows controllers to refresh token if it becomes invalid during their execution
    req.refreshRingToken = refreshTokenHelper;

    // Call next() to proceed to the next middleware/controller in the chain
    return next();
  } catch (error) {
        return next({
          status: 500,
          message: { err: 'Failed to authenticate with RingRX' },
          log: `Error in ringAuthMiddleware: ${error}`,
        });
  }
};
