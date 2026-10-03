'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send, ExternalLink, Download, Globe, CheckCircle2,
  AlertCircle, ArrowLeft, Loader2, Sparkles, Eye
} from 'lucide-react';
import { adminApi } from '../../../lib/api/adminApi';
import type { NotificationCategory, StatusBadgeType, NotificationItem } from '@sarkari/shared-types';

interface ContentTypeOption {
  value: NotificationCategory;
  label: string;
  badge: string;
  desc: string;
}

const CONTENT_TYPES: ContentTypeOption[] = [
  { value: 'latest-job', label: 'Latest Job', badge: 'JOB', desc: 'Recruitment & Vacancies' },
  { value: 'result', label: 'Exam Result', badge: 'RESULT', desc: 'Scorecard & Merits' },
  { value: 'admit-card', label: 'Admit Card', badge: 'HALL TICKET', desc: 'Exam Call Letter' },
  { value: 'answer-key', label: 'Answer Key', badge: 'KEYS', desc: 'Objections & Solutions' },
  { value: 'syllabus', label: 'Syllabus', badge: 'SYLLABUS', desc: 'Exam Pattern & Topics' },
  { value: 'important', label: 'Admission / Entrance', badge: 'ADMISSION', desc: 'Counseling & Colleges' },
  { value: 'important', label: 'Certificate Verification', badge: 'CERTIFICATE', desc: 'PAN, Aadhar, Voter' },
  { value: 'outsourcing', label: 'Outsourcing / Offline', badge: 'OUTSOURCE', desc: 'Contractual Jobs' },
  { value: 'important', label: 'Important Notice', badge: 'IMPORTANT', desc: 'Public Advisories' },
];

