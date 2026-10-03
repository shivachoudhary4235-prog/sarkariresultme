import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase/adminClient';
import { AppError } from '../../middleware/errorHandler';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 50);
    const offset = (page - 1) * limit;
    const action = req.query.action as string | undefined;
    const resourceType = req.query.resourceType as string | undefined;

    let query = supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (action) query = query.eq('action', action);
    if (resourceType) query = query.eq('resource_type', resourceType);

    const { data, error, count } = await query;
    if (error) throw new AppError('Failed to fetch audit logs', 500);
    res.json({ success: true, data, meta: { total: count ?? 0, page, limit } });
  } catch (err) { next(err); }
}
