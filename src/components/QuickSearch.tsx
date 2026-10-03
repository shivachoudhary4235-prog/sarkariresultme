import React, { useState, useRef, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import type { SeoKeywordItem } from '../data/curatedSeoKeywords';

// Cached dynamic search module to prevent re-fetching once loaded
let searchCuratedModule: ((query: string, limit?: number) => SeoKeywordItem[]) | null = null;

export const QuickSearch: React.FC = () => {
  const { searchQuery, setSearchQuery, setView } = usePortal();
  const [localInput, setLocalInput] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<SeoKeywordItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lazy-load curated search only when candidate types 2+ characters
  useEffect(() => {
    let isMounted = true;
    const query = localInput.trim();

    if (query.length >= 2) {
      if (searchCuratedModule) {
        const matches = searchCuratedModule(query, 6);
        setSuggestions(matches);
        setShowDropdown(matches.length > 0);
      } else {
        import('../data/curatedSeoKeywords').then((m) => {
          searchCuratedModule = m.searchCuratedKeywords;
          if (isMounted) {
            const matches = m.searchCuratedKeywords(query, 6);
            setSuggestions(matches);
            setShowDropdown(matches.length > 0);
          }
        });
      }
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }

    return () => {
      isMounted = false;
    };
  }, [localInput]);

  // Preload on focus in idle time so suggestions appear instantly
  const handleFocus = () => {
    if (!searchCuratedModule) {
      import('../data/curatedSeoKeywords').then((m) => {
        searchCuratedModule = m.searchCuratedKeywords;
      });
    }
    if (localInput.trim().length >= 2 && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    setSearchQuery(localInput.trim());
    if (localInput.trim()) {
      setView('search');
    }
  };

  const handleSelectSuggestion = (item: SeoKeywordItem) => {
    setLocalInput(item.keyword);
    setSearchQuery(item.keyword);
    setShowDropdown(false);
    setView('search');
  };

  const handleClear = () => {
    setLocalInput('');
    setSearchQuery('');
    setShowDropdown(false);
  };

  const quickTags = ['UPSSSC PET', 'UP Police', 'RRB NTPC', 'SSC CGL', 'BPSC TRE 4', 'UPTET', 'NEET UG', 'IBPS PO'];

  return (
    <div className="w-full bg-[#001a40] text-white p-3.5 mb-4 shadow-sm border border-black/20 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Title with Bolt */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[24px] text-[#ffea00]">bolt</span>
          <span className="text-[14.5px] md:text-base font-black text-white tracking-wide uppercase">
            Quick Find Vacancies &amp; Results:
          </span>
        </div>

        {/* Center Search Input Form & Auto-suggest Dropdown */}
        <div ref={dropdownRef} className="w-full md:w-auto flex-1 max-w-xl relative">
          <form onSubmit={handleSearch} className="w-full flex items-center bg-white border-2 border-gray-300 focus-within:border-[#ffea00] transition-colors">
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
              onFocus={handleFocus}
              placeholder="Type Exam, Board, or Post (e.g. UPSSSC, RRB, BPSC, Police)..."
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

          {/* Predictive Keyword Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-[#850008] shadow-xl text-black mt-1 overflow-hidden animate-in fade-in duration-150">
              <div className="bg-[#f4f6f9] px-3 py-1.5 border-b border-gray-200 text-[11px] font-bold text-gray-600 flex items-center justify-between uppercase">
                <span>Top High-Ranking Searches</span>
                <span className="text-[#850008] font-black">Official Results</span>
              </div>
              <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {suggestions.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#fff0ee] transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-[#850008]">
                          trending_up
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#850008]">
                          {item.keyword}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-gray-100 text-gray-600 group-hover:bg-[#850008] group-hover:text-white rounded-[2px]">
                          {item.intent}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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

