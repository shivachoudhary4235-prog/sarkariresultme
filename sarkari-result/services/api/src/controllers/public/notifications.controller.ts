/** Public notifications controller — only published, non-trashed items. */
import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase/adminClient';
import { AppError } from '../../middleware/errorHandler';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const offset = (page - 1) * limit;
    const category = req.query.category as string | undefined;

    let query = supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .eq('in_trash', false)
      .order('post_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;
    if (error) throw new AppError('Failed to fetch notifications', 500);

    res.json({
      success: true,
      data,
      meta: { total: count ?? 0, page, limit, hasMore: offset + limit < (count ?? 0) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .eq('in_trash', false)
      .single();

    if (error || !data) throw new AppError('Notification not found', 404, 'NOT_FOUND');

    // Increment views (fire-and-forget)
    supabaseAdmin.from('notifications').update({ views: (data.views || 0) + 1 }).eq('id', data.id);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function categories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('category')
      .eq('published', true)
      .eq('in_trash', false);

    if (error) throw new AppError('Failed to fetch categories', 500);

    // Count per category
    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.category] = (counts[row.category] || 0) + 1;
    }

    res.json({ success: true, data: counts });
  } catch (err) {
    next(err);
  }
}
