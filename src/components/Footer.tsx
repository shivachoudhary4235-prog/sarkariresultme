import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';

export const Footer: React.FC = () => {
  const { goHome, openCategory, setSearchQuery, setView } = usePortal();
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const handleBoardSearch = (term: string) => {
    setSearchQuery(term);
    setView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showPolicyModal = (type: 'privacy' | 'disclaimer' | 'contact' | 'terms') => {
    if (type === 'privacy') {
      setModalContent({
        title: 'Privacy Policy - Sarkari Result Me',
        body: 'Sarkari Result Me values candidate privacy. We do not require registration, phone numbers, or credit card details to access examination results, admit cards, or recruitment links. All analytics and server metrics are aggregated anonymously. External official portals operate under their respective privacy policies.',
      });
    } else if (type === 'disclaimer') {
      setModalContent({
        title: 'Disclaimer & Terms - Sarkari Result Me',
        body: 'SarkariResultMe.com is an independent informational aggregator and is NOT an official department of the Government of India or any State Government. All job advertisements, exam dates, syllabus links, and results are published for public facilitation. Candidates must verify original notifications before submitting applications.',
      });
    } else if (type === 'contact') {
      setModalContent({
        title: 'Contact Us & Editorial Office',
        body: 'For press inquiries, editorial corrections, or reporting broken links, reach our administrative desk at: support@sarkariresultme.com or office@sarkariresultme.com. Average response time: 24-48 business hours.',
      });
    } else {
      setModalContent({
        title: 'Terms of Service',
        body: 'By accessing SarkariResultMe.com, you agree to fair informational use. Any automated scraping, trademark infringement, or unauthorized mirroring of our database without written consent is strictly prohibited.',
      });
    }
  };

  return (
    <footer className="w-full bg-[#f4f6f9] border-t-2 border-[#ab1818] mt-6 text-black">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* 4 Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
          {/* Col 1 */}
          <div className="border border-gray-300 bg-white p-3.5 sm:p-4 shadow-2xs">
            <h3 className="text-sm sm:text-base font-black text-[#850008] mb-3 border-b border-gray-200 pb-1.5 uppercase font-serif">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={goHome}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  Sarkari Result Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('latest-job')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  Latest Jobs Online
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('result')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  Exam Results 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('admit-card')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  Hall Ticket / Admit Card
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="border border-gray-300 bg-white p-3.5 sm:p-4 shadow-2xs">
            <h3 className="text-sm sm:text-base font-black text-[#850008] mb-3 border-b border-gray-200 pb-1.5 uppercase font-serif">
              Popular Boards
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleBoardSearch('UPPSC')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  UPPSC Recruitment
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleBoardSearch('SSC')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  SSC CGL / CHSL / MTS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleBoardSearch('Railway')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  Railway RRB NTPC
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleBoardSearch('UPSC')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  UPSC Civil Services
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="border border-gray-300 bg-white p-3.5 sm:p-4 shadow-2xs">
            <h3 className="text-sm sm:text-base font-black text-[#850008] mb-3 border-b border-gray-200 pb-1.5 uppercase font-serif">
              Official Apps
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline font-medium"
                >
                  Download Android App
                </a>
              </li>
              <li>
                <a
                  href="https://apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline font-medium"
                >
                  Download iOS App
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline font-medium"
                >
                  Official Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline font-medium"
                >
                  Facebook Public Group
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="border border-gray-300 bg-white p-3.5 sm:p-4 shadow-2xs">
            <h3 className="text-sm sm:text-base font-black text-[#850008] mb-3 border-b border-gray-200 pb-1.5 uppercase font-serif">
              Legal &amp; About
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => showPolicyModal('privacy')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => showPolicyModal('disclaimer')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  Disclaimer &amp; T&amp;C
                </button>
              </li>
              <li>
                <button
                  onClick={() => showPolicyModal('contact')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  Contact Administrator
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('latest-job')}
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-medium text-left"
                >
                  Sitemap Index
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Trademark Notice Box */}
        <div className="border border-gray-300 bg-white p-4 sm:p-5 text-center mb-5 shadow-2xs">
          <p className="text-sm sm:text-base font-bold text-[#850008] mb-2 uppercase font-serif">
            Trademark &amp; Regulatory Notice
          </p>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2.5">
            Sarkari Result® is a registered trademark under the Government of India Controller General of Patents, Designs &amp; Trade Marks. Unauthorized imitation, reproduction, or commercial repurposing of the platform layout, database, or identity mark is strictly prohibited and subject to legal prosecution under the Indian Copyright &amp; Trademark Act.
          </p>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <strong>Disclaimer:</strong> SarkariResult.com is not an official portal of any Government Department or Board. All data published here is purely for candidate informational facilitation. While every effort has been made to verify data integrity, Sarkari Result shall not be responsible for inadvertent errors in notifications or answer keys.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-xs sm:text-sm text-gray-700 py-3.5 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between gap-3">
          <span>Copyright © 2012-2026 Sarkari Result. All Rights Reserved.</span>
          <div className="flex items-center gap-5">
            <button
              onClick={() => showPolicyModal('terms')}
              className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-semibold"
            >
              Terms of Service
            </button>
            <button
              onClick={() => showPolicyModal('privacy')}
              className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-semibold"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => showPolicyModal('contact')}
              className="text-[#000dff] hover:text-[#ab1818] hover:underline cursor-pointer font-semibold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Policy / Info Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-4 border-2 border-[#ab1818] shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
              <h4 className="text-sm font-bold text-[#850008] uppercase font-serif">
                {modalContent.title}
              </h4>
              <button
                onClick={() => setModalContent(null)}
                className="text-gray-500 hover:text-black font-bold p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mb-4">
              {modalContent.body}
            </p>
            <div className="text-right">
              <button
                onClick={() => setModalContent(null)}
                className="bg-[#ab1818] text-white text-xs font-bold px-4 py-1.5 uppercase hover:bg-[#8a0c0c] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
