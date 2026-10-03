/**
 * HomeClient — Client Component.
 * Wraps all existing home page components.
 * Receives server-fetched data as props (replaces Context + localStorage).
 * The visual design is IDENTICAL to the original — only the data source changes.
 */
'use client';

import React, { useState } from 'react';
import type { NotificationItem, TickerItem, FeaturedTile } from '@sarkari/shared-types';
import { PortalProvider } from '../context/PortalContext';

import { Header } from './Header';
import { Ticker } from './Ticker';
import { QuickSearch } from './QuickSearch';
import { ActionGrid } from './ActionGrid';
import { StatsBar } from './StatsBar';
import { DirectoryMatrix } from './DirectoryMatrix';
import { SocialBanner } from './SocialBanner';
import { EditorialGuide } from './EditorialGuide';
import { FAQSection } from './FAQSection';
import { LegalNotice } from './LegalNotice';
import { Footer } from './Footer';

interface HomeClientProps {
  initialNotifications: { items?: NotificationItem[] } | NotificationItem[];
  tickerItems: TickerItem[];
  featuredTiles: FeaturedTile[];
  categoryStats: Record<string, number>;
}

export function HomeClient({
  initialNotifications,
  tickerItems,
  featuredTiles,
  categoryStats,
}: HomeClientProps) {
  // Normalize response shape
  const notifications: NotificationItem[] = Array.isArray(initialNotifications)
    ? initialNotifications
    : initialNotifications.items ?? [];

  const [fontScale, setFontScale] = useState<'standard' | 'large' | 'xlarge'>('large');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PortalProvider
      initialNotifications={notifications}
      initialTickerItems={tickerItems}
      initialFeaturedTiles={featuredTiles}
    >
      <div className={`min-h-screen bg-white flex flex-col font-sans font-scale-${fontScale}`}>
        <Header
          fontScale={fontScale}
          onFontScaleChange={setFontScale}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="w-full max-w-[1240px] mx-auto px-3 sm:px-4 py-3 sm:py-5 flex-1">
          <div className="flex flex-col w-full">
            <Ticker items={tickerItems} />
            <QuickSearch
              notifications={notifications}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <ActionGrid featuredTiles={featuredTiles} />
            <StatsBar notifications={notifications} categoryStats={categoryStats} />
            <DirectoryMatrix notifications={notifications} />
            <SocialBanner />
            <EditorialGuide />
            <FAQSection />
            <LegalNotice />
          </div>
        </main>
        <Footer />
      </div>
    </PortalProvider>
  );
}
