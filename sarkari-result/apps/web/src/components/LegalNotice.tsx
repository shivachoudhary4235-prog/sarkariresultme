import React from 'react';

export const LegalNotice: React.FC = () => {
  return (
    <section className="w-full bg-[#fff0ee] p-4 sm:p-5 mb-4 text-center border border-[#f9dcd9] shadow-xs">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-11 h-11 bg-[#850008] text-white rounded-full flex items-center justify-center mb-2.5 shadow-xs">
          <span className="material-symbols-outlined text-[24px]">verified</span>
        </div>
        <h3 className="text-base sm:text-lg font-black text-[#850008] uppercase mb-1.5 font-serif">
          Sarkari Result® – Registered Trademark under Intellectual Property India
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Trademark Word Mark Application No. <strong>4531613</strong> | Device Mark Logo Application No. <strong>5569166</strong>. Sarkari Result (Since 2012) is the premier trusted public resource for government examinations across India.
        </p>
      </div>
    </section>
  );
};
