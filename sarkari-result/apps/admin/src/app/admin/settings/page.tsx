'use client';

import React, { useState } from 'react';

export default function SettingsAdminPage() {
  const [siteName, setSiteName] = useState('Sarkari Result Me®');
  const [siteUrl, setSiteUrl] = useState('https://www.sarkariresultme.com');
  const [trademarkWord, setTrademarkWord] = useState('4531613');
  const [trademarkDevice, setTrademarkDevice] = useState('5569166');
  const [supportEmail, setSupportEmail] = useState('getsarkarinaukrimeinfo@gmail.com');
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/getsarkariresultme');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-4 sm:p-5 border border-gray-200 shadow-2xs rounded-xs">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-serif">
          Portal Global Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Configure site metadata, registered trademark numbers, and contact channels.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-5 border border-gray-200 shadow-2xs rounded-xs space-y-4 text-xs sm:text-sm">
        <div>
          <label className="font-bold text-gray-700 block mb-1">Official Portal Brand Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full border border-gray-300 p-2 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Canonical Domain URL</label>
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="w-full border border-gray-300 p-2 focus:outline-none font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Trademark Word Mark Reg. No.</label>
            <input
              type="text"
              value={trademarkWord}
              onChange={(e) => setTrademarkWord(e.target.value)}
              className="w-full border border-gray-300 p-2 focus:outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Trademark Device Mark Reg. No.</label>
            <input
              type="text"
              value={trademarkDevice}
              onChange={(e) => setTrademarkDevice(e.target.value)}
              className="w-full border border-gray-300 p-2 focus:outline-none font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Editorial Support Email</label>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Official Telegram Channel</label>
          <input
            type="url"
            value={telegramUrl}
            onChange={(e) => setTelegramUrl(e.target.value)}
            className="w-full border border-gray-300 p-2 focus:outline-none font-mono text-xs"
          />
        </div>

        <div className="pt-3 border-t border-gray-200 text-right">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#ab1818] hover:bg-[#8a0c0c] text-white px-6 py-2 font-bold uppercase text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Site Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
