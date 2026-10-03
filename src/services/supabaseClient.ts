/**
 * Supabase Lightweight REST Client (Dependency-Free)
 * Connects directly to Supabase PostgREST API using native fetch().
 * Works seamlessly in Vite, Next.js, and browser environments with zero extra npm packages.
 */

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  '';

const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  '';

export const isSupabaseReady = () => {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('YOUR_PROJECT_REF')
  );
};

export async function supabaseRestFetch<T>(
  table: string,
  options?: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    params?: Record<string, string>;
    body?: any;
    headers?: Record<string, string>;
  }
): Promise<T | null> {
  if (!isSupabaseReady()) {
    return null;
  }

  const method = options?.method || 'GET';
  const query = options?.params ? '?' + new URLSearchParams(options.params).toString() : '';
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;

  const defaultHeaders: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    Prefer: method === 'POST' ? 'return=representation' : 'return=minimal',
  };

  try {
    const res = await fetch(url, {
      method,
      headers: { ...defaultHeaders, ...options?.headers },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Supabase REST error on ${table}:`, errText);
      return null;
    }

    if (method === 'DELETE') return true as unknown as T;
    const data = await res.json();
    return data as T;
  } catch (err: any) {
    console.warn(`Supabase connection error:`, err.message);
    return null;
  }
}

// High-level API for content, ticker, and flash tiles
export const supabaseApi = {
  notifications: {
    list: async () => {
      return supabaseRestFetch<any[]>('notifications', {
        params: { select: '*', order: 'created_at.desc' },
      });
    },
    create: async (item: any) => {
      return supabaseRestFetch<any[]>('notifications', {
        method: 'POST',
        body: item,
      });
    },
    update: async (id: string, updates: any) => {
      return supabaseRestFetch<any>('notifications', {
        method: 'PATCH',
        params: { id: `eq.${id}` },
        body: updates,
      });
    },
    delete: async (id: string) => {
      return supabaseRestFetch<any>('notifications', {
        method: 'DELETE',
        params: { id: `eq.${id}` },
      });
    },
  },
  ticker: {
    list: async () => {
      return supabaseRestFetch<any[]>('ticker_items', {
        params: { select: '*', order: 'sort_order.asc' },
      });
    },
    create: async (item: any) => {
      return supabaseRestFetch<any[]>('ticker_items', {
        method: 'POST',
        body: item,
      });
    },
    update: async (id: string, updates: any) => {
      return supabaseRestFetch<any>('ticker_items', {
        method: 'PATCH',
        params: { id: `eq.${id}` },
        body: updates,
      });
    },
    delete: async (id: string) => {
      return supabaseRestFetch<any>('ticker_items', {
        method: 'DELETE',
        params: { id: `eq.${id}` },
      });
    },
  },
  featuredTiles: {
    list: async () => {
      return supabaseRestFetch<any[]>('featured_tiles', {
        params: { select: '*', order: 'sort_order.asc' },
      });
    },
    update: async (id: string, updates: any) => {
      return supabaseRestFetch<any>('featured_tiles', {
        method: 'PATCH',
        params: { id: `eq.${id}` },
        body: updates,
      });
    },
  },
};
