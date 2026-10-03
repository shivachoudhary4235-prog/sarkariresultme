'use client';

import React, { useState } from 'react';
import type { NotificationItem } from '@sarkari/shared-types';
import { PortalProvider } from '../../context/PortalContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SearchView } from '../../components/SearchView';

interface SearchClientProps {
  initialNotifications: NotificationItem[];
  initialQuery: string;
}

export function SearchClient({ initialNotifications, initialQuery }: SearchClientProps) {
  const [fontScale] = useState<'standard' | 'large' | 'xlarge'>('large');

  return (
    <PortalProvider initialNotifications={initialNotifications}>
      <div className={`min-h-screen bg-white flex flex-col font-sans font-scale-${fontScale}`}>
        <Header />
        <main className="w-full max-w-[1240px] mx-auto px-3 sm:px-4 py-3 sm:py-5 flex-1">
          <SearchView notifications={initialNotifications} query={initialQuery} />
        </main>
        <Footer />
      </div>
    </PortalProvider>
  );
}
