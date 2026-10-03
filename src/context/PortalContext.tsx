import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NotificationItem,
  NotificationCategory,
  TickerItem,
  FeaturedTile,
  ActiveScreen,
} from '../types';
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_TICKER_ITEMS,
  INITIAL_FEATURED_TILES,
} from '../data/seedData';
import { supabaseApi, isSupabaseReady } from '../services/supabaseClient';

interface PortalContextType {
  notifications: NotificationItem[];
  tickerItems: TickerItem[];
  featuredTiles: FeaturedTile[];
  currentView: ActiveScreen;
  selectedCategory: NotificationCategory | 'all';
  selectedSlug: string | null;
  searchQuery: string;
  filterState: string;
  filterQualification: string;
  selectedItem: NotificationItem | null;
  
  // Navigation
  setView: (view: ActiveScreen) => void;
  openNotification: (slug: string) => void;
  openCategory: (category: NotificationCategory) => void;
  goHome: () => void;
  setSearchQuery: (q: string) => void;
  setFilterState: (state: string) => void;
  setFilterQualification: (qual: string) => void;
  
  // CMS Operations
  addNotification: (item: Omit<NotificationItem, 'id' | 'views'>) => void;
  updateNotification: (id: string, item: Partial<NotificationItem>) => void;
  trashNotification: (id: string) => void;
  restoreNotification: (id: string) => void;
  permanentDeleteNotification: (id: string) => void;
  
  // Ticker operations
  addTickerItem: (title: string, url: string, badge?: string) => void;
  toggleTickerItem: (id: string) => void;
  deleteTickerItem: (id: string) => void;
  
  // Featured Tiles
  updateFeaturedTile: (id: string, updates: Partial<FeaturedTile>) => void;
  
  // Reset
  resetToDefaults: () => void;

