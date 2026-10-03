'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, Plus, Edit2, Trash2, Globe, Eye,
  CheckCircle2, X, Loader2, ArrowUpRight
} from 'lucide-react';
import { adminApi } from '../../../lib/api/adminApi';
import type { FeaturedTile } from '@sarkari/shared-types';

const BG_COLOR_OPTIONS = [
  { label: 'Red (Flash Red)', class: 'bg-[#ab1818]', hex: '#ab1818' },
  { label: 'Navy Blue', class: 'bg-[#00264d]', hex: '#00264d' },
  { label: 'Forest Green', class: 'bg-[#006622]', hex: '#006622' },
  { label: 'Magenta Pink', class: 'bg-[#99004d]', hex: '#99004d' },
  { label: 'Indigo Purple', class: 'bg-[#4b0082]', hex: '#4b0082' },
  { label: 'Vibrant Orange', class: 'bg-[#cc5200]', hex: '#cc5200' },
  { label: 'Deep Crimson', class: 'bg-[#850008]', hex: '#850008' },
  { label: 'Ocean Blue', class: 'bg-[#004d80]', hex: '#004d80' },
];

const SUBTEXT_COLOR_OPTIONS = [
  { label: 'Yellow (Flash Yellow)', color: '#ffe600' },
  { label: 'White', color: '#ffffff' },
  { label: 'Light Pink', color: '#ffb3d9' },
  { label: 'Cyan Blue', color: '#b3ecff' },
];

export default function FlashTilesAdminPage() {
  const [tiles, setTiles] = useState<FeaturedTile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTile, setEditingTile] = useState<FeaturedTile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTiles = async () => {
    try {
      setLoading(true);
      const data = await adminApi.featured.list();
      setTiles(data || []);
    } catch (err: any) {
      console.warn('Failed to load tiles, using defaults:', err.message);
      setTiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiles();
  }, []);

  const handleOpenEdit = (tile: FeaturedTile) => {
    setEditingTile({ ...tile });
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    const nextOrder = tiles.length + 1;
    setEditingTile({
      id: `ft-${Date.now()}`,
      title: '',
      actionText: 'Apply Online',
      bgColor: '#ab1818',
      actionColor: '#ffe600',
      slug: 'jobs',
      active: true,
      sortOrder: nextOrder,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTile || !editingTile.title.trim() || !editingTile.slug.trim()) return;

    try {
      setSubmitting(true);
      await adminApi.featured.update(editingTile.id, editingTile);
      setTiles((prev) => {
        const exists = prev.some((t) => t.id === editingTile.id);
        if (exists) {
          return prev.map((t) => (t.id === editingTile.id ? editingTile : t));
        }
        return [...prev, editingTile];
      });
      setIsModalOpen(false);
      setEditingTile(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update tile in Supabase');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this flash action tile?')) return;
    setTiles((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ab1818]" />
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Flash Tiles Manager</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Configure the 8 colorful highlight buttons displayed directly below the search bar on the public homepage.
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
            Preview on Site
            <ArrowUpRight className="w-3 h-3 text-gray-400" />
          </a>

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#ab1818] hover:bg-[#850008] rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            + Add New Tile
          </button>
        </div>
      </div>

      {/* Live 2x4 Grid Preview */}
      <div className="bg-white p-5 sm:p-6 border border-gray-200 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Live 2×4 Homepage Tile Grid Preview
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            Showing {tiles.filter((t) => t.active).length} of {tiles.length} active
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#ab1818]" />
            Loading flash tiles from Supabase...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {tiles.map((tile, idx) => (
              <div
                key={tile.id || idx}
                style={{ backgroundColor: tile.bgColor }}
                className={`relative rounded-lg p-4 text-center border shadow-xs transition-all flex flex-col justify-between min-h-[110px] ${
                  !tile.active ? 'opacity-40 border-dashed border-gray-400' : 'border-black/10'
                }`}
              >
                {/* Tile Order badge */}
                <div className="absolute top-2 left-2 text-[10px] font-black text-white/80 bg-black/30 px-1.5 py-0.5 rounded">
                  #{tile.sortOrder || idx + 1}
                </div>

                {/* Overlaid edit buttons */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(tile)}
                    className="p-1 bg-white/90 hover:bg-white text-gray-800 rounded shadow-xs text-xs"
                    title="Edit Tile"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(tile.id)}
                    className="p-1 bg-white/90 hover:bg-white text-red-600 rounded shadow-xs text-xs"
                    title="Delete Tile"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Content */}
                <div className="pt-5 pb-2">
                  <p className="text-white font-black text-sm leading-tight drop-shadow-xs line-clamp-2">
                    {tile.title || 'Untitled Tile'}
                  </p>
                  <p
                    style={{ color: tile.actionColor || '#ffe600' }}
                    className="text-[11px] font-black uppercase tracking-wider mt-1 drop-shadow-xs"
                  >
                    {tile.actionText || 'Apply Online'}
                  </p>
                </div>

                <div className="text-[10px] text-white/80 font-mono truncate">
                  /{tile.slug}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && editingTile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingTile.id.startsWith('ft-') ? 'Add Flash Tile' : 'Edit Flash Tile'}
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
                  Main Headline / Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingTile.title}
                  onChange={(e) => setEditingTile({ ...editingTile, title: e.target.value })}
                  placeholder="e.g. UP Police Constable Re-Exam"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#ab1818]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Sub-label / CTA Action Text
                </label>
                <input
                  type="text"
                  required
                  value={editingTile.actionText}
                  onChange={(e) => setEditingTile({ ...editingTile, actionText: e.target.value })}
                  placeholder="e.g. Apply Online or Admit Card"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#ab1818]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Destination URL / Target Slug <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingTile.slug}
                  onChange={(e) => setEditingTile({ ...editingTile, slug: e.target.value })}
                  placeholder="e.g. up-police-constable or /jobs"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-[#ab1818]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Order Index (1-8)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={editingTile.sortOrder || 1}
                    onChange={(e) => setEditingTile({ ...editingTile, sortOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Active Status
                  </label>
                  <select
                    value={editingTile.active ? 'true' : 'false'}
                    onChange={(e) => setEditingTile({ ...editingTile, active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="true">🟢 Active (Visible)</option>
                    <option value="false">⚪ Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Tile Background Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BG_COLOR_OPTIONS.map((bg) => (
                    <button
                      type="button"
                      key={bg.hex}
                      onClick={() => setEditingTile({ ...editingTile, bgColor: bg.hex })}
                      style={{ backgroundColor: bg.hex }}
                      className={`h-9 rounded-lg text-[10px] font-bold text-white flex items-center justify-center border-2 transition-transform ${
                        editingTile.bgColor === bg.hex ? 'border-black scale-105 shadow-sm' : 'border-transparent'
                      }`}
                    >
                      {bg.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Action Subtext Color
                </label>
                <div className="flex gap-2">
                  {SUBTEXT_COLOR_OPTIONS.map((col) => (
                    <button
                      type="button"
                      key={col.color}
                      onClick={() => setEditingTile({ ...editingTile, actionColor: col.color })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        editingTile.actionColor === col.color
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full inline-block mr-1.5 border border-black/20" style={{ backgroundColor: col.color }} />
                      {col.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
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
                  {submitting ? 'Saving...' : 'Save Tile to Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
