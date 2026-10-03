'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '../context/PortalContext';
import type { NotificationItem } from '@sarkari/shared-types';

interface QuickSearchProps {
  notifications?: NotificationItem[];
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({
  searchQuery: propQuery,
  onSearchChange,
}) => {
  const router = useRouter();
  const portal = usePortal();
  const activeQuery = propQuery !== undefined ? propQuery : portal.searchQuery;

  const [localInput, setLocalInput] = useState(activeQuery);
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/keywords.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllKeywords(data);
      })
      .catch(err => console.error('Failed to load keywords', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = localInput.trim();
    if (onSearchChange) onSearchChange(query);
    portal.setSearchQuery(query);
    if (query) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalInput(val);
    if (onSearchChange) onSearchChange(val);
    portal.setSearchQuery(val);

    if (val.trim() && allKeywords.length > 0) {
      const lowerVal = val.toLowerCase();
      // Prioritize startsWith, then includes
      const startsWith = allKeywords.filter(kw => kw.toLowerCase().startsWith(lowerVal));
      const includes = allKeywords.filter(kw => !kw.toLowerCase().startsWith(lowerVal) && kw.toLowerCase().includes(lowerVal));
      const matched = [...startsWith, ...includes].slice(0, 8);
      
      setSuggestions(matched);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setLocalInput(suggestion);
    if (onSearchChange) onSearchChange(suggestion);
    portal.setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleClear = () => {
    setLocalInput('');
    if (onSearchChange) onSearchChange('');
    portal.setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const quickTags = ['RRB NTPC', 'SSC CGL', 'UPTET', 'BPSC TRE 4', 'UP Police', 'IBPS PO', 'UPSSSC PET'];

  return (
    <div className="w-full bg-[#001a40] text-white p-3.5 mb-4 shadow-sm border border-black/20 relative" ref={dropdownRef}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Title with Bolt */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[24px] text-[#ffea00]">bolt</span>
          <span className="text-[14.5px] md:text-base font-black text-white tracking-wide uppercase">
            Quick Find Vacancies &amp; Results:
          </span>
        </div>

        {/* Center Search Input Form */}
        <div className="relative w-full md:w-auto flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="flex items-center bg-white border-2 border-gray-300 focus-within:border-[#ffea00] transition-colors">
            <div className="pl-3 text-gray-500 flex items-center">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              type="text"
              value={localInput}
              onChange={handleInputChange}
              onFocus={() => {
                if (localInput.trim() && suggestions.length > 0) setShowSuggestions(true);
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

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-xl z-50 rounded-b-sm overflow-hidden text-black">
              <ul className="max-h-64 overflow-y-auto py-1">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors border-b border-gray-100 last:border-0 font-medium"
                    >
                      {/* Highlight matching part */}
                      <span className="text-gray-900">
                        {suggestion.toLowerCase().startsWith(localInput.toLowerCase()) ? (
                          <>
                            <span className="font-bold text-[#850008]">{suggestion.substring(0, localInput.length)}</span>
                            {suggestion.substring(localInput.length)}
                          </>
                        ) : (
                          suggestion
                        )}
                      </span>
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
            onClick={() => handleSelectSuggestion(tag)}
            className="bg-white/15 hover:bg-[#ab1818] text-white px-2.5 py-1 font-bold transition-all cursor-pointer rounded-[2px]"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
