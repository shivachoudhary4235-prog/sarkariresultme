/**
 * Admin API routes — ALL require authentication + admin role.
 * Every privileged endpoint is protected on the server — not just hidden in the UI.
 */
import { Router } from 'express';
import { apiRateLimiter, authRateLimiter, uploadRateLimiter } from '../middleware/rateLimit';
import { authenticate } from '../middleware/auth';
import { requireAdmin, requirePermission } from '../middleware/adminAuth';

import * as notificationsController from '../controllers/admin/notifications.controller';
import * as tickerController from '../controllers/admin/ticker.controller';
import * as featuredController from '../controllers/admin/featured.controller';
import * as mediaController from '../controllers/admin/media.controller';
import * as usersController from '../controllers/admin/users.controller';
import * as auditController from '../controllers/admin/audit.controller';

const router = Router();

// ── Auth (rate-limited strictly) ──────────────────────────────────────────────
// Note: Supabase Auth handles actual login/logout — these are just session helpers
router.post('/auth/verify', authRateLimiter, authenticate, requireAdmin, (req, res) => {
  // Returns the verified admin user profile
  res.json({ success: true, data: req.user });
});

// ── Apply auth + admin check to all subsequent admin routes ───────────────────
router.use(apiRateLimiter);
router.use(authenticate);
router.use(requireAdmin);

// ── Notifications ─────────────────────────────────────────────────────────────
router.get('/notifications', notificationsController.list);
router.get('/notifications/:id', notificationsController.getById);
router.post(
  '/notifications',
  requirePermission('canCreateNotification'),
  notificationsController.create
);
router.patch(
  '/notifications/:id',
  requirePermission('canEditNotification'),
  notificationsController.update
);
router.patch(
  '/notifications/:id/publish',
  requirePermission('canPublishNotification'),
  notificationsController.publish
);
router.patch(
  '/notifications/:id/unpublish',
  requirePermission('canPublishNotification'),
  notificationsController.unpublish
);
router.patch(
  '/notifications/:id/trash',
  requirePermission('canDeleteNotification'),
  notificationsController.trash
);
router.patch(
  '/notifications/:id/restore',
  requirePermission('canDeleteNotification'),
  notificationsController.restore
);
router.delete(
  '/notifications/:id',
  requirePermission('canDeleteNotification'),
  notificationsController.permanentDelete
);

// ── Ticker ────────────────────────────────────────────────────────────────────
router.get('/ticker', tickerController.list);
router.post('/ticker', requirePermission('canManageTicker'), tickerController.create);
router.patch('/ticker/:id', requirePermission('canManageTicker'), tickerController.update);
router.delete('/ticker/:id', requirePermission('canManageTicker'), tickerController.remove);

// ── Featured tiles ────────────────────────────────────────────────────────────
router.get('/featured', featuredController.list);
router.patch('/featured/:id', requirePermission('canManageFeatured'), featuredController.update);

// ── Media ─────────────────────────────────────────────────────────────────────
router.get('/media', requirePermission('canUploadMedia'), mediaController.list);
router.post(
  '/media/upload-url',
  uploadRateLimiter,
  requirePermission('canUploadMedia'),
  mediaController.getUploadUrl
);
router.post('/media', requirePermission('canUploadMedia'), mediaController.create);
router.delete('/media/:id', requirePermission('canDeleteMedia'), mediaController.remove);

// ── Users (SUPER_ADMIN only) ──────────────────────────────────────────────────
router.get('/users', requirePermission('canManageUsers'), usersController.list);
router.patch('/users/:id/role', requirePermission('canChangeRoles'), usersController.updateRole);
router.patch('/users/:id/deactivate', requirePermission('canManageUsers'), usersController.deactivate);

// ── Audit logs ────────────────────────────────────────────────────────────────
router.get('/audit-logs', requirePermission('canViewAuditLogs'), auditController.list);

export default router;
