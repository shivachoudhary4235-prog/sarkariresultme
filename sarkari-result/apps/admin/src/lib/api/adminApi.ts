/**
 * Admin API client — browser-side.
 * Authenticates with Supabase session token.
 * All requests go to the Node.js/Express backend.
 */
import { createSupabaseBrowserClient } from '../supabase/browser';
import type { NotificationItem, TickerItem, FeaturedTile, AuditLog } from '@sarkari/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' };
}

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}${path}`, { ...options, headers: { ...headers, ...options?.headers } });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'An error occurred.' }));
    throw new Error(body.message || 'An error occurred.');
  }

  const json = await res.json();
  return json.data;
}

// ── Notifications ──────────────────────────────────────────────────────────
export const adminApi = {
  notifications: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return adminFetch<NotificationItem[]>(`/api/admin/notifications${qs}`);
    },
    getById: (id: string) => adminFetch<NotificationItem>(`/api/admin/notifications/${id}`),
    create: (data: Partial<NotificationItem>) =>
      adminFetch<NotificationItem>('/api/admin/notifications', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<NotificationItem>) =>
      adminFetch<NotificationItem>(`/api/admin/notifications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    publish: (id: string) =>
      adminFetch<NotificationItem>(`/api/admin/notifications/${id}/publish`, { method: 'PATCH' }),
    unpublish: (id: string) =>
      adminFetch<NotificationItem>(`/api/admin/notifications/${id}/unpublish`, { method: 'PATCH' }),
    trash: (id: string) =>
      adminFetch(`/api/admin/notifications/${id}/trash`, { method: 'PATCH' }),
    restore: (id: string) =>
      adminFetch(`/api/admin/notifications/${id}/restore`, { method: 'PATCH' }),
    permanentDelete: (id: string) =>
      adminFetch(`/api/admin/notifications/${id}`, { method: 'DELETE' }),
  },

  ticker: {
    list: () => adminFetch<TickerItem[]>('/api/admin/ticker'),
    create: (data: { title: string; url: string; badge?: string }) =>
      adminFetch<TickerItem>('/api/admin/ticker', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<TickerItem>) =>
      adminFetch<TickerItem>(`/api/admin/ticker/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      adminFetch(`/api/admin/ticker/${id}`, { method: 'DELETE' }),
  },

  featured: {
    list: () => adminFetch<FeaturedTile[]>('/api/admin/featured'),
    update: (id: string, data: Partial<FeaturedTile>) =>
      adminFetch<FeaturedTile>(`/api/admin/featured/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  auditLogs: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return adminFetch<AuditLog[]>(`/api/admin/audit-logs${qs}`);
    },
  },

  media: {
    list: () => adminFetch('/api/admin/media'),
    getUploadUrl: (data: { fileName: string; mimeType: string; sizeBytes: number }) =>
      adminFetch<{ signedUrl: string; storagePath: string; fileId: string }>(
        '/api/admin/media/upload-url',
        { method: 'POST', body: JSON.stringify(data) }
      ),
    create: (data: { storagePath: string; fileName: string; mimeType: string; sizeBytes: number; altText?: string }) =>
      adminFetch('/api/admin/media', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => adminFetch(`/api/admin/media/${id}`, { method: 'DELETE' }),
  },
};
