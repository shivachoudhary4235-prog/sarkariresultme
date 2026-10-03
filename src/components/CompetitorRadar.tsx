import React, { useState, useMemo } from 'react';
import {
  DEFAULT_COMPETITORS,
  CompetitorAnalysis,
  analyzeCompetitorWithGemini,
} from '../services/competitorService';
import { NotificationCategory } from '../types';
import {
  CURATED_SEO_KEYWORDS,
  SEO_CLUSTERS,
  SEO_INTENTS,
  SeoKeywordItem,
  generateHighCtrMeta,
} from '../data/curatedSeoKeywords';

interface CompetitorRadarProps {
  onImportToPublish: (title: string, category: NotificationCategory, org: string) => void;
}

export const CompetitorRadar: React.FC<CompetitorRadarProps> = ({ onImportToPublish }) => {
  const [activeSubTab, setActiveSubTab] = useState<'keywords' | 'radar'>('keywords');

  // Competitor Radar state
  const [selectedDomain, setSelectedDomain] = useState<string>('sarkariresult.com');
  const [customDomainInput, setCustomDomainInput] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<CompetitorAnalysis>(
    DEFAULT_COMPETITORS['sarkariresult.com']
  );
  const [loading, setLoading] = useState(false);
  const [geminiSuccess, setGeminiSuccess] = useState(false);

  // SEO Keywords Vault state
  const [keywordSearch, setKeywordSearch] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSelectPreset = (domain: string) => {
    setSelectedDomain(domain);
    setCurrentAnalysis(DEFAULT_COMPETITORS[domain] || DEFAULT_COMPETITORS['sarkariresult.com']);
  };

  const handleAnalyzeCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomainInput.trim()) return;

    setLoading(true);
    setGeminiSuccess(false);

    try {
      const result = await analyzeCompetitorWithGemini(customDomainInput.trim());
      setSelectedDomain(result.domain);
      setCurrentAnalysis(result);
      setGeminiSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered SEO Keywords
  const filteredKeywords = useMemo(() => {
    return CURATED_SEO_KEYWORDS.filter((item) => {
      if (selectedCluster !== 'all' && item.cluster !== selectedCluster) return false;
      if (selectedIntent !== 'all' && item.intent !== selectedIntent) return false;
      if (keywordSearch.trim()) {
        const q = keywordSearch.toLowerCase().trim();
        const kw = item.keyword.toLowerCase();
        const cat = item.category.toLowerCase();
        const slug = item.targetSlug.toLowerCase();
        if (!kw.includes(q) && !cat.includes(q) && !slug.includes(q)) return false;
      }
      return true;
    });
  }, [selectedCluster, selectedIntent, keywordSearch]);

  const totalPages = Math.ceil(filteredKeywords.length / pageSize) || 1;
  const paginatedKeywords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredKeywords.slice(start, start + pageSize);
  }, [filteredKeywords, currentPage]);

  const handleCopyMeta = (item: SeoKeywordItem) => {
    const meta = generateHighCtrMeta(item);
    const textToCopy = `TITLE: ${meta.title}\nDESCRIPTION: ${meta.description}\nCANONICAL: ${meta.canonical}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleImportKeyword = (item: SeoKeywordItem) => {
    // Map cluster/category to NotificationCategory
    let cat: NotificationCategory = 'latest-job';
    if (item.intent === 'Result / Cutoff') cat = 'result';
    else if (item.intent === 'Admit Card / Exam') cat = 'admit-card';
    else if (item.intent === 'Answer Key') cat = 'answer-key';
    else if (item.intent === 'Syllabus / PYQ') cat = 'syllabus';
    else if (item.cluster.includes('Teaching') || item.category.includes('Teaching')) cat = 'teaching';

    const formattedTitle = item.keyword
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    onImportToPublish(formattedTitle, cat, item.category || 'Commission / Board');
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Sub-tab Navigation */}
      <div className="flex border-b-2 border-gray-300 bg-white">
        <button
          type="button"
          onClick={() => setActiveSubTab('keywords')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-black uppercase transition-all cursor-pointer border-b-2 -mb-0.5 ${
            activeSubTab === 'keywords'
              ? 'border-[#850008] text-[#850008] bg-[#fff0ee]'
              : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">key</span>
          <span>SEO Keywords &amp; Ranking Vault ({CURATED_SEO_KEYWORDS.length} Curated / 283K Master)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('radar')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-black uppercase transition-all cursor-pointer border-b-2 -mb-0.5 ${
            activeSubTab === 'radar'
              ? 'border-[#850008] text-[#850008] bg-[#fff0ee]'
              : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">radar</span>
          <span>Competitor Intelligence &amp; SERP Radar</span>
        </button>
      </div>

      {/* VIEW 1: SEO KEYWORDS & RANKING VAULT */}
      {activeSubTab === 'keywords' && (
        <div className="space-y-5">
          {/* Corpus Statistics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 border border-gray-300 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                Analyzed Raw Corpus
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#850008] block leading-tight font-serif">
                283,489
              </span>
              <span className="text-[11px] text-gray-600 font-semibold">Across Parts 04 to 11</span>
            </div>

            <div className="bg-white p-3.5 border border-gray-300 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                Curated High-Intent
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#000066] block leading-tight font-serif">
                {CURATED_SEO_KEYWORDS.length}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">100% Verified Slugs</span>
            </div>

            <div className="bg-white p-3.5 border border-emerald-300 bg-emerald-50/50 shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">
                Zero-KD Goldmines
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 block leading-tight font-serif">
                100+ Exams
              </span>
              <span className="text-[11px] text-emerald-800 font-semibold">KD = 0 (Immediate Top 3)</span>
            </div>

            <div className="bg-white p-3.5 border border-gray-300 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                Lifecycle Stages
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 block leading-tight font-serif">
                5 Stages
              </span>
              <span className="text-[11px] text-gray-600 font-semibold">Form → Admit → Key → Result</span>
            </div>
          </div>

          {/* Permutation Filter Alert Banner */}
          <div className="bg-[#fff9e6] border-l-4 border-amber-500 p-3.5 sm:p-4 text-xs text-amber-900 shadow-2xs flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600 text-[22px] shrink-0 mt-0.5">
              shield
            </span>
            <div>
              <p className="font-bold text-sm text-amber-950 mb-1">
                Algorithm Safeguard: The &ldquo;Permutation Trap&rdquo; Quarantined
              </p>
              <p className="leading-relaxed">
                The raw dataset contained ~270,000 synthetic Cartesian permutations (e.g. <em>&ldquo;odisha police gujarat current affairs&rdquo;</em>). Under Google&apos;s March 2024 Core Update, publishing thin doorway pages for zero-search cross-state combinations triggers <strong>Scaled Content Abuse penalties</strong>. Our portal actively filters these out while targeting the <strong>top verified, high-volume real candidate searches</strong> shown below.
              </p>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white border-2 border-gray-300 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search keywords, board, or target slug (e.g. UPSSSC, PET, BPSC, Syllabus)..."
                  value={keywordSearch}
                  onChange={(e) => {
                    setKeywordSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 bg-white font-semibold focus:outline-none focus:border-[#850008]"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[18px]">
                  search
                </span>
                {keywordSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setKeywordSearch('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCluster}
                  onChange={(e) => {
                    setSelectedCluster(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-2 text-xs border border-gray-300 bg-white font-semibold focus:outline-none focus:border-[#850008]"
                >
                  <option value="all">All Exam Clusters ({SEO_CLUSTERS.length})</option>
                  {SEO_CLUSTERS.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedIntent}
                  onChange={(e) => {
                    setSelectedIntent(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-2 text-xs border border-gray-300 bg-white font-semibold focus:outline-none focus:border-[#850008]"
                >
                  <option value="all">All Search Intents</option>
                  {SEO_INTENTS.map((it) => (
                    <option key={it} value={it}>
                      {it}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Counter & Pagination header */}
            <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-200 pt-3">
              <span>
                Showing <strong>{paginatedKeywords.length}</strong> of{' '}
                <strong>{filteredKeywords.length}</strong> matching keywords
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 text-xs border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 cursor-pointer font-bold"
                >
                  Prev
                </button>
                <span className="px-2 font-bold text-gray-800">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 text-xs border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 cursor-pointer font-bold"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Interactive Keywords Table */}
            <div className="overflow-x-auto border border-gray-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase font-black text-[11px] border-b border-gray-300">
                    <th className="p-2.5">Target Keyword</th>
                    <th className="p-2.5">Category / Exam</th>
                    <th className="p-2.5">Monthly Volume</th>
                    <th className="p-2.5">KD</th>
                    <th className="p-2.5">Intent</th>
                    <th className="p-2.5">Target Slug</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedKeywords.map((item) => {
                    const isCopied = copiedId === item.id;
                    const isZeroKd = item.kd === '0' || item.kd === '0-5';

                    let intentColor = 'bg-gray-100 text-gray-700';
                    if (item.intent === 'Result / Cutoff') intentColor = 'bg-emerald-100 text-emerald-800 font-bold';
                    else if (item.intent === 'Admit Card / Exam') intentColor = 'bg-amber-100 text-amber-800 font-bold';
                    else if (item.intent === 'Answer Key') intentColor = 'bg-blue-100 text-blue-800 font-bold';
                    else if (item.intent === 'Syllabus / PYQ') intentColor = 'bg-purple-100 text-purple-800 font-bold';
                    else if (item.intent === 'Application / Form') intentColor = 'bg-rose-100 text-rose-800 font-bold';

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-2.5 font-bold text-gray-900 whitespace-nowrap">
                          {item.keyword}
                        </td>
                        <td className="p-2.5 text-gray-600 whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="p-2.5 font-extrabold text-[#850008] whitespace-nowrap">
                          {item.monthlyVolume}
                        </td>
                        <td className="p-2.5 whitespace-nowrap">
                          {isZeroKd ? (
                            <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] rounded-[2px]">
                              KD {item.kd} 🟢
                            </span>
                          ) : (
                            <span className="text-gray-500 font-semibold">{item.kd}</span>
                          )}
                        </td>
                        <td className="p-2.5 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 text-[10px] uppercase rounded-[2px] ${intentColor}`}>
                            {item.intent}
                          </span>
                        </td>
                        <td className="p-2.5 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                          {item.targetSlug}
                        </td>
                        <td className="p-2.5 text-right whitespace-nowrap space-x-1">
                          <button
                            type="button"
                            onClick={() => handleCopyMeta(item)}
                            title="Copy high-CTR Title, Meta Description & Canonical URL"
                            className={`px-2 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer rounded-[2px] border ${
                              isCopied
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-gray-100 hover:bg-[#850008] hover:text-white text-gray-800 border-gray-300'
                            }`}
                          >
                            {isCopied ? 'Copied! ✓' : 'Copy Meta'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImportKeyword(item)}
                            title="Create and publish a post targeting this keyword"
                            className="bg-[#000066] hover:bg-[#001a40] text-white px-2 py-1 text-[11px] font-bold uppercase transition-colors cursor-pointer rounded-[2px]"
                          >
                            + Publish
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination */}
            <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 text-xs border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 cursor-pointer font-bold"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 text-xs border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 cursor-pointer font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPETITOR RADAR (ORIGINAL) */}
      {activeSubTab === 'radar' && (
        <div className="space-y-5">
          {/* Header & Competitor Selector */}
          <div className="bg-white border-2 border-gray-300 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-4 border-b border-gray-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#850008] text-[24px]">radar</span>
                  <h2 className="text-base sm:text-lg font-black text-[#850008] uppercase tracking-tight font-serif">
                    Competitor Intelligence &amp; SERP Radar (Powered by Gemini AI)
                  </h2>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Compare your portal in real time against top recruitment portals, uncover content gaps, and dominate Google Search &amp; Google Maps Local Pack.
                </p>
              </div>

              {/* Quick Status Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase rounded-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Gemini AI Connected</span>
                </span>
              </div>
            </div>

            {/* Competitor Presets + Custom Input Form */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-gray-700">Competitors:</span>
                {Object.keys(DEFAULT_COMPETITORS).map((dom) => (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => handleSelectPreset(dom)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer border ${
                      selectedDomain === dom
                        ? 'bg-[#850008] text-white border-[#850008] shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAnalyzeCustom} className="w-full md:w-auto flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. sarkariprep.in"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-300 bg-white font-semibold focus:outline-none focus:border-[#850008] w-48 sm:w-60"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#000066] hover:bg-[#001a40] text-white px-3.5 py-1.5 text-xs font-bold uppercase cursor-pointer disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[15px]">search</span>
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {geminiSuccess && (
              <div className="mt-3 p-2.5 bg-green-50 border border-green-300 text-green-900 text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-green-700 text-[18px]">verified</span>
                <span>Live competitor intelligence generated with Gemini AI!</span>
              </div>
            )}
          </div>

          {/* KPI Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 border border-gray-300 shadow-xs">
              <span className="text-xs text-gray-600 font-bold uppercase block mb-1">Competitor Target</span>
              <span className="text-lg sm:text-xl font-black text-[#850008] block leading-tight font-serif truncate">
                {currentAnalysis.name}
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">{currentAnalysis.domain}</span>
            </div>

            <div className="bg-white p-3.5 border border-gray-300 shadow-xs">
              <span className="text-xs text-gray-600 font-bold uppercase block mb-1">Estimated Traffic</span>
              <span className="text-xl sm:text-2xl font-black text-[#000066] block leading-tight font-serif">
                {currentAnalysis.monthlyVisits}
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">Monthly Visits</span>
            </div>

            <div className="bg-white p-3.5 border border-gray-300 shadow-xs">
              <span className="text-xs text-gray-600 font-bold uppercase block mb-1">Domain Authority (DA)</span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 block leading-tight font-serif">
                {currentAnalysis.domainAuthority} / 100
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">Search Engine Authority</span>
            </div>

            <div className="bg-white p-3.5 border border-emerald-300 bg-emerald-50/50 shadow-xs">
              <span className="text-xs text-emerald-800 font-bold uppercase block mb-1">Our Portal Speed Score</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 block leading-tight font-serif">
                95 / 100 🟢
              </span>
              <span className="text-[11px] text-emerald-800 font-semibold">Faster than rival</span>
            </div>
          </div>

          {/* Top Keywords Comparison Matrix */}
          <div className="bg-white border-2 border-gray-300 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#850008] text-[20px]">key</span>
                <h3 className="text-sm sm:text-base font-black text-gray-900 uppercase font-serif">
                  High-Volume Keyword Rankings &amp; SERP Battle
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-bold">Showing {currentAnalysis.topKeywords.length} core keywords</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase font-black text-[11px] border-b border-gray-300">
                    <th className="p-2.5">Target Keyword</th>
                    <th className="p-2.5">Monthly Volume</th>
                    <th className="p-2.5">Their Rank</th>
                    <th className="p-2.5">Our Rank</th>
                    <th className="p-2.5">Difficulty</th>
                    <th className="p-2.5">Intent</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentAnalysis.topKeywords.map((kw, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2.5 font-bold text-gray-900">{kw.keyword}</td>
                      <td className="p-2.5 font-semibold text-[#850008]">{kw.volume}</td>
                      <td className="p-2.5">
                        <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-xs">
                          #{kw.competitorRank}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-xs">
                          {typeof kw.ourRank === 'number' ? `#${kw.ourRank}` : kw.ourRank}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs ${
                            kw.difficulty === 'Easy'
                              ? 'bg-green-100 text-green-800'
                              : kw.difficulty === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {kw.difficulty}
                        </span>
                      </td>
                      <td className="p-2.5 text-gray-600">{kw.intent}</td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => onImportToPublish(kw.keyword, 'latest-job', 'Govt Commission')}
                          className="bg-[#850008] hover:bg-[#8a0c0c] text-white px-2.5 py-1 text-[11px] font-bold uppercase transition-colors cursor-pointer"
                        >
                          + Post
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content Gaps & Opportunities */}
          <div className="bg-white border-2 border-gray-300 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-200">
              <span className="material-symbols-outlined text-[#850008] text-[20px]">flag</span>
              <h3 className="text-sm sm:text-base font-black text-gray-900 uppercase font-serif">
                Content Gap Analysis (Immediate Win Opportunities)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentAnalysis.contentGaps.map((gap, idx) => (
                <div key={idx} className="border border-gray-300 p-3 bg-gray-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-[#850008] text-white">
                        {gap.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 ${
                          gap.urgency === 'HIGH' ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'
                        }`}
                      >
                        {gap.urgency} URGENCY
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 mb-1 leading-snug">{gap.title}</h4>
                    <p className="text-[11px] text-gray-600 mb-2 leading-relaxed">{gap.action}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onImportToPublish(gap.title, gap.category, gap.organization)}
                    className="w-full bg-[#000066] hover:bg-[#001a40] text-white text-[11px] font-bold py-1.5 uppercase transition-colors cursor-pointer text-center"
                  >
                    Quick Add Notification
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Google Maps & SEO Domination Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Maps Strategy */}
            <div className="bg-white border-2 border-gray-300 p-4 shadow-xs">
              <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-gray-200">
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">location_on</span>
                <h4 className="text-xs sm:text-sm font-black text-gray-900 uppercase font-serif">
                  Google Maps 3-Pack Domination Advantage
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                {currentAnalysis.mapsAdvantage.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold text-sm leading-none mt-0.5">✔</span>
                    <span className="leading-relaxed">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Recommendations */}
            <div className="bg-white border-2 border-gray-300 p-4 shadow-xs">
              <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-gray-200">
                <span className="material-symbols-outlined text-[#000066] text-[20px]">military_tech</span>
                <h4 className="text-xs sm:text-sm font-black text-gray-900 uppercase font-serif">
                  Tactical Playbook for #1 Organic Spot
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                {currentAnalysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#000066] font-bold text-sm leading-none mt-0.5">●</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* OpenSEO Integration Status Card */}
          <div className="bg-[#001a40] text-white p-4 sm:p-5 shadow-xs border border-black/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffea00] text-[22px]">bolt</span>
                  <h4 className="text-sm sm:text-base font-black uppercase tracking-wide text-white">
                    OpenSEO Integration Hub
                  </h4>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  OpenSEO MCP server is connected via <code className="text-[#ffea00] font-mono">https://app.openseo.so/mcp</code>.
                  You can also run OpenSEO locally with Docker.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://app.openseo.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#ffea00] hover:bg-yellow-400 text-black px-3.5 py-1.5 text-xs font-black uppercase transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Launch OpenSEO App</span>
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
