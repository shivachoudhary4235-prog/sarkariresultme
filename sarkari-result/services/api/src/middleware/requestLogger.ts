import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

/**
 * Structured request logger.
 * Logs method, path, status code, and response time.
 * Does NOT log request bodies (may contain sensitive data).
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const logFn = statusCode >= 500
      ? logger.error.bind(logger)
      : statusCode >= 400
        ? logger.warn.bind(logger)
        : logger.info.bind(logger);

    logFn({
      message: `${method} ${originalUrl} ${statusCode} ${duration}ms`,
      method,
      url: originalUrl,
      status: statusCode,
      duration,
      ip,
    });
  });

  next();
}
