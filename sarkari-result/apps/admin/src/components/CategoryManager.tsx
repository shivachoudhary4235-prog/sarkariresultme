'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Search, ExternalLink, Download, FileText, Globe,
  Edit2, Trash2, CheckCircle2, AlertCircle, X, Loader2, ArrowUpRight
} from 'lucide-react';
import type { NotificationItem, NotificationCategory, StatusBadgeType } from '@sarkari/shared-types';
import { adminApi } from '../lib/api/adminApi';

interface Props {
  category: NotificationCategory;
  categoryTitle: string;
  categorySlug: string;
  publicPath: string;
}

const BADGE_OPTIONS: { label: string; value: StatusBadgeType; color: string }[] = [
  { label: 'None', value: null, color: 'bg-gray-100 text-gray-700' },
  { label: 'NEW', value: 'NEW', color: 'bg-red-600 text-white' },
  { label: 'HOT', value: 'UPCOMING', color: 'bg-pink-600 text-white' },
  { label: 'EXTENDED', value: 'EXTENDED', color: 'bg-orange-600 text-white' },
  { label: 'ACTIVE', value: 'ACTIVE', color: 'bg-emerald-600 text-white' },
  { label: 'OUT', value: 'OUT', color: 'bg-red-700 text-white' },
  { label: 'DECLARED', value: 'DECLARED', color: 'bg-rose-700 text-white' },
  { label: 'CORRECTION', value: 'CORRECTION', color: 'bg-amber-600 text-white' },
];

