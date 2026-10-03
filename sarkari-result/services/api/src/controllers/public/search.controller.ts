/** Public search controller — PostgreSQL full-text search. */
import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase/adminClient';
import { AppError } from '../../middleware/errorHandler';

export async function search(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const q = (req.query.q as string || '').trim().slice(0, 200);
    const category = req.query.category as string | undefined;
    const state = req.query.state as string | undefined;
    const qualification = req.query.qualification as string | undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .eq('in_trash', false)
      .range(offset, offset + limit - 1)
      .order('post_date', { ascending: false });

    if (q) {
      // PostgreSQL full-text search using ilike for now (upgrade to tsvector later)
      query = query.or(
        `title.ilike.%${q}%,organization.ilike.%${q}%,short_description.ilike.%${q}%`
      );
    }
    if (category && category !== 'all') query = query.eq('category', category);
    if (state && state !== 'All') query = query.eq('state', state);
    if (qualification && qualification !== 'All') query = query.eq('qualification', qualification);

    const { data, error, count } = await query;
    if (error) throw new AppError('Search failed', 500);

    res.json({
      success: true,
      data,
      meta: { total: count ?? 0, page, limit, hasMore: offset + limit < (count ?? 0) },
    });
  } catch (err) {
    next(err);
  }
}
