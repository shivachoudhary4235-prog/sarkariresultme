/**
 * Auth middleware — verifies Supabase session from Authorization header.
 * Attaches the verified user to req.user.
 *
 * SECURITY:
 * - Uses the secret server key to verify tokens server-side.
 * - Returns a generic 401 for all auth failures (no enumeration).
 */
import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase/adminClient';
import { logger } from '../lib/logger';
import type { AdminUser } from '@sarkari/shared-types';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AdminUser;
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      // Log the real reason internally, but return generic message
      logger.warn({ message: 'Auth failure', reason: error?.message, ip: req.ip });
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // Fetch admin profile to attach role info
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*, admin_roles(role)')
      .eq('id', user.id)
      .single();

    if (!profile) {
      logger.warn({ message: 'Auth: profile not found', userId: user.id, ip: req.ip });
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email!,
      displayName: profile.display_name || user.email!,
      role: profile.admin_roles?.role || 'EDITOR',
      avatarUrl: profile.avatar_url,
      lastSignInAt: user.last_sign_in_at,
      createdAt: user.created_at,
      isActive: profile.is_active ?? true,
    };

    next();
  } catch (err) {
    logger.error({ message: 'Auth middleware error', error: err, ip: req.ip });
    res.status(401).json({ success: false, message: 'Authentication failed.' });
  }
}
