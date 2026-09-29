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

  const [currentView, setCurrentView] = useState<ActiveScreen>('home');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('All');
  const [filterQualification, setFilterQualification] = useState<string>('All');

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
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategory = (category: NotificationCategory) => {
    setSelectedCategory(category);
    setCurrentView('directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedCategory('all');
    setSelectedSlug(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
  };

  const updateNotification = (id: string, updates: Partial<NotificationItem>) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const trashNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inTrash: true } : item))
    );
  };

  const restoreNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inTrash: false } : item))
    );
  };

  const permanentDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
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
  };

  const toggleTickerItem = (id: string) => {
    setTickerItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const deleteTickerItem = (id: string) => {
    setTickerItems((prev) => prev.filter((t) => t.id !== id));
  };

  // Featured tile operations
  const updateFeaturedTile = (id: string, updates: Partial<FeaturedTile>) => {
    setFeaturedTiles((prev) =>
      prev.map((tile) => (tile.id === id ? { ...tile, ...updates } : tile))
    );
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
        setView: setCurrentView,
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
