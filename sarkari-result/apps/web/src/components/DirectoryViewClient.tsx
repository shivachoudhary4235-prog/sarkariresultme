'use client';

import React, { useState } from 'react';
import type { NotificationCategory, NotificationItem } from '@sarkari/shared-types';
import { PortalProvider } from '../context/PortalContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { DirectoryView } from './DirectoryView';

interface DirectoryViewClientProps {
  category: NotificationCategory;
  notifications: NotificationItem[];
}

export function DirectoryViewClient({ category, notifications }: DirectoryViewClientProps) {
  const [fontScale] = useState<'standard' | 'large' | 'xlarge'>('large');

  return (
    <PortalProvider initialNotifications={notifications} initialCategory={category}>
      <div className={`min-h-screen bg-white flex flex-col font-sans font-scale-${fontScale}`}>
        <Header />
        <main className="w-full max-w-[1240px] mx-auto px-3 sm:px-4 py-3 sm:py-5 flex-1">
          <DirectoryView category={category} items={notifications} />
        </main>
        <Footer />
      </div>
    </PortalProvider>
  );
}
