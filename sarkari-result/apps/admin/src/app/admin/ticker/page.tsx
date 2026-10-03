'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio, Plus, Trash2, Edit2, Globe, ExternalLink,
  CheckCircle2, X, Loader2, Sparkles, ArrowUpRight
} from 'lucide-react';
import { adminApi } from '../../../lib/api/adminApi';
import type { TickerItem } from '@sarkari/shared-types';

interface ExtendedTickerItem extends TickerItem {
  row?: 1 | 2 | 3;
}

const ROWS: { id: 1 | 2 | 3; name: string; delay: string; desc: string }[] = [
  { id: 1, name: 'Row 1 — Top Band', delay: '0.0s delay', desc: 'Primary breaking recruitment alerts' },
  { id: 2, name: 'Row 2 — Middle Band', delay: '-1.5s staggered', desc: 'Admit cards & exam date declarations' },
  { id: 3, name: 'Row 3 — Bottom Band', delay: '-3.0s staggered', desc: 'Results, answer keys & deadlines' },
];

export default function TickerAdminPage() {
  const [tickerItems, setTickerItems] = useState<ExtendedTickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ExtendedTickerItem> | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await adminApi.ticker.list();
      // Ensure row assignment
      const mapped = (data || []).map((t, idx) => ({
        ...t,
        row: ((idx % 3) + 1) as 1 | 2 | 3,
      }));
      setTickerItems(mapped);
    } catch (err: any) {
      console.warn('Ticker load fallback:', err.message);
      setTickerItems([
        { id: 't1', title: 'UP Police Constable 2026 Re-Exam City Details Released', url: '/jobs', active: true, row: 1 },
        { id: 't2', title: 'SSC CGL 2026 Tier 1 Admit Card Out — Download Now', url: '/admit-cards', active: true, row: 1 },
        { id: 't3', title: 'Railway RRB NTPC Graduate Level 8,113 Posts Apply Online', url: '/jobs', active: true, row: 2 },
        { id: 't4', title: 'Bihar BPSC TRE 4.0 Teacher Vacancy Notification Soon', url: '/jobs', active: true, row: 2 },
        { id: 't5', title: 'UPSC CSE Prelims 2026 Scorecard Declared — Check Cut Off', url: '/results', active: true, row: 3 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenNew = (row: 1 | 2 | 3 = 1) => {
    setEditingItem({
      id: `t-${Date.now()}`,
      title: '',
      url: '/jobs',
      row,
      active: true,
      badge: 'LIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExtendedTickerItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim() || !editingItem.url?.trim()) return;

    try {
      setSubmitting(true);
      const exists = tickerItems.some((t) => t.id === editingItem.id);

      if (exists) {
        await adminApi.ticker.update(editingItem.id!, editingItem);
        setTickerItems((prev) =>
          prev.map((t) => (t.id === editingItem.id ? (editingItem as ExtendedTickerItem) : t))
        );
      } else {
        const created = await adminApi.ticker.create({
          title: editingItem.title.trim(),
          url: editingItem.url.trim(),
          badge: editingItem.badge,
        });
        setTickerItems((prev) => [
          { ...(created || editingItem), row: editingItem.row || 1 } as ExtendedTickerItem,
          ...prev,
        ]);
      }

      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save ticker headline to Supabase.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (item: ExtendedTickerItem) => {
    try {
      const nextActive = !item.active;
      await adminApi.ticker.update(item.id, { active: nextActive });
      setTickerItems((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, active: nextActive } : t))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update ticker status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this headline from the moving ticker?')) return;
    try {
      await adminApi.ticker.delete(id);
      setTickerItems((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete ticker item.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#ab1818]" />
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Moving Ticker Headlines</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manages the oscillating 3-row scrolling ticker band on the homepage with staggered animation speeds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
          >
            <Globe className="w-3.5 h-3.5" />
            Live Ticker Preview
            <ArrowUpRight className="w-3 h-3 text-gray-400" />
          </a>

          <button
            onClick={() => handleOpenNew(1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#ab1818] hover:bg-[#850008] rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            + Add Headline
          </button>
        </div>
      </div>

      {/* 3 Row-Organized Cards System */}
      <div className="space-y-5">
        {ROWS.map((rowConfig) => {
          const rowItems = tickerItems.filter((t) => (t.row || 1) === rowConfig.id);

          return (
            <div
              key={rowConfig.id}
              className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden"
            >
              {/* Row Header */}
              <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ab1818]" />
                    <h2 className="text-sm font-bold text-gray-900">{rowConfig.name}</h2>
                    <span className="text-[10px] font-mono text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      {rowConfig.delay}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">({rowItems.length} items)</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{rowConfig.desc}</p>
                </div>

                <button
                  onClick={() => handleOpenNew(rowConfig.id)}
                  className="px-3 py-1.5 text-xs font-bold text-[#ab1818] hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to {rowConfig.name.split('—')[0]}
                </button>
              </div>

              {/* Row Items Table */}
              <div className="divide-y divide-gray-100">
                {rowItems.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs">
                    No ticker headlines in this band. Click "+ Add to {rowConfig.name.split('—')[0]}" to create one!
                  </div>
                ) : (
                  rowItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 sm:px-5 hover:bg-gray-50/80 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => handleToggle(item)}
                          className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform ${
                            item.active ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-gray-300'
                          }`}
                          title={item.active ? 'Click to deactivate' : 'Click to activate'}
                        />

                        <div className="min-w-0 flex-1">
                          <p className={`font-bold line-clamp-1 ${item.active ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                            {item.title}
                          </p>
                          <p className="text-[11px] font-mono text-gray-400 truncate">
                            Target: {item.url}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggle(item)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.active ? 'ACTIVE' : 'PAUSED'}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-base">
                {editingItem.id?.startsWith('t-') ? 'Add Ticker Headline' : 'Edit Ticker Headline'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Headline Text <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. SSC MTS 2026 Tier 1 Answer Key Released — Raise Objections"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#ab1818]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  placeholder="e.g. /jobs or /answer-keys/ssc-mts-2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-[#ab1818]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Ticker Row / Band
                  </label>
                  <select
                    value={editingItem.row || 1}
                    onChange={(e) => setEditingItem({ ...editingItem, row: Number(e.target.value) as 1 | 2 | 3 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value={1}>Row 1 (Top Band)</option>
                    <option value={2}>Row 2 (Middle Band)</option>
                    <option value={3}>Row 3 (Bottom Band)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={editingItem.badge || 'LIVE'}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    placeholder="LIVE, NEW, OUT"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.active ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                    className="w-4 h-4 text-[#ab1818] rounded focus:ring-[#ab1818]"
                  />
                  <span className="text-xs font-bold text-gray-800">
                    Display actively in oscillating marquee
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-sm font-bold text-white bg-[#ab1818] hover:bg-[#850008] disabled:bg-gray-400 rounded-lg shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Save Headline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
