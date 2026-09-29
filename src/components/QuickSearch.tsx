import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';

export const QuickSearch: React.FC = () => {
  const { searchQuery, setSearchQuery, setView } = usePortal();
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localInput.trim());
    if (localInput.trim()) {
      setView('search');
    }
  };

  const handleClear = () => {
    setLocalInput('');
    setSearchQuery('');
  };

  const quickTags = ['RRB NTPC', 'SSC CGL', 'UPTET', 'BPSC TRE 4', 'UP Police', 'IBPS PO', 'UPSSSC PET'];

  return (
    <div className="w-full bg-[#001a40] text-white p-3.5 mb-4 shadow-sm border border-black/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Title with Bolt */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[24px] text-[#ffea00]">bolt</span>
          <span className="text-[14.5px] md:text-base font-black text-white tracking-wide uppercase">
            Quick Find Vacancies &amp; Results:
          </span>
        </div>

        {/* Center Search Input Form */}
        <form onSubmit={handleSearch} className="w-full md:w-auto flex-1 max-w-xl flex items-center bg-white border-2 border-gray-300 focus-within:border-[#ffea00] transition-colors">
          <div className="pl-3 text-gray-500 flex items-center">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={localInput}
            onChange={(e) => {
              setLocalInput(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder="Type Exam, Board, or Post (e.g. RRB, SSC, UPTET, BPSC)..."
            className="w-full bg-transparent px-3 py-2 text-sm text-black font-semibold focus:outline-none placeholder:text-gray-500"
          />
          {localInput && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 text-gray-400 hover:text-black cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            type="submit"
            className="bg-[#850008] text-white text-xs md:text-sm font-black px-5 py-2.5 uppercase hover:bg-[#8a0c0c] transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Quick Board Tags */}
      <div className="mt-2.5 pt-2 border-t border-white/15 flex flex-wrap items-center gap-2 text-xs md:text-[13px]">
        <span className="text-[#ffea00] font-black mr-1">Trending Searches:</span>
        {quickTags.map((tag, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setLocalInput(tag);
              setSearchQuery(tag);
              setView('search');
            }}
            className="bg-white/15 hover:bg-[#ab1818] text-white px-2.5 py-1 font-bold transition-all cursor-pointer rounded-[2px]"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
