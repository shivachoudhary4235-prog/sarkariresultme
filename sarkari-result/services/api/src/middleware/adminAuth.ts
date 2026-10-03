/**
 * Admin authorization middleware.
 * Checks that the authenticated user has admin role in the system.
 * Must be used AFTER the authenticate middleware.
 *
 * SECURITY:
 * - Returns 403 for non-admin users (not 404, not role-specific info).
 * - Inactive accounts are blocked.
 */
import { Request, Response, NextFunction } from 'express';
import { ROLE_PERMISSIONS } from '@sarkari/shared-types';
import type { AdminRole, RolePermissions } from '@sarkari/shared-types';
import { logger } from '../lib/logger';

/** Require the user to have an admin role at all. */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const user = req.user;

  if (!user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  if (!user.isActive) {
    logger.warn({ message: 'Inactive account access attempt', userId: user.id, ip: req.ip });
    res.status(403).json({ success: false, message: 'Access denied.' });
    return;
  }

  const validRoles: AdminRole[] = ['SUPER_ADMIN', 'CONTENT_ADMIN', 'EDITOR', 'MODERATOR'];
  if (!validRoles.includes(user.role)) {
    logger.warn({ message: 'Non-admin access attempt', userId: user.id, role: user.role, ip: req.ip });
    res.status(403).json({ success: false, message: 'Access denied.' });
    return;
  }

  next();
}

/** Require a specific permission from the role permission matrix. */
export function requirePermission(permission: keyof RolePermissions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions || !permissions[permission]) {
      logger.warn({
        message: 'Permission denied',
        userId: user.id,
        role: user.role,
        requiredPermission: permission,
        ip: req.ip,
      });
      // Generic 403 — do not reveal which permission is missing
      res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
      return;
    }

    next();
  };
}
