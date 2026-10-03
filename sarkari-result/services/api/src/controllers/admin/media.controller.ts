import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase/adminClient';
import { createAuditLog } from '../../services/auditService';
import { AppError } from '../../middleware/errorHandler';
import { config } from '../../config';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin.from('media_files').select('*').order('created_at', { ascending: false });
    if (error) throw new AppError('Failed to fetch media files', 500);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

/** Returns a pre-signed upload URL from Supabase Storage (client uploads directly) */
export async function getUploadUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fileName, mimeType, sizeBytes } = req.body;

    if (!fileName || !mimeType) throw new AppError('fileName and mimeType are required', 400, 'VALIDATION_ERROR');
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) throw new AppError('File type not allowed', 400, 'VALIDATION_ERROR');
    if (sizeBytes > config.MAX_FILE_SIZE_BYTES) throw new AppError(`File exceeds max size of ${config.MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`, 400, 'VALIDATION_ERROR');

    const fileId = uuidv4();
    const ext = fileName.split('.').pop();
    const storagePath = `uploads/${req.user!.id}/${fileId}.${ext}`;

    const { data, error } = await supabaseAdmin.storage
      .from(config.SUPABASE_STORAGE_BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error) throw new AppError('Failed to create upload URL', 500);

    res.json({ success: true, data: { signedUrl: data.signedUrl, storagePath, fileId } });
  } catch (err) { next(err); }
}

/** Called after client upload is complete to record the media_files row */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { storagePath, fileName, mimeType, sizeBytes, altText } = req.body;

    const { data: urlData } = supabaseAdmin.storage.from(config.SUPABASE_STORAGE_BUCKET).getPublicUrl(storagePath);
    const { data, error } = await supabaseAdmin.from('media_files').insert({
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      file_name: fileName,
      mime_type: mimeType,
      size_bytes: sizeBytes,
      alt_text: altText,
      uploaded_by: req.user!.id,
    }).select().single();

    if (error) throw new AppError('Failed to record media file', 500);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'UPLOAD_MEDIA', resourceType: 'media_file', resourceId: data.id, afterData: data, ipAddress: req.ip });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { data: file } = await supabaseAdmin.from('media_files').select('*').eq('id', id).single();
    if (!file) throw new AppError('Media file not found', 404, 'NOT_FOUND');

    // Delete from storage
    await supabaseAdmin.storage.from(config.SUPABASE_STORAGE_BUCKET).remove([file.storage_path]);
    await supabaseAdmin.from('media_files').delete().eq('id', id);
    await createAuditLog({ actorUserId: req.user!.id, actorEmail: req.user!.email, action: 'DELETE_MEDIA', resourceType: 'media_file', resourceId: id, beforeData: file, ipAddress: req.ip });
    res.json({ success: true, message: 'Media file deleted.' });
  } catch (err) { next(err); }
}
