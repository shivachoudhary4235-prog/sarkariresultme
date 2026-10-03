/**
 * Centralized error handler — Express error middleware (must have 4 args).
 *
 * SECURITY:
 * - Never expose stack traces in production.
 * - Never expose SQL errors, internal paths, or secret values.
 * - Always return a generic, user-safe message.
 * - Detailed reason is only logged server-side.
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const isProduction = process.env.NODE_ENV === 'production';

  // Log the real error server-side (including stack trace)
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
    return;
  }

  // Unknown / programmer error — return a generic safe message in production
  res.status(500).json({
    success: false,
    message: isProduction
      ? 'An unexpected error occurred. Please try again.'
      : err.message,
    // Never include stack trace or internal details in production
  });
}
