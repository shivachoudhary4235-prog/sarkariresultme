import React from 'react';
import { usePortal } from '../context/PortalContext';
import { NotificationCategory, NotificationItem } from '../types';

interface ColumnCardProps {
  title: string;
  category: NotificationCategory;
  iconName: string;
  items: NotificationItem[];
  viewMoreLabel: string;
}

const ColumnCard: React.FC<ColumnCardProps> = ({
  title,
  category,
  iconName,
  items,
  viewMoreLabel,
}) => {
  const { openNotification, openCategory } = usePortal();

  return (
    <section
      aria-label={title}
      className="bg-white border-2 border-[#ab1818] shadow-xs flex flex-col min-h-[480px]"
    >
      {/* Column Header */}
      <div className="bg-[#ab1818] text-white py-2.5 px-4 flex items-center justify-between">
        <h2 className="text-lg md:text-[19px] font-black tracking-wide uppercase font-serif">
          {title}
        </h2>
        <span className="material-symbols-outlined text-[20px]">{iconName}</span>
      </div>

      {/* Item List */}
      <ul className="p-3 sm:p-3.5 text-[14.5px] sm:text-[15px] md:text-[16px] flex-1 divide-y divide-gray-200">
        {items.slice(0, 18).map((item) => (
          <li
            key={item.id}
            className="py-2.5 sm:py-3 first:pt-1 last:pb-1 flex items-start gap-2.5 hover:bg-[#fff9f8] transition-colors rounded-xs px-1"
          >
            <span className="text-[#850008] font-black text-base select-none leading-none mt-1">▪</span>
            <div className="flex-1 flex flex-wrap items-center gap-1.5 leading-normal">
              <button
                onClick={() => openNotification(item.slug)}
                className="text-[#000dff] hover:text-[#ab1818] hover:underline font-bold text-left cursor-pointer transition-colors"
              >
                {item.title}
              </button>

              {/* Distinct 1-Click Highlight Badges */}
              {item.statusBadge === 'NEW' && (
                <span className="bg-[#dc2626] text-white text-[10.5px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px] animate-pulse ring-1 ring-red-400">
                  NEW
                </span>
              )}
              {item.statusBadge === 'ACTIVE' && (
                <span className="bg-[#15803d] text-white text-[10.5px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px] ring-1 ring-emerald-500">
                  ACTIVE
                </span>
              )}
              {item.statusBadge === 'UPCOMING' && (
                <span className="bg-[#7e22ce] text-white text-[10.5px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px] animate-pulse ring-1 ring-purple-400">
                  UPCOMING
                </span>
              )}
              {item.statusBadge === 'OUT' && (
                <span className="bg-[#1d4ed8] text-white text-[10.5px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px] ring-1 ring-blue-400">
                  OUT
                </span>
              )}
              {item.statusBadge === 'DECLARED' && (
                <span className="bg-[#991b1b] text-white text-[10.5px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px] ring-1 ring-red-700">
                  DECLARED
                </span>
              )}
              {item.statusBadge === 'EXTENDED' && (
                <span className="bg-[#d97706] text-white text-[10.5px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px] ring-1 ring-amber-400">
                  EXTENDED
                </span>
              )}
            </div>
          </li>
        ))}

        {items.length === 0 && (
          <li className="text-gray-500 py-6 text-center text-base font-semibold">
            No notifications found
          </li>
        )}
      </ul>

      {/* View More Footer Link */}
      <div className="bg-[#fcfcfc] border-t border-gray-200 p-2 text-right">
        <button
          onClick={() => openCategory(category)}
          className="text-xs sm:text-sm font-extrabold text-[#ab1818] hover:text-[#850008] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{viewMoreLabel}</span>
          <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
        </button>
      </div>
    </section>
  );
};

export const DirectoryMatrix: React.FC = () => {
  const { notifications, openNotification } = usePortal();

  const getActiveByCategory = (cat: NotificationCategory) =>
    notifications.filter((n) => n.category === cat && n.published && !n.inTrash);

  const results = getActiveByCategory('result');
  const admitCards = getActiveByCategory('admit-card');
  const latestJobs = getActiveByCategory('latest-job');
  const teachingJobs = getActiveByCategory('teaching');
  const answerKeys = getActiveByCategory('answer-key');
  const syllabus = getActiveByCategory('syllabus');
  const important = getActiveByCategory('important');

  return (
    <div className="w-full space-y-6 mb-6">
      {/* PRIMARY 3-COLUMN DIRECTORY MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start">
        <ColumnCard
          title="Result"
          category="result"
          iconName="verified"
          items={results}
          viewMoreLabel="View More Result"
        />
        <ColumnCard
          title="Admit Card"
          category="admit-card"
          iconName="badge"
          items={admitCards}
          viewMoreLabel="View More Admit Card"
        />
        <ColumnCard
          title="Latest Job"
          category="latest-job"
          iconName="work"
          items={latestJobs}
          viewMoreLabel="View More Latest Job"
        />
      </div>

      {/* SECONDARY 3-COLUMN DIRECTORY MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start content-auto">
        <ColumnCard
          title="Teaching Jobs"
          category="teaching"
          iconName="school"
          items={teachingJobs}
          viewMoreLabel="View More Teaching"
        />
        <ColumnCard
          title="Answer Key"
          category="answer-key"
          iconName="key"
          items={answerKeys}
          viewMoreLabel="View More Answer Key"
        />
        <ColumnCard
          title="Syllabus"
          category="syllabus"
          iconName="menu_book"
          items={syllabus}
          viewMoreLabel="View More Syllabus"
        />
      </div>

      {/* IMPORTANT CANDIDATE PORTALS & LINKS */}
      <section className="bg-white border-2 border-[#000066] shadow-xs content-auto">
        <div className="bg-[#000066] text-white py-2.5 px-4 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black tracking-wide uppercase font-serif">
            Important Candidate Links &amp; Public Portals
          </h2>
          <span className="material-symbols-outlined text-[20px]">priority_high</span>
        </div>
        <ul className="p-3 sm:p-4 text-[14.5px] sm:text-[15px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {important.map((item) => (
            <li
              key={item.id}
              className="p-2 border border-gray-200 hover:border-[#ab1818] hover:bg-[#fff9f8] transition-colors rounded-xs flex items-start gap-2"
            >
              <span className="text-[#850008] font-bold">▪</span>
              <button
                onClick={() => openNotification(item.slug)}
                className="text-[#000dff] hover:text-[#ab1818] hover:underline font-bold text-left text-xs sm:text-sm cursor-pointer"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
