import React from 'react';

export const SocialBanner: React.FC = () => {
  const channels = [
    { name: 'WhatsApp', count: '6.3M+', unit: 'Followers', color: 'text-[#2e7d32]', href: 'https://whatsapp.com/channel/0029VbDTiYy1dAw2mrPX7a2m' },
    { name: 'Telegram', count: '1.5M+', unit: 'Members', color: 'text-[#004076]', href: 'https://t.me/getsarkariresultme' },
    { name: 'Instagram', count: '640K+', unit: 'Followers', color: 'text-[#c2185b]', href: 'https://instagram.com' },
    { name: 'YouTube', count: '250K+', unit: 'Subscribers', color: 'text-[#d32f2f]', href: 'https://youtube.com' },
    { name: 'Facebook', count: '861K+', unit: 'Likes', color: 'text-[#001a40]', href: 'https://facebook.com' },
    { name: 'X / Twitter', count: '15K+', unit: 'Followers', color: 'text-black', href: 'https://twitter.com' },
    { name: 'Threads', count: '67K+', unit: 'Followers', color: 'text-[#5056ac]', href: 'https://threads.net' },
  ];

  return (
    <section className="w-full bg-[#fff0ee] p-3 mb-4 text-center border border-[#f9dcd9] shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-[#ab1818] text-white px-3.5 py-1.5 mb-2.5 uppercase text-xs sm:text-sm font-bold tracking-wider">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Official Social Media Presence • Over 10M+ Followers</span>
        </div>

        <p className="text-base sm:text-lg font-black text-[#850008] mb-1.5 uppercase font-serif">
          Sarkari Result Official Social Media Channels (Verified as of 2026)
        </p>

        <p className="text-xs sm:text-sm text-gray-700 mb-4 leading-relaxed max-w-2xl mx-auto">
          Stay updated with 100% verified alerts on examinations, admit cards, and application deadlines directly on your smartphone. Avoid counterfeit Telegram channels and fraudulent spam pages.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs sm:text-sm">
          {channels.map((ch, idx) => (
            <a
              key={idx}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-2.5 sm:p-3 border border-gray-200 shadow-xs hover:border-[#ab1818] hover:bg-[#fff8f7] transition-all flex flex-col items-center group cursor-pointer"
            >
              <span className={`font-bold ${ch.color}`}>{ch.name}</span>
              <span className="text-lg sm:text-xl font-black text-[#850008] group-hover:scale-105 transition-transform my-0.5">
                {ch.count}
              </span>
              <span className="text-[11px] sm:text-xs text-gray-600 font-semibold">{ch.unit}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
