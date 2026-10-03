import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase/adminClient';
import { createAuditLog } from '../../services/auditService';
import { AppError } from '../../middleware/errorHandler';
import type { AdminRole } from '@sarkari/shared-types';

const VALID_ROLES: AdminRole[] = ['SUPER_ADMIN', 'CONTENT_ADMIN', 'EDITOR', 'MODERATOR'];

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*, admin_roles(role)')
      .order('created_at', { ascending: false });
    if (error) throw new AppError('Failed to fetch users', 500);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!VALID_ROLES.includes(role)) throw new AppError('Invalid role', 400, 'VALIDATION_ERROR');

    const { error } = await supabaseAdmin.from('admin_roles').upsert({ user_id: id, role });
    if (error) throw new AppError('Failed to update role', 500);

    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'ROLE_CHANGED', resourceType: 'user', resourceId: id, afterData: { role }, ipAddress: req.ip });
    res.json({ success: true, message: 'Role updated.' });
  } catch (err) { next(err); }
}

export async function deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    if (id === req.user!.id) throw new AppError('Cannot deactivate your own account', 400, 'VALIDATION_ERROR');

    await supabaseAdmin.from('profiles').update({ is_active: false }).eq('id', id);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'USER_DEACTIVATED', resourceType: 'user', resourceId: id, ipAddress: req.ip });
    res.json({ success: true, message: 'User deactivated.' });
  } catch (err) { next(err); }
}
