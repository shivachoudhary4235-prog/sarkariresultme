'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/api/adminApi';
import type { FeaturedTile } from '@sarkari/shared-types';

export default function FeaturedAdminPage() {
  const [tiles, setTiles] = useState<FeaturedTile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTile, setEditingTile] = useState<FeaturedTile | null>(null);

  const fetchTiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.featured.list();
      setTiles(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load featured tiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiles();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTile) return;

    try {
      await adminApi.featured.update(editingTile.id, editingTile);
      setTiles((prev) =>
        prev.map((t) => (t.id === editingTile.id ? editingTile : t))
      );
      setEditingTile(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update featured tile');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-serif">
          Featured Action Tiles Manager
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Configure the 8 high-priority hero colored action tiles shown prominently at the top of the homepage.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500 font-semibold bg-white border border-gray-200">
          Loading tiles...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="bg-white border border-gray-200 shadow-2xs rounded-xs p-4 flex flex-col justify-between"
            >
              <div>
                <div
                  style={{ backgroundColor: tile.bgColor }}
                  className="w-full text-white p-4 rounded-xs text-center mb-3 border border-black/10"
                >
                  <span className="font-black text-sm block leading-snug">
                    {tile.title}
                  </span>
                  <span
                    style={{ color: tile.actionColor }}
                    className="text-xs font-black uppercase tracking-wider mt-1 px-2 py-0.5 bg-black/20 inline-block rounded-xs"
                  >
                    {tile.actionText}
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1 mb-4">
                  <div>
                    <span className="font-bold">Target Slug: </span>
                    <span className="font-mono">{tile.slug}</span>
                  </div>
                  <div>
                    <span className="font-bold">Status: </span>
                    <span className={tile.active ? 'text-emerald-700 font-bold' : 'text-gray-500'}>
                      {tile.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditingTile(tile)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 uppercase rounded-xs cursor-pointer shadow-xs"
              >
                Edit Tile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingTile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-5 border border-gray-200 shadow-lg rounded-xs">
            <h3 className="text-base font-black text-gray-900 uppercase font-serif mb-4 pb-2 border-b border-gray-200">
              Edit Action Tile: {editingTile.title}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Tile Title</label>
                <input
                  type="text"
                  required
                  value={editingTile.title}
                  onChange={(e) => setEditingTile({ ...editingTile, title: e.target.value })}
                  className="w-full border border-gray-300 p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Action Button Text</label>
                <input
                  type="text"
                  required
                  value={editingTile.actionText}
                  onChange={(e) => setEditingTile({ ...editingTile, actionText: e.target.value })}
                  className="w-full border border-gray-300 p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Target Slug</label>
                <input
                  type="text"
                  required
                  value={editingTile.slug}
                  onChange={(e) => setEditingTile({ ...editingTile, slug: e.target.value })}
                  className="w-full border border-gray-300 p-2 focus:outline-none font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingTile.bgColor}
                      onChange={(e) => setEditingTile({ ...editingTile, bgColor: e.target.value })}
                      className="w-8 h-8 cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={editingTile.bgColor}
                      onChange={(e) => setEditingTile({ ...editingTile, bgColor: e.target.value })}
                      className="w-full border border-gray-300 p-1.5 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Action Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingTile.actionColor}
                      onChange={(e) => setEditingTile({ ...editingTile, actionColor: e.target.value })}
                      className="w-8 h-8 cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={editingTile.actionColor}
                      onChange={(e) => setEditingTile({ ...editingTile, actionColor: e.target.value })}
                      className="w-full border border-gray-300 p-1.5 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingTile(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase text-xs hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ab1818] hover:bg-[#8a0c0c] text-white px-5 py-2 font-bold uppercase text-xs cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
