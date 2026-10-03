/** Admin ticker, featured, media, users, audit controllers (stubs with full structure) */
import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase/adminClient';
import { createAuditLog } from '../../services/auditService';
import { AppError } from '../../middleware/errorHandler';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin.from('ticker_items').select('*').order('sort_order');
    if (error) throw new AppError('Failed to fetch ticker items', 500);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, url, badge, active } = req.body;
    if (!title || !url) throw new AppError('title and url are required', 400, 'VALIDATION_ERROR');
    const { data, error } = await supabaseAdmin.from('ticker_items').insert({ title, url, badge, active: active ?? true, created_by: req.user!.id }).select().single();
    if (error) throw new AppError('Failed to create ticker item', 500);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'CREATE_TICKER', resourceType: 'ticker_item', resourceId: data.id, afterData: data, ipAddress: req.ip });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from('ticker_items').update(req.body).eq('id', id).select().single();
    if (error) throw new AppError('Failed to update ticker item', 500);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'UPDATE_TICKER', resourceType: 'ticker_item', resourceId: id, ipAddress: req.ip });
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await supabaseAdmin.from('ticker_items').delete().eq('id', id);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'DELETE_TICKER', resourceType: 'ticker_item', resourceId: id, ipAddress: req.ip });
    res.json({ success: true, message: 'Ticker item deleted.' });
  } catch (err) { next(err); }
}
