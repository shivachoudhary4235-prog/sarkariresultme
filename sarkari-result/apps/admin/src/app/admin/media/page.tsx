'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/api/adminApi';

interface MediaItem {
  id: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

export default function MediaAdminPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: any = await adminApi.media.list();
      setMediaList(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // 1. Get signed upload URL from backend
      const { signedUrl, storagePath } = await adminApi.media.getUploadUrl({
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      // 2. Upload directly to Supabase storage via PUT
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Direct upload to storage failed');
      }

      // 3. Register media record in DB
      await adminApi.media.create({
        storagePath,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      await fetchMedia();
      alert('File uploaded successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await adminApi.media.delete(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete file');
    }
  };

  const copyUrl = (storagePath: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const url = `${supabaseUrl}/storage/v1/object/public/portal-media/${storagePath}`;
    navigator.clipboard.writeText(url);
    alert('Public URL copied to clipboard:\n' + url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 border border-gray-200 shadow-2xs rounded-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-serif">
            Media &amp; Asset Library
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Upload official examination notification PDFs, syllabus documents, and exam notices to Supabase CDN.
          </p>
        </div>

        <label className="bg-[#ab1818] hover:bg-[#8a0c0c] text-white text-xs sm:text-sm font-bold px-4 py-2 uppercase transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">upload</span>
          <span>{uploading ? 'Uploading...' : 'Upload File (PDF/Image)'}</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
          />
        </label>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500 font-semibold bg-white border border-gray-200">
          Loading media...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600">{error}</div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-2xs rounded-xs overflow-hidden">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-800 border-b border-gray-200">
                <th className="p-3 font-bold uppercase">File Name</th>
                <th className="p-3 font-bold uppercase">Type</th>
                <th className="p-3 font-bold uppercase">Size</th>
                <th className="p-3 font-bold uppercase">Uploaded</th>
                <th className="p-3 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mediaList.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-gray-500">
                      {file.mime_type.includes('pdf') ? 'picture_as_pdf' : 'image'}
                    </span>
                    <span>{file.file_name}</span>
                  </td>
                  <td className="p-3 text-gray-600 font-mono text-xs">
                    {file.mime_type}
                  </td>
                  <td className="p-3 text-gray-600">
                    {(file.size_bytes / 1024).toFixed(1)} KB
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => copyUrl(file.storage_path)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-2.5 py-1 font-bold rounded-xs cursor-pointer"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1 font-bold rounded-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {mediaList.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500">
                    No media files uploaded yet. Click &quot;Upload File&quot; above to store official notice PDFs.
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