export function CategoryManager({ category, categoryTitle, categorySlug, publicPath }: Props) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const initialFormState: Partial<NotificationItem> = {
    title: '',
    slug: '',
    category: category,
    organization: '',
    department: '',
    state: 'All India',
    qualification: 'Graduate',
    totalVacancies: '',
    postDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    lastDate: '',
    examDate: 'Notified Soon',
    admitCardDate: 'Before Exam',
    resultDate: '',
    feeGeneral: '₹0',
    feeReserved: '₹0',
    ageMin: '18 Years',
    ageMax: '40 Years',
    eligibility: '',
    shortDescription: '',
    applyUrl: 'https://',
    applyUrlServer2: '',
    notificationUrl: 'https://',
    officialUrl: 'https://',
    statusBadge: 'NEW',
    published: true,
    featured: false,
  };

  const [formData, setFormData] = useState<Partial<NotificationItem>>(initialFormState);

  // Load items
  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await adminApi.notifications.list({ category });
      setItems(data || []);
    } catch (err: any) {
      // In development fallback if backend is offline
      console.warn('API fetch failed, falling back:', err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [category]);

  const handleFieldChange = (field: keyof NotificationItem, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !editingId) {
        next.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
      return next;
    });
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsFormOpen(true);
    setMessage(null);
  };

  const handleOpenEdit = (item: NotificationItem) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsFormOpen(true);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.organization?.trim()) {
      setMessage({ type: 'error', text: 'Please fill in Notification Title and Organization.' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      if (editingId) {
        const updated = await adminApi.notifications.update(editingId, formData);
        setItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...formData } as NotificationItem : item)));
        setMessage({ type: 'success', text: `Successfully updated "${formData.title}" in Supabase!` });
      } else {
        const created = await adminApi.notifications.create({ ...formData, category });
        setItems((prev) => [created || ({ ...formData, id: `local-${Date.now()}` } as NotificationItem), ...prev]);
        setMessage({ type: 'success', text: `Published "${formData.title}" to Supabase & Live Site!` });
      }

      setIsFormOpen(false);
      setEditingId(null);
      setFormData(initialFormState);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Operation failed. Check server connection.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete:\n\n"${title}"?`)) return;

    try {
      await adminApi.notifications.permanentDelete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: 'success', text: `Deleted "${title}" from Supabase.` });
    } catch (err: any) {
      alert(err.message || 'Failed to delete item.');
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.organization?.toLowerCase().includes(q) ||
        item.slug?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{categoryTitle}</h1>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage, edit, test links, and publish real-time entries directly to Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
          >
            <Globe className="w-3.5 h-3.5" />
            Public Page
            <ArrowUpRight className="w-3 h-3 text-gray-400" />
          </a>

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#ab1818] hover:bg-[#850008] rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            + Add New {categoryTitle.replace('Manage ', '')}
          </button>
        </div>
      </div>

      {/* Dismissible Feedback Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start justify-between border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Inline Add / Edit Form */}
      {isFormOpen && (
        <div className="bg-white border-2 border-[#ab1818] rounded-xl shadow-lg p-5 sm:p-6 transition-all">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? `Edit Entry: ${formData.title}` : `+ Create New ${categoryTitle}`}
              </h2>
              <p className="text-xs text-gray-500">All fields save directly to Supabase PostgreSQL database.</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Core Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Headline / Notification Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. SSC CGL 2026 Online Application Form"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Recruiting Org / Board <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization || ''}
                  onChange={(e) => handleFieldChange('organization', e.target.value)}
                  placeholder="e.g. SSC, UPSC, Railway, BPSC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => handleFieldChange('slug', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Last Date / Event Date
                </label>
                <input
                  type="text"
                  value={formData.lastDate || ''}
                  onChange={(e) => handleFieldChange('lastDate', e.target.value)}
                  placeholder="e.g. 25/11/2026 or Extended"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Total Vacancies
                </label>
                <input
                  type="text"
                  value={formData.totalVacancies || ''}
                  onChange={(e) => handleFieldChange('totalVacancies', e.target.value)}
                  placeholder="e.g. 14,500 Posts"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Highlight Badge
                </label>
                <select
                  value={formData.statusBadge || ''}
                  onChange={(e) => handleFieldChange('statusBadge', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none bg-white"
                >
                  {BADGE_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value || ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.published ? 'true' : 'false'}
                  onChange={(e) => handleFieldChange('published', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none bg-white font-bold"
                >
                  <option value="true">🟢 PUBLISHED (Live on Site)</option>
                  <option value="false">🟡 DRAFT (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Section 2: Official Portal Links and PDF Downloads (Red Tinted Box with Test Buttons) */}
            <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#ab1818]" />
                <h3 className="text-sm font-bold text-[#850008] uppercase tracking-wide">
                  Official Portal Direct Links & PDF Downloads (Live Testable)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Direct Apply Online / Registration Portal URL
                    </label>
                    {formData.applyUrl && formData.applyUrl.startsWith('http') && (
                      <a
                        href={formData.applyUrl}
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
                    value={formData.applyUrl || ''}
                    onChange={(e) => handleFieldChange('applyUrl', e.target.value)}
                    placeholder="https://apply-portal.gov.in"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Download Official Notification PDF Link
                    </label>
                    {formData.notificationUrl && formData.notificationUrl.startsWith('http') && (
                      <a
                        href={formData.notificationUrl}
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
                    value={formData.notificationUrl || ''}
                    onChange={(e) => handleFieldChange('notificationUrl', e.target.value)}
                    placeholder="https://.../notification.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Download Result / Admit Card / Answer Key URL
                    </label>
                    {formData.answerKeyUrl && formData.answerKeyUrl.startsWith('http') && (
                      <a
                        href={formData.answerKeyUrl}
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
                    value={formData.answerKeyUrl || ''}
                    onChange={(e) => handleFieldChange('answerKeyUrl', e.target.value)}
                    placeholder="https://.../result.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Official Department / Commission Website
                    </label>
                    {formData.officialUrl && formData.officialUrl.startsWith('http') && (
                      <a
                        href={formData.officialUrl}
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
                    value={formData.officialUrl || ''}
                    onChange={(e) => handleFieldChange('officialUrl', e.target.value)}
                    placeholder="https://ssc.gov.in"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Eligibility, Fees, and Age Limits */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Eligibility, Fees & Exam Schedule
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Educational Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification || ''}
                    onChange={(e) => handleFieldChange('qualification', e.target.value)}
                    placeholder="e.g. Bachelor Degree in Any Stream"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Fee (Gen / OBC / EWS)
                  </label>
                  <input
                    type="text"
                    value={formData.feeGeneral || ''}
                    onChange={(e) => handleFieldChange('feeGeneral', e.target.value)}
                    placeholder="e.g. ₹100/-"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Fee (SC / ST / PH)
                  </label>
                  <input
                    type="text"
                    value={formData.feeReserved || ''}
                    onChange={(e) => handleFieldChange('feeReserved', e.target.value)}
                    placeholder="e.g. ₹0/- (Nil)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Minimum Age
                  </label>
                  <input
                    type="text"
                    value={formData.ageMin || ''}
                    onChange={(e) => handleFieldChange('ageMin', e.target.value)}
                    placeholder="e.g. 18 Years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Maximum Age
                  </label>
                  <input
                    type="text"
                    value={formData.ageMax || ''}
                    onChange={(e) => handleFieldChange('ageMax', e.target.value)}
                    placeholder="e.g. 30 Years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Exam Date
                  </label>
                  <input
                    type="text"
                    value={formData.examDate || ''}
                    onChange={(e) => handleFieldChange('examDate', e.target.value)}
                    placeholder="e.g. December 2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    State / Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={formData.state || 'All India'}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="e.g. All India or Uttar Pradesh"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-[#ab1818] hover:bg-[#850008] disabled:bg-gray-400 rounded-lg shadow-sm transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving to Supabase...
                  </>
                ) : editingId ? (
                  'Save Changes to Supabase'
                ) : (
                  'Publish to Live Site'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Table Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${categoryTitle}...`}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ab1818] focus:border-transparent outline-none"
            />
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{filteredItems.length}</span> of {items.length} items
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4">Last Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Direct Portal & Downloads</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#ab1818]" />
                    Loading {categoryTitle} from Supabase...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No entries found. Click "+ Add New" above to publish your first post!
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Title & Slug */}
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <p className="font-bold text-gray-900 line-clamp-1 hover:text-[#ab1818] cursor-pointer">
                        {item.title}
                      </p>
                      <p className="text-[11px] font-mono text-gray-400 truncate">
                        /{item.slug}
                      </p>
                    </td>

                    {/* Organization */}
                    <td className="py-3 px-4 text-xs font-medium text-gray-700 whitespace-nowrap">
                      {item.organization || '—'}
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.statusBadge ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          {item.statusBadge}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Last Date */}
                    <td className="py-3 px-4 text-xs text-gray-600 whitespace-nowrap">
                      {item.lastDate || '—'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.published ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          DRAFT
                        </span>
                      )}
                    </td>

                    {/* Direct Portal & Downloads */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {item.applyUrl && item.applyUrl.startsWith('http') && (
                          <a
                            href={item.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Direct Apply / Official Portal"
                            className="px-2 py-1 text-[11px] font-bold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors inline-flex items-center gap-1"
                          >
                            Portal <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}

                        {item.notificationUrl && item.notificationUrl.startsWith('http') && (
                          <a
                            href={item.notificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download PDF"
                            className="px-2 py-1 text-[11px] font-bold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors inline-flex items-center gap-1"
                          >
                            PDF <Download className="w-2.5 h-2.5" />
                          </a>
                        )}

                        <a
                          href={`/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Public Post Page"
                          className="px-2 py-1 text-[11px] font-semibold rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors"
                        >
                          Post
                        </a>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
