'use client';

import React from 'react';
import { Globe, ArrowUpRight, User, Bell } from 'lucide-react';
import type { AdminUser } from '@sarkari/shared-types';

interface Props {
  user: Pick<AdminUser, 'email' | 'displayName' | 'role'>;
}

export function AdminHeader({ user }: Props) {
  return (
    <header className="h-16 bg-[#090d14] border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-10 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#ab1818] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-sm">
          SRM
        </div>
        <div>
          <h2 className="text-white font-black text-xs sm:text-sm uppercase tracking-wide">
            Sarkari Result Me
          </h2>
          <p className="text-slate-400 text-[10px] sm:text-[11px] font-medium hidden sm:block">
            Admin Portal • Complete Portal Control
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* View Public Site Button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">View Public Site</span>
          <ArrowUpRight className="w-3 h-3 text-slate-400" />
        </a>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-right">
            <p className="text-white text-xs font-bold leading-tight">{user.displayName || 'Admin'}</p>
            <p className="text-emerald-400 text-[10px] font-mono leading-tight">{user.role || 'SUPER_ADMIN'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
