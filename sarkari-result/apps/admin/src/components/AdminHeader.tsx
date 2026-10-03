'use client';

import React from 'react';
import { Globe, ArrowUpRight, User, Bell } from 'lucide-react';
import type { AdminUser } from '@sarkari/shared-types';

interface Props {
  user: Pick<AdminUser, 'email' | 'displayName' | 'role'>;
}

export function AdminHeader({ user }: Props) {
  return (
    <header className="w-full bg-white border-b-2 border-[#ab1818] shadow-sm select-none z-20 shrink-0">
      {/* Top Banner Row matching authentic portal design */}
      <div className="max-w-[1400px] mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 min-h-[72px] sm:min-h-[84px]">
        {/* Brand Left Lockup */}
        <div className="w-full md:w-auto flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            title="Sarkari Result Official Home"
          >
            {/* Official Sarkari Result Me Emblem */}
            <img
              src="/sarkari-result-me-emblem.png"
              alt="Sarkari Result Me Official Emblem"
              width={56}
              height={56}
              style={{ width: '56px', height: '56px', maxWidth: '56px', maxHeight: '56px' }}
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-transform group-hover:scale-105 object-contain"
            />

            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl md:text-[26px] font-black text-[#850008] tracking-tight leading-none uppercase font-serif">
                SARKARI RESULT ME®
              </span>
              <span className="text-xs sm:text-[13px] md:text-sm text-gray-700 font-extrabold tracking-wider mt-1">
                WWW.SARKARIRESULTME.COM
              </span>
            </div>
          </a>
        </div>

        {/* Right Section: Large Title and Admin Public View Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center md:items-end text-center md:text-right px-2 py-0.5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-[#ab1818] uppercase tracking-normal font-serif leading-none drop-shadow-2xs">
              SARKARI RESULT ME
            </h1>
            <p className="text-sm sm:text-base md:text-[17px] text-[#000066] tracking-wider font-black mt-1 uppercase">
              WWW.SARKARIRESULTME.COM
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 md:py-2 text-xs md:text-[13px] font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer border shadow-xs bg-[#2e7d32] text-white border-[#2e7d32] hover:bg-green-800 shrink-0"
              title="Return to Public Portal"
            >
              <Globe className="w-4 h-4 text-white" />
              <span>Public View</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
            </a>

            {/* User Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-300">
              <div className="w-8 h-8 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-[#ab1818] font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="text-right">
                <p className="text-gray-900 text-xs font-bold leading-tight">{user.displayName || 'Admin'}</p>
                <p className="text-[#ab1818] text-[10px] font-mono leading-tight">{user.role || 'SUPER_ADMIN'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Navy Navigation Strip */}
      <div className="w-full bg-[#000066]">
        <div className="max-w-[1400px] mx-auto px-2 md:px-4 flex items-center justify-between">
          <nav className="flex flex-wrap items-center overflow-x-auto whitespace-nowrap text-white text-[13.5px] lg:text-[14px] font-bold">
            <a
              href="/"
              className="py-3 px-3.5 lg:px-4.5 hover:bg-[#ab1818] transition-colors border-r border-white/20"
            >
              Home
            </a>
            <a
              href="/#latest-jobs"
              className="py-3 px-3.5 lg:px-4.5 hover:bg-[#ab1818] transition-colors border-r border-white/20"
            >
              Latest Job
            </a>
            <a
              href="/#admit-card"
              className="py-3 px-3.5 lg:px-4.5 hover:bg-[#ab1818] transition-colors border-r border-white/20"
            >
              Admit Card
            </a>
            <a
              href="/#results"
              className="py-3 px-3.5 lg:px-4.5 hover:bg-[#ab1818] transition-colors border-r border-white/20"
            >
              Results
            </a>
            <span className="py-3 px-3.5 lg:px-4.5 bg-[#ab1818] text-white font-extrabold border-r border-white/20 flex items-center gap-1.5">
              <span>Admin Portal</span>
              <span className="bg-[#faaf47] text-[#850008] text-[9px] font-black px-1 py-0.2 rounded-xs uppercase tracking-tighter">
                ACTIVE
              </span>
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
}