export default function QuickPublishPage() {
  const [selectedType, setSelectedType] = useState<NotificationCategory>('latest-job');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; slug?: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [organization, setOrganization] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [vacancy, setVacancy] = useState('');
  const [badge, setBadge] = useState<StatusBadgeType>('NEW');
  const [published, setPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Links
  const [applyUrl, setApplyUrl] = useState('https://');
  const [notificationUrl, setNotificationUrl] = useState('https://');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [officialSiteUrl, setOfficialSiteUrl] = useState('https://');

  // Eligibility & Schedule
  const [qualification, setQualification] = useState('Graduate');
  const [feeGeneral, setFeeGeneral] = useState('₹100/-');
  const [feeReserve, setFeeReserve] = useState('₹0/- (Nil)');
  const [ageMin, setAgeMin] = useState('18 Years');
  const [ageMax, setAgeMax] = useState('30 Years');
  const [appStartDate, setAppStartDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [examDate, setExamDate] = useState('Notified Soon');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) {
      setResult({ success: false, message: 'Please provide Title and Recruiting Organization.' });
      return;
    }

    try {
      setSubmitting(true);
      setResult(null);

      const payload: Partial<NotificationItem> = {
        title: title.trim(),
        slug: slug.trim() || `post-${Date.now()}`,
        category: selectedType,
        organization: organization.trim(),
        state: 'All India',
        qualification,
        totalVacancies: vacancy.trim() || 'Check Notification',
        postDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        lastDate: lastDate.trim() || undefined,
        examDate: examDate.trim() || undefined,
        feeGeneral: feeGeneral.trim() || undefined,
        feeReserved: feeReserve.trim() || undefined,
        ageMin: ageMin.trim() || undefined,
        ageMax: ageMax.trim() || undefined,
        eligibility: qualification,
        shortDescription: `${organization} has released notification for ${title}. Eligible candidates can apply online.`,
        applyUrl: applyUrl.trim(),
        notificationUrl: notificationUrl.trim(),
        answerKeyUrl: downloadUrl.trim() || undefined,
        officialUrl: officialSiteUrl.trim(),
        statusBadge: badge,
        published,
        featured: isFeatured,
      };

      await adminApi.notifications.create(payload);

      setResult({
        success: true,
        message: `"${title}" has been published directly to Supabase and is now live on the portal!`,
        slug: slug.trim(),
      });

      // Clear main fields
      setTitle('');
      setSlug('');
      setOrganization('');
      setVacancy('');
      setLastDate('');
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Publishing failed. Check Supabase connection credentials.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Breadcrumb */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Command Center Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#ab1818]" />
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quick Publish Portal</h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Fast-track publishing engine for all 9 categories. Directly inserts into Supabase and updates the public homepage immediately.
        </p>
      </div>

      {/* Result Banner */}
      {result && (
        <div
          className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            result.success
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : 'bg-rose-50 text-rose-950 border-rose-300'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">{result.success ? 'Publish Successful!' : 'Publication Failed'}</p>
              <p className="text-xs mt-0.5">{result.message}</p>
            </div>
          </div>

          {result.success && (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin"
                className="px-3 py-1.5 bg-white text-gray-700 text-xs font-bold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Dashboard
              </Link>
              <a
                href={result.slug ? `/${result.slug}` : '/'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1 shadow-sm transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View Live
              </a>
            </div>
          )}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Content Type Selector */}
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
            Section 1 — Select Content Type
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CONTENT_TYPES.map((type, idx) => {
              const isSelected = selectedType === type.value;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedType(type.value)}
                  className={`p-3 text-left rounded-xl border-2 transition-all flex items-start justify-between ${
                    isSelected
                      ? 'border-[#ab1818] bg-red-50/70 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="font-black text-sm text-gray-900 block">{type.label}</span>
                    <span className="text-[11px] text-gray-500 mt-0.5 block">{type.desc}</span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#ab1818] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {type.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Core Details */}
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-gray-700 uppercase">
            Section 2 — Core Notification Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Headline / Notification Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. UPSC Civil Services Prelims 2026 Online Form"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Recruiting Org / Commission <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. UPSC, SSC, Railway, BPSC"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                URL Slug (Auto Generated)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Last Date to Apply
              </label>
              <input
                type="text"
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                placeholder="e.g. 15/12/2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Number of Vacancies
              </label>
              <input
                type="text"
                value={vacancy}
                onChange={(e) => setVacancy(e.target.value)}
                placeholder="e.g. 1,056 Posts"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Badge Label
              </label>
              <select
                value={badge || ''}
                onChange={(e) => setBadge((e.target.value as StatusBadgeType) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="NEW">NEW (Red)</option>
                <option value="UPCOMING">HOT / TRENDING</option>
                <option value="EXTENDED">EXTENDED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="OUT">OUT</option>
                <option value="DECLARED">DECLARED</option>
                <option value="CORRECTION">CORRECTION</option>
                <option value="">None</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Publish Status
              </label>
              <select
                value={published ? 'true' : 'false'}
                onChange={(e) => setPublished(e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-bold"
              >
                <option value="true">🟢 PUBLISHED (Immediate Live)</option>
                <option value="false">🟡 DRAFT (Save for Later)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#ab1818] rounded focus:ring-[#ab1818]"
              />
              <span className="text-xs font-bold text-gray-800">
                Mark as Featured Post (Pin to hero flash spots & top of category)
              </span>
            </label>
          </div>
        </div>

        {/* Section 3: Official Portal Links and PDF Downloads */}
        <div className="bg-red-50/60 border border-red-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#ab1818]" />
            <h2 className="text-xs font-bold text-[#850008] uppercase tracking-wide">
              Section 3 — Official Portal Direct Links & PDF Downloads
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Direct Apply Online / Registration Link
                </label>
                {applyUrl && applyUrl.startsWith('http') && (
                  <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Test Link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono bg-white outline-none focus:ring-2 focus:ring-[#ab1818]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Download Notification PDF Link
                </label>
                {notificationUrl && notificationUrl.startsWith('http') && (
                  <a
                    href={notificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
                  >
                    Open PDF <Download className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={notificationUrl}
                onChange={(e) => setNotificationUrl(e.target.value)}
                placeholder="https://.../notification.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono bg-white outline-none focus:ring-2 focus:ring-[#ab1818]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Download Admit Card / Result / Answer Key Link
                </label>
                {downloadUrl && downloadUrl.startsWith('http') && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-purple-600 hover:underline inline-flex items-center gap-1"
                  >
                    Test Download <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://.../result.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono bg-white outline-none focus:ring-2 focus:ring-[#ab1818]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Official Board / Department Website
                </label>
                {officialSiteUrl && officialSiteUrl.startsWith('http') && (
                  <a
                    href={officialSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-gray-700 hover:underline inline-flex items-center gap-1"
                  >
                    Open Site <Globe className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={officialSiteUrl}
                onChange={(e) => setOfficialSiteUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono bg-white outline-none focus:ring-2 focus:ring-[#ab1818]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Eligibility, Fees & Schedule */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-bold text-gray-700 uppercase">
            Section 4 — Eligibility, Fees & Exam Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Educational Qualification / Eligibility
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. 10+2 Intermediate Exam in Any Stream"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Fee Gen / OBC
              </label>
              <input
                type="text"
                value={feeGeneral}
                onChange={(e) => setFeeGeneral(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Fee SC / ST / PH
              </label>
              <input
                type="text"
                value={feeReserve}
                onChange={(e) => setFeeReserve(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Age Min
              </label>
              <input
                type="text"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Age Max
              </label>
              <input
                type="text"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Application Start Date
              </label>
              <input
                type="text"
                value={appStartDate}
                onChange={(e) => setAppStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Exam Date / Schedule
              </label>
              <input
                type="text"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/admin"
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel & Return to Dashboard
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-black text-white bg-[#ab1818] hover:bg-[#850008] disabled:bg-gray-400 rounded-xl shadow-md transition-all cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing to Supabase...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish Now (Sync to Live Site)
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
