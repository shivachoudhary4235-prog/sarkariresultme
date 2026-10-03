'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../lib/api/adminApi';
import type { NotificationItem, NotificationCategory, StatusBadgeType } from '@sarkari/shared-types';

const ALL_INDIAN_STATES = [
  'All India', 'Uttar Pradesh', 'Bihar', 'Jharkhand', 'Delhi NCR', 'Rajasthan',
  'Madhya Pradesh', 'Haryana', 'Punjab', 'Uttarakhand', 'West Bengal', 'Maharashtra',
  'Gujarat', 'Chhattisgarh', 'Odisha', 'Assam', 'Tamil Nadu', 'Karnataka', 'Kerala',
  'Andhra Pradesh', 'Telangana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Goa',
  'Chandigarh', 'Tripura', 'Manipur', 'Meghalaya', 'Nagaland', 'Arunachal Pradesh',
  'Sikkim', 'Mizoram', 'Puducherry', 'Ladakh'
];

const QUALIFICATION_OPTIONS = [
  '8th Pass', '10th Pass', '12th Pass', 'ITI', 'Diploma', 'Graduate',
  'Post Graduate', 'PhD', 'B.Tech', 'Medical', 'Nursing', 'Teaching', 'Law'
];

interface Props {
  initialData?: NotificationItem;
  isEdit?: boolean;
}

