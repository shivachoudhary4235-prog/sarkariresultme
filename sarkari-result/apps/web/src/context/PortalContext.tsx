'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type {
  NotificationItem,
  NotificationCategory,
  TickerItem,
  FeaturedTile,
  ActiveScreen,
} from '@sarkari/shared-types';

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

  // Typography & Accessibility
  fontScale: 'standard' | 'large' | 'xlarge';
  setFontScale: (scale: 'standard' | 'large' | 'xlarge') => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEY_FONTSCALE = 'sarkari_result_font_scale_v1';

interface PortalProviderProps {
  children: React.ReactNode;
  initialNotifications?: NotificationItem[];
  initialTickerItems?: TickerItem[];
  initialFeaturedTiles?: FeaturedTile[];
  initialCategory?: NotificationCategory | 'all';
  initialSlug?: string | null;
  initialItem?: NotificationItem | null;
}

export const PortalProvider: React.FC<PortalProviderProps> = ({
  children,
  initialNotifications = [],
  initialTickerItems = [],
  initialFeaturedTiles = [],
  initialCategory = 'all',
  initialSlug = null,
  initialItem = null,
}) => {
  const router = useRouter();

  const [fontScale, setFontScaleState] = useState<'standard' | 'large' | 'xlarge'>('large');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FONTSCALE);
      if (saved === 'standard' || saved === 'large' || saved === 'xlarge') {
        setFontScaleState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setFontScale = (scale: 'standard' | 'large' | 'xlarge') => {
    setFontScaleState(scale);
    try {
      localStorage.setItem(STORAGE_KEY_FONTSCALE, scale);
    } catch {
      // ignore
    }
  };

  const [notifications] = useState<NotificationItem[]>(initialNotifications);
  const [tickerItems] = useState<TickerItem[]>(initialTickerItems);
  const [featuredTiles] = useState<FeaturedTile[]>(initialFeaturedTiles);

  const [currentView, setCurrentView] = useState<ActiveScreen>('home');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>(initialCategory);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('All');
  const [filterQualification, setFilterQualification] = useState<string>('All');

  const selectedItem = initialItem || (selectedSlug ? notifications.find((n) => n.slug === selectedSlug) || null : null);

  const openNotification = (slug: string) => {
    setSelectedSlug(slug);
    router.push(`/jobs/${slug}`);
  };

  const openCategory = (category: NotificationCategory) => {
    setSelectedCategory(category);
    router.push(`/${category}`);
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedCategory('all');
    setSelectedSlug(null);
    setSearchQuery('');
    router.push('/');
  };

  const setView = (view: ActiveScreen) => {
    setCurrentView(view);
    if (view === 'home') {
      goHome();
    } else if (view === 'admin') {
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || '/admin';
      window.open(adminUrl, '_blank');
    }
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
