import React, { useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { searchCuratedKeywords } from '../data/curatedSeoKeywords';

export const SearchView: React.FC = () => {
  const { searchQuery, setSearchQuery, notifications, openNotification, goHome } = usePortal();

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

  const relatedTopics = useMemo(() => {
    if (!q) return [];
    return searchCuratedKeywords(q, 6);
  }, [q]);

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
            Found <span className="font-bold text-[#ffea00]">{results.length}</span> matching official records
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
      <div className="mb-4 flex items-center gap-2 max-w-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Refine search query..."
          className="w-full border border-gray-300 p-2 sm:p-2.5 text-xs sm:text-sm focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs sm:text-sm bg-gray-200 px-3 py-2 sm:py-2.5 hover:bg-gray-300 cursor-pointer font-bold"
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

        {/* Candidate Help Desk when 0 exact notices match */}
        {results.length === 0 && (
          <div className="p-6 text-center text-gray-700 bg-white">
            <div className="bg-[#fff9e6] border-2 border-amber-400 p-4 max-w-xl mx-auto mb-6 text-left shadow-2xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                <span className="material-symbols-outlined text-[20px] text-amber-600">help</span>
                <span>Candidate Help Desk: No exact post titled &ldquo;{searchQuery}&rdquo;</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                The specific vacancy or result might be published under its parent Commission board. Explore verified resources and exam hubs below:
              </p>
            </div>

            {relatedTopics.length > 0 && (
              <div className="max-w-2xl mx-auto text-left">
                <h3 className="text-xs sm:text-sm font-black text-[#850008] uppercase mb-3 flex items-center gap-1.5 font-serif border-b border-gray-200 pb-1.5">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Verified Official Examination Hubs for &ldquo;{searchQuery}&rdquo;</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {relatedTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-3 border border-gray-300 bg-[#f9fafb] hover:bg-white hover:border-[#850008] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-[#850008] text-white inline-block">
                            {topic.category}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">
                            {topic.intent}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                          {topic.keyword}
                        </h4>
                        <span className="text-[11px] text-gray-500 font-mono block mt-1">
                          {topic.targetSlug}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSearchQuery(topic.category)}
                        className="mt-2 text-xs text-[#000dff] hover:text-[#850008] hover:underline font-bold text-left cursor-pointer"
                      >
                        Explore {topic.category} Updates →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