export function NotificationEditor({ initialData, isEdit }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<NotificationItem>>(
    initialData || {
      title: '',
      slug: '',
      category: 'latest-job' as NotificationCategory,
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
      answerKeyDate: '',
      feeGeneral: '₹0',
      feeReserved: '₹0',
      ageMin: '18 Years',
      ageMax: '40 Years',
      ageAsOnDate: '01/07/2026',
      ageRelaxationNotes: 'Age Relaxation Extra as per Commission Recruitment Rules.',
      eligibility: '',
      shortDescription: '',
      applyUrl: 'https://',
      applyUrlServer2: 'https://',
      notificationUrl: 'https://',
      officialUrl: 'https://',
      statusBadge: 'NEW' as StatusBadgeType,
      published: true,
      featured: false,
    }
  );

  const handleChange = (field: keyof NotificationItem, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from title if new
      if (field === 'title' && !isEdit && (!prev.slug || prev.slug === generateSlug(prev.title || ''))) {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.organization) {
      setError('Please fill in Title, Slug, and Organization.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (isEdit && initialData?.id) {
        await adminApi.notifications.update(initialData.id, formData);
      } else {
        await adminApi.notifications.create(formData);
      }
      router.push('/admin/notifications');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xs">
          {error}
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="bg-white p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h2 className="text-base font-black text-[#850008] uppercase font-serif border-b border-gray-200 pb-2 mb-4">
          1. Basic Notification Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="md:col-span-2">
            <label className="font-bold text-gray-700 block mb-1">
              Recruitment / Exam Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. BPSC School Teacher TRE 4.0 Online Form 2026"
              className="w-full border border-gray-300 p-2 focus:outline-none focus:border-[#ab1818]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              URL Slug <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug || ''}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="bpsc-school-teacher-tre-4-online-form-2026"
              className="w-full border border-gray-300 p-2 focus:outline-none focus:border-[#ab1818] font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value as NotificationCategory)}
              className="w-full border border-gray-300 p-2 focus:outline-none focus:border-[#ab1818] bg-white"
            >
              <option value="latest-job">Latest Job</option>
              <option value="teaching">Teaching Jobs</option>
              <option value="admit-card">Admit Card</option>
              <option value="result">Result</option>
              <option value="answer-key">Answer Key</option>
              <option value="syllabus">Syllabus</option>
              <option value="important">Important</option>
              <option value="outsourcing">Outsourcing</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Recruitment Board / Commission <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.organization || ''}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="e.g. Bihar Public Service Commission (BPSC)"
              className="w-full border border-gray-300 p-2 focus:outline-none focus:border-[#ab1818]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">State / Jurisdiction</label>
            <select
              value={formData.state || 'All India'}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full border border-gray-300 p-2 focus:outline-none focus:border-[#ab1818] bg-white"
            >
              {ALL_INDIAN_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Total Vacancies</label>
            <input
              type="text"
              value={formData.totalVacancies || ''}
              onChange={(e) => handleChange('totalVacancies', e.target.value)}
              placeholder="e.g. 87,774 Posts"
              className="w-full border border-gray-300 p-2 focus:outline-none focus:border-[#ab1818]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Minimum Qualification</label>
            <select
              value={formData.qualification || 'Graduate'}
              onChange={(e) => handleChange('qualification', e.target.value)}
              className="w-full border border-gray-300 p-2 focus:outline-none focus:border-[#ab1818] bg-white"
            >
              {QUALIFICATION_OPTIONS.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Status Badge</label>
            <select
              value={formData.statusBadge || 'NEW'}
              onChange={(e) => handleChange('statusBadge', e.target.value)}
              className="w-full border border-gray-300 p-2 focus:outline-none focus:border-[#ab1818] bg-white"
            >
              <option value="NEW">NEW</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="HOT">HOT</option>
              <option value="DECLARED">DECLARED</option>
              <option value="OUT">OUT</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="EXTENDED">EXTENDED</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Critical Dates & Fees */}
      <div className="bg-white p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h2 className="text-base font-black text-[#850008] uppercase font-serif border-b border-gray-200 pb-2 mb-4">
          2. Dates &amp; Application Fees
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Application Begin Date</label>
            <input
              type="text"
              value={formData.postDate || ''}
              onChange={(e) => handleChange('postDate', e.target.value)}
              placeholder="e.g. 10 Feb 2026"
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Last Date to Apply</label>
            <input
              type="text"
              value={formData.lastDate || ''}
              onChange={(e) => handleChange('lastDate', e.target.value)}
              placeholder="e.g. 28 Feb 2026"
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Exam Date</label>
            <input
              type="text"
              value={formData.examDate || ''}
              onChange={(e) => handleChange('examDate', e.target.value)}
              placeholder="e.g. May 2026 / Notified Soon"
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">General / OBC / EWS Fee</label>
            <input
              type="text"
              value={formData.feeGeneral || ''}
              onChange={(e) => handleChange('feeGeneral', e.target.value)}
              placeholder="e.g. ₹750 / ₹100 / Exempted"
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">SC / ST / PH Fee</label>
            <input
              type="text"
              value={formData.feeReserved || ''}
              onChange={(e) => handleChange('feeReserved', e.target.value)}
              placeholder="e.g. ₹200 / ₹0 / Nil"
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Age Limit */}
      <div className="bg-white p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h2 className="text-base font-black text-[#850008] uppercase font-serif border-b border-gray-200 pb-2 mb-4">
          3. Age Limit Specifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Minimum Age</label>
            <input
              type="text"
              value={formData.ageMin || ''}
              onChange={(e) => handleChange('ageMin', e.target.value)}
              placeholder="18 Years"
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Maximum Age</label>
            <input
              type="text"
              value={formData.ageMax || ''}
              onChange={(e) => handleChange('ageMax', e.target.value)}
              placeholder="37-40 Years"
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Benchmark Date (As on)</label>
            <input
              type="text"
              value={formData.ageAsOnDate || ''}
              onChange={(e) => handleChange('ageAsOnDate', e.target.value)}
              placeholder="01/08/2026"
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="font-bold text-gray-700 block mb-1">Age Relaxation Notes</label>
            <input
              type="text"
              value={formData.ageRelaxationNotes || ''}
              onChange={(e) => handleChange('ageRelaxationNotes', e.target.value)}
              placeholder="Age Relaxation Extra as per Commission Recruitment Rules."
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Useful Official Links */}
      <div className="bg-white p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h2 className="text-base font-black text-[#850008] uppercase font-serif border-b border-gray-200 pb-2 mb-4">
          4. Useful Official Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Apply Online URL (Server 1)</label>
            <input
              type="url"
              value={formData.applyUrl || ''}
              onChange={(e) => handleChange('applyUrl', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 p-2 focus:outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Apply Online URL (Server 2 Backup)</label>
            <input
              type="url"
              value={formData.applyUrlServer2 || ''}
              onChange={(e) => handleChange('applyUrlServer2', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 p-2 focus:outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Official Notification PDF URL</label>
            <input
              type="url"
              value={formData.notificationUrl || ''}
              onChange={(e) => handleChange('notificationUrl', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 p-2 focus:outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Official Commission Website URL</label>
            <input
              type="url"
              value={formData.officialUrl || ''}
              onChange={(e) => handleChange('officialUrl', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 p-2 focus:outline-none font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* 5. Editorial Content & Descriptions */}
      <div className="bg-white p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h2 className="text-base font-black text-[#850008] uppercase font-serif border-b border-gray-200 pb-2 mb-4">
          5. Editorial Guidelines &amp; Descriptions
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Short Description</label>
            <textarea
              rows={2}
              value={formData.shortDescription || ''}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              placeholder="Brief summary displayed on homepage card and metadata description."
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Eligibility Criteria</label>
            <textarea
              rows={2}
              value={formData.eligibility || ''}
              onChange={(e) => handleChange('eligibility', e.target.value)}
              placeholder="e.g. Bachelor Degree in any stream from recognized university with 50% marks."
              className="w-full border border-gray-300 p-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">How to Apply (Step-by-Step)</label>
            <textarea
              rows={3}
              value={formData.howToApply || ''}
              onChange={(e) => handleChange('howToApply', e.target.value)}
              placeholder="1. Visit official link&#10;2. Register and upload documents&#10;3. Pay examination fee"
              className="w-full border border-gray-300 p-2 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Full Article / Guidelines Content</label>
            <textarea
              rows={4}
              value={formData.articleContent || ''}
              onChange={(e) => handleChange('articleContent', e.target.value)}
              placeholder="Detailed candidate instructions, syllabus highlights, selection stages..."
              className="w-full border border-gray-300 p-2 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* 6. Publication Status */}
      <div className="bg-white p-5 border border-gray-200 shadow-2xs rounded-xs flex items-center justify-between">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 font-bold text-gray-800 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published ?? true}
              onChange={(e) => handleChange('published', e.target.checked)}
              className="w-4 h-4 text-[#ab1818]"
            />
            <span>Published (Visible to public)</span>
          </label>

          <label className="flex items-center gap-2 font-bold text-gray-800 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured ?? false}
              onChange={(e) => handleChange('featured', e.target.checked)}
              className="w-4 h-4 text-[#ab1818]"
            />
            <span>Featured on Homepage</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase text-xs hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ab1818] hover:bg-[#8a0c0c] text-white px-6 py-2 font-bold uppercase text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Notification'}
          </button>
        </div>
      </div>
    </form>
  );
}
