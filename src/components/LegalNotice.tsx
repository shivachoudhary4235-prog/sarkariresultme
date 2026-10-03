import React from 'react';
import { usePortal } from '../context/PortalContext';

export const LegalNotice: React.FC = () => {
  const { setView } = usePortal();

  return (
    <section className="w-full bg-[#fffbf0] p-4 sm:p-6 mb-4 text-center border border-[#f6e0b5] rounded-md shadow-xs">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-10 h-10 bg-[#b45309] text-white rounded-full flex items-center justify-center mb-2.5 shadow-xs">
          <span className="material-symbols-outlined text-[22px]">policy</span>
        </div>
        <h3 className="text-sm sm:text-base font-black text-[#92400e] uppercase tracking-wide mb-1.5">
          Independent Educational & Information Portal Notice
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-2xl mb-2">
          <strong>SarkariResultMe.com</strong> is an independent digital information resource. We are <strong>not affiliated with, authorized by, or an official agency</strong> of any government ministry, commission, board, or examination authority. All recruitment summaries are synthesized from public gazette notifications for candidate convenience. Always verify details with original official source notifications.
        </p>
        <p className="text-[11px] sm:text-xs text-gray-500 mb-3 italic">
          Legal Jurisdiction: All disputes, legal notices, and claims are subject exclusively to the competent judicial courts at Koderma, Jharkhand (India).
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
          <button
            onClick={() => setView('disclaimer')}
            className="text-[#ab1818] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">gavel</span> Read Legal Disclaimer
          </button>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => setView('editorial-policy')}
            className="text-[#ab1818] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">menu_book</span> Editorial Policy
          </button>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => setView('about')}
            className="text-[#ab1818] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">info</span> About Platform
          </button>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => setView('contact')}
            className="text-[#ab1818] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">flag</span> Report an Error
          </button>
        </div>
      </div>
    </section>
  );
};
