/**
 * Centralized configuration — reads from environment variables.
 * All env access in the app goes through this module.
 * Never import process.env directly elsewhere.
 */
export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.API_PORT) || 4000,

  // URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',

  // Supabase — SERVER-ONLY keys (never sent to browser)
  SUPABASE_URL: requireEnv('SUPABASE_URL'),
  SUPABASE_SECRET_KEY: requireEnv('SUPABASE_SECRET_KEY'),

  // Gemini AI — SERVER-ONLY
  GEMINI_API_KEY: requireEnv('GEMINI_API_KEY'),

  // Auth / Session
  JWT_SECRET: requireEnv('JWT_SECRET'),
  SESSION_EXPIRY_HOURS: Number(process.env.SESSION_EXPIRY_HOURS) || 8,

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900_000,  // 15 min
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX) || 5,

  // Storage
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'sarkari-media',
  MAX_FILE_SIZE_BYTES: (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
}
