import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { NotificationCategory } from '../types';

export const DirectoryView: React.FC = () => {
  const {
    notifications,
    selectedCategory,
    openNotification,
    openCategory,
    goHome,
  } = usePortal();

  const [dirSearch, setDirSearch] = useState('');
  const [filterState, setFilterState] = useState('All');
  const [filterQual, setFilterQual] = useState('All');

  const categoryNameMap: Record<string, string> = {
    'result': 'Results & Scorecards',
    'admit-card': 'Admit Cards & Hall Tickets',
    'latest-job': 'Latest Government Jobs & Vacancies',
    'teaching': 'Teaching & Faculty Recruitments (UP, Bihar, Jharkhand & All India)',
    'answer-key': 'Answer Keys & Objection Trackers',
    'syllabus': 'Syllabus & Exam Pattern PDFs',
    'important': 'Important Candidate & Official Portals',
    'all': 'All Examinations & Recruitment Hub',
  };

  const currentTitle = categoryNameMap[selectedCategory] || 'Public Job Directory';

  const categoryTabs: { label: string; cat: NotificationCategory }[] = [
    { label: 'Latest Jobs', cat: 'latest-job' },
    { label: 'Teaching Jobs', cat: 'teaching' },
    { label: 'Admit Cards', cat: 'admit-card' },
    { label: 'Results', cat: 'result' },
    { label: 'Answer Keys', cat: 'answer-key' },
    { label: 'Syllabus', cat: 'syllabus' },
    { label: 'Important', cat: 'important' },
  ];

  // Filtering
  const filtered = notifications.filter((item) => {
    if (!item.published || item.inTrash) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    if (filterState !== 'All' && item.state !== filterState && item.state !== 'All India') {
      return false;
    }

    if (filterQual !== 'All') {
      if (!item.qualification.toLowerCase().includes(filterQual.toLowerCase())) {
        return false;
      }
    }

    if (dirSearch.trim()) {
      const q = dirSearch.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchOrg = item.organization.toLowerCase().includes(q);
      const matchDesc = item.shortDescription.toLowerCase().includes(q);
      if (!matchTitle && !matchOrg && !matchDesc) return false;
    }

    return true;
  });

  const stateOptions = ['All', 'Uttar Pradesh', 'Bihar', 'Jharkhand', 'Madhya Pradesh', 'Rajasthan', 'Delhi NCR', 'All India'];
  const qualOptions = [
    'All',
    '8th Pass',
    '10th Pass',
    '12th Pass',
    'ITI',
    'Diploma',
    'Graduate',
    'Post Graduate',
    'PhD',
    'B.Tech',
    'Medical',
    'Nursing',
    'Teaching',
    'Law',
  ];

  return (
    <div className="w-full bg-white border border-[#ab1818] p-3 md:p-5 mb-6 shadow-sm">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-3 flex items-center gap-1.5 border-b border-gray-200 pb-2">
        <button
          onClick={goHome}
          className="text-[#000dff] hover:text-[#ab1818] hover:underline font-bold cursor-pointer"
        >
          Home
        </button>
        <span>&gt;</span>
        <span className="text-gray-800 font-bold">{currentTitle}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-[#ab1818] text-white p-4 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight font-serif mb-1">
            {currentTitle}
          </h1>
          <p className="text-xs sm:text-sm text-white/90">
            Total Available Active Notifications: <span className="font-bold">{filtered.length}</span>
          </p>
        </div>
        <button
          onClick={goHome}
          className="bg-white text-[#850008] text-xs sm:text-sm font-bold px-4 py-1.5 uppercase hover:bg-gray-100 cursor-pointer shadow-xs"
        >
          Back to Home
        </button>
      </div>

      {/* Category Tabs Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-4 border-b border-gray-200 text-xs sm:text-sm">
        {categoryTabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => openCategory(tab.cat)}
            className={`px-3.5 py-2 whitespace-nowrap font-bold uppercase transition-colors cursor-pointer border ${
              selectedCategory === tab.cat
                ? 'bg-[#000066] text-white border-[#000066]'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#f4f6f9] p-3.5 border border-gray-300 mb-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Field */}
        <div className="w-full md:w-96 flex items-center bg-white border border-gray-300 px-3 py-1.5">
          <span className="material-symbols-outlined text-[20px] text-gray-500 mr-2">search</span>
          <input
            type="text"
            value={dirSearch}
            onChange={(e) => setDirSearch(e.target.value)}
            placeholder="Filter list by title or keyword..."
            className="w-full text-xs sm:text-sm text-black focus:outline-none"
          />
          {dirSearch && (
            <button
              onClick={() => setDirSearch('')}
              className="text-gray-400 hover:text-black cursor-pointer text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* State and Qualification dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="font-bold text-gray-700">State:</span>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="bg-white border border-gray-300 text-xs sm:text-sm p-1.5 focus:outline-none"
            >
              {stateOptions.map((st, i) => (
                <option key={i} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="font-bold text-gray-700">Qualification:</span>
            <select
              value={filterQual}
              onChange={(e) => setFilterQual(e.target.value)}
              className="bg-white border border-gray-300 text-xs sm:text-sm p-1.5 focus:outline-none"
            >
              {qualOptions.map((q, i) => (
                <option key={i} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="overflow-x-auto border border-gray-300">
        <table className="w-full text-xs sm:text-sm text-left border-collapse">
          <thead>
            <tr className="bg-[#001a40] text-white">
              <th className="p-3 border-r border-white/20 font-bold uppercase">Date</th>
              <th className="p-3 border-r border-white/20 font-bold uppercase">Recruitment / Exam Title</th>
              <th className="p-3 border-r border-white/20 font-bold uppercase">Board</th>
              <th className="p-3 border-r border-white/20 font-bold uppercase">Vacancies</th>
              <th className="p-3 border-r border-white/20 font-bold uppercase">Qualification</th>
              <th className="p-3 font-bold uppercase text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[#fff0ee] transition-colors">
                <td className="p-3 font-bold text-gray-600 whitespace-nowrap border-r border-gray-200">
                  {item.postDate}
                </td>
                <td className="p-3 font-bold border-r border-gray-200 max-w-sm">
                  <button
                    onClick={() => openNotification(item.slug)}
                    className="text-[#000dff] hover:text-[#ab1818] hover:underline text-left cursor-pointer font-bold leading-normal text-sm sm:text-[15px]"
                  >
                    {item.title}
                  </button>
                  {item.statusBadge === 'NEW' && (
                    <span className="bg-[#dc2626] text-white text-[10px] font-black px-1.5 py-0.5 ml-2 uppercase rounded-[1px] animate-pulse ring-1 ring-red-400">
                      NEW
                    </span>
                  )}
                  {item.statusBadge === 'ACTIVE' && (
                    <span className="bg-[#15803d] text-white text-[10px] font-black px-1.5 py-0.5 ml-2 uppercase rounded-[1px] ring-1 ring-emerald-500">
                      ACTIVE
                    </span>
                  )}
                  {item.statusBadge === 'UPCOMING' && (
                    <span className="bg-[#7e22ce] text-white text-[10px] font-black px-1.5 py-0.5 ml-2 uppercase rounded-[1px] animate-pulse ring-1 ring-purple-400">
                      UPCOMING
                    </span>
                  )}
                  {item.statusBadge === 'OUT' && (
                    <span className="bg-[#1d4ed8] text-white text-[10px] font-black px-1.5 py-0.5 ml-2 uppercase rounded-[1px] ring-1 ring-blue-400">
                      OUT
                    </span>
                  )}
                  {item.statusBadge === 'DECLARED' && (
                    <span className="bg-[#991b1b] text-white text-[10px] font-black px-1.5 py-0.5 ml-2 uppercase rounded-[1px] ring-1 ring-red-700">
                      DECLARED
                    </span>
                  )}
                  {item.statusBadge === 'EXTENDED' && (
                    <span className="bg-[#d97706] text-white text-[10px] font-black px-1.5 py-0.5 ml-2 uppercase rounded-[1px] ring-1 ring-amber-400">
                      EXTENDED
                    </span>
                  )}
                </td>
                <td className="p-3 text-gray-800 font-semibold border-r border-gray-200 whitespace-nowrap">
                  {item.organization}
                </td>
                <td className="p-3 font-bold text-[#850008] border-r border-gray-200 whitespace-nowrap">
                  {item.totalVacancies}
                </td>
                <td className="p-3 text-gray-600 border-r border-gray-200 max-w-xs truncate">
                  {item.qualification}
                </td>
                <td className="p-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => openNotification(item.slug)}
                    className="bg-[#ab1818] hover:bg-[#8a0c0c] text-white font-bold text-xs px-3 py-1.5 uppercase cursor-pointer"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500 text-sm sm:text-base">
                  No records match your selected criteria. Try adjusting your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
