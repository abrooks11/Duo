import { NextFunction } from 'express';

/**
 * Standardized error structure for the application
 */
export interface AppError {
  status: number;
  message: { err: string };
  log: string;
}

/**
 * Generic error handler for controller methods
 * @param error - The caught error
 * @param method - The method name where error occurred
 * @param next - Express next function
 * @param customMessage - Optional custom error message
 */
export const handleControllerError = (
  error: unknown,
  method: string,
  next: NextFunction,
  customMessage?: string
): void => {
  console.error(`Controller.${method}:`, error);
  
  const errorMessage = customMessage || `Failed to ${method.toLowerCase()}`;
  
  return next({
    status: 500,
    message: { err: errorMessage },
    log: `Controller.${method}: ${error instanceof Error ? error.message : String(error)}`
  } as AppError);
};

/**
 * Async wrapper for Express route handlers
 * Automatically catches and forwards async errors
 */
export const asyncHandler = (
  fn: Function
) => (req: any, res: any, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Database operation error handler
 * @param error - The database error
 * @param operation - The database operation that failed
 * @param next - Express next function
 */
export const handleDatabaseError = (
  error: unknown,
  operation: string,
  next: NextFunction
): void => {
  console.error(`Database ${operation} error:`, error);
  
  return next({
    status: 500,
    message: { err: `Database ${operation} failed` },
    log: `Database.${operation}: ${error instanceof Error ? error.message : String(error)}`
  } as AppError);
};

/**
 * Validation error handler
 * @param field - The field that failed validation
 * @param value - The invalid value
 * @param next - Express next function
 */
export const handleValidationError = (
  field: string,
  value: any,
  next: NextFunction
): void => {
  console.error(`Validation error for ${field}:`, value);
  
  return next({
    status: 400,
    message: { err: `Invalid ${field}` },
    log: `Validation error: ${field} = ${value}`
  } as AppError);
};

/**
 * Creates a standardized success response
 * @param data - The response data
 * @param message - Optional success message
 * @param statusCode - HTTP status code (default: 200)
 */
export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  statusCode: number = 200
) => ({
  success: true,
  data,
  message,
  statusCode
});

/**
 * Creates a standardized error response
 * @param error - The error message
 * @param statusCode - HTTP status code (default: 500)
 */
export const createErrorResponse = (
  error: string,
  statusCode: number = 500
) => ({
  success: false,
  error,
  statusCode
});