/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Header } from './components/Header';
import { Ticker } from './components/Ticker';
import { QuickSearch } from './components/QuickSearch';
import { ActionGrid } from './components/ActionGrid';
import { StatsBar } from './components/StatsBar';
import { DirectoryMatrix } from './components/DirectoryMatrix';
import { SocialBanner } from './components/SocialBanner';
import { EditorialGuide } from './components/EditorialGuide';
import { FAQSection } from './components/FAQSection';
import { LegalNotice } from './components/LegalNotice';
import { Footer } from './components/Footer';
import { DetailView } from './components/DetailView';
import { DirectoryView } from './components/DirectoryView';
import { SearchView } from './components/SearchView';
import { AdminCMS } from './components/AdminCMS';

const MainContent: React.FC = () => {
  const { currentView, fontScale } = usePortal();

  return (
    <div className={`min-h-screen bg-white flex flex-col font-sans font-scale-${fontScale}`}>
      <Header />

      <main className="w-full max-w-[1240px] mx-auto px-3 sm:px-4 py-3 sm:py-5 flex-1">
        {currentView === 'home' && (
          <div className="flex flex-col w-full">
            <Ticker />
            <QuickSearch />
            <ActionGrid />
            <StatsBar />
            <DirectoryMatrix />
            <SocialBanner />
            <EditorialGuide />
            <FAQSection />
            <LegalNotice />
          </div>
        )}

        {currentView === 'directory' && <DirectoryView />}

        {currentView === 'detail' && <DetailView />}

        {currentView === 'search' && <SearchView />}

        {currentView === 'admin' && <AdminCMS />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <MainContent />
    </PortalProvider>
  );
}
