/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
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
import { WhatsAppPopup } from './components/WhatsAppPopup';

// Code-split heavy views to keep initial mobile bundle ultra-light
const DetailView = React.lazy(() => import('./components/DetailView').then(m => ({ default: m.DetailView })));
const DirectoryView = React.lazy(() => import('./components/DirectoryView').then(m => ({ default: m.DirectoryView })));
const SearchView = React.lazy(() => import('./components/SearchView').then(m => ({ default: m.SearchView })));
const AdminCMS = React.lazy(() => import('./components/AdminCMS').then(m => ({ default: m.AdminCMS })));
const CompliancePage = React.lazy(() => import('./components/CompliancePage').then(m => ({ default: m.CompliancePage })));

const ViewLoader: React.FC = () => (
  <div className="w-full py-16 flex flex-col items-center justify-center gap-2 text-gray-500">
    <div className="w-8 h-8 border-3 border-[#ab1818] border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-bold uppercase tracking-wider text-[#850008]">Loading...</span>
  </div>
);

const MainContent: React.FC = () => {
  const { currentView, fontScale } = usePortal();

  // Render clean full-width Admin Dashboard without public site header and footer
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans w-full">
        <Suspense fallback={<ViewLoader />}>
          <AdminCMS />
        </Suspense>
      </div>
    );
  }

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
            <div className="content-auto">
              <SocialBanner />
            </div>
            <div className="content-auto">
              <EditorialGuide />
            </div>
            <div className="content-auto">
              <FAQSection />
            </div>
            <div className="content-auto">
              <LegalNotice />
            </div>
          </div>
        )}

        <Suspense fallback={<ViewLoader />}>
          {currentView === 'directory' && <DirectoryView />}
          {currentView === 'detail' && <DetailView />}
          {currentView === 'search' && <SearchView />}
          {(
            currentView === 'about' ||
            currentView === 'contact' ||
            currentView === 'disclaimer' ||
            currentView === 'privacy-policy' ||
            currentView === 'cookie-policy' ||
            currentView === 'terms' ||
            currentView === 'editorial-policy' ||
            currentView === 'correction-policy' ||
            currentView === 'sitemap'
          ) && <CompliancePage screen={currentView} />}
        </Suspense>
      </main>

      <Footer />
      <WhatsAppPopup />
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
