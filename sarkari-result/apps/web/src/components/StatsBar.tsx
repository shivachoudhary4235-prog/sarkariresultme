'use client';

import React from 'react';
import { usePortal } from '../context/PortalContext';
import type { NotificationItem } from '@sarkari/shared-types';

interface StatsBarProps {
  notifications?: NotificationItem[];
  categoryStats?: Record<string, number>;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  notifications: propNotifications,
  categoryStats,
}) => {
  const portal = usePortal();
  const notifications = propNotifications ?? portal.notifications;
  const { openCategory, setView } = portal;

  // Real-time live counts dynamically calculated from current notifications database or categoryStats
  const totalActive = categoryStats
    ? Object.values(categoryStats).reduce((a, b) => a + b, 0)
    : notifications.filter((n) => n.published && !n.inTrash).length;

  const latestJobsCount = categoryStats?.['latest-job'] ?? notifications.filter(
    (n) => n.category === 'latest-job' && n.published && !n.inTrash
  ).length;

  const teachingCount = categoryStats?.['teaching'] ?? notifications.filter(
    (n) => n.category === 'teaching' && n.published && !n.inTrash
  ).length;

  const admitCardsCount = categoryStats?.['admit-card'] ?? notifications.filter(
    (n) => n.category === 'admit-card' && n.published && !n.inTrash
  ).length;

  const resultsCount = categoryStats?.['result'] ?? notifications.filter(
    (n) => n.category === 'result' && n.published && !n.inTrash
  ).length;

  const otherAlertsCount = totalActive - (latestJobsCount + teachingCount + admitCardsCount + resultsCount);

  return (
    <div className="w-full bg-[#fff0ee] p-3 mb-5 border border-[#f9dcd9] shadow-xs">
      {/* 4 Interactive Dynamic Count Cards directly connected to live data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center text-center">
        {/* Card 1: Latest Jobs Count */}
        <button
          onClick={() => openCategory('latest-job')}
          className="p-2.5 sm:p-3 bg-white shadow-xs border border-gray-200 hover:border-[#ab1818] transition-all hover:-translate-y-0.5 cursor-pointer text-center group"
          title="Click to view all Active Latest Jobs"
        >
          <span className="text-2xl sm:text-3xl font-black text-[#850008] block leading-none mb-1 font-serif group-hover:scale-105 transition-transform">
            {latestJobsCount} Live
          </span>
          <span className="text-xs sm:text-[13px] text-gray-700 font-extrabold uppercase tracking-wide">
            Active Registrations
          </span>
        </button>

        {/* Card 2: Admit Cards Count */}
        <button
          onClick={() => openCategory('admit-card')}
          className="p-2.5 sm:p-3 bg-white shadow-xs border border-gray-200 hover:border-[#004076] transition-all hover:-translate-y-0.5 cursor-pointer text-center group"
          title="Click to view all Active Admit Cards"
        >
          <span className="text-2xl sm:text-3xl font-black text-[#004076] block leading-none mb-1 font-serif group-hover:scale-105 transition-transform">
            {admitCardsCount} New
          </span>
          <span className="text-xs sm:text-[13px] text-gray-700 font-extrabold uppercase tracking-wide">
            Admit Cards Out
          </span>
        </button>

        {/* Card 3: Results Count */}
        <button
          onClick={() => openCategory('result')}
          className="p-2.5 sm:p-3 bg-white shadow-xs border border-gray-200 hover:border-[#2e7d32] transition-all hover:-translate-y-0.5 cursor-pointer text-center group"
          title="Click to view all Declared Results"
        >
          <span className="text-2xl sm:text-3xl font-black text-[#2e7d32] block leading-none mb-1 font-serif group-hover:scale-105 transition-transform">
            {resultsCount} Results
          </span>
          <span className="text-xs sm:text-[13px] text-gray-700 font-extrabold uppercase tracking-wide">
            Declared This Week
          </span>
        </button>

        {/* Card 4: Total Live Connected Notifications */}
        <button
          onClick={() => setView('admin')}
          className="p-2.5 sm:p-3 bg-white shadow-xs border border-gray-200 hover:border-[#001a40] transition-all hover:-translate-y-0.5 cursor-pointer text-center group"
          title="Click to open Admin CMS to view or add more notifications"
        >
          <span className="text-2xl sm:text-3xl font-black text-[#001a40] flex items-center justify-center gap-1.5 leading-none mb-1 font-serif group-hover:scale-105 transition-transform">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            {totalActive} Total
          </span>
          <span className="text-xs sm:text-[13px] text-gray-700 font-extrabold uppercase tracking-wide">
            Live Govt Alerts
          </span>
        </button>
      </div>

      {/* Real-time Connection Status Indicator */}
      <div className="mt-2.5 pt-2 border-t border-[#f2cfcb] flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-600 px-1 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-ping" />
          <span className="font-bold text-[#850008] uppercase tracking-wide">Live Connected Counter:</span>
          <span>
            {totalActive} Notifications Published ({latestJobsCount} General Jobs • {teachingCount} Teaching Jobs • {admitCardsCount} Admit Cards • {resultsCount} Results • {otherAlertsCount > 0 ? `${otherAlertsCount} Other Alerts` : '0 Other'})
          </span>
        </div>
        <button
          onClick={() => setView('admin')}
          className="text-[#000066] hover:text-[#ab1818] font-bold underline cursor-pointer"
        >
          + Add New in Admin CMS
        </button>
      </div>
    </div>
  );
};
