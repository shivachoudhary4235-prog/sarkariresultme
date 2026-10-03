'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '../context/PortalContext';
import type { NotificationItem } from '@sarkari/shared-types';

interface SearchViewProps {
  notifications?: NotificationItem[];
  query?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({
  notifications: propNotifications,
  query: propQuery,
}) => {
  const router = useRouter();
  const portal = usePortal();
  const notifications = propNotifications ?? portal.notifications;
  const searchQuery = propQuery !== undefined ? propQuery : portal.searchQuery;
  const { setSearchQuery, openNotification, goHome } = portal;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    router.replace(`/search?q=${encodeURIComponent(val)}`);

    if (val.trim() && allKeywords.length > 0) {
      const lowerVal = val.toLowerCase();
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
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.replace(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const q = searchQuery.toLowerCase().trim();

  const results = notifications.filter((item) => {
    if (!item.published || item.inTrash) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.organization.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q) ||
      item.qualification.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q)
    );
  });

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
        <span className="text-gray-800 font-bold">Search Results</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-[#001a40] text-white p-4 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight font-serif mb-1">
            Search Results for &ldquo;{searchQuery || 'All'}&rdquo;
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Found <span className="font-bold text-[#ffea00]">{results.length}</span> matching records in official portal
          </p>
        </div>
        <button
          onClick={goHome}
          className="bg-[#ab1818] text-white text-xs sm:text-sm font-bold px-4 py-1.5 uppercase hover:bg-[#8a0c0c] cursor-pointer shadow-xs"
        >
          Back to Home
        </button>
      </div>

      {/* In-page search refinement */}
      <div className="mb-4 flex flex-col md:flex-row md:items-start gap-2 max-w-lg relative" ref={dropdownRef}>
        <div className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => {
              if (searchQuery.trim() && suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder="Refine search query..."
            className="w-full border border-gray-300 p-2 sm:p-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#001a40]"
          />
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
                      <span className="text-gray-900">
                        {suggestion.toLowerCase().startsWith(searchQuery.toLowerCase()) ? (
                          <>
                            <span className="font-bold text-[#850008]">{suggestion.substring(0, searchQuery.length)}</span>
                            {suggestion.substring(searchQuery.length)}
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
        
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
              router.replace('/search');
            }}
            className="text-xs sm:text-sm bg-gray-200 px-3 py-2 sm:py-2.5 hover:bg-gray-300 cursor-pointer font-bold shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="divide-y divide-gray-200 border border-gray-300">
        {results.map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-4 hover:bg-[#fff0ee] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-[#001a40] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                  {item.category.replace('-', ' ')}
                </span>
                <span className="text-xs text-gray-500 font-semibold">{item.postDate}</span>
                {item.statusBadge && (
                  <span className="bg-[#d32f2f] text-white text-[10px] font-black px-1.5 py-0.5 uppercase">
                    {item.statusBadge}
                  </span>
                )}
              </div>
              <button
                onClick={() => openNotification(item.slug)}
                className="text-base sm:text-lg font-bold text-[#000dff] hover:text-[#ab1818] hover:underline text-left cursor-pointer leading-snug"
              >
                {item.title}
              </button>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mt-1">
                {item.shortDescription}
              </p>
              <div className="text-xs text-gray-500 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                <span>Board: <strong>{item.organization}</strong></span>
                <span>Vacancies: <strong className="text-[#850008]">{item.totalVacancies}</strong></span>
                <span>Qualification: <strong>{item.qualification}</strong></span>
              </div>
            </div>

            <button
              onClick={() => openNotification(item.slug)}
              className="bg-[#ab1818] hover:bg-[#8a0c0c] text-white text-xs sm:text-sm font-bold px-4 py-2 uppercase whitespace-nowrap self-start md:self-center cursor-pointer shadow-xs"
            >
              View Notice
            </button>
          </div>
        ))}

        {results.length === 0 && (
          <div className="p-10 text-center text-gray-500 text-sm sm:text-base">
            No examinations or vacancies matched your search term &ldquo;{searchQuery}&rdquo;. Try another board name or keyword.
          </div>
        )}
      </div>
    </div>
  );
};