  // Typography & Accessibility
  fontScale: 'standard' | 'large' | 'xlarge';
  setFontScale: (scale: 'standard' | 'large' | 'xlarge') => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEY_NOTIFS = 'sarkari_result_notifications_v1';
const STORAGE_KEY_TICKER = 'sarkari_result_ticker_v1';
const STORAGE_KEY_FEATURED = 'sarkari_result_featured_v1';
const STORAGE_KEY_FONTSCALE = 'sarkari_result_font_scale_v1';

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontScale, setFontScaleState] = useState<'standard' | 'large' | 'xlarge'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FONTSCALE);
      if (saved === 'standard' || saved === 'large' || saved === 'xlarge') return saved;
    } catch {
      // fallback
    }
    return 'large'; // Default to large as requested by user
  });

  const setFontScale = (scale: 'standard' | 'large' | 'xlarge') => {
    setFontScaleState(scale);
    try {
      localStorage.setItem(STORAGE_KEY_FONTSCALE, scale);
    } catch {
      // ignore
    }
  };
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) {
        const parsed: NotificationItem[] = JSON.parse(saved);
        // Clean out any old admission or certificate notifications from localStorage cache
        const cleaned = parsed.filter(
          (n) => (n.category as string) !== 'admission' && (n.category as string) !== 'certificate'
        );
        const hasTeaching = cleaned.some((n) => n.category === 'teaching');
        if (!hasTeaching) {
          const teachingSeed = INITIAL_NOTIFICATIONS.filter((n) => n.category === 'teaching');
          return [...teachingSeed, ...cleaned];
        }
        return cleaned;
      }
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [tickerItems, setTickerItems] = useState<TickerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TICKER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TICKER_ITEMS;
  });

  const [featuredTiles, setFeaturedTiles] = useState<FeaturedTile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FEATURED);
      if (saved) {
        const parsed: FeaturedTile[] = JSON.parse(saved);
        // If cached tile still has old scholarship, refresh with new teaching tile
        const hasScholarship = parsed.some((t) => t.title.toLowerCase().includes('scholarship'));
        if (hasScholarship) {
          return INITIAL_FEATURED_TILES;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_FEATURED_TILES;
  });

  const VALID_CATEGORIES: NotificationCategory[] = [
    'result',
    'admit-card',
    'latest-job',
    'teaching',
    'answer-key',
    'syllabus',
    'outsourcing',
    'important',
    'admission',
    'certificate',
  ];

  const parseStateFromLocation = (): {
    view: ActiveScreen;
    category: NotificationCategory | 'all';
    slug: string | null;
  } => {
    if (typeof window === 'undefined') {
      return { view: 'home', category: 'all', slug: null };
    }
    const path = window.location.pathname.toLowerCase().replace(/^\/+/g, '').replace(/\/+$/g, '');
    const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
    const searchParams = new URLSearchParams(window.location.search);
    const queryView = searchParams.get('view')?.toLowerCase();
    const queryPost = searchParams.get('post') || searchParams.get('item');
    const queryCat = searchParams.get('category')?.toLowerCase();

    if (queryPost) {
      return { view: 'detail', category: 'all', slug: queryPost };
    }

    const target = queryView || hash || path;

    if (!target || target === 'home') {
      return { view: 'home', category: 'all', slug: null };
    }
    if (target === 'admin' || target.startsWith('admin/')) {
      return { view: 'admin', category: 'all', slug: null };
    }
    if (target === 'about' || target === 'about-us') {
      return { view: 'about', category: 'all', slug: null };
    }
    if (target === 'contact' || target === 'contact-us') {
      return { view: 'contact', category: 'all', slug: null };
    }
    if (target === 'disclaimer') {
      return { view: 'disclaimer', category: 'all', slug: null };
    }
    if (target === 'privacy' || target === 'privacy-policy') {
      return { view: 'privacy-policy', category: 'all', slug: null };
    }
    if (target === 'cookie' || target === 'cookie-policy' || target === 'cookies') {
      return { view: 'cookie-policy', category: 'all', slug: null };
    }
    if (target === 'terms' || target === 'terms-conditions' || target === 'terms-of-service') {
      return { view: 'terms', category: 'all', slug: null };
    }
    if (target === 'editorial' || target === 'editorial-policy') {
      return { view: 'editorial-policy', category: 'all', slug: null };
    }
    if (target === 'correction' || target === 'corrections' || target === 'correction-policy') {
      return { view: 'correction-policy', category: 'all', slug: null };
    }
    if (target === 'sitemap') {
      return { view: 'sitemap', category: 'all', slug: null };
    }
    if (target === 'search') {
      return { view: 'search', category: 'all', slug: null };
    }

    // Direct category routing e.g. /latest-job, /result, or /directory/latest-job
    const strippedCategory = target.replace(/^directory\//, '');
    if (VALID_CATEGORIES.includes(strippedCategory as NotificationCategory)) {
      return { view: 'directory', category: strippedCategory as NotificationCategory, slug: null };
    }
    if (queryCat && VALID_CATEGORIES.includes(queryCat as NotificationCategory)) {
      return { view: 'directory', category: queryCat as NotificationCategory, slug: null };
    }

    // Direct notification slug routing e.g. /my-job-notification-slug
    const cleanSlug = target.replace(/^jobs\//, '').replace(/^notification\//, '');
    const matchedNotif = INITIAL_NOTIFICATIONS.find(
      (n) => n.slug.toLowerCase() === cleanSlug.toLowerCase()
    );
    if (matchedNotif) {
      return { view: 'detail', category: matchedNotif.category, slug: matchedNotif.slug };
    }

    return { view: 'home', category: 'all', slug: null };
  };

  const initialParsed = parseStateFromLocation();
  const [currentView, setCurrentViewState] = useState<ActiveScreen>(initialParsed.view);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>(initialParsed.category);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialParsed.slug);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('All');
  const [filterQualification, setFilterQualification] = useState<string>('All');

  // Sync browser back/forward and deep link navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseStateFromLocation();
      setCurrentViewState(parsed.view);
      setSelectedCategory(parsed.category);
      setSelectedSlug(parsed.slug);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const setView = (view: ActiveScreen) => {
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      if (view === 'home') {
        setSelectedCategory('all');
        setSelectedSlug(null);
        window.history.pushState(null, '', '/');
      } else if (view === 'admin') {
        window.history.pushState(null, '', '/admin');
      } else if (view === 'directory') {
        const cat = selectedCategory !== 'all' ? selectedCategory : 'latest-job';
        window.history.pushState(null, '', `/${cat}`);
      } else if (view === 'detail' && selectedSlug) {
        window.history.pushState(null, '', `/${selectedSlug}`);
      } else {
        window.history.pushState(null, '', `/${view}`);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TICKER, JSON.stringify(tickerItems));
    } catch {
      // ignore
    }
  }, [tickerItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FEATURED, JSON.stringify(featuredTiles));
    } catch {
      // ignore
    }
  }, [featuredTiles]);

  // Derive selected item
  const selectedItem = selectedSlug
    ? notifications.find((n) => n.slug === selectedSlug) || null
    : null;

  const openNotification = (slug: string) => {
    setSelectedSlug(slug);
    setCurrentViewState('detail');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openCategory = (category: NotificationCategory) => {
    setSelectedCategory(category);
    setSelectedSlug(null);
    setCurrentViewState('directory');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/${category}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goHome = () => {
    setCurrentViewState('home');
    setSelectedCategory('all');
    setSelectedSlug(null);
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/' || window.location.search || window.location.hash) {
        window.history.pushState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Automatically fetch from Supabase if configured
  useEffect(() => {
    if (!isSupabaseReady()) return;

    const syncWithSupabase = async () => {
      try {
        const [remoteNotifs, remoteTicker, remoteTiles] = await Promise.all([
          supabaseApi.notifications.list(),
          supabaseApi.ticker.list(),
          supabaseApi.featuredTiles.list(),
        ]);

        if (remoteNotifs && remoteNotifs.length > 0) {
          setNotifications(remoteNotifs as NotificationItem[]);
        }
        if (remoteTicker && remoteTicker.length > 0) {
          setTickerItems(remoteTicker as TickerItem[]);
        }
        if (remoteTiles && remoteTiles.length > 0) {
          setFeaturedTiles(remoteTiles as FeaturedTile[]);
        }
      } catch (err) {
        console.warn('Initial Supabase sync fallback:', err);
      }
    };

    syncWithSupabase();
  }, []);

  // CMS functions
  const addNotification = (item: Omit<NotificationItem, 'id' | 'views'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now(),
      views: 0,
      published: true,
      inTrash: false,
    };
    setNotifications((prev) => [newItem, ...prev]);

    if (isSupabaseReady()) {
      supabaseApi.notifications.create(newItem).catch((err) => {
        console.warn('Failed to insert into Supabase:', err);
      });
    }
  };

  const updateNotification = (id: string, updates: Partial<NotificationItem>) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    if (isSupabaseReady()) {
      supabaseApi.notifications.update(id, updates).catch((err) => {
        console.warn('Failed to update in Supabase:', err);
      });
    }
  };

  const trashNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inTrash: true } : item))
    );

    if (isSupabaseReady()) {
      supabaseApi.notifications.update(id, { inTrash: true }).catch((err) => {
        console.warn('Failed to trash in Supabase:', err);
      });
    }
  };

  const restoreNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inTrash: false } : item))
    );

    if (isSupabaseReady()) {
      supabaseApi.notifications.update(id, { inTrash: false }).catch((err) => {
        console.warn('Failed to restore in Supabase:', err);
      });
    }
  };

  const permanentDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));

    if (isSupabaseReady()) {
      supabaseApi.notifications.delete(id).catch((err) => {
        console.warn('Failed to delete in Supabase:', err);
      });
    }
  };

  // Ticker operations
  const addTickerItem = (title: string, url: string, badge?: string) => {
    const newItem: TickerItem = {
      id: 'ticker-' + Date.now(),
      title,
      url,
      badge,
      active: true,
    };
    setTickerItems((prev) => [newItem, ...prev]);

    if (isSupabaseReady()) {
      supabaseApi.ticker.create(newItem).catch((err) => {
        console.warn('Failed to insert ticker into Supabase:', err);
      });
    }
  };

  const toggleTickerItem = (id: string) => {
    const item = tickerItems.find((t) => t.id === id);
    const nextActive = item ? !item.active : true;

    setTickerItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: nextActive } : t))
    );

    if (isSupabaseReady()) {
      supabaseApi.ticker.update(id, { active: nextActive }).catch((err) => {
        console.warn('Failed to toggle ticker in Supabase:', err);
      });
    }
  };

  const deleteTickerItem = (id: string) => {
    setTickerItems((prev) => prev.filter((t) => t.id !== id));

    if (isSupabaseReady()) {
      supabaseApi.ticker.delete(id).catch((err) => {
        console.warn('Failed to delete ticker from Supabase:', err);
      });
    }
  };

  // Featured tile operations
  const updateFeaturedTile = (id: string, updates: Partial<FeaturedTile>) => {
    setFeaturedTiles((prev) =>
      prev.map((tile) => (tile.id === id ? { ...tile, ...updates } : tile))
    );

    if (isSupabaseReady()) {
      supabaseApi.featuredTiles.update(id, updates).catch((err) => {
        console.warn('Failed to update featured tile in Supabase:', err);
      });
    }
  };

  const resetToDefaults = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    setTickerItems(INITIAL_TICKER_ITEMS);
    setFeaturedTiles(INITIAL_FEATURED_TILES);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    localStorage.removeItem(STORAGE_KEY_TICKER);
    localStorage.removeItem(STORAGE_KEY_FEATURED);
  };

  return (
    <PortalContext.Provider
      value={{
        notifications,
        tickerItems,
        featuredTiles,
        currentView,
        selectedCategory,
        selectedSlug,
        searchQuery,
        filterState,
        filterQualification,
        selectedItem,
        setView,
        openNotification,
        openCategory,
        goHome,
        setSearchQuery,
        setFilterState,
        setFilterQualification,
        addNotification,
        updateNotification,
        trashNotification,
        restoreNotification,
        permanentDeleteNotification,
        addTickerItem,
        toggleTickerItem,
        deleteTickerItem,
        updateFeaturedTile,
        resetToDefaults,
        fontScale,
        setFontScale,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
