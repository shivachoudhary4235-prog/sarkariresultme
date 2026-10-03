/**
 * API client for the public web app.
 * All requests go to the Node.js/Express backend.
 * Never imports server secrets.
 */
import type {
  NotificationItem,
  TickerItem,
  FeaturedTile,
  SearchFilters,
  SearchResult,
  ApiSuccessResponse,
} from '@sarkari/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      // Next.js 15 caching — revalidate every 60 seconds for public content
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const json = (await res.json()) as ApiSuccessResponse<T>;
    return json.data;
  } catch {
    // Graceful offline / build-time fallback when API is not running
    return null;
  }
}

export async function getNotifications(category?: string, page = 1, limit = 20) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category && category !== 'all') params.set('category', category);
  const data = await apiFetch<{ items: NotificationItem[]; total: number }>(`/api/public/notifications?${params}`);
  return data ?? { items: [], total: 0 };
}

export async function getNotificationBySlug(slug: string): Promise<NotificationItem> {
  const data = await apiFetch<NotificationItem>(`/api/public/notifications/${slug}`);
  if (!data) {
    throw new Error(`Notification not found: ${slug}`);
  }
  return data;
}

export async function searchNotifications(filters: SearchFilters): Promise<SearchResult> {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.category && filters.category !== 'all') params.set('category', filters.category);
  if (filters.state) params.set('state', filters.state);
  if (filters.qualification) params.set('qualification', filters.qualification);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const data = await apiFetch<{ items: NotificationItem[]; total: number; hasMore: boolean }>(
    `/api/public/search?${params}`
  );
  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    hasMore: data?.hasMore ?? false,
  };
}

export async function getTickerItems(): Promise<TickerItem[]> {
  const data = await apiFetch<TickerItem[]>('/api/public/ticker');
  return data ?? [];
}

export async function getFeaturedTiles(): Promise<FeaturedTile[]> {
  const data = await apiFetch<FeaturedTile[]>('/api/public/featured');
  return data ?? [];
}

export async function getCategoryStats(): Promise<Record<string, number>> {
  const data = await apiFetch<Record<string, number>>('/api/public/categories');
  return data ?? {};
}
