'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Send, Briefcase, Award, CreditCard,
  KeyRound, BookOpen, GraduationCap, ShieldCheck, Building2,
  Pin, Sparkles, Radio, Globe, LogOut, ChevronLeft, ChevronRight,
  Database
} from 'lucide-react';
import type { AdminUser } from '@sarkari/shared-types';
import { createSupabaseBrowserClient } from '../lib/supabase/browser';
import { useRouter } from 'next/navigation';

interface Props {
  user: Pick<AdminUser, 'id' | 'email' | 'displayName' | 'role'>;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/quick-publish', label: 'Quick Publish', icon: Send, highlight: true },
  { href: '/admin/jobs', label: 'Manage Jobs', icon: Briefcase },
  { href: '/admin/results', label: 'Manage Results', icon: Award },
  { href: '/admin/admit-cards', label: 'Admit Cards', icon: CreditCard },
  { href: '/admin/answer-keys', label: 'Answer Keys', icon: KeyRound },
  { href: '/admin/syllabus', label: 'Syllabus', icon: BookOpen },
  { href: '/admin/admissions', label: 'Admissions', icon: GraduationCap },
  { href: '/admin/certificate', label: 'Certificates', icon: ShieldCheck },
  { href: '/admin/outsourcing', label: 'Outsourcing Jobs', icon: Building2 },
  { href: '/admin/important', label: 'Important Links', icon: Pin },
  { href: '/admin/flash-tiles', label: 'Flash Tiles', icon: Sparkles },
  { href: '/admin/ticker', label: 'Moving Ticker', icon: Radio },
  { href: '/', label: 'Public Site', icon: Globe, external: true },
];

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.push('/login');
  };

  return (
    <aside
      className={`bg-[#0d141e] text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800/80 bg-[#090d14]">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ab1818] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-sm">
              SRM
            </div>
            <div>
              <p className="text-white font-black text-xs uppercase tracking-wider">Sarkari Result Me</p>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest text-[#e63946]">Command Center</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 14 Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {NAV_ITEMS.map(({ href, label, icon: Icon, external, highlight }) => {
          const isActive = !external && (pathname === href || (href !== '/admin' && pathname?.startsWith(href)));

          if (external) {
            return (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all ${
                  collapsed ? 'justify-center' : ''
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
                {!collapsed && (
                  <span className="flex items-center justify-between w-full">
                    {label}
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                      LIVE
                    </span>
                  </span>
                )}
              </a>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-[#ab1818] text-white shadow-xs font-bold'
                  : highlight
                  ? 'text-red-400 hover:bg-red-950/40 hover:text-red-300 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : highlight ? 'text-red-400' : 'text-slate-400'
                }`}
              />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Instant Sync Helper Box */}
      {!collapsed && (
        <div className="p-3 mx-2 mb-2 bg-slate-900/90 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-[#2ec4b6] text-[11px] font-black uppercase tracking-wider mb-1">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Supabase Live Sync
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Every edit, add, or delete made here writes directly to Supabase and updates the public homepage immediately!
          </p>
        </div>
      )}

      {/* User Info & Logout */}
      <div className="border-t border-slate-800/80 p-2.5 bg-[#090d14]">
        {!collapsed && (
          <div className="px-2 py-1 mb-1 flex items-center justify-between">
            <div className="truncate">
              <p className="text-white text-xs font-bold truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-slate-400 text-[10px] truncate">{user?.role || 'SUPER_ADMIN'}</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Connected to Supabase" />
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
