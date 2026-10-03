/**
 * Winston logger — structured logging.
 * In production, logs JSON. In dev, pretty-prints.
 * NEVER log passwords, tokens, or secrets.
 */
import { createLogger, format, transports } from 'winston';
import { config } from '../config';

const { combine, timestamp, errors, json, colorize, printf } = format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => {
    return stack
      ? `[${ts}] ${level}: ${message}\n${stack}`
      : `[${ts}] ${level}: ${message}`;
  })
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = createLogger({
  level: config.LOG_LEVEL,
  format: config.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [new transports.Console()],
  // In production, add file/cloud transports as needed
});
