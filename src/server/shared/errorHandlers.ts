import type { Response, NextFunction, Request } from 'express';
import logger from './logger.js';

// ---------------------------------------------------------------------------
// AppError class
// ---------------------------------------------------------------------------

/**
 * Structured application error that the global error handler understands.
 */
export class AppError extends Error {
  status: number;
  log: string;

  constructor(message: string, status = 500, log?: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.log = log || message;
  }
}

// ---------------------------------------------------------------------------
// Response helpers — standard envelope
// ---------------------------------------------------------------------------

/**
 * Send a success response with the standard envelope.
 *
 * Shape: `{ success: true, data: T, message?: string }`
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
  });
};

/**
 * Send an error response with the standard envelope.
 *
 * Shape: `{ success: false, error: string }`
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode = 500
): void => {
  res.status(statusCode).json({
    success: false,
    error,
  });
};

// ---------------------------------------------------------------------------
// Controller / service error helpers
// ---------------------------------------------------------------------------

/**
 * Generic error handler for controller catch blocks.
 * Logs the error and forwards a structured AppError to Express `next()`.
 */
export const handleControllerError = (
  error: unknown,
  method: string,
  next: NextFunction,
  customMessage?: string
): void => {
  const errMsg =
    error instanceof Error ? error.message : String(error);

  logger.error({ method, error: errMsg }, `Controller.${method} failed`);

  next(
    new AppError(
      customMessage || `Failed to ${method.toLowerCase()}`,
      500,
      `Controller.${method}: ${errMsg}`
    )
  );
};

/**
 * Async wrapper for Express route handlers.
 * Catches rejected promises and forwards them to the global error handler.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Database operation error handler.
 */
export const handleDatabaseError = (
  error: unknown,
  operation: string,
  next: NextFunction
): void => {
  const errMsg =
    error instanceof Error ? error.message : String(error);

  logger.error({ operation, error: errMsg }, `Database ${operation} failed`);

  next(
    new AppError(
      `Database ${operation} failed`,
      500,
      `Database.${operation}: ${errMsg}`
    )
  );
};

/**
 * Validation error handler — returns 400.
 */
export const handleValidationError = (
  field: string,
  value: unknown,
  next: NextFunction
): void => {
  logger.warn({ field, value }, 'Validation error');

  next(new AppError(`Invalid ${field}`, 400, `Validation error: ${field} = ${value}`));
};
