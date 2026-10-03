import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { NotificationCategory } from '../types';

export const Header: React.FC = () => {
  const { currentView, selectedCategory, openCategory, goHome, setView } = usePortal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    label: string;
    category?: NotificationCategory;
    view?: 'admin' | 'home';
    badge?: string;
  }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Latest Job', category: 'latest-job' },
    { label: 'Admit Card', category: 'admit-card' },
    { label: 'Results', category: 'result' },
    { label: 'Teaching Jobs', category: 'teaching', badge: 'HOT' },
    { label: 'Answer Key', category: 'answer-key' },
    { label: 'Syllabus', category: 'syllabus' },
    { label: 'Important', category: 'important' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setMobileMenuOpen(false);
    if (item.view === 'home') {
      goHome();
    } else if (item.view === 'admin') {
      setView('admin');
    } else if (item.category) {
      openCategory(item.category);
    }
  };

  const isNavActive = (item: typeof navItems[0]) => {
    if (item.view === 'admin') return currentView === 'admin';
    if (item.view === 'home') return currentView === 'home';
    if (currentView === 'directory' && item.category === selectedCategory) return true;
    return false;
  };

  return (
    <header className="w-full bg-white border-b-2 border-[#ab1818] shadow-sm">
      {/* Top Banner Row */}
      <div className="max-w-[1240px] mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 min-h-[72px] sm:min-h-[84px]">
        {/* Brand Left Lockup */}
        <div className="w-full md:w-auto flex items-center justify-between">
          <button
            onClick={goHome}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            aria-label="Sarkari Result Official Home"
          >
            {/* Official Sarkari Result Me Emblem */}
            <img
              src="/sarkari-result-me-emblem.png"
              alt="Sarkari Result Me Official Emblem"
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-transform group-hover:scale-105 object-contain"
            />

            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl md:text-[26px] font-black text-[#850008] tracking-tight leading-none uppercase font-serif">
                SARKARI RESULT®
              </span>
              <span className="text-xs sm:text-[13px] md:text-sm text-gray-700 font-extrabold tracking-wider mt-1">
                WWW.SARKARIRESULT.COM
              </span>
            </div>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-800 hover:text-black border border-gray-400 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Center Main Headings - HERO SECTION: SARKARI RESULT ONLY */}
        <div className="flex flex-col items-center justify-center text-center px-2 py-0.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-black text-[#ab1818] uppercase tracking-normal font-serif leading-none drop-shadow-2xs">
            SARKARI RESULT
          </h1>
          <p className="text-sm sm:text-base md:text-[17px] text-[#000066] tracking-wider font-black mt-1 uppercase">
            WWW.SARKARIRESULT.COM
          </p>
        </div>

        {/* Right Action: Only visible when inside Admin CMS to return to Public Site */}
        {currentView === 'admin' && (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={goHome}
              className="px-3.5 py-1.5 md:py-2 text-xs md:text-[13px] font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer border shadow-xs bg-[#2e7d32] text-white border-[#2e7d32] hover:bg-green-800"
              title="Return to Public Portal"
            >
              <span className="material-symbols-outlined text-[18px]">
                visibility
              </span>
              <span>Public View</span>
            </button>
          </div>
        )}
      </div>

      {/* Dark Navy Navigation Strip */}
      <div className="w-full bg-[#000066]">
        <div className="max-w-[1240px] mx-auto px-2 md:px-4 flex items-center justify-between">
          <nav className="hidden md:flex flex-wrap items-center overflow-x-auto whitespace-nowrap text-white text-[13.5px] lg:text-[14px] font-bold">
            {navItems.map((item, idx) => {
              const active = isNavActive(item);
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item)}
                  className={`py-3 px-3.5 lg:px-4.5 transition-colors border-r border-white/20 cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#ab1818] text-white font-extrabold'
                      : 'hover:bg-[#ab1818] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-[#faaf47] text-[#850008] text-[9px] font-black px-1 py-0.2 rounded-xs uppercase tracking-tighter">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#001a40] text-white border-t border-white/10 px-3 py-2 flex flex-col divide-y divide-white/10">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(item)}
                className={`py-2.5 px-3 text-left text-sm font-bold transition-colors ${
                  isNavActive(item) ? 'bg-[#ab1818] text-white font-extrabold' : 'hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Crimson Apps & Official Social Links Strip */}
      <div className="w-full bg-[#ab1818] text-white border-t border-[#8a0c0c]">
        <div className="max-w-[1240px] mx-auto px-3 py-1.5 flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-1 text-xs md:text-[13px] font-bold text-center">
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">android</span>
            <span>Sarkari Result Android App</span>
          </a>
          <span className="text-white/80 hidden sm:inline">|</span>
          <a
            href="https://apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
            <span>Apple IOS App</span>
          </a>
          <span className="text-white/80 hidden sm:inline">|</span>
          <a
            href="https://t.me/getsarkariresultme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Telegram Channel</span>
          </a>
          <span className="text-white/80 hidden sm:inline">|</span>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">smart_display</span>
            <span>YouTube Channel</span>
          </a>
          <span className="text-white/80 hidden md:inline">|</span>
          <a
            href="https://whatsapp.com/channel/0029VbDTiYy1dAw2mrPX7a2m"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>WhatsApp Channel</span>
          </a>
          <span className="text-white/80 hidden md:inline">|</span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            <span>Follow Instagram</span>
          </a>
        </div>
      </div>
    </header>
  );
};
