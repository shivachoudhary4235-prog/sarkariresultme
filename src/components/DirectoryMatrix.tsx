import React, { useState } from 'react';
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

              {/* Status Badges */}
              {item.statusBadge === 'DECLARED' && (
                <span className="bg-[#d32f2f] text-white text-[11px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px]">
                  DECLARED
                </span>
              )}
              {item.statusBadge === 'ACTIVE' && (
                <span className="bg-[#2e7d32] text-white text-[11px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px]">
                  ACTIVE
                </span>
              )}
              {item.statusBadge === 'OUT' && (
                <span className="bg-[#d32f2f] text-white text-[11px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px]">
                  OUT
                </span>
              )}
              {item.statusBadge === 'NEW' && (
                <span className="bg-[#d32f2f] text-white text-[11px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px] animate-pulse">
                  NEW
                </span>
              )}
              {item.statusBadge === 'UPCOMING' && (
                <span className="bg-[#6b21a8] text-white text-[11px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px] animate-pulse">
                  UPCOMING
                </span>
              )}
              {item.statusBadge === 'EXTENDED' && (
                <span className="bg-[#faaf47] text-[#001a40] text-[11px] font-black px-1.5 py-0.5 uppercase tracking-wide rounded-[1px]">
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

      {/* View More Footer Bar */}
      <div className="bg-[#fee2de] py-2.5 px-4 text-right mt-auto border-t border-[#f9dcd9]">
        <button
          onClick={() => openCategory(category)}
          className="text-sm md:text-[15px] font-extrabold text-[#000dff] hover:text-[#ab1818] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>{viewMoreLabel}</span>
          <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
        </button>
      </div>
    </section>
  );
};

export const DirectoryMatrix: React.FC = () => {
  const { notifications, openNotification, openCategory } = usePortal();
  const [teachingStateFilter, setTeachingStateFilter] = useState<'All' | 'Bihar' | 'Uttar Pradesh' | 'Jharkhand' | 'Central'>('All');

  const getActiveByCategory = (cat: NotificationCategory) =>
    notifications.filter((n) => n.category === cat && n.published && !n.inTrash);

  const results = getActiveByCategory('result');
  const admitCards = getActiveByCategory('admit-card');
  const latestJobs = getActiveByCategory('latest-job');
  const teachingJobs = getActiveByCategory('teaching');
  const answerKeys = getActiveByCategory('answer-key');
  const syllabus = getActiveByCategory('syllabus');
  const important = getActiveByCategory('important');

  // Filtered teaching jobs by state
  const filteredTeaching = teachingJobs.filter((item) => {
    if (teachingStateFilter === 'All') return true;
    if (teachingStateFilter === 'Bihar') return item.state.includes('Bihar');
    if (teachingStateFilter === 'Uttar Pradesh') return item.state.includes('Uttar Pradesh') || item.state.includes('UP');
    if (teachingStateFilter === 'Jharkhand') return item.state.includes('Jharkhand');
    if (teachingStateFilter === 'Central') return item.state === 'All India' || item.state.includes('Central') || item.state.includes('Delhi');
    return true;
  });

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

      {/* DEDICATED TEACHING JOBS / SHIKSHAK BHARTI HUB (UP • BIHAR • JHARKHAND • ALL INDIA) */}
      <section className="bg-white border-2 border-[#ab1818] shadow-sm">
        <div className="bg-gradient-to-r from-[#850008] via-[#ab1818] to-[#000066] text-white p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#faaf47] text-[#001a40] text-[10px] sm:text-xs font-black px-2 py-0.5 uppercase tracking-wide rounded-xs">
                SPECIAL SECTION
              </span>
              <h2 className="text-lg sm:text-xl font-black uppercase font-serif tracking-wide">
                Teaching &amp; Faculty Recruitments (शिक्षक भर्ती)
              </h2>
            </div>
            <p className="text-xs text-gray-200 mt-0.5">
              Dedicated recruitment portal for Primary, Secondary (TGT), Higher Secondary (PGT), and Eligibility Exams (BPSC TRE, UP TGT/PGT, Super TET, JSSC Sahayak Acharya, JTET, CTET)
            </p>
          </div>

          {/* State Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setTeachingStateFilter('All')}
              className={`px-2.5 py-1 font-bold uppercase transition-colors rounded-xs cursor-pointer ${
                teachingStateFilter === 'All'
                  ? 'bg-white text-[#850008] font-black shadow-xs'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              All Teaching ({teachingJobs.length})
            </button>
            <button
              onClick={() => setTeachingStateFilter('Bihar')}
              className={`px-2.5 py-1 font-bold uppercase transition-colors rounded-xs cursor-pointer ${
                teachingStateFilter === 'Bihar'
                  ? 'bg-white text-[#850008] font-black shadow-xs'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              Bihar (BPSC TRE)
            </button>
            <button
              onClick={() => setTeachingStateFilter('Uttar Pradesh')}
              className={`px-2.5 py-1 font-bold uppercase transition-colors rounded-xs cursor-pointer ${
                teachingStateFilter === 'Uttar Pradesh'
                  ? 'bg-white text-[#850008] font-black shadow-xs'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              Uttar Pradesh
            </button>
            <button
              onClick={() => setTeachingStateFilter('Jharkhand')}
              className={`px-2.5 py-1 font-bold uppercase transition-colors rounded-xs cursor-pointer ${
                teachingStateFilter === 'Jharkhand'
                  ? 'bg-white text-[#850008] font-black shadow-xs'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              Jharkhand (JSSC/JTET)
            </button>
            <button
              onClick={() => setTeachingStateFilter('Central')}
              className={`px-2.5 py-1 font-bold uppercase transition-colors rounded-xs cursor-pointer ${
                teachingStateFilter === 'Central'
                  ? 'bg-white text-[#850008] font-black shadow-xs'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              Central (CTET / KVS)
            </button>
          </div>
        </div>

        {/* Teaching Items Grid */}
        <div className="p-3 sm:p-4 bg-[#fffaf9]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTeaching.slice(0, 9).map((job) => (
              <div
                key={job.id}
                onClick={() => openNotification(job.slug)}
                className="bg-white border border-gray-300 hover:border-[#ab1818] p-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 bg-[#fee2de] text-[#850008] border border-[#f9dcd9] rounded-xs">
                      {job.state || 'All India'}
                    </span>
                    {job.statusBadge && (
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xs">
                        {job.statusBadge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#000dff] group-hover:text-[#ab1818] group-hover:underline line-clamp-2 leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-[11px] text-gray-600 mt-1 font-medium">
                    {job.organization}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-700">
                  <span className="font-bold text-[#850008]">
                    {job.totalVacancies || 'Various Posts'}
                  </span>
                  <span className="text-gray-500 font-semibold">
                    Last Date: {job.lastDate || 'Check Notice'}
                  </span>
                </div>
              </div>
            ))}

            {filteredTeaching.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500 text-sm">
                No teaching notifications found for this region. Use Admin CMS to post new teaching vacancies!
              </div>
            )}
          </div>

          <div className="mt-3 text-right">
            <button
              onClick={() => openCategory('teaching')}
              className="text-xs sm:text-sm font-extrabold text-[#000dff] hover:text-[#ab1818] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All Teaching Jobs &amp; Eligibility Tests ({teachingJobs.length})</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECONDARY 3-COLUMN DIRECTORY MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start">
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
      <section className="bg-white border-2 border-[#000066] shadow-xs">
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
