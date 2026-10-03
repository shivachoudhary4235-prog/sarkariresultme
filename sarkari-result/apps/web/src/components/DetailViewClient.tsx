'use client';

import React, { useState } from 'react';
import type { NotificationItem } from '@sarkari/shared-types';
import { PortalProvider } from '../context/PortalContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { DetailView } from './DetailView';

interface DetailViewClientProps {
  notification: NotificationItem;
}

export function DetailViewClient({ notification }: DetailViewClientProps) {
  const [fontScale] = useState<'standard' | 'large' | 'xlarge'>('large');

  return (
    <PortalProvider initialItem={notification} initialSlug={notification.slug}>
      <div className={`min-h-screen bg-white flex flex-col font-sans font-scale-${fontScale}`}>
        <Header />
        <main className="w-full max-w-[1240px] mx-auto px-3 sm:px-4 py-3 sm:py-5 flex-1">
          <DetailView item={notification} />
        </main>
        <Footer />
      </div>
    </PortalProvider>
  );
}
