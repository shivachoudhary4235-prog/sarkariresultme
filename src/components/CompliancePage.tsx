import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { ActiveScreen } from '../types';

interface CompliancePageProps {
  screen: ActiveScreen;
}

export const CompliancePage: React.FC<CompliancePageProps> = ({ screen }) => {
  const { setView, goHome, openCategory, notifications } = usePortal();

  // Contact / Correction form state
  const [formType, setFormType] = useState<'correction' | 'general' | 'business' | 'editorial'>('correction');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPageUrl, setFormPageUrl] = useState('');
  const [formSourceUrl, setFormSourceUrl] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  interface NavItem {
    id: ActiveScreen;
    label: string;
    icon: string;
    pageTitle: string;
    pageDescription: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'about',
      label: 'About Us',
      icon: 'info',
      pageTitle: 'About SarkariResultMe.com',
      pageDescription: 'Independent educational & recruitment information platform for Indian candidates, job aspirants, and students nationwide.',
    },
    {
      id: 'contact',
      label: 'Contact Us',
      icon: 'mail',
      pageTitle: 'Contact Us & Editorial Desk',
      pageDescription: 'Reach our editorial team for corrections, recruitment notices, feedback, advertising, or official communications.',
    },
    {
      id: 'editorial-policy',
      label: 'Editorial Policy',
      icon: 'menu_book',
      pageTitle: 'Editorial & Sourcing Policy',
      pageDescription: 'Our standards for sourcing, fact-checking, and publishing public recruitment advertisements and exam results.',
    },
    {
      id: 'correction-policy',
      label: 'Correction Policy',
      icon: 'rule',
      pageTitle: 'Content Correction Policy',
      pageDescription: 'How we review, verify, and correct recruitment dates, eligibility requirements, and broken external links.',
    },
    {
      id: 'privacy-policy',
      label: 'Privacy Policy',
      icon: 'shield',
      pageTitle: 'Privacy Policy & Disclosures',
      pageDescription: 'Transparency regarding information collection, Google AdSense cookies, analytics, and user privacy protection.',
    },
    {
      id: 'cookie-policy',
      label: 'Cookie Policy',
      icon: 'cookie',
      pageTitle: 'Browser Cookie Policy',
      pageDescription: 'Details on technical, analytical, and advertising cookies used to maintain site performance and relevant features.',
    },
    {
      id: 'terms',
      label: 'Terms & Conditions',
      icon: 'gavel',
      pageTitle: 'Terms & Conditions of Use',
      pageDescription: 'Legal conditions governing the use of SarkariResultMe.com, including exclusive Koderma judicial jurisdiction.',
    },
    {
      id: 'disclaimer',
      label: 'Disclaimer',
      icon: 'verified_user',
      pageTitle: 'Official Non-Affiliation Disclaimer',
      pageDescription: 'Independent platform notification clarifying non-affiliation with government authorities and Koderma jurisdiction.',
    },
    {
      id: 'sitemap',
      label: 'Sitemap',
      icon: 'account_tree',
      pageTitle: 'Directory Sitemap & Index',
      pageDescription: 'Comprehensive navigation index to all public recruitment categories, exam notifications, and portal tools.',
    },
  ];

  const activeMeta = navItems.find((item) => item.id === screen) || navItems[0];

  return (
    <div className="w-full font-sans text-gray-800 pb-10">
      {/* Sleek Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-gray-600 mb-3 flex items-center gap-2">
        <button
          onClick={goHome}
          className="text-[#000dff] hover:text-[#ab1818] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">home</span>
          Home
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500 font-medium">Portal Information</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-extrabold uppercase tracking-wide">
          {activeMeta.label}
        </span>
      </nav>

      {/* Hero Header Banner with Verified Badges */}
      <div className="bg-gradient-to-r from-[#001a40] via-[#0b2752] to-[#850008] text-white p-5 sm:p-7 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5 border border-white/20">
            <span className="material-symbols-outlined text-[15px]">{activeMeta.icon}</span>
            Official Portal Transparency &amp; Compliance Desk
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif uppercase tracking-tight text-white mb-2 leading-tight">
            {activeMeta.pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
            {activeMeta.pageDescription}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3.5 border-t border-white/15 text-[11px] font-medium text-gray-200">
            <span className="bg-black/25 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">verified</span> Independent Educational Platform
            </span>
            <span className="bg-black/25 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-300">gavel</span> Judicial Jurisdiction: Koderma (Jharkhand)
            </span>
            <span className="bg-black/25 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-blue-300">lock_open</span> 100% Free Public Service
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Navigation Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-4 shadow-2xs lg:sticky lg:top-4 space-y-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-gray-500 px-2 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>Information &amp; Legal</span>
                <span className="text-[10px] bg-red-100 text-[#850008] px-2 py-0.5 rounded-full font-bold">9 Pages</span>
              </div>
              {/* Responsive Navigation: Grid on Mobile/Tablet, Vertical on Desktop */}
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
                {navItems.map((item) => {
                  const isActive = screen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-[#850008] text-white shadow-xs font-black'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-[#850008] border border-gray-100 lg:border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`material-symbols-outlined text-[17px] shrink-0 ${isActive ? 'text-amber-300' : 'text-gray-400'}`}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className={`material-symbols-outlined text-[15px] hidden lg:block shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        chevron_right
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legal Jurisdiction Badge Card in Sidebar */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#92400e]">
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                <span>Judicial Jurisdiction</span>
              </div>
              <p className="text-[11px] text-gray-700 leading-snug">
                All legal disputes and claims are subject exclusively to the competent courts of <strong>Koderma, Jharkhand (India)</strong>.
              </p>
              <div className="pt-1 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Legal Desk</span>
                <a
                  href="mailto:getsarkarinaukrimeinfo@gmail.com"
                  className="text-[11px] text-[#000dff] font-bold hover:underline"
                >
                  getsarkarinaukrimeinfo@gmail.com
                </a>
              </div>
            </div>

            {/* Quick Support / Correction Desk */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <span className="material-symbols-outlined text-[16px] text-[#000dff]">support_agent</span>
                <span>Editorial Support</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Found an error or broken link in an exam notification? Report it directly to our desk.
              </p>
              <button
                onClick={() => setView('contact')}
                className="w-full mt-1 bg-white hover:bg-gray-100 text-[#850008] border border-gray-300 font-bold py-1.5 px-2 rounded-md text-[11px] cursor-pointer transition-colors text-center block"
              >
                Submit Correction Report
              </button>
            </div>

            {/* Platform Governance Card in Sidebar */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#001a40] text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <div className="overflow-hidden">
                  <div className="font-black text-gray-900 truncate text-[12px]">Editorial Governance</div>
                  <div className="text-[10px] font-bold text-[#850008] truncate">Independent Public Portal</div>
                  <div className="text-[9px] text-gray-500 truncate">SarkariResultMe.com</div>
                </div>
              </div>
              <p className="text-[10.5px] text-gray-600 leading-snug">
                Dedicated to empowering Indian aspirants with 100% free, verified government career notifications.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Column: Main Content Container */}
        <main className="lg:col-span-8 xl:col-span-9 bg-white border border-gray-200 rounded-xl p-5 sm:p-8 shadow-xs min-w-0">
          {/* =========================================================================
              1. ABOUT US PAGE
          ========================================================================= */}
          {screen === 'about' && (
            <article className="space-y-6 text-sm leading-relaxed text-gray-800">
              <header className="border-b border-gray-200 pb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#850008] uppercase mb-1">
                  <span>Platform Profile</span>
                  <span>•</span>
                  <span>Since 2012</span>
                  <span>•</span>
                  <span>100% Free For All Aspirants</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#850008] uppercase tracking-tight font-serif">
                  About SarkariResultMe.com
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  India's premier independent digital information portal for public recruitment updates, government examination notices, syllabus outlines, and official answer keys.
                </p>
              </header>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-[#fcfdfd] border border-blue-100 p-3.5 rounded-lg flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#001a40] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">public</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase text-[#001a40] mb-0.5">Pan-India Reach</h3>
                    <p className="text-xs text-gray-600 leading-normal">
                      Covering central examinations (UPSC, SSC, Railway, Defense) and state recruitment boards across all 28 states &amp; 8 UTs.
                    </p>
                  </div>
                </div>

                <div className="bg-[#fcfdfd] border border-emerald-100 p-3.5 rounded-lg flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase text-emerald-800 mb-0.5">Gazette-Verified Summaries</h3>
                    <p className="text-xs text-gray-600 leading-normal">
                      Each notification is strictly synthesized from official public gazettes and authorized board notifications.
                    </p>
                  </div>
                </div>

                <div className="bg-[#fcfdfd] border border-amber-100 p-3.5 rounded-lg flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">money_off</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase text-amber-800 mb-0.5">100% Free Public Access</h3>
                    <p className="text-xs text-gray-600 leading-normal">
                      No subscription fees, paywalls, or candidate registration required to browse verified alerts and syllabus PDF links.
                    </p>
                  </div>
                </div>

                <div className="bg-[#fcfdfd] border border-red-100 p-3.5 rounded-lg flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-[#850008] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">gavel</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase text-[#850008] mb-0.5">Koderma Judicial Jurisdiction</h3>
                    <p className="text-xs text-gray-600 leading-normal">
                      Operating with legal clarity with all dispute matters and claims subject exclusively to Koderma Courts, Jharkhand.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission & Purpose */}
              <section className="space-y-3">
                <h3 className="text-base sm:text-lg font-black text-[#001a40] uppercase font-serif border-b border-gray-100 pb-1.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#850008]">flag</span>
                  Our Purpose &amp; Mission
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <strong>SarkariResultMe.com</strong> was created to address a critical hurdle faced by millions of Indian students and job aspirants: <strong>fragmented recruitment information</strong>. In India, public recruitment notices are scattered across hundreds of separate ministry portals, state service commissions, district employment boards, and university portals.
                </p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Our editorial mission is to bring structure, speed, and simplicity to this process by systematically cataloging latest jobs, admit cards, exam results, answer keys, admission forms, and syllabi in an organized, easy-to-read format with direct outbound links to official application gateways.
                </p>
              </section>

              {/* Editorial Integrity & Sourcing */}
              <section className="bg-amber-50/60 border border-amber-200 p-4 sm:p-5 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-[#92400e]">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                  <h3 className="font-black text-sm uppercase">Editorial Sourcing &amp; Candidate Verification Policy</h3>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Every job notification published on this portal undergoes an editorial review based strictly on gazette releases, public recruitment advertisements, and official press announcements published by respective government recruitment commissions (e.g. UPSC, SSC, Railway RRB, State Public Service Commissions).
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  We make no false claims of official affiliation, government partnership, or unverified statistics. Candidates are always advised and directed to verify essential dates, fees, and requirements with the original official recruitment gazette.
                </p>
              </section>

              {/* Editorial Leadership & Public Charter */}
              <section className="border border-slate-200 bg-gradient-to-br from-white via-[#fcfdff] to-[#f4f7fb] p-5 sm:p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[11px] font-black uppercase text-[#850008] tracking-wider block">Platform Leadership</span>
                    <h3 className="text-lg font-serif font-black text-[#001a40] tracking-tight">Editorial &amp; Governance Desk</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                    Independent Public Directory
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <p>
                    <strong>SarkariResultMe.com</strong> operates under strict editorial review standards. Founded with the primary objective of empowering aspirants from tier-1, tier-2, tier-3 cities, and rural India, our desk provides equal, barrier-free access to authenticated government career notifications, official gazette releases, and timely examination guidance.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-gray-600 font-medium">
                    <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1.5 rounded-md shadow-2xs">
                      <span className="material-symbols-outlined text-[15px] text-blue-600">location_on</span>
                      HQ: Koderma, Jharkhand (India)
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1.5 rounded-md shadow-2xs">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">verified_user</span>
                      100% Free Public Service (No Paywalls)
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1.5 rounded-md shadow-2xs">
                      <span className="material-symbols-outlined text-[15px] text-amber-600">policy</span>
                      Gazette-Verified Source Policy
                    </span>
                  </div>
                </div>

                {/* Platform Mission Commitment */}
                <div className="bg-white/90 border-l-4 border-[#850008] p-3.5 rounded-r-lg text-xs text-gray-700 italic leading-relaxed shadow-2xs">
                  &ldquo;Every student and candidate in India, regardless of whether they study in a remote village or a major metropolis, deserves transparent, timely, and free access to public recruitment opportunities without falling prey to commercial paywalls or misleading rumors.&rdquo;
                  <span className="block not-italic font-bold text-[#001a40] mt-1.5 text-[11px]">
                    — SarkariResultMe Editorial &amp; Governance Charter
                  </span>
                </div>
              </section>

              {/* Candidate Safety Advisory */}
              <section className="border-l-4 border-red-500 bg-red-50/40 p-4 rounded-r-lg space-y-1.5 text-xs text-gray-700">
                <h4 className="font-bold text-[#850008] uppercase flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-[17px]">security</span>
                  Candidate Advisory &amp; Anti-Fraud Warning
                </h4>
                <p>
                  SarkariResultMe.com will <strong>never charge candidates any fees</strong> for accessing information or receiving job alerts. Beware of fraudulent agencies asking for money in exchange for employment guarantees. Always apply and submit fees solely on the authorized official government portal referenced in our direct links.
                </p>
              </section>

              {/* Legal Jurisdiction Notice */}
              <section className="border border-gray-200 bg-white p-4 rounded-lg flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-gray-900 uppercase text-[11px] block">Exclusive Legal Forum</span>
                  <p className="text-gray-600 text-xs">
                    All legal matters, disclaimers, and terms are strictly governed under the exclusive jurisdiction of the competent judicial courts at <strong>Koderma, Jharkhand (India)</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setView('terms')}
                  className="shrink-0 bg-[#001a40] hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer uppercase"
                >
                  View Terms
                </button>
              </section>
            </article>
          )}

      {/* =========================================================================
          2. CONTACT US PAGE
      ========================================================================= */}
      {screen === 'contact' && (
        <article className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed text-gray-800">
          <header className="border-b-2 border-[#850008] pb-3">
            <h1 className="text-xl sm:text-3xl font-black text-[#850008] uppercase tracking-tight font-serif">
              Contact Us &amp; Editorial Desk
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              We value your feedback and work continuously to keep SarkariResultMe.com accurate and useful.
            </p>
          </header>

          <p>
            You can contact us for general enquiries, reporting incorrect information, content corrections, technical issues, advertising/business enquiries, or other website-related questions.
          </p>

          {/* Operational Contact Directory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* General */}
            <div className="border border-gray-300 p-4 bg-white shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5 text-[#001a40]">
                <span className="material-symbols-outlined text-[20px]">mail</span>
                <h3 className="font-black text-sm uppercase">General Enquiries</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                For questions about the platform, feedback, or general support:
              </p>
              <a
                href="mailto:getsarkarinaukrimeinfo@gmail.com"
                className="text-[#000dff] hover:underline font-bold text-xs"
              >
                getsarkarinaukrimeinfo@gmail.com
              </a>
            </div>

            {/* Error / Correction */}
            <div className="border border-red-300 p-4 bg-red-50/40 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5 text-[#850008]">
                <span className="material-symbols-outlined text-[20px]">report</span>
                <h3 className="font-black text-sm uppercase">Report an Error / Correction</h3>
              </div>
              <p className="text-xs text-gray-700 mb-2">
                For reporting outdated dates, broken links, or eligibility errors:
              </p>
              <a
                href="mailto:getsarkarinaukrimeinfo@gmail.com"
                className="text-[#850008] hover:underline font-bold text-xs"
              >
                getsarkarinaukrimeinfo@gmail.com
              </a>
            </div>

            {/* Business / Advertising */}
            <div className="border border-gray-300 p-4 bg-white shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5 text-[#001a40]">
                <span className="material-symbols-outlined text-[20px]">campaign</span>
                <h3 className="font-black text-sm uppercase">Business / Advertising</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                For partnership or sponsorship queries:
              </p>
              <a
                href="mailto:getsarkarinaukrimeinfo@gmail.com"
                className="text-[#000dff] hover:underline font-bold text-xs"
              >
                getsarkarinaukrimeinfo@gmail.com
              </a>
            </div>

            {/* Editorial */}
            <div className="border border-gray-300 p-4 bg-white shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5 text-[#001a40]">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                <h3 className="font-black text-sm uppercase">Editorial Desk</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                For recruitment boards and press releases:
              </p>
              <a
                href="mailto:getsarkarinaukrimeinfo@gmail.com"
                className="text-[#000dff] hover:underline font-bold text-xs"
              >
                getsarkarinaukrimeinfo@gmail.com
              </a>
            </div>

            {/* Legal Notices & Judicial Jurisdiction */}
            <div className="border border-amber-300 p-4 bg-amber-50/50 shadow-2xs md:col-span-2">
              <div className="flex items-center gap-2 mb-1.5 text-[#92400e]">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
                <h3 className="font-black text-sm uppercase">Legal Inquiries &amp; Judicial Jurisdiction</h3>
              </div>
              <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                For formal legal communications, statutory notices, or dispute-related matters, contact our legal desk at:{' '}
                <a href="mailto:getsarkarinaukrimeinfo@gmail.com" className="text-[#000dff] hover:underline font-bold">
                  getsarkarinaukrimeinfo@gmail.com
                </a>
              </p>
              <div className="text-xs text-gray-700 bg-white p-2.5 border border-amber-200 rounded-xs">
                <strong>Judicial Jurisdiction Notice:</strong> All legal matters, claims, disputes, notices, and proceedings relating to SarkariResultMe.com are subject to the exclusive jurisdiction of the competent courts in <strong>Koderma, Jharkhand (India)</strong>.
              </div>
            </div>
          </div>

          {/* Correction Submission Guidelines */}
          <div className="bg-[#fff9f8] border border-[#f5c6cb] p-4 space-y-2">
            <h3 className="font-black text-[#850008] text-xs uppercase tracking-wide">
              What to Include When Reporting an Error
            </h3>
            <p className="text-xs text-gray-700">
              To assist our editorial team in verifying and applying corrections quickly, please provide:
            </p>
            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
              <li><strong>Page URL</strong> on SarkariResultMe.com where the error is located</li>
              <li><strong>Information that appears incorrect</strong> (e.g. application last date, fee, eligibility)</li>
              <li><strong>Suggested correction</strong> with accurate details</li>
              <li><strong>Official notification / source link</strong> from the recruiting board or commission</li>
              <li>Supporting screenshot, where relevant</li>
            </ul>
          </div>

          {/* Response Commitment & Editorial Desk */}
          <div className="border border-gray-200 bg-[#fbfcfd] p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-600">
            <div className="w-11 h-11 rounded-lg bg-[#001a40] text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-[22px]">contact_support</span>
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <p className="font-bold text-[#001a40] text-sm">
                Editorial &amp; Verification Desk <span className="font-normal text-xs text-gray-500">— SarkariResultMe.com</span>
              </p>
              <p>
                <strong>Response Time:</strong> We aim to review genuine candidate correction requests and enquiries within a reasonable period.
              </p>
              <p className="text-[11px] text-gray-500">
                Official Correspondence: <a href="mailto:getsarkarinaukrimeinfo@gmail.com" className="text-[#000dff] underline font-semibold">getsarkarinaukrimeinfo@gmail.com</a> | Legal &amp; Compliance: <a href="mailto:getsarkarinaukrimeinfo@gmail.com" className="text-[#000dff] underline font-semibold">getsarkarinaukrimeinfo@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Interactive Form */}
          <section className="bg-white border border-gray-300 p-4 sm:p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-[#001a40] uppercase font-serif">
              Send an Online Message or Correction Request
            </h3>
            {formSubmitted ? (
              <div className="bg-green-50 border border-green-400 text-green-900 p-4 rounded-xs text-xs">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[18px] text-green-700">check_circle</span>
                  <span>Thank you! Your submission has been received.</span>
                </div>
                <p>Our editorial team will review the information against official notifications.</p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-3 text-[#000dff] underline font-bold cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full border border-gray-300 p-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. candidate@example.com"
                      className="w-full border border-gray-300 p-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Inquiry Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full border border-gray-300 p-2 focus:outline-none bg-white font-semibold"
                    >
                      <option value="correction">Report an Error / Correction</option>
                      <option value="general">General Enquiry / Support</option>
                      <option value="business">Advertising / Business</option>
                      <option value="editorial">Editorial / Press Release</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Affected Page URL (if reporting error)</label>
                    <input
                      type="url"
                      value={formPageUrl}
                      onChange={(e) => setFormPageUrl(e.target.value)}
                      placeholder="https://sarkariresultme.com/..."
                      className="w-full border border-gray-300 p-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Official Notification / Source URL (if reporting error)</label>
                  <input
                    type="url"
                    value={formSourceUrl}
                    onChange={(e) => setFormSourceUrl(e.target.value)}
                    placeholder="https://upsssc.gov.in/notice.pdf"
                    className="w-full border border-gray-300 p-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Message / Correction Details</label>
                  <textarea
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Describe your inquiry or the exact information that needs correction..."
                    className="w-full border border-gray-300 p-2 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#850008] hover:bg-[#ab1818] text-white font-bold px-5 py-2 uppercase rounded-xs cursor-pointer transition-colors shadow-xs"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </section>
        </article>
      )}

      {/* =========================================================================
          3. EDITORIAL POLICY PAGE
      ========================================================================= */}
      {screen === 'editorial-policy' && (
        <article className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed text-gray-800">
          <header className="border-b-2 border-[#850008] pb-3">
            <h1 className="text-xl sm:text-3xl font-black text-[#850008] uppercase tracking-tight font-serif">
              Editorial Policy
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Our principles on helpful content, original value, sourcing, and candidate facilitation.
            </p>
          </header>

          <section className="space-y-3">
            <p>
              <strong>SarkariResultMe.com</strong> aims to provide accurate, useful, and clearly presented information relating to government recruitment, examinations, results, admissions, and related opportunities.
            </p>
            <p>
              In accordance with Google Search and Helpful Content principles, we do not copy or scrape government PDFs into raw text. Our editorial process is structured to provide genuine, substantial value to candidates through organized synthesis:
            </p>

            <div className="bg-[#f8f9fa] border border-gray-300 p-4 space-y-2 font-mono text-xs text-gray-700">
              <div className="font-bold text-[#850008] font-sans text-sm">
                Standard Content Pipeline for Every Recruitment Post:
              </div>
              <p>Official Recruitment Notification &rarr; Editorial Review &rarr; Structured Job Summary &rarr; Important Dates &rarr; Eligibility Criteria &rarr; Age Limit &amp; Benchmark Date &rarr; Vacancy Breakdown &rarr; Application Fee &rarr; Selection Procedure &rarr; Exam Pattern / Syllabus &rarr; Step-by-Step How to Apply &rarr; Important Links (Direct Official Notification PDF &amp; Official Board Portal)</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              1. Sourcing Standards
            </h2>
            <p>
              We prioritize primary official sources:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Gazette notifications published by Central and State Ministries</li>
              <li>Official recruitment portals of Central Commissions (UPSC, SSC, RRB, IBPS, NTA)</li>
              <li>State Public Service Commissions (UPPSC, BPSC, MPPSC, RPSC, etc.)</li>
              <li>Official university admission and scholarship notices</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              2. Candidate Verification Responsibility
            </h2>
            <p>
              Important information such as eligibility criteria, application dates, reservation norms, fees, vacancy counts, and examination schedules must always be verified against the original official notification before a candidate submits an application or makes any payment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              3. Ongoing Review and Updates
            </h2>
            <p>
              When recruiting bodies release corrigenda, addenda, deadline extensions, or revised exam dates, our editorial team updates the corresponding article promptly and marks status badges accordingly (e.g. <code>LAST DATE EXTENDED</code>, <code>RESULT DECLARED</code>).
            </p>
          </section>
        </article>
      )}

      {/* =========================================================================
          4. CORRECTION POLICY PAGE
      ========================================================================= */}
      {screen === 'correction-policy' && (
        <article className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed text-gray-800">
          <header className="border-b-2 border-[#850008] pb-3">
            <h1 className="text-xl sm:text-3xl font-black text-[#850008] uppercase tracking-tight font-serif">
              Correction Policy
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              How we review, verify, and correct factual errors reported by candidates and readers.
            </p>
          </header>

          <section className="space-y-3">
            <p>
              We take accuracy seriously. If you believe that any information published on <strong>SarkariResultMe.com</strong> is incorrect, outdated, incomplete, or misleading, please contact our editorial team.
            </p>
            <p>
              We operate a transparent correction protocol to ensure that candidate decisions are based on authentic data.
            </p>
          </section>

          <section className="bg-white border border-gray-300 p-4 space-y-3 shadow-2xs">
            <h2 className="text-base font-black text-[#850008] uppercase font-serif">
              How to Submit a Correction Request
            </h2>
            <p className="text-xs text-gray-600">
              Please email our dedicated corrections desk with the following details:
            </p>
            <div className="bg-gray-50 p-3 border border-gray-200 text-xs space-y-1.5">
              <p><strong>To:</strong> <a href="mailto:getsarkarinaukrimeinfo@gmail.com" className="text-[#000dff] underline font-bold">getsarkarinaukrimeinfo@gmail.com</a></p>
              <p><strong>Subject:</strong> Correction Request: [Title or URL of Post]</p>
              <p><strong>Information in question:</strong> Clearly state what detail is incorrect</p>
              <p><strong>Suggested correction:</strong> State the correct date, fee, post count, or requirement</p>
              <p><strong>Official source link:</strong> URL to the official board notice or corrigendum PDF</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              Editorial Verification &amp; Resolution
            </h2>
            <p>
              Our editorial team will cross-check the submitted information against the official recruitment portal or advertisement. Once verified:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-xs">
              <li>The live recruitment post is updated immediately.</li>
              <li>A correction note or updated date is published where appropriate.</li>
              <li>The submitter receives an acknowledgment once the correction is live.</li>
            </ul>
          </section>
        </article>
      )}

      {/* =========================================================================
          5. PRIVACY POLICY PAGE (GOOGLE ADSENSE AUGUST 2026 COMPLIANT)
      ========================================================================= */}
      {screen === 'privacy-policy' && (
        <article className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed text-gray-800">
          <header className="border-b-2 border-[#850008] pb-3">
            <h1 className="text-xl sm:text-3xl font-black text-[#850008] uppercase tracking-tight font-serif">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Effective Date: October 1, 2026 | Last Updated: October 2026
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              1. Introduction
            </h2>
            <p>
              This Privacy Policy explains how <strong>SarkariResultMe.com</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) collects, uses, and safeguards information when you visit our website. We are committed to candidate privacy and transparency regarding third-party advertising practices.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              2. Information We Collect
            </h2>
            <p>
              We only collect information necessary to operate, protect, and improve our services. We do not require account registration, passwords, or payment details to browse public recruitment alerts. Information collected may include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-xs">
              <li><strong>Device &amp; Browser Information:</strong> IP address, browser type, operating system, and language settings.</li>
              <li><strong>Usage Analytics:</strong> Pages visited, duration of visit, referring website, and access timestamps.</li>
              <li><strong>Voluntary Submissions:</strong> Name, email address, and messages submitted voluntarily through our contact and error-reporting forms.</li>
              <li><strong>Cookies &amp; Local Storage:</strong> Technical cookies and local storage tokens used to preserve candidate preferences (e.g. font size scaling, filter preferences).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              3. How We Use Information
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-xs">
              <li>To provide, operate, and maintain the website.</li>
              <li>To protect against malicious traffic, fraud, or spam submissions.</li>
              <li>To evaluate audience trends and improve user interface performance.</li>
              <li>To respond to user inquiries, correction reports, and editorial submissions.</li>
              <li>To deliver relevant digital advertisements in compliance with publisher standards.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              4. Cookies
            </h2>
            <p>
              Cookies are small data files placed on your device. We use essential cookies to maintain core functionality (such as navigation and user preference settings). Third-party partners may also set cookies for analytics and advertising purposes as detailed below.
            </p>
          </section>

          {/* CRITICAL ADSENSE DISCLOSURE (REQUIRED BY GOOGLE HELP ARTICLE 1348695 & 48182) */}
          <section className="bg-blue-50/70 border-2 border-blue-400 p-4 sm:p-5 rounded-xs space-y-3">
            <div className="flex items-center gap-2 text-[#000066]">
              <span className="material-symbols-outlined text-[22px]">verified</span>
              <h2 className="text-base font-black uppercase font-serif">
                5. Google AdSense &amp; Advertising Disclosures
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-800">
              We may use <strong>Google AdSense</strong> and other third-party advertising partners to display advertisements on SarkariResultMe.com. In compliance with Google Publisher Policies:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-800 space-y-2 pl-2">
              <li>
                <strong>Third-Party Vendor Cookies:</strong> Third-party vendors, including Google, use cookies to serve advertisements based on a user&rsquo;s prior visits to this website or other websites across the Internet.
              </li>
              <li>
                <strong>Personalized Advertising:</strong> Google&rsquo;s use of advertising cookies enables it and its partners to serve advertisements to users based on their visits to SarkariResultMe.com and/or other websites on the Internet.
              </li>
              <li>
                <strong>User Opt-Out:</strong> Users may opt out of personalized advertising by visiting Google&rsquo;s official Ad Settings page at{' '}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000dff] font-bold underline"
                >
                  https://adssettings.google.com/
                </a>.
              </li>
              <li>
                Alternatively, users can opt out of a third-party vendor&rsquo;s use of cookies for personalized advertising by visiting the Network Advertising Initiative or AboutAds choices portal at{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000dff] font-bold underline"
                >
                  https://www.aboutads.info/choices/
                </a>.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              6. Analytics
            </h2>
            <p>
              We may utilize privacy-focused analytics tools to understand aggregate website performance. These tools collect non-personally identifiable telemetry such as page load duration, browser family, and session duration.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              7. External Links to Government Portals
            </h2>
            <p>
              SarkariResultMe.com contains direct outbound hyperlinks to external websites, including government recruitment commissions, public examination boards, universities, and official PDF gazettes. We have no control over the content, terms, or privacy practices of these external websites. Candidates are advised to review the respective privacy statements of each external site visited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              8. Data Security
            </h2>
            <p>
              We implement reasonable technical, administrative, and physical security measures to safeguard server infrastructure against unauthorized access, alteration, or disclosure. However, no electronic transmission over the Internet can be guaranteed as entirely immune from vulnerability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              9. Data Retention
            </h2>
            <p>
              Correspondence sent to our contact and correction inboxes is retained only for the period necessary to resolve the editorial inquiry or as required for administrative records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              10. Children&rsquo;s Privacy
            </h2>
            <p>
              Our website is intended for candidates seeking career, examination, and higher education information. We do not knowingly collect personal information from children under the age of 13.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              11. Changes to this Policy
            </h2>
            <p>
              We reserve the right to revise this Privacy Policy to reflect regulatory, technical, or editorial changes. The latest revision date will always appear at the top of this document.
            </p>
          </section>

          <section className="space-y-2 border-t border-gray-200 pt-3">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              12. Contact for Privacy Inquiries
            </h2>
            <p className="text-xs text-gray-700">
              For any questions or privacy concerns regarding this policy, please reach out to:{' '}
              <a href="mailto:getsarkarinaukrimeinfo@gmail.com" className="text-[#000dff] font-bold underline">
                getsarkarinaukrimeinfo@gmail.com
              </a>
            </p>
          </section>

          <section className="space-y-2 border-t border-gray-200 pt-3">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              13. Governing Law &amp; Exclusive Jurisdiction
            </h2>
            <p className="text-xs text-gray-700">
              This Privacy Policy and any matters, disputes, or proceedings arising out of data practices, privacy, or website usage shall be governed by the laws of India and shall be subject to the exclusive jurisdiction of the competent judicial courts at <strong>Koderma, Jharkhand, India</strong>.
            </p>
          </section>
        </article>
      )}

      {/* =========================================================================
          6. COOKIE POLICY PAGE
      ========================================================================= */}
      {screen === 'cookie-policy' && (
        <article className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed text-gray-800">
          <header className="border-b-2 border-[#850008] pb-3">
            <h1 className="text-xl sm:text-3xl font-black text-[#850008] uppercase tracking-tight font-serif">
              Cookie Policy
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Information on how cookies and browser storage are utilized on SarkariResultMe.com.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              What Are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you browse websites. They are widely used to make websites work efficiently, remember your preferences, and provide analytical information to website operators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              Categories of Cookies We Use
            </h2>
            <div className="space-y-3">
              <div className="border border-gray-200 p-3 bg-gray-50">
                <h3 className="font-bold text-[#850008] text-xs uppercase mb-1">1. Essential Technical Cookies</h3>
                <p className="text-xs text-gray-700">
                  Required for core website navigation, font-size scaling controls, session management, and search query state. These cannot be disabled without affecting site functionality.
                </p>
              </div>

              <div className="border border-gray-200 p-3 bg-gray-50">
                <h3 className="font-bold text-[#850008] text-xs uppercase mb-1">2. Analytical Cookies</h3>
                <p className="text-xs text-gray-700">
                  Enable anonymous aggregation of visitor volume, popular recruitment categories, and page latency to help us optimize server bandwidth during high-traffic exam result days.
                </p>
              </div>

              <div className="border border-gray-200 p-3 bg-gray-50">
                <h3 className="font-bold text-[#850008] text-xs uppercase mb-1">3. Advertising &amp; Third-Party Cookies</h3>
                <p className="text-xs text-gray-700">
                  Utilized by Google AdSense and third-party advertising partners to deliver relevant advertisements and measure ad campaign performance. Users can opt out of personalized ad cookies at{' '}
                  <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#000dff] underline font-bold">Google Ads Settings</a>.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              How You Can Manage Cookies
            </h2>
            <p>
              Most web browsers allow you to control cookie settings through their preferences or settings menu:
            </p>
            <ul className="list-disc list-inside text-xs space-y-1 text-gray-700">
              <li>Google Chrome: Settings &rarr; Privacy and security &rarr; Cookies and other site data</li>
              <li>Mozilla Firefox: Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data</li>
              <li>Apple Safari: Preferences &rarr; Privacy &rarr; Manage Website Data</li>
              <li>Microsoft Edge: Settings &rarr; Cookies and site permissions</li>
            </ul>
          </section>
        </article>
      )}

      {/* =========================================================================
          7. TERMS & CONDITIONS PAGE
      ========================================================================= */}
      {screen === 'terms' && (
        <article className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed text-gray-800">
          <header className="border-b-2 border-[#850008] pb-3">
            <h1 className="text-xl sm:text-3xl font-black text-[#850008] uppercase tracking-tight font-serif">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Please read these terms carefully before accessing or using SarkariResultMe.com.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">1. Acceptance of Terms</h2>
            <p>
              By accessing and using <strong>SarkariResultMe.com</strong>, you agree to comply with and be bound by these Terms and Conditions. If you disagree with any portion of these terms, please discontinue using the portal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">2. Permitted Informational Use</h2>
            <p>
              This website provides educational facilitation, recruitment summaries, syllabus outlines, examination notices, and direct government links for personal, non-commercial informational use by Indian students and job seekers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">3. Accuracy of Information &amp; Official Verification</h2>
            <p>
              While reasonable care is taken to verify recruitment notifications, dates, age criteria, and eligibility from official advertisements, recruitment boards frequently release corrigenda, deadline updates, and fee changes. Candidates are legally responsible for checking the original official notification on the official recruiting portal before submitting an application or paying examination fees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">4. External Portals &amp; Third-Party Services</h2>
            <p>
              SarkariResultMe.com provides links to external government portals, online application forms, PDF notifications, and advertiser sites. We do not endorse, guarantee, or assume responsibility for external content, transaction security, or service availability on third-party domains.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">5. Intellectual Property</h2>
            <p>
              The design, layout, editorial compilations, and portal structure of SarkariResultMe.com are protected by copyright laws. Automated data scraping, bot indexing for malicious mirroring, or unauthorized reproduction of editorial tables without written permission is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">6. Limitation of Liability</h2>
            <p>
              SarkariResultMe.com, its founder, and editorial contributors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website, including missed deadlines, typographical errors, server downtime, or reliance on published summaries.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">7. Governing Law &amp; Exclusive Jurisdiction (Koderma Judicial)</h2>
            <p>
              These Terms and Conditions, and any dispute, controversy, claim, or legal proceeding of whatever nature arising out of or in connection with the access, usage, content, or services of <strong>SarkariResultMe.com</strong> shall be governed by and construed in accordance with the substantive laws of India.
            </p>
            <p>
              It is expressly and irrevocably agreed by the user, visitor, applicant, or any interacting third party that in the event of any legal grievance, dispute, claim, litigation, lawsuit, writ petition, consumer complaint, or judicial proceeding instituted against or concerning SarkariResultMe.com, its management, founders, editors, or operating team, the competent courts having judicial jurisdiction in <strong>Koderma (Jharkhand), India</strong> shall have <strong>sole and exclusive territorial, pecuniary, and subject-matter jurisdiction</strong> to entertain, try, and adjudicate such matters.
            </p>
            <p>
              Users and visitors unconditionally submit to the exclusive jurisdiction of the judicial courts located at Koderma, Jharkhand, and explicitly waive any objections regarding lack of territorial jurisdiction, improper venue, or inconvenient forum (forum non conveniens).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">8. Mandatory Pre-Litigation Grievance Redressal &amp; Notice</h2>
            <p>
              Before instituting any formal judicial proceeding, claim, or lawsuit in any court or forum, an aggrieved party shall serve a written legal notice to the management of SarkariResultMe.com (via registered email at <a href="mailto:getsarkarinaukrimeinfo@gmail.com" className="text-[#000dff] underline font-medium">getsarkarinaukrimeinfo@gmail.com</a>) setting forth full factual particulars, specific grievance, and relief sought.
            </p>
            <p>
              The platform management shall be provided a mandatory window of thirty (30) business days from receipt of such notice to review, investigate, and amicably redress the grievance. Any unresolved dispute following this period may solely be instituted within the exclusive judicial jurisdiction of Koderma, Jharkhand.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">9. Severability &amp; Entire Agreement</h2>
            <p>
              If any provision of these Terms is deemed unlawful, void, or unenforceable by a court of competent jurisdiction in Koderma, Jharkhand, that provision shall be deemed severable and shall not affect the validity and enforceability of any remaining provisions.
            </p>
          </section>
        </article>
      )}

      {/* =========================================================================
          8. DISCLAIMER PAGE
      ========================================================================= */}
      {screen === 'disclaimer' && (
        <article className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed text-gray-800">
          <header className="border-b-2 border-[#850008] pb-3">
            <h1 className="text-xl sm:text-3xl font-black text-[#850008] uppercase tracking-tight font-serif">
              Official Disclaimer
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Important legal disclosure regarding non-affiliation with government authorities.
            </p>
          </header>

          <div className="bg-[#fff0ee] border-2 border-[#850008] p-4 sm:p-5 rounded-xs space-y-3">
            <div className="flex items-center gap-2 text-[#850008]">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <h2 className="text-base sm:text-lg font-black uppercase font-serif">
                Not a Government Entity
              </h2>
            </div>
            <p className="font-semibold text-gray-900 leading-normal">
              SarkariResultMe.com is an independent informational website. It is NOT a government website and is NOT affiliated with, authorized by, or officially connected to any government department, ministry, commission, recruitment board, examination authority, university, or other government organization unless explicitly stated.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-black text-[#001a40] uppercase font-serif">
              Purpose of Published Information
            </h2>
            <p>
              We publish and organize publicly available information relating to government jobs, recruitment advertisements, examinations, results, admit cards, answer keys, admissions, scholarships, and related opportunities for candidate informational purposes only.
            </p>
            <p>
              We make reasonable efforts to present information accurately and keep pages updated. However, recruitment authorities and other organizations may change vacancies, eligibility requirements, examination dates, application deadlines, fees, selection procedures, or other conditions at their discretion without prior notice.
            </p>
          </section>

          <section className="bg-amber-50 border border-amber-300 p-4 space-y-2 text-xs text-amber-900">
            <h3 className="font-black uppercase text-sm">
              Mandatory Candidate Verification Directive
            </h3>
            <p>
              Candidates should <strong>always read the original official notification</strong> and verify all important information on the official website of the relevant authority before applying or making any payment.
            </p>
            <p>
              SarkariResultMe.com does not accept responsibility for losses, missed deadlines, application errors, financial loss, or other consequences arising from reliance on information published on this website.
            </p>
          </section>

          {/* Legal Jurisdiction Clause */}
          <section className="bg-red-50/80 border-2 border-[#850008] p-4 sm:p-5 rounded-xs space-y-3">
            <div className="flex items-center gap-2 text-[#850008]">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
              <h2 className="text-base sm:text-lg font-black uppercase font-serif">
                Exclusive Legal Jurisdiction (Koderma Judicial Courts)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
              If any candidate, visitor, user, organization, or public/private authority initiates, issues, or contemplates any legal notice, claim, consumer complaint, dispute, lawsuit, or judicial proceeding arising out of or regarding SarkariResultMe.com or any content published herein, it is expressly clarified and stipulated that <strong>all such legal matters and proceedings shall be subject strictly and exclusively to the territorial and judicial jurisdiction of the competent courts at Koderma, Jharkhand (India) only</strong>.
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              Users and third parties accessing this platform expressly submit to the exclusive jurisdiction of the competent courts in Koderma, Jharkhand and agree that no court outside Koderma judicial jurisdiction shall have jurisdiction to entertain or adjudicate any legal proceedings against SarkariResultMe.com or its management.
            </p>
          </section>
        </article>
      )}

      {/* =========================================================================
          9. SITEMAP PAGE
      ========================================================================= */}
      {screen === 'sitemap' && (
        <article className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed text-gray-800">
          <header className="border-b-2 border-[#850008] pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-[#850008] uppercase tracking-tight font-serif">
                SarkariResultMe.com — Sitemap
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Complete directory index of all public recruitment categories, portal tools, and compliance pages.
              </p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#850008] bg-red-50 hover:bg-red-100 border border-red-300 px-3 py-1.5 rounded-xs flex items-center gap-1"
            >
              <span>View XML Sitemap</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </header>

          {/* Directory Hubs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Category Hubs */}
            <div className="border border-gray-300 bg-white p-3.5 shadow-2xs space-y-2">
              <h2 className="font-black text-sm text-[#850008] uppercase border-b border-gray-200 pb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">work</span>
                <span>Recruitment Hubs</span>
              </h2>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => openCategory('latest-job')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Latest Government Jobs Online
                  </button>
                </li>
                <li>
                  <button onClick={() => openCategory('teaching')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Teaching Jobs (UP, Bihar, Jharkhand)
                  </button>
                </li>
                <li>
                  <button onClick={() => openCategory('outsourcing')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Outsourcing &amp; Contract Jobs
                  </button>
                </li>
                <li>
                  <button onClick={() => openCategory('admit-card')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Hall Ticket / Admit Cards
                  </button>
                </li>
                <li>
                  <button onClick={() => openCategory('result')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Exam Results &amp; Scorecards
                  </button>
                </li>
                <li>
                  <button onClick={() => openCategory('answer-key')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Answer Keys &amp; Objections
                  </button>
                </li>
                <li>
                  <button onClick={() => openCategory('syllabus')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Syllabus &amp; Exam Patterns
                  </button>
                </li>
                <li>
                  <button onClick={() => openCategory('admission')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Admissions &amp; Counseling
                  </button>
                </li>
                <li>
                  <button onClick={() => openCategory('certificate')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Certificate Verification &amp; Documents
                  </button>
                </li>
                <li>
                  <button onClick={() => openCategory('important')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Important Portals &amp; Scholarships
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal & Compliance */}
            <div className="border border-gray-300 bg-white p-3.5 shadow-2xs space-y-2">
              <h2 className="font-black text-sm text-[#001a40] uppercase border-b border-gray-200 pb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">policy</span>
                <span>Legal &amp; Policy Pages</span>
              </h2>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setView('about')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; About SarkariResultMe.com
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('contact')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Contact Us &amp; Office Desk
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('editorial-policy')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Editorial Policy &amp; Sourcing
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('correction-policy')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Correction Policy &amp; Protocol
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('privacy-policy')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Privacy Policy (AdSense Compliant)
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('cookie-policy')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Cookie Policy &amp; Preferences
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('terms')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('disclaimer')} className="text-[#000dff] hover:underline cursor-pointer">
                    &bull; Non-Government Disclaimer
                  </button>
                </li>
              </ul>
            </div>

            {/* Popular Boards & Tools */}
            <div className="border border-gray-300 bg-white p-3.5 shadow-2xs space-y-2">
              <h2 className="font-black text-sm text-[#001a40] uppercase border-b border-gray-200 pb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">domain</span>
                <span>Major Exam Boards</span>
              </h2>
              <ul className="space-y-1.5 text-xs">
                <li><span className="text-gray-700">&bull; Union Public Service Commission (UPSC)</span></li>
                <li><span className="text-gray-700">&bull; Staff Selection Commission (SSC CGL, CHSL, MTS)</span></li>
                <li><span className="text-gray-700">&bull; Railway Recruitment Board (RRB NTPC, Group D)</span></li>
                <li><span className="text-gray-700">&bull; UP Police Recruitment &amp; Promotion Board (UPPRPB)</span></li>
                <li><span className="text-gray-700">&bull; Uttar Pradesh Subordinate (UPSSSC Lekhpal, PET)</span></li>
                <li><span className="text-gray-700">&bull; Bihar Public Service Commission (BPSC TRE 4.0)</span></li>
                <li><span className="text-gray-700">&bull; National Testing Agency (NTA NEET, JEE, CUET)</span></li>
                <li><span className="text-gray-700">&bull; Central Board of Secondary Education (CTET)</span></li>
              </ul>
            </div>
          </div>

          {/* Published Articles Sample Index */}
          <section className="border border-gray-300 bg-white p-4 space-y-2 shadow-2xs">
            <h2 className="font-black text-sm text-gray-900 uppercase border-b border-gray-200 pb-1">
              Active Published Notifications ({notifications.length} Total)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {notifications.slice(0, 20).map((item) => (
                <div key={item.id} className="truncate">
                  <a
                    href={`/post/${item.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState(null, '', `/post/${item.slug}`);
                      // Trigger detail
                      usePortal;
                    }}
                    className="text-[#000dff] hover:underline"
                  >
                    &bull; {item.title}
                  </a>
                </div>
              ))}
            </div>
          </section>
        </article>
      )}
        </main>
      </div>
    </div>
  );
};
