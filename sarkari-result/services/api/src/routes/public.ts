/**
 * Public API routes — no authentication required.
 * All data returned here must be published and safe for public consumption.
 */
import { Router } from 'express';
import { apiRateLimiter } from '../middleware/rateLimit';
import * as notificationsController from '../controllers/public/notifications.controller';
import * as searchController from '../controllers/public/search.controller';
import * as tickerController from '../controllers/public/ticker.controller';
import * as featuredController from '../controllers/public/featured.controller';

const router = Router();

// Apply general rate limiter to all public routes
router.use(apiRateLimiter);

// ── Notifications ─────────────────────────────────────────────────────────────
/** GET /api/public/notifications?category=&page=&limit= */
router.get('/notifications', notificationsController.list);

/** GET /api/public/notifications/:slug */
router.get('/notifications/:slug', notificationsController.getBySlug);

// ── Search ────────────────────────────────────────────────────────────────────
/** GET /api/public/search?q=&category=&state=&qualification=&page=&limit= */
router.get('/search', searchController.search);

// ── Ticker ────────────────────────────────────────────────────────────────────
/** GET /api/public/ticker */
router.get('/ticker', tickerController.list);

// ── Featured tiles ────────────────────────────────────────────────────────────
/** GET /api/public/featured */
router.get('/featured', featuredController.list);

// ── Categories ────────────────────────────────────────────────────────────────
/** GET /api/public/categories — returns counts per category */
router.get('/categories', notificationsController.categories);

export default router;
