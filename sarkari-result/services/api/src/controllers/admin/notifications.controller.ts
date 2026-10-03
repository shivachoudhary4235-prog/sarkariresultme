/**
 * Admin — Notifications Controller
 * Handles CMS CRUD for notification items.
 * All operations are authenticated, authorized, and audit-logged.
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../lib/supabase/adminClient';
import { createAuditLog } from '../../services/auditService';
import { AppError } from '../../middleware/errorHandler';

// ── Zod validation schemas ────────────────────────────────────────────────────
const notificationSchema = z.object({
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(3).max(500),
  category: z.enum(['result', 'admit-card', 'latest-job', 'teaching', 'answer-key', 'syllabus', 'outsourcing', 'important']),
  organization: z.string().min(2).max(300),
  department: z.string().optional(),
  state: z.string().min(1),
  qualification: z.string().min(1),
  totalVacancies: z.string().min(1),
  postDate: z.string(),
  lastDate: z.string().optional(),
  examDate: z.string().optional(),
  admitCardDate: z.string().optional(),
  resultDate: z.string().optional(),
  feeGeneral: z.string().optional(),
  feeReserved: z.string().optional(),
  ageMin: z.string().optional(),
  ageMax: z.string().optional(),
  eligibility: z.string().min(1),
  shortDescription: z.string().min(10).max(1000),
  applyUrl: z.string().url().or(z.literal('#')),
  notificationUrl: z.string().url().or(z.literal('#')),
  officialUrl: z.string().url(),
  telegramUrl: z.string().url().optional().or(z.literal('')),
  whatsappUrl: z.string().url().optional().or(z.literal('')),
  articleContent: z.string().optional(),
  howToApply: z.string().optional(),
  selectionProcess: z.string().optional(),
  statusBadge: z.enum(['DECLARED', 'ACTIVE', 'OUT', 'EXTENDED', 'NEW', 'CORRECTION', 'UPCOMING']).nullable().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

// ── List ──────────────────────────────────────────────────────────────────────
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 50);
    const offset = (page - 1) * limit;
    const category = req.query.category as string | undefined;
    const trash = req.query.trash === 'true';

    let query = supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('in_trash', trash)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;
    if (error) throw new AppError('Failed to fetch notifications', 500, 'DB_ERROR');

    res.json({
      success: true,
      data,
      meta: { total: count ?? 0, page, limit, hasMore: (offset + limit) < (count ?? 0) },
    });
  } catch (err) {
    next(err);
  }
}

// ── Get by ID ─────────────────────────────────────────────────────────────────
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError('Notification not found', 404, 'NOT_FOUND');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// ── Create ────────────────────────────────────────────────────────────────────
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = notificationSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Validation failed: ' + parsed.error.issues.map(i => i.message).join(', '), 400, 'VALIDATION_ERROR');
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        ...parsed.data,
        published: parsed.data.published ?? false,
        in_trash: false,
        views: 0,
        created_by: req.user!.id,
        updated_by: req.user!.id,
      })
      .select()
      .single();

    if (error) throw new AppError('Failed to create notification', 500, 'DB_ERROR');

    await createAuditLog({
      actorUserId: req.user!.id,
      actorEmail: req.user!.email,
      action: 'CREATE_NOTIFICATION',
      resourceType: 'notification',
      resourceId: inserted.id,
      afterData: inserted,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({ success: true, data: inserted, message: 'Notification created.' });
  } catch (err) {
    next(err);
  }
}

// ── Update ────────────────────────────────────────────────────────────────────
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const parsed = notificationSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Validation failed: ' + parsed.error.issues.map(i => i.message).join(', '), 400, 'VALIDATION_ERROR');
    }

    // Fetch existing for audit
    const { data: existing } = await supabaseAdmin.from('notifications').select('*').eq('id', id).single();
    if (!existing) throw new AppError('Notification not found', 404, 'NOT_FOUND');

    const { data: updated, error } = await supabaseAdmin
      .from('notifications')
      .update({ ...parsed.data, updated_by: req.user!.id })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError('Failed to update notification', 500, 'DB_ERROR');

    await createAuditLog({
      actorUserId: req.user!.id,
      actorEmail: req.user!.email,
      action: 'UPDATE_NOTIFICATION',
      resourceType: 'notification',
      resourceId: id,
      beforeData: existing,
      afterData: updated,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ success: true, data: updated, message: 'Notification updated.' });
  } catch (err) {
    next(err);
  }
}

// ── Publish ───────────────────────────────────────────────────────────────────
export async function publish(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ published: true, updated_by: req.user!.id })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new AppError('Failed to publish notification', 500, 'DB_ERROR');

    await createAuditLog({
      actorUserId: req.user!.id,
      actorEmail: req.user!.email,
      action: 'PUBLISH_NOTIFICATION',
      resourceType: 'notification',
      resourceId: id,
      ipAddress: req.ip,
    });

    res.json({ success: true, data, message: 'Notification published.' });
  } catch (err) {
    next(err);
  }
}

// ── Unpublish ─────────────────────────────────────────────────────────────────
export async function unpublish(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ published: false, updated_by: req.user!.id })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new AppError('Failed to unpublish notification', 500, 'DB_ERROR');

    await createAuditLog({
      actorUserId: req.user!.id,
      actorEmail: req.user!.email,
      action: 'UNPUBLISH_NOTIFICATION',
      resourceType: 'notification',
      resourceId: id,
      ipAddress: req.ip,
    });

    res.json({ success: true, data, message: 'Notification unpublished.' });
  } catch (err) {
    next(err);
  }
}

// ── Trash ─────────────────────────────────────────────────────────────────────
export async function trash(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await supabaseAdmin.from('notifications').update({ in_trash: true, updated_by: req.user!.id }).eq('id', id);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'DELETE_NOTIFICATION', resourceType: 'notification', resourceId: id, ipAddress: req.ip });
    res.json({ success: true, message: 'Notification moved to trash.' });
  } catch (err) {
    next(err);
  }
}

// ── Restore ───────────────────────────────────────────────────────────────────
export async function restore(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await supabaseAdmin.from('notifications').update({ in_trash: false, updated_by: req.user!.id }).eq('id', id);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'RESTORE_NOTIFICATION', resourceType: 'notification', resourceId: id, ipAddress: req.ip });
    res.json({ success: true, message: 'Notification restored.' });
  } catch (err) {
    next(err);
  }
}

// ── Permanent delete ──────────────────────────────────────────────────────────
export async function permanentDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { data: existing } = await supabaseAdmin.from('notifications').select('*').eq('id', id).single();
    await supabaseAdmin.from('notifications').delete().eq('id', id);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'DELETE_NOTIFICATION', resourceType: 'notification', resourceId: id, beforeData: existing, ipAddress: req.ip });
    res.json({ success: true, message: 'Notification permanently deleted.' });
  } catch (err) {
    next(err);
  }
}
