'use client';

import React from 'react';
import { usePortal } from '../context/PortalContext';
import { openPdfInBrowser, downloadPdfFile } from '../utils/pdfUtils';
import type { NotificationItem } from '@sarkari/shared-types';

interface DetailViewProps {
  item?: NotificationItem;
}

export const DetailView: React.FC<DetailViewProps> = ({ item: propItem }) => {
  const { selectedItem: contextItem, goHome, openCategory } = usePortal();
  const selectedItem = propItem || contextItem;

  if (!selectedItem) {
    return (
      <div className="w-full bg-white p-8 text-center border border-gray-300">
        <p className="text-base text-gray-700 mb-4">Notification details not found.</p>
        <button
          onClick={goHome}
          className="bg-[#ab1818] text-white text-xs font-bold px-4 py-2 uppercase hover:bg-[#8a0c0c] cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const categoryNameMap: Record<string, string> = {
    'result': 'Results',
    'admit-card': 'Admit Cards',
    'latest-job': 'Latest Jobs',
    'teaching': 'Teaching Jobs (UP, Bihar, Jharkhand & All India)',
    'answer-key': 'Answer Keys',
    'syllabus': 'Syllabus',
    'outsourcing': 'Outsourcing Jobs',
    'important': 'Important Updates',
  };

  const categoryLabel = categoryNameMap[selectedItem.category] || 'Jobs & Recruitment';

  return (
    <div className="w-full bg-white border border-[#ab1818] p-3 md:p-6 mb-6 shadow-sm">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-gray-700 mb-3.5 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2.5">
        <button
          onClick={goHome}
          className="text-[#000dff] hover:text-[#ab1818] hover:underline font-bold cursor-pointer"
        >
          Home
        </button>
        <span className="text-gray-400">&gt;</span>
        <button
          onClick={() => openCategory(selectedItem.category)}
          className="text-[#000dff] hover:text-[#ab1818] hover:underline font-bold cursor-pointer"
        >
          {categoryLabel}
        </button>
        <span className="text-gray-400">&gt;</span>
        <span className="text-gray-900 font-extrabold truncate max-w-xs md:max-w-md">
          {selectedItem.title}
        </span>
      </nav>

      {/* Main Title Box */}
      <div className="bg-[#ab1818] text-white p-3.5 sm:p-5 text-center mb-4 sm:mb-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          {selectedItem.statusBadge === 'NEW' && (
            <span className="bg-[#dc2626] text-white text-xs font-black px-3 py-1 rounded-sm uppercase tracking-wider animate-pulse shadow-xs border border-red-300">
              🔥 NEW NOTIFICATION
            </span>
          )}
          {selectedItem.statusBadge === 'ACTIVE' && (
            <span className="bg-[#15803d] text-white text-xs font-black px-3 py-1 rounded-sm uppercase tracking-wider shadow-xs border border-emerald-300">
              ⚡ ACTIVE REGISTRATION (OPEN)
            </span>
          )}
          {selectedItem.statusBadge === 'UPCOMING' && (
            <span className="bg-[#7e22ce] text-white text-xs font-black px-3 py-1 rounded-sm uppercase tracking-wider animate-pulse shadow-xs border border-purple-300">
              ⏳ UPCOMING NOTIFICATION
            </span>
          )}
          {selectedItem.statusBadge === 'OUT' && (
            <span className="bg-[#1d4ed8] text-white text-xs font-black px-3 py-1 rounded-sm uppercase tracking-wider shadow-xs border border-blue-300">
              📢 OUT NOW
            </span>
          )}
          {selectedItem.statusBadge === 'DECLARED' && (
            <span className="bg-[#991b1b] text-white text-xs font-black px-3 py-1 rounded-sm uppercase tracking-wider shadow-xs border border-red-500">
              🎯 RESULT DECLARED
            </span>
          )}
          {selectedItem.statusBadge === 'EXTENDED' && (
            <span className="bg-[#d97706] text-white text-xs font-black px-3 py-1 rounded-sm uppercase tracking-wider shadow-xs border border-amber-300">
              ⏳ LAST DATE EXTENDED
            </span>
          )}
        </div>
        <h1 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight font-serif mb-2 leading-tight">
          {selectedItem.title}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-white/95">
          Organization: <span className="font-black underline">{selectedItem.organization}</span> | State: <span className="font-black">{selectedItem.state}</span>
        </p>
      </div>

      {/* Metadata strip */}
      <div className="bg-[#fee2de] border border-[#f9dcd9] p-3 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <span className="font-bold text-[#850008]">Post Date / Update: </span>
          <span className="font-semibold">{selectedItem.postDate}</span>
        </div>
        <div>
          <span className="font-bold text-[#850008]">Total Vacancy: </span>
          <span className="font-black text-[#001a40]">{selectedItem.totalVacancies}</span>
        </div>
        <div>
          <span className="font-bold text-[#850008]">Qualification: </span>
          <span className="font-semibold">{selectedItem.qualification}</span>
        </div>
      </div>

      {/* Short Info */}
      <div className="mb-5 text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed bg-[#fff0ee] p-3.5 sm:p-4 border-l-4 border-[#ab1818]">
        <strong className="text-[#850008] block mb-1.5 font-bold">Short Description:</strong>
        {selectedItem.shortDescription}
      </div>

      {/* 2-Column Tables: Important Dates & Application Fee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Important Dates */}
        <div className="border border-[#ab1818]">
          <div className="bg-[#ab1818] text-white py-1.5 px-3 text-xs font-bold uppercase font-serif text-center">
            Important Dates
          </div>
          <table className="w-full text-xs divide-y divide-gray-200">
            <tbody>
              <tr className="hover:bg-[#fff0ee]">
                <td className="p-2 font-bold text-gray-700">Application Begin :</td>
                <td className="p-2 text-gray-900 font-bold">{selectedItem.postDate}</td>
              </tr>
              <tr className="hover:bg-[#fff0ee]">
                <td className="p-2 font-bold text-gray-700">Last Date for Apply :</td>
                <td className="p-2 text-[#d32f2f] font-bold">
                  {selectedItem.lastDate || 'As per official schedule'}
                </td>
              </tr>
              <tr className="hover:bg-[#fff0ee]">
                <td className="p-2 font-bold text-gray-700">Last Date Pay Exam Fee :</td>
                <td className="p-2 text-gray-900">
                  {selectedItem.lastDate || 'As per official schedule'}
                </td>
              </tr>
              <tr className="hover:bg-[#fff0ee]">
                <td className="p-2 font-bold text-gray-700">Exam Date :</td>
                <td className="p-2 text-[#000dff] font-bold">
                  {selectedItem.examDate || 'Notified Soon'}
                </td>
              </tr>
              <tr className="hover:bg-[#fff0ee]">
                <td className="p-2 font-bold text-gray-700">Admit Card Available :</td>
                <td className="p-2 text-[#2e7d32] font-bold">
                  {selectedItem.admitCardDate || 'Before Exam'}
                </td>
              </tr>
              {selectedItem.resultDate && (
                <tr className="hover:bg-[#fff0ee]">
                  <td className="p-2 font-bold text-gray-700">Result Announced :</td>
                  <td className="p-2 text-[#850008] font-bold">
                    {selectedItem.resultDate}
                  </td>
                </tr>
              )}
              {selectedItem.answerKeyDate && (
                <tr className="hover:bg-[#fff0ee]">
                  <td className="p-2 font-bold text-gray-700">Answer Key Released :</td>
                  <td className="p-2 text-[#850008] font-bold">
                    {selectedItem.answerKeyDate}
                  </td>
                </tr>
              )}
              {selectedItem.answerKeyCloseDate && (
                <tr className="hover:bg-[#fff0ee]">
                  <td className="p-2 font-bold text-gray-700">Answer Key Last Date (Objection) :</td>
                  <td className="p-2 text-[#ab1818] font-black">
                    {selectedItem.answerKeyCloseDate}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Application Fee */}
        <div className="border border-[#ab1818]">
          <div className="bg-[#ab1818] text-white py-1.5 px-3 text-xs font-bold uppercase font-serif text-center">
            Application Fee
          </div>
          <table className="w-full text-xs divide-y divide-gray-200">
            <tbody>
              <tr className="hover:bg-[#fff0ee]">
                <td className="p-2 font-bold text-gray-700">General / OBC / EWS :</td>
                <td className="p-2 text-gray-900 font-bold">
                  {selectedItem.feeGeneral || '₹0 / Exempted'}
                </td>
              </tr>
              <tr className="hover:bg-[#fff0ee]">
                <td className="p-2 font-bold text-gray-700">SC / ST / PH :</td>
                <td className="p-2 text-gray-900 font-bold">
                  {selectedItem.feeReserved || '₹0 / Nil'}
                </td>
              </tr>
              <tr className="hover:bg-[#fff0ee]">
                <td className="p-2 font-bold text-gray-700">Payment Mode :</td>
                <td className="p-2 text-gray-900 leading-tight">
                  Pay the Examination Fee Through Debit Card, Credit Card, Net Banking or UPI Offline E Challan Mode.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Age Limit Box */}
      <div className="border-2 border-[#ab1818] mb-5 shadow-xs">
        <div className="bg-[#001a40] text-white py-2 px-3 text-xs sm:text-sm font-black uppercase text-center tracking-wide font-serif">
          Age Limit Details (As on {selectedItem.ageAsOnDate || '01/07/2026'})
        </div>
        <div className="p-3.5 sm:p-4 text-xs sm:text-sm grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f8f9fa] divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          <div className="text-center pt-2 sm:pt-0">
            <span className="font-bold text-gray-600 block text-xs uppercase mb-0.5">Minimum Age</span>
            <span className="font-black text-[#850008] text-base sm:text-lg">{selectedItem.ageMin || '18 Years'}</span>
          </div>
          <div className="text-center pt-2 sm:pt-0">
            <span className="font-bold text-gray-600 block text-xs uppercase mb-0.5">Maximum Age</span>
            <span className="font-black text-[#850008] text-base sm:text-lg">{selectedItem.ageMax || '35-40 Years'}</span>
          </div>
          <div className="text-center pt-2 sm:pt-0">
            <span className="font-bold text-gray-600 block text-xs uppercase mb-0.5">Benchmark Date</span>
            <span className="font-black text-[#000066] text-sm sm:text-base">As on {selectedItem.ageAsOnDate || '01/07/2026'}</span>
          </div>
        </div>
        <div className="bg-[#fff0ee] px-3.5 py-2 border-t border-gray-200 text-xs sm:text-sm text-center text-gray-800">
          <span className="font-bold text-[#850008]">Age Relaxation: </span>
          <span>{selectedItem.ageRelaxationNotes || 'Age Relaxation Extra as per Commission Recruitment Rules.'}</span>
        </div>
        {selectedItem.postWiseAgeLimits && (
          <div className="bg-[#f0f4ff] px-3.5 py-2 border-t border-blue-200 text-xs sm:text-sm text-center text-blue-950">
            <span className="font-bold text-[#000066]">Post-Wise Age Limit: </span>
            <span>{selectedItem.postWiseAgeLimits}</span>
          </div>
        )}
      </div>

      {/* Vacancy Details Table */}
      <div className="border border-[#ab1818] mb-4 overflow-x-auto">
        <div className="bg-[#ab1818] text-white py-1.5 px-3 text-xs font-bold uppercase font-serif text-center">
          Vacancy Details Total : {selectedItem.totalVacancies}
        </div>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#001a40] text-white">
              <th className="p-2 border-r border-white/20 font-bold uppercase">Post Name</th>
              <th className="p-2 border-r border-white/20 font-bold uppercase">Total Post</th>
              <th className="p-2 font-bold uppercase">Eligibility Criteria</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-[#fff0ee]">
              <td className="p-2.5 font-bold text-[#850008] border-r border-gray-200">
                {selectedItem.title}
              </td>
              <td className="p-2.5 font-bold text-[#001a40] border-r border-gray-200">
                {selectedItem.totalVacancies}
              </td>
              <td className="p-2.5 text-gray-800 leading-relaxed">
                {selectedItem.eligibility}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Teaching Recruitment Specification */}
      {(selectedItem.category === 'teaching' || selectedItem.teachingLevel || selectedItem.tetRequirement || selectedItem.teachingSubject) && (
        <div className="border-2 border-emerald-700 bg-emerald-50/50 mb-4 p-3.5 sm:p-4 rounded-xs">
          <div className="flex items-center gap-2 border-b border-emerald-300 pb-2 mb-3">
            <span className="material-symbols-outlined text-emerald-800 text-[22px]">school</span>
            <h3 className="text-sm sm:text-base font-black text-emerald-950 uppercase font-serif tracking-tight">
              Teacher Recruitment Specification (शिक्षक पद विवरण एवं TET पात्रता)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-2.5 border border-emerald-200 shadow-2xs">
              <span className="font-bold text-gray-600 block text-[11px] uppercase mb-0.5">Teacher Post Level</span>
              <span className="font-black text-emerald-900 text-sm">
                {selectedItem.teachingLevel || 'PRT / TGT / PGT / Faculty'}
              </span>
            </div>
            <div className="bg-white p-2.5 border border-emerald-200 shadow-2xs">
              <span className="font-bold text-gray-600 block text-[11px] uppercase mb-0.5">TET / Eligibility Requirement</span>
              <span className="font-black text-emerald-900 text-sm">
                {selectedItem.tetRequirement || 'CTET / State TET / STET / NET'}
              </span>
            </div>
            <div className="bg-white p-2.5 border border-emerald-200 shadow-2xs">
              <span className="font-bold text-gray-600 block text-[11px] uppercase mb-0.5">Subject / Discipline</span>
              <span className="font-black text-emerald-900 text-sm">
                {selectedItem.teachingSubject || 'All Subjects / Primary & Secondary'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step by Step How to Apply */}
      {selectedItem.articleContent && (
        <div className="border border-gray-300 p-3.5 sm:p-5 mb-5 bg-white">
          <h2 className="text-base sm:text-lg font-black text-[#850008] uppercase border-b-2 border-[#ab1818] pb-1.5 mb-3 font-serif">
            Important Information &amp; Official Guidelines
          </h2>
          <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line space-y-2">
            {selectedItem.articleContent}
          </div>
        </div>
      )}

      <div className="border border-gray-300 p-3.5 sm:p-4 mb-5 bg-[#fff8f7]">
        <h3 className="text-sm sm:text-base font-bold text-[#850008] uppercase mb-2 border-b border-gray-200 pb-1 font-serif">
          How to Fill Application Form Online
        </h3>
        <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {selectedItem.howToApply ? (
            <li className="list-none whitespace-pre-line">{selectedItem.howToApply}</li>
          ) : (
            <>
              <li>Candidate can apply online by visiting the official commission website through the direct server links below.</li>
              <li>Kindly check and collect all required documents: Eligibility proofs, ID proof, address details, basic candidate biodata.</li>
              <li>Keep ready scanned document copies: Photograph, signature, ID proof, caste certificate, thumb impression, etc.</li>
              <li>Before submitting the application form, carefully preview all columns and verify every typed detail.</li>
              <li>If application fee is applicable, complete the payment transaction before the deadline date.</li>
              <li>Take a final printout of submitted application form for future reference during document verification.</li>
            </>
          )}
        </ol>
      </div>

      {/* Useful Important Links Table */}
      <div className="border-2 border-[#ab1818] mb-5 overflow-x-auto shadow-xs">
        <div className="bg-[#ab1818] text-white py-2 px-4 text-sm sm:text-base font-black uppercase font-serif text-center tracking-wider">
          USEFUL IMPORTANT LINKS
        </div>
        <table className="w-full text-xs sm:text-sm text-left border-collapse divide-y divide-gray-200">
          <tbody>
            <tr className="hover:bg-[#fff0ee] transition-colors">
              <td className="p-3 sm:p-3.5 font-bold text-[#850008] border-r border-gray-200 w-1/2 text-sm sm:text-base">
                Apply Online (Server I)
              </td>
              <td className="p-3 sm:p-3.5">
                <a
                  href={selectedItem.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#cb1d1d] hover:bg-[#a01313] text-white font-black text-xs sm:text-sm px-4 py-1.5 uppercase transition-colors inline-block tracking-wider shadow-xs"
                >
                  CLICK HERE
                </a>
              </td>
            </tr>
            <tr className="hover:bg-[#fff0ee] transition-colors">
              <td className="p-3 sm:p-3.5 font-bold text-[#850008] border-r border-gray-200 text-sm sm:text-base">
                Apply Online (Server II Backup)
              </td>
              <td className="p-3 sm:p-3.5">
                <a
                  href={selectedItem.applyUrlServer2 || selectedItem.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#00386b] hover:bg-[#002244] text-white font-black text-xs sm:text-sm px-4 py-1.5 uppercase transition-colors inline-block tracking-wider shadow-xs"
                >
                  SERVER II
                </a>
              </td>
            </tr>
            {/* Official Answer Key Download / Objection Link */}
            {(selectedItem.category === 'answer-key' || selectedItem.answerKeyUrl) && (
              <tr className="bg-[#fff4f2] border-2 border-[#850008] transition-colors">
                <td className="p-3 sm:p-3.5 font-black text-[#850008] border-r border-gray-200 text-sm sm:text-base">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px] text-[#850008]">key</span>
                    <span>Download Official Answer Key</span>
                  </span>
                </td>
                <td className="p-3 sm:p-3.5">
                  <a
                    href={selectedItem.answerKeyUrl || selectedItem.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#850008] hover:bg-[#ab1818] text-white font-black text-xs sm:text-sm px-4 py-2 uppercase transition-all inline-flex items-center gap-1.5 shadow-xs tracking-wider"
                  >
                    <span>Click Here to View / Download Key</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </td>
              </tr>
            )}

            {/* Direct Objection / Challenge Portal */}
            {selectedItem.objectionUrl && (
              <tr className="bg-[#fff9f0] border-2 border-[#b45309] transition-colors">
                <td className="p-3 sm:p-3.5 font-black text-[#b45309] border-r border-gray-200 text-sm sm:text-base">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px] text-[#b45309]">gavel</span>
                    <span>Submit Question Objection / Challenge Online</span>
                  </span>
                </td>
                <td className="p-3 sm:p-3.5">
                  <a
                    href={selectedItem.objectionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#b45309] hover:bg-[#92400e] text-white font-black text-xs sm:text-sm px-4 py-2 uppercase transition-all inline-flex items-center gap-1.5 shadow-xs tracking-wider"
                  >
                    <span>Click Here to File Objection</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </td>
              </tr>
            )}

            {/* Official Commission Website (Placed right after Apply Online per requested sequence) */}
            <tr className="hover:bg-[#fff0ee] transition-colors">
              <td className="p-3 sm:p-3.5 font-bold text-[#850008] border-r border-gray-200 text-sm sm:text-base">
                Official Commission Website
              </td>
              <td className="p-3 sm:p-3.5">
                <a
                  href={selectedItem.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000dff] hover:text-[#ab1818] hover:underline font-bold text-sm sm:text-base inline-flex items-center gap-1.5"
                >
                  <span>{selectedItem.organization} Official Portal</span>
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                </a>
              </td>
            </tr>

            {/* Download Official Notification PDF */}
            <tr className="hover:bg-[#fff0ee] transition-colors bg-[#fffbfb]">
              <td className="p-3 sm:p-3.5 font-bold text-[#850008] border-r border-gray-200 text-sm sm:text-base">
                Download Official Notification PDF
              </td>
              <td className="p-3 sm:p-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadPdfFile(selectedItem.notificationUrl, `${selectedItem.slug}-official-notification.pdf`)}
                    className="bg-[#ab1818] hover:bg-[#850008] text-white font-bold text-xs sm:text-sm px-3.5 py-1.5 uppercase transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Direct Download PDF to your computer"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download Official PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openPdfInBrowser(selectedItem.notificationUrl, `${selectedItem.slug}-official-notification.pdf`)}
                    className="bg-[#000066] hover:bg-[#001a40] text-white font-bold text-xs sm:text-sm px-3.5 py-1.5 uppercase transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Open PDF cleanly in browser"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>View / Read Online</span>
                  </button>
                </div>
              </td>
            </tr>

            {/* Custom Admin Added Useful Links */}
            {selectedItem.customLinks && selectedItem.customLinks.map((custom) => (
              <tr key={custom.id} className="hover:bg-[#fff0ee] transition-colors">
                <td className="p-3 sm:p-3.5 font-bold text-[#850008] border-r border-gray-200 text-sm sm:text-base">
                  {custom.title}
                </td>
                <td className="p-3 sm:p-3.5">
                  {custom.isButton ? (
                    <a
                      href={custom.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-white font-black text-xs sm:text-sm px-4 py-1.5 uppercase transition-colors inline-block tracking-wider shadow-xs ${
                        custom.buttonColor === 'navy'
                          ? 'bg-[#00386b] hover:bg-[#002244]'
                          : custom.buttonColor === 'green'
                          ? 'bg-[#1b5e20] hover:bg-green-800'
                          : 'bg-[#cb1d1d] hover:bg-[#a01313]'
                      }`}
                    >
                      {custom.actionText || 'CLICK HERE'}
                    </a>
                  ) : (
                    <a
                      href={custom.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#000dff] hover:text-[#ab1818] hover:underline font-bold text-sm sm:text-base"
                    >
                      {custom.actionText || 'Click Here'}
                    </a>
                  )}
                </td>
              </tr>
            ))}

            <tr className="hover:bg-[#fff0ee] transition-colors">
              <td className="p-3 sm:p-3.5 font-bold text-[#1b5e20] border-r border-gray-200 text-sm sm:text-base">
                Join Telegram Channel for Instant Alerts
              </td>
              <td className="p-3 sm:p-3.5">
                <a
                  href={selectedItem.telegramUrl || "https://t.me/getsarkariresultme"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000dff] hover:underline font-bold text-sm sm:text-base"
                >
                  Join Telegram (1.5M+ Members)
                </a>
              </td>
            </tr>
            <tr className="hover:bg-[#fff0ee] transition-colors">
              <td className="p-3 sm:p-3.5 font-bold text-[#1b5e20] border-r border-gray-200 text-sm sm:text-base">
                Join WhatsApp Channel
              </td>
              <td className="p-3 sm:p-3.5">
                <a
                  href={selectedItem.whatsappUrl || "https://whatsapp.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000dff] hover:underline font-bold text-sm sm:text-base"
                >
                  Join WhatsApp (6.3M+ Followers)
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200">
        <button
          onClick={() => openCategory(selectedItem.category)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs sm:text-sm font-bold px-4 py-2 cursor-pointer uppercase flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to {categoryLabel}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="bg-[#001a40] text-white text-xs font-bold px-3 py-1.5 cursor-pointer uppercase hover:bg-black flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Page</span>
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Page link copied to clipboard!');
              }
            }}
            className="bg-[#2e7d32] text-white text-xs font-bold px-3 py-1.5 cursor-pointer uppercase hover:bg-green-800 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
