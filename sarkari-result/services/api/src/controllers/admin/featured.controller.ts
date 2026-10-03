import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase/adminClient';
import { createAuditLog } from '../../services/auditService';
import { AppError } from '../../middleware/errorHandler';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin.from('featured_tiles').select('*').order('sort_order');
    if (error) throw new AppError('Failed to fetch featured tiles', 500);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const allowed = ['title', 'action_text', 'bg_color', 'action_color', 'slug', 'active', 'sort_order'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    updates.updated_by = req.user!.id;

    const { data, error } = await supabaseAdmin.from('featured_tiles').update(updates).eq('id', id).select().single();
    if (error) throw new AppError('Failed to update featured tile', 500);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'UPDATE_FEATURED', resourceType: 'featured_tile', resourceId: id, afterData: data, ipAddress: req.ip });
    res.json({ success: true, data });
  } catch (err) { next(err); }
}
