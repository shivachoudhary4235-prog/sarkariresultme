/**
 * Rate limiting middleware.
 * Separate limiters for public API and auth endpoints.
 *
 * SECURITY: Auth endpoint limiter is strict (5 attempts / 15 min)
 * to prevent brute-force attacks.
 */
import rateLimit from 'express-rate-limit';
import { config } from '../config';

/** General API rate limiter */
export const apiRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  skip: (req) => req.method === 'OPTIONS',
});

/** Strict limiter for authentication endpoints */
export const authRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,   // 15 minutes
  max: config.AUTH_RATE_LIMIT_MAX,          // 5 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    // Generic message — do not reveal lockout details
    message: 'Invalid email or password.',
  },
});

/** Strict limiter for media upload endpoints */
export const uploadRateLimiter = rateLimit({
  windowMs: 60_000,   // 1 minute
  max: 10,            // 10 uploads per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Upload rate limit exceeded. Please try again.',
  },
});
