import React, { useState, useEffect } from 'react';

export const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbDTiYy1dAw2mrPX7a2m';

export const WhatsAppPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-show popup callout once after 2.5 seconds if candidate hasn't dismissed it
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('sr_whatsapp_popup_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore storage exceptions
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setHasInteracted(true);
    try {
      sessionStorage.setItem('sr_whatsapp_popup_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleJoinChannel = () => {
    window.open(WHATSAPP_CHANNEL_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside aria-label="Official WhatsApp Channel Alert" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end font-sans">
      {/* Pop-up Interactive Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="WhatsApp Channel Alert Dialog"
          className="mb-3 w-[calc(100vw-32px)] max-w-[340px] sm:max-w-[360px] bg-white rounded-2xl shadow-2xl border border-emerald-600/30 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* WhatsApp Brand Header */}
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 p-1 flex items-center justify-center shrink-0 border border-white/20">
                <svg
                  className="w-5 h-5 fill-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-10.416c-4.405 0-7.989 3.581-7.99 7.986 0 1.408.365 2.783 1.059 3.992l-1.127 4.119 4.225-1.108c1.169.638 2.489.977 3.839.977 4.411 0 7.991-3.583 7.991-7.988 0-4.406-3.582-7.978-7.997-7.978zm0 14.417c-1.208 0-2.39-.324-3.418-.936l-.244-.146-2.539.666.677-2.473-.16-.254c-.672-1.069-1.027-2.308-1.026-3.578.001-3.548 2.888-6.434 6.438-6.434 3.545 0 6.434 2.888 6.435 6.436 0 3.551-2.888 6.443-6.438 6.443z" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm uppercase tracking-wide">Sarkari Result®</span>
                  <span className="bg-emerald-400 text-[#075E54] text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase flex items-center gap-0.5">
                    ✓ Verified
                  </span>
                </div>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Instant Alerts Desk
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              title="Close alert"
              aria-label="Close WhatsApp alert"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Card Body */}
          <div className="p-4 bg-gradient-to-b from-emerald-50/50 to-white text-gray-800 text-xs sm:text-[13px] space-y-3">
            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs space-y-1.5">
              <div className="font-extrabold text-[#075E54] text-xs sm:text-sm flex items-center gap-1.5">
                <span className="text-base">📢</span>
                <span>Get Instant Job &amp; Result Alerts on WhatsApp!</span>
              </div>
              <p className="text-[11.5px] sm:text-xs text-gray-600 leading-relaxed">
                Join over <strong className="text-emerald-800">6.3 Million+ Aspirants</strong> for direct updates on UP, Bihar, SSC, Railway, UPSC, Teaching, Admit Cards &amp; Results.
              </p>
            </div>

            {/* Key Benefits */}
            <ul className="space-y-1.5 text-[11px] sm:text-xs text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>100% Free &amp; Verified Official Notification Links</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Direct PDF Downloads &amp; Online Apply Links</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Zero Spam — Only Genuine Employment News</span>
              </li>
            </ul>

            {/* Direct Channel CTA Button */}
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] text-[#073b18] hover:text-white font-black py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wide group cursor-pointer"
            >
              <svg
                className="w-5 h-5 fill-current transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-10.416c-4.405 0-7.989 3.581-7.99 7.986 0 1.408.365 2.783 1.059 3.992l-1.127 4.119 4.225-1.108c1.169.638 2.489.977 3.839.977 4.411 0 7.991-3.583 7.991-7.988 0-4.406-3.582-7.978-7.997-7.978zm0 14.417c-1.208 0-2.39-.324-3.418-.936l-.244-.146-2.539.666.677-2.473-.16-.254c-.672-1.069-1.027-2.308-1.026-3.578.001-3.548 2.888-6.434 6.438-6.434 3.545 0 6.434 2.888 6.435 6.436 0 3.551-2.888 6.443-6.438 6.443z" />
              </svg>
              <span>Join Official WhatsApp Channel</span>
            </a>

            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100">
              <span className="font-semibold text-emerald-700">Official Channel ID: 0029VbDTiYy1dAw2mrPX7a2m</span>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) Row */}
      <div className="flex items-center gap-2">
        {/* Interactive Desktop Pill Label */}
        {!isOpen && (
          <button
            onClick={handleToggle}
            className="hidden sm:inline-flex items-center gap-1.5 bg-white text-[#075E54] hover:text-[#128C7E] px-3.5 py-1.5 rounded-full shadow-lg border border-emerald-500/30 text-xs font-black tracking-wide hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>WhatsApp Job Alerts</span>
            <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ml-0.5">
              NEW
            </span>
          </button>
        )}

        {/* Circular Floating WhatsApp Button */}
        <div className="relative group">
          {/* Subtle pulse ring animation */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 blur-xs group-hover:opacity-75 transition duration-500 animate-ping pointer-events-none" />

          {/* Main Button */}
          <button
            onClick={isOpen ? handleDismiss : handleJoinChannel}
            onContextMenu={(e) => {
              e.preventDefault();
              handleToggle();
            }}
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
            title="Join Sarkari Result Official WhatsApp Channel"
            aria-label="Join Sarkari Result Official WhatsApp Channel"
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 fill-white transition-transform group-hover:scale-105"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-10.416c-4.405 0-7.989 3.581-7.99 7.986 0 1.408.365 2.783 1.059 3.992l-1.127 4.119 4.225-1.108c1.169.638 2.489.977 3.839.977 4.411 0 7.991-3.583 7.991-7.988 0-4.406-3.582-7.978-7.997-7.978zm0 14.417c-1.208 0-2.39-.324-3.418-.936l-.244-.146-2.539.666.677-2.473-.16-.254c-.672-1.069-1.027-2.308-1.026-3.578.001-3.548 2.888-6.434 6.438-6.434 3.545 0 6.434 2.888 6.435 6.436 0 3.551-2.888 6.443-6.438 6.443z" />
            </svg>

            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              1
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
