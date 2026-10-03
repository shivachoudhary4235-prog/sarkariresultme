/**
 * Audit Log service.
 * Records every significant admin mutation.
 *
 * SECURITY:
 * - Never store passwords, tokens, or secrets in audit logs.
 * - IP address is stored for security forensics.
 * - before/after data is stored for accountability.
 */
import { supabaseAdmin } from '../lib/supabase/adminClient';
import { logger } from '../lib/logger';
import type { AuditAction } from '@sarkari/shared-types';

interface CreateAuditLogParams {
  actorUserId: string;
  actorEmail: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(params: CreateAuditLogParams): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from('audit_logs').insert({
      actor_user_id: params.actorUserId,
      actor_email: params.actorEmail,
      action: params.action,
      resource_type: params.resourceType,
      resource_id: params.resourceId,
      before_data: params.beforeData,
      after_data: params.afterData,
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
    });

    if (error) {
      // Non-fatal: log audit failure but don't interrupt the main operation
      logger.error({ message: 'Failed to write audit log', error: error.message });
    }
  } catch (err) {
    logger.error({ message: 'Audit log service error', error: err });
  }
}
