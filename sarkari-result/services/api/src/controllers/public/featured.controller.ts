import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase/adminClient';
import { AppError } from '../../middleware/errorHandler';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('featured_tiles')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });
    if (error) throw new AppError('Failed to fetch featured tiles', 500);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
