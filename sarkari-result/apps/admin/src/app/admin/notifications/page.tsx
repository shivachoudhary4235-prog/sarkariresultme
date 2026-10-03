'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '../../../lib/api/adminApi';
import type { NotificationItem, NotificationCategory } from '@sarkari/shared-types';

export default function NotificationsAdminPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts' | 'trash'>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.notifications.list();
      setNotifications(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleTrash = async (id: string) => {
    if (!confirm('Move this notification to trash?')) return;
    try {
      await adminApi.notifications.trash(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, inTrash: true } : n))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to trash notification');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await adminApi.notifications.restore(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, inTrash: false } : n))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to restore notification');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this notification? This action cannot be undone.')) return;
    try {
      await adminApi.notifications.permanentDelete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete notification');
    }
  };

  const handleTogglePublish = async (item: NotificationItem) => {
    try {
      if (item.published) {
        await adminApi.notifications.unpublish(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, published: false } : n))
        );
      } else {
        await adminApi.notifications.publish(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, published: true } : n))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle publish status');
    }
  };

  const filtered = notifications.filter((item) => {
    if (activeTab === 'published' && (!item.published || item.inTrash)) return false;
    if (activeTab === 'drafts' && (item.published || item.inTrash)) return false;
    if (activeTab === 'trash' && !item.inTrash) return false;
    if (activeTab === 'all' && item.inTrash) return false;

    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchOrg = item.organization.toLowerCase().includes(q);
      if (!matchTitle && !matchOrg) return false;
    }
    return true;
  });

  const countTotal = notifications.filter((n) => !n.inTrash).length;
  const countPublished = notifications.filter((n) => n.published && !n.inTrash).length;
  const countDrafts = notifications.filter((n) => !n.published && !n.inTrash).length;
  const countTrash = notifications.filter((n) => n.inTrash).length;

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 border border-gray-200 shadow-2xs rounded-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-serif">
            Notification Manager
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage public exam notices, job postings, admit cards, and results.
          </p>
        </div>
        <Link
          href="/admin/notifications/new"
          className="bg-[#ab1818] hover:bg-[#8a0c0c] text-white text-xs sm:text-sm font-bold px-4 py-2 uppercase transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Post New Notification</span>
        </Link>
      </div>

      {/* Tabs & Metrics */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 font-bold rounded-xs cursor-pointer transition-colors ${
            activeTab === 'all'
              ? 'bg-[#ab1818] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All Active ({countTotal})
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`px-3 py-1.5 font-bold rounded-xs cursor-pointer transition-colors ${
            activeTab === 'published'
              ? 'bg-[#2e7d32] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Published ({countPublished})
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-3 py-1.5 font-bold rounded-xs cursor-pointer transition-colors ${
            activeTab === 'drafts'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Drafts ({countDrafts})
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          className={`px-3 py-1.5 font-bold rounded-xs cursor-pointer transition-colors ${
            activeTab === 'trash'
              ? 'bg-gray-800 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Trash ({countTrash})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 border border-gray-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-96 flex items-center bg-gray-50 border border-gray-300 px-3 py-1.5">
          <span className="material-symbols-outlined text-[20px] text-gray-400 mr-2">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or board..."
            className="w-full text-xs sm:text-sm text-black bg-transparent focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-gray-400 hover:text-black cursor-pointer text-sm"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-600">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-gray-300 text-xs p-1.5 focus:outline-none rounded-xs"
          >
            <option value="all">All Categories</option>
            <option value="latest-job">Latest Job</option>
            <option value="teaching">Teaching Jobs</option>
            <option value="admit-card">Admit Card</option>
            <option value="result">Result</option>
            <option value="answer-key">Answer Key</option>
            <option value="syllabus">Syllabus</option>
            <option value="important">Important</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 font-semibold bg-white border border-gray-200">
          Loading notifications...
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-2xs overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-800 border-b border-gray-200">
                <th className="p-3 font-bold uppercase">Status</th>
                <th className="p-3 font-bold uppercase">Recruitment / Notice Title</th>
                <th className="p-3 font-bold uppercase">Category</th>
                <th className="p-3 font-bold uppercase">Organization</th>
                <th className="p-3 font-bold uppercase">Last Date</th>
                <th className="p-3 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-xs cursor-pointer ${
                        item.published
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {item.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-3 max-w-sm">
                    <span className="font-bold text-gray-900 block leading-snug">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Slug: /jobs/{item.slug}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-xs text-[11px] font-bold uppercase">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700 whitespace-nowrap font-medium">
                    {item.organization}
                  </td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">
                    {item.lastDate || 'N/A'}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap space-x-1">
                    {!item.inTrash ? (
                      <>
                        <Link
                          href={`/admin/notifications/${item.id}/edit`}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1 font-bold rounded-xs cursor-pointer inline-block"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleTrash(item.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2.5 py-1 font-bold rounded-xs cursor-pointer"
                        >
                          Trash
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRestore(item.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 font-bold rounded-xs cursor-pointer"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-700 hover:bg-red-800 text-white text-xs px-2.5 py-1 font-bold rounded-xs cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 font-medium">
                    No notifications found for this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
