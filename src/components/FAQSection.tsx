import React, { useState } from 'react';
import { FAQS } from '../data/seedData';

export const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // Keep first open by default
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      aria-label="Frequently Asked Questions"
      className="w-full bg-white p-3 md:p-4 mb-4 border border-[#d1d5db] shadow-sm"
    >
      <div className="bg-[#ab1818] text-white py-2 px-3.5 mb-3.5 flex items-center justify-between">
        <h2 className="text-base sm:text-lg md:text-xl uppercase font-black tracking-tight font-serif">
          Frequently Asked Questions (FAQ) – Sarkari Result
        </h2>
        <span className="material-symbols-outlined text-[22px]">help_outline</span>
      </div>

      <div className="space-y-2">
        {FAQS.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div key={faq.id} className="bg-[#fff0ee] border border-[#fee2de] shadow-xs">
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className="w-full p-3 sm:p-3.5 text-left flex items-center justify-between gap-3 text-sm sm:text-base md:text-[16px] font-bold text-[#001a40] hover:text-[#850008] transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#850008]' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {isOpen && (
                <div className="px-3.5 pb-3.5 text-xs sm:text-sm md:text-[14.5px] text-gray-800 leading-relaxed border-t border-[#f9dcd9] pt-2.5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
