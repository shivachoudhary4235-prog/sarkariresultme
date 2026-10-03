'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '../context/PortalContext';
import type { NotificationCategory } from '@sarkari/shared-types';
import footerGhatsBg from '../assets/footer_ghats_bg.png';

export const Footer: React.FC = () => {
  const router = useRouter();
  const { goHome, openCategory, setSearchQuery } = usePortal();
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const handleBoardSearch = (term: string) => {
    setSearchQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (cat: NotificationCategory) => {
    openCategory(cat);
    router.push(`/${cat}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full relative bg-[#120713] text-gray-100 mt-10 overflow-hidden font-sans border-t-4 border-[#eab308] shadow-2xl">
      {/* Background Architectural Heritage Panorama Backdrop (Varanasi Ghats) */}
      <div
        className="absolute inset-0 bg-cover bg-left md:bg-center bg-no-repeat pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `url(${typeof footerGhatsBg === 'string' ? footerGhatsBg : (footerGhatsBg as any)?.src || '/footer_ghats_bg.png'})`,
          opacity: 1,
        }}
      />

      {/* Very light subtle scrim so the photo is bright and vivid with minimal black */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35 pointer-events-none" />

      {/* Subtle top golden accent shimmer line */}
      <div className="relative z-10 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* Upper Category & Exam Board Filter Strip */}
      <div className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xs py-3.5 px-4">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <span className="material-symbols-outlined text-[17px]">hub</span>
            <span>Directories &amp; Boards:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { label: 'Latest Jobs', cat: 'latest-job' as NotificationCategory },
              { label: 'Results', cat: 'result' as NotificationCategory },
              { label: 'Admit Card', cat: 'admit-card' as NotificationCategory },
              { label: 'Answer Key', cat: 'answer-key' as NotificationCategory },
              { label: 'Syllabus', cat: 'syllabus' as NotificationCategory },
              { label: 'Teaching', cat: 'teaching' as NotificationCategory },
              { label: 'Admissions', cat: 'admission' as NotificationCategory },
              { label: 'Scholarships', cat: 'important' as NotificationCategory },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleCategoryClick(btn.cat)}
                className="bg-white/10 hover:bg-amber-400 hover:text-black text-gray-200 px-2.5 py-1 rounded-sm text-[11px] font-medium transition-all duration-150 cursor-pointer border border-white/10"
              >
                {btn.label}
              </button>
            ))}

            <span className="text-gray-600 hidden sm:inline">|</span>

            {['UPPSC', 'SSC CGL', 'Railway RRB', 'UPSC Civil', 'BPSC'].map((board) => (
              <button
                key={board}
                onClick={() => handleBoardSearch(board.split(' ')[0])}
                className="bg-amber-500/15 hover:bg-amber-400 hover:text-black text-amber-300 px-2.5 py-1 rounded-sm text-[11px] font-semibold transition-all duration-150 cursor-pointer border border-amber-400/20"
              >
                {board}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Identity & Founder Leadership */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={goHome}
                className="shrink-0 focus:outline-none transition-transform hover:scale-105 cursor-pointer"
                aria-label="Sarkari Result Me Official Portal"
              >
                <img
                  src="/sarkari-result-me-emblem.png"
                  alt="Sarkari Result Me Official Logo"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 drop-shadow-lg"
                />
              </button>
              <div>
                <button
                  onClick={goHome}
                  className="text-left font-serif text-lg sm:text-xl font-black text-white hover:text-amber-300 tracking-wider transition-colors cursor-pointer block leading-tight uppercase"
                >
                  SARKARI RESULT ME
                </button>
                <span className="text-[10px] tracking-widest uppercase font-bold text-amber-400/90 block">
                  Public Jobs &amp; Recruitment Portal
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-gray-200 leading-relaxed font-normal">
              Recognizing the critical need to position candidates with accurate, verified information, SarkariResultMe.com organizes public recruitment notices, admit cards, exam results, and gazette releases from various commissions across India into unified, free directories.
            </p>

            <p className="text-xs text-gray-300 leading-relaxed">
              The SarkariResultMe portal is an independent digital initiative dedicated to empowering aspirants from Tier-1, Tier-2, Tier-3 cities, and rural India with zero-cost access to authentic career opportunities.
            </p>
          </div>

          {/* Column 2: QuickLinks */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base sm:text-lg font-serif font-black text-white tracking-wide border-b border-white/10 pb-2">
              QuickLinks
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Copyright Policy', href: '/editorial-policy' },
                { label: 'Disclaimer', href: '/disclaimer' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Cookie Policy', href: '/cookie-policy' },
                { label: 'Site Map', href: '/sitemap' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      router.push(link.href);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-gray-300 hover:text-amber-300 hover:translate-x-1 transition-all duration-150 cursor-pointer flex items-center gap-1.5 text-left"
                  >
                    <span className="text-amber-400 text-[10px]">▸</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect with us & Visitor Counter */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-base sm:text-lg font-serif font-black text-white tracking-wide border-b border-white/10 pb-2">
              Connect with us
            </h3>

            <div className="space-y-2.5 text-xs sm:text-[13px]">
              <a
                href="mailto:getsarkarinaukrimeinfo@gmail.com"
                className="flex items-center gap-2.5 text-gray-300 hover:text-amber-300 transition-colors group"
              >
                <div className="w-8 h-8 rounded-md bg-white/10 group-hover:bg-amber-400 group-hover:text-black flex items-center justify-center shrink-0 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400">Email</div>
                  <div className="font-semibold text-white group-hover:text-amber-300 break-all text-xs">
                    getsarkarinaukrimeinfo@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="https://t.me/getsarkariresultme"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-300 hover:text-amber-300 transition-colors group"
              >
                <div className="w-8 h-8 rounded-md bg-white/10 group-hover:bg-amber-400 group-hover:text-black flex items-center justify-center shrink-0 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400">Telegram Channel</div>
                  <div className="font-semibold text-white group-hover:text-amber-300">
                    @getsarkariresultme
                  </div>
                </div>
              </a>

              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-300 hover:text-amber-300 transition-colors group"
              >
                <div className="w-8 h-8 rounded-md bg-white/10 group-hover:bg-amber-400 group-hover:text-black flex items-center justify-center shrink-0 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">forum</span>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400">WhatsApp Alert Group</div>
                  <div className="font-semibold text-white group-hover:text-amber-300">
                    Join Aspirants Network
                  </div>
                </div>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-300 hover:text-amber-300 transition-colors group"
              >
                <div className="w-8 h-8 rounded-md bg-white/10 group-hover:bg-amber-400 group-hover:text-black flex items-center justify-center shrink-0 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">public</span>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400">Facebook</div>
                  <div className="font-semibold text-white group-hover:text-amber-300">
                    @SarkariResultMePortal
                  </div>
                </div>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-300 hover:text-amber-300 transition-colors group"
              >
                <div className="w-8 h-8 rounded-md bg-white/10 group-hover:bg-amber-400 group-hover:text-black flex items-center justify-center shrink-0 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400">X (Twitter)</div>
                  <div className="font-semibold text-white group-hover:text-amber-300">
                    @_sarkariresultme
                  </div>
                </div>
              </a>
            </div>

            {/* Digital Visitor Counter Box */}
          </div>

          {/* Column 4: Official-Style Trust Seals & Scroll-To-Top Button */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-5">

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wide">Gazette Verified</div>
                  <div className="text-[10px] text-gray-400">Official Commission Sourced</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">lock_open</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wide">100% Free Service</div>
                  <div className="text-[10px] text-gray-400">Zero Candidate Paywalls</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">language</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wide">Digital Bharat</div>
                  <div className="text-[10px] text-gray-400">Empowering Rural &amp; Urban Youth</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="hidden lg:block -ml-[31px]">
                <span className="text-amber-400 text-xs">◆</span>
              </div>
              <button
                type="button"
                onClick={scrollToTop}
                className="w-11 h-11 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-black flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer ml-auto"
                title="Back to Top"
                aria-label="Scroll to Top"
              >
                <span className="material-symbols-outlined text-[26px]">arrow_upward</span>
              </button>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimer Banner */}
        <div className="mt-8 border border-white/15 bg-black/40 rounded-xl p-4 sm:p-5 backdrop-blur-xs text-xs text-gray-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <span className="material-symbols-outlined text-[17px] text-amber-400">security</span>
            <span>Independent Platform Regulatory Notice &amp; Anti-Fraud Warning</span>
          </div>
          <p className="leading-relaxed text-gray-300">
            <strong>SarkariResultMe.com</strong> is an independent digital educational directory. It is <strong>NOT</strong> a government entity and has no direct affiliation with any ministry, commission, or recruitment board. Summaries are synthesized from authentic public advertisements solely to assist candidates. Candidates must always cross-check essential eligibility and deadlines on official portals before applying or paying fees. SarkariResultMe.com will <strong>never charge candidates fees</strong> or make employment guarantees.
          </p>
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
            <span>Official Educational &amp; Career Information Directory</span>
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/disclaimer')} className="hover:text-amber-300 underline cursor-pointer">Disclaimer</button>
              <span>•</span>
              <button onClick={() => router.push('/terms')} className="hover:text-amber-300 underline cursor-pointer">Terms</button>
              <span>•</span>
              <button onClick={() => router.push('/contact')} className="hover:text-amber-300 underline cursor-pointer">Report Grievance</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Last Updated: <strong>02/10/2026</strong></span>
          </div>

          <div className="text-center sm:text-left">
            &copy; 2026 SarkariResultMe.com. All Rights Reserved. Independent Career Information Platform.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHelpModal(true)}
              className="group flex items-center gap-2 bg-white/10 hover:bg-amber-400 hover:text-black text-gray-200 px-3 py-1.5 rounded-full transition-all duration-200 border border-white/15 cursor-pointer shadow-sm"
              title="Aspirants Support & FAQ Desk"
            >
              <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-black shrink-0">
                🙏
              </div>
              <span className="text-[11.5px] font-bold">Aspirants Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Aspirants Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full cursor-pointer"
              aria-label="Close Modal"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shrink-0">
                🙏
              </div>
              <div>
                <h4 className="font-serif font-black text-lg text-[#001a40] leading-tight">
                  Namaste Aspirant!
                </h4>
                <p className="text-xs text-gray-600">SarkariResultMe Candidate Guidance Desk</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-700 leading-relaxed mb-5">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <span className="font-bold text-[#850008] block mb-1">How can we assist you today?</span>
                <p>
                  SarkariResultMe.com provides 100% free recruitment updates, direct official links, and gazette notifications.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setShowHelpModal(false);
                    router.push('/about');
                  }}
                  className="bg-gray-100 hover:bg-[#001a40] hover:text-white p-2.5 rounded-lg text-left font-semibold transition-colors cursor-pointer"
                >
                  🏢 About the Platform
                </button>
                <button
                  onClick={() => {
                    setShowHelpModal(false);
                    router.push('/contact');
                  }}
                  className="bg-gray-100 hover:bg-[#001a40] hover:text-white p-2.5 rounded-lg text-left font-semibold transition-colors cursor-pointer"
                >
                  ✉️ Report an Error
                </button>
                <button
                  onClick={() => {
                    setShowHelpModal(false);
                    handleCategoryClick('latest-job');
                  }}
                  className="bg-gray-100 hover:bg-[#001a40] hover:text-white p-2.5 rounded-lg text-left font-semibold transition-colors cursor-pointer"
                >
                  💼 Browse Latest Jobs
                </button>
                <button
                  onClick={() => {
                    setShowHelpModal(false);
                    router.push('/disclaimer');
                  }}
                  className="bg-gray-100 hover:bg-[#001a40] hover:text-white p-2.5 rounded-lg text-left font-semibold transition-colors cursor-pointer"
                >
                  ⚖️ Read Legal Notice
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-[11px] text-gray-500">
              <span>Official Candidate Guidance Desk</span>
              <button
                onClick={() => setShowHelpModal(false)}
                className="bg-[#001a40] text-white px-4 py-1.5 rounded-md font-bold cursor-pointer hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
