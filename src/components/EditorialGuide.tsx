import React from 'react';
import { usePortal } from '../context/PortalContext';

export const EditorialGuide: React.FC = () => {
  const { setSearchQuery, setView } = usePortal();

  const boards = [
    'UPPSC (Uttar Pradesh)',
    'UPSSSC PET',
    'BPSC (Bihar)',
    'BSSC Bihar',
    'SSC CGL / CHSL / MTS',
    'Railway RRB NTPC',
    'MPESB Vyapam',
    'DSSSB Delhi',
    'RPSC Rajasthan',
    'IBPS PO / Clerk / SO',
    'Indian Air Force / Navy',
  ];

  const handleBoardClick = (board: string) => {
    // Extract main board keyword
    const keyword = board.split(' ')[0].replace(/[^a-zA-Z]/g, '');
    setSearchQuery(keyword);
    setView('search');
  };

  return (
    <section
      aria-label="Government Exam Preparation Guide"
      className="w-full bg-white p-3 md:p-4 mb-4 border border-[#d1d5db] shadow-sm"
    >
      {/* Title Header */}
      <div className="bg-[#ab1818] text-white py-2 px-4 mb-3.5 text-center">
        <h2 className="text-base sm:text-lg md:text-xl uppercase font-black tracking-tight font-serif">
          With All the Competition, How Can I Get a Job Working in the Government?
        </h2>
      </div>

      <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed mb-4">
        It is not easy to stand out in the face of fierce national competition with lakhs of applicants per vacancy. But by following these four structured stages and leveraging the unified directories of Sarkari Result, securing your coveted public service posting transforms from a daunting aspiration into tangible career milestones.
      </p>

      {/* 4 Step Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-[#ffe9e6] p-3 sm:p-3.5 flex flex-col border border-[#f9dcd9]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm sm:text-base font-black text-[#850008] uppercase">Step 1</span>
            <span className="material-symbols-outlined text-[#850008] text-[22px]">
              manage_search
            </span>
          </div>
          <h3 className="text-sm font-black text-[#001a40] mb-1.5">
            Examine The Job Requirements
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed flex-1">
            Review the one-page notification summary on Sarkari Result detailing aggregate vacancies, qualification criteria, grade pay, and online forms.
          </p>
        </div>

        <div className="bg-[#ffe9e6] p-3 sm:p-3.5 flex flex-col border border-[#f9dcd9]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm sm:text-base font-black text-[#850008] uppercase">Step 2</span>
            <span className="material-symbols-outlined text-[#850008] text-[22px]">
              fact_check
            </span>
          </div>
          <h3 className="text-sm font-black text-[#001a40] mb-1.5">
            Validate Strict Eligibility
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed flex-1">
            Government recruitments carry firm statutory parameters: candidate age brackets, category relaxation, domicile mandates, and accredited degrees.
          </p>
        </div>

        <div className="bg-[#ffe9e6] p-3 sm:p-3.5 flex flex-col border border-[#f9dcd9]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm sm:text-base font-black text-[#850008] uppercase">Step 3</span>
            <span className="material-symbols-outlined text-[#850008] text-[22px]">
              calendar_month
            </span>
          </div>
          <h3 className="text-sm font-black text-[#001a40] mb-1.5">
            Track Critical Deadlines
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed flex-1">
            Never miss an application cut-off date, Challan payment window, document upload deadline, or exam district rectification period.
          </p>
        </div>

        <div className="bg-[#ffe9e6] p-3 sm:p-3.5 flex flex-col border border-[#f9dcd9]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm sm:text-base font-black text-[#850008] uppercase">Step 4</span>
            <span className="material-symbols-outlined text-[#850008] text-[22px]">
              send
            </span>
          </div>
          <h3 className="text-sm font-black text-[#001a40] mb-1.5">
            Apply Via Official Portals
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed flex-1">
            Use Sarkari Result&apos;s verified direct links to reach the authentic exam board commission portal without landing on spam intermediaries.
          </p>
        </div>
      </div>

      {/* Summary Checklist Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-left text-xs sm:text-sm border border-[#d1d5db] border-collapse">
          <thead>
            <tr className="bg-[#001a40] text-white">
              <th className="py-2.5 px-3 font-bold uppercase text-xs sm:text-[13px]">Notification Feature</th>
              <th className="py-2.5 px-3 font-bold uppercase text-xs sm:text-[13px]">Details Provided by Sarkari Result</th>
              <th className="py-2.5 px-3 font-bold uppercase text-xs sm:text-[13px]">Candidate Action Needed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d1d5db]">
            <tr className="hover:bg-[#fff0ee] transition-colors">
              <td className="py-2 px-3 font-bold text-[#850008]">Number of Vacancies</td>
              <td className="py-2 px-3 text-gray-700">Post-wise, Department-wise, and Category-wise (UR/OBC/EWS/SC/ST) breakup.</td>
              <td className="py-2 px-3 text-gray-800">Match with candidate category reservations.</td>
            </tr>
            <tr className="hover:bg-[#fff0ee] transition-colors">
              <td className="py-2 px-3 font-bold text-[#850008]">Age Limit &amp; Cutoff</td>
              <td className="py-2 px-3 text-gray-700">Min and max age calculations with reference benchmark cut-off dates.</td>
              <td className="py-2 px-3 text-gray-800">Calculate age with permissible government relaxation.</td>
            </tr>
            <tr className="hover:bg-[#fff0ee] transition-colors">
              <td className="py-2 px-3 font-bold text-[#850008]">Fee &amp; Payment Methods</td>
              <td className="py-2 px-3 text-gray-700">Application charges across categories, payment gateways (Net Banking/UPI/Challan).</td>
              <td className="py-2 px-3 text-gray-800">Download and save final fee receipt / transaction ID.</td>
            </tr>
            <tr className="hover:bg-[#fff0ee] transition-colors">
              <td className="py-2 px-3 font-bold text-[#850008]">Syllabus &amp; Exam Scheme</td>
              <td className="py-2 px-3 text-gray-700">Direct PDF download of official negative marking schemes, subjects, and paper patterns.</td>
              <td className="py-2 px-3 text-gray-800">Structure time table as per tier-wise syllabus breakdown.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* State Recruitment Board Tags */}
      <div className="bg-[#fff0ee] p-3 border border-[#f9dcd9]">
        <span className="text-xs sm:text-sm font-bold text-[#850008] uppercase block mb-2">
          Major Covered State &amp; Central Boards:
        </span>
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          {boards.map((b, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleBoardClick(b)}
              className="bg-white px-2.5 py-1.5 text-gray-800 border border-gray-300 shadow-2xs hover:border-[#ab1818] hover:text-[#850008] transition-colors cursor-pointer text-left font-medium"
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
