/**
 * Sarkari Result — Node.js/Express API Server
 * Main entry point. Bootstraps all middleware, routes, and starts listening.
 */
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { config } from './config';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { notFoundHandler } from './middleware/notFoundHandler';

// Routes
import publicRouter from './routes/public';
import adminRouter from './routes/admin';

const app = express();

// ── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: config.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  })
);

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [config.APP_URL, config.ADMIN_URL].filter(Boolean);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  })
);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── HTTP request logging (dev only via morgan, prod via winston) ─────────────
if (config.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(requestLogger);

// ── Health check (no auth required) ─────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: config.NODE_ENV, timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/public', publicRouter);
app.use('/api/admin', adminRouter);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── Centralized error handler (always last) ───────────────────────────────────
app.use(errorHandler);

// ── Start server (local / non-Vercel environments) ───────────────────────────
if (process.env.VERCEL !== '1') {
  app.listen(config.PORT, () => {
    logger.info(`🚀 Sarkari Result API running on port ${config.PORT} [${config.NODE_ENV}]`);
  });
}

export default app;
