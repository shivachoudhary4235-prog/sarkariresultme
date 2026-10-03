import React, { useState, useRef } from 'react';
import { usePortal } from '../context/PortalContext';
import { NotificationCategory, NotificationItem, StatusBadgeType, CustomLinkItem } from '../types';
import {
  isoToDisplayDate,
  displayDateToIso,
  getOffsetDateString,
  getOffsetFromDateString,
  getDaysDifference,
  getFormattedDateWithDay,
  checkJobExpirationStatus,
} from '../utils/dateUtils';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from 'recharts';
import { openPdfInBrowser, downloadPdfFile, createPdfBlob } from '../utils/pdfUtils';
import { CompetitorRadar } from './CompetitorRadar';

interface NativeDatePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  quickPills?: { label: string; days?: number; fixed?: string }[];
  helperText?: string;
  allowCustomText?: boolean;
  baseDateForOffset?: string;
  isInvalid?: boolean;
  errorMessage?: string;
}

// Predefined Indian States & Union Territories
const ALL_INDIAN_STATES = [
  'All India',
  'Uttar Pradesh',
  'Bihar',
  'Jharkhand',
  'Delhi NCR',
  'Rajasthan',
  'Madhya Pradesh',
  'Haryana',
  'Punjab',
  'Uttarakhand',
  'West Bengal',
  'Maharashtra',
  'Gujarat',
  'Chhattisgarh',
  'Odisha',
  'Assam',
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Andhra Pradesh',
  'Telangana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Goa',
  'Chandigarh',
  'Tripura',
  'Manipur',
  'Meghalaya',
  'Nagaland',
  'Arunachal Pradesh',
  'Sikkim',
  'Mizoram',
  'Puducherry',
  'Ladakh',
];

// Predefined Minimum Qualifications requested by user
const QUALIFICATION_OPTIONS = [
  '8th Pass',
  '10th Pass',
  '12th Pass',
  'ITI',
  'Diploma',
  'Graduate',
  'Post Graduate',
  'PhD',
  'B.Tech',
  'Medical',
  'Nursing',
  'Teaching',
  'Law',
];

// Researched Recruitment Commissions & Boards
const RECRUITMENT_COMMISSIONS = [
  // Teaching Specific
  { label: 'BPSC Teacher (TRE) - Bihar School Teacher', val: 'BPSC Teacher (TRE)' },
  { label: 'UP Teacher (TGT / PGT / Super TET) - UPESSB', val: 'UP Teacher (TGT/PGT/Super TET)' },
  { label: 'JSSC Teacher (Sahayak Acharya / JTET) - Jharkhand', val: 'JSSC Teacher (Sahayak Acharya)' },
  { label: 'CTET / CBSE - Central Teacher Eligibility Test', val: 'CTET / CBSE' },
  { label: 'KVS - Kendriya Vidyalaya Sangathan (TGT/PGT/PRT)', val: 'KVS (Kendriya Vidyalaya)' },
  { label: 'NVS - Navodaya Vidyalaya Samiti', val: 'NVS (Navodaya Vidyalaya)' },
  { label: 'EMRS - Eklavya Model Residential Schools', val: 'EMRS' },
  { label: 'DSSSB - Delhi Subordinate Services (Teacher / PRT)', val: 'DSSSB' },
  { label: 'NTA UGC NET / CSIR NET (Assistant Professor)', val: 'NTA UGC NET' },

  // Major Central & National
  { label: 'Railway RRB / RRC (NTPC, Group D, ALP, JE)', val: 'Railway RRB / RRC' },
  { label: 'UPSC - Union Public Service Commission', val: 'UPSC' },
  { label: 'SSC - Staff Selection Commission (CGL, CHSL, GD, MTS)', val: 'SSC' },
  { label: 'NEET UG / PG - NTA Medical Entrance', val: 'NTA NEET' },
  { label: 'JEE Main / Advanced - NTA Engineering', val: 'NTA JEE' },
  { label: 'Banking - IBPS / SBI / RBI / NABARD', val: 'Banking (IBPS/SBI/RBI)' },
  { label: 'Defence - Army, Navy, Air Force Agniveer, NDA, CDS', val: 'Indian Defence (Army/Navy/Airforce)' },

  // State Public Service & Selection Commissions
  { label: 'BPSC / BSSC - Bihar Public Service Commission', val: 'BPSC / BSSC (Bihar)' },
  { label: 'UPPSC / UPSSSC - Uttar Pradesh Public Service', val: 'UPPSC / UPSSSC (Uttar Pradesh)' },
  { label: 'JPSC / JSSC - Jharkhand Public Service Commission', val: 'JPSC / JSSC (Jharkhand)' },
  { label: 'RPSC / RSMSSB - Rajasthan Public Service', val: 'RPSC / RSMSSB (Rajasthan)' },
  { label: 'MPPSC / MPESB - Madhya Pradesh Vyapam', val: 'MPPSC / MPESB (Madhya Pradesh)' },
  { label: 'HSSC / HPSC - Haryana Staff Selection', val: 'HSSC / HPSC (Haryana)' },
  { label: 'UKPSC / UKSSSC - Uttarakhand Commission', val: 'UKPSC / UKSSSC' },
  { label: 'State Police Recruitment (UP, Bihar, Jharkhand Police)', val: 'State Police Recruitment Board' },
];

/**
 * Native DatePicker Component
 * Opens the native browser/OS calendar interface reliably on click, ensures valid dates,
 * and formats cleanly to "DD Mon YYYY".
 */
/**
 * Bulletproof DatePicker Component
 * Features an interactive visual calendar popup with month/year navigation, direct text editing,
 * native HTML5 picker trigger, quick presets, and live duration calculations.
 */
const NativeDatePicker: React.FC<NativeDatePickerProps> = ({
  label,
  value,
  onChange,
  required,
  minDate,
  maxDate,
  quickPills,
  helperText,
  allowCustomText = false,
  baseDateForOffset,
  isInvalid,
  errorMessage,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [customTextMode, setCustomTextMode] = useState(false);
  const nativeInputRef = useRef<HTMLInputElement>(null);

  const isoVal = displayDateToIso(value);
  const minIso = minDate ? displayDateToIso(minDate) : undefined;
  const maxIso = maxDate ? displayDateToIso(maxDate) : undefined;

  // Calendar view year and month
  const initialDate = isoVal ? new Date(isoVal + 'T12:00:00') : new Date();
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear() || 2026);
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth() || 9); // 0-indexed (Sep=8, Oct=9)

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Handle direct text typing
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange(raw);
    const parsedIso = displayDateToIso(raw);
    if (parsedIso) {
      const d = new Date(parsedIso + 'T12:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw) {
      onChange(isoToDisplayDate(raw));
      const parts = raw.split('-');
      if (parts.length === 3) {
        setViewYear(parseInt(parts[0], 10));
        setViewMonth(parseInt(parts[1], 10) - 1);
      }
    }
  };

  const selectDay = (day: number) => {
    const monthStr = SHORT_MONTHS[viewMonth];
    const formatted = `${day} ${monthStr} ${viewYear}`;
    onChange(formatted);
    setCalendarOpen(false);
  };

  // Generate calendar grid days
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sun

  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
  const leadingBlanks = [];
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    leadingBlanks.push(prevMonthDays - i);
  }

  const currentMonthDays = [];
  for (let d = 1; d <= daysInMonth; d++) {
    currentMonthDays.push(d);
  }

  // Calculate relative status
  let relativeStatus = '';
  if (isoVal) {
    const target = new Date(isoVal + 'T12:00:00');
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) relativeStatus = 'Today';
    else if (diffDays === 1) relativeStatus = 'Tomorrow';
    else if (diffDays === -1) relativeStatus = 'Yesterday';
    else if (diffDays > 1) relativeStatus = `in ${diffDays} days`;
    else relativeStatus = `${Math.abs(diffDays)} days ago`;
  }

  const formattedDisplay = value ? getFormattedDateWithDay(value) : '';

  return (
    <div className="flex flex-col gap-1.5 relative">
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-800 text-xs flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-red-600 font-black">*</span>}
        </label>
        {allowCustomText && (
          <button
            type="button"
            onClick={() => setCustomTextMode(!customTextMode)}
            className="text-[10px] text-[#000066] hover:text-[#850008] font-bold underline cursor-pointer"
          >
            {customTextMode ? 'Calendar Mode' : 'Custom Status (e.g. Soon)'}
          </button>
        )}
      </div>

      {customTextMode && allowCustomText ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Notified Soon or Before Exam"
            className="flex-1 border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium text-gray-900"
          />
          <button
            type="button"
            onClick={() => setCustomTextMode(false)}
            className="px-2.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold border border-gray-300 cursor-pointer"
          >
            Use Calendar
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* Main Date Input & Trigger Bar */}
          <div
            className={`flex items-center gap-1.5 bg-white border p-1 transition-colors shadow-2xs ${
              isInvalid
                ? 'border-red-500 ring-1 ring-red-400 bg-red-50/20'
                : 'border-gray-300 hover:border-[#850008] focus-within:border-[#850008]'
            }`}
          >
            {/* Calendar Icon Button: Toggles Interactive Visual Calendar */}
            <button
              type="button"
              onClick={() => {
                if (isoVal) {
                  const d = new Date(isoVal + 'T12:00:00');
                  if (!isNaN(d.getTime())) {
                    setViewYear(d.getFullYear());
                    setViewMonth(d.getMonth());
                  }
                }
                setCalendarOpen(!calendarOpen);
              }}
              className="flex items-center gap-1 bg-[#850008] hover:bg-[#ab1818] text-white px-2 py-1.5 rounded-xs cursor-pointer shadow-xs font-bold text-xs transition-colors shrink-0"
              title="Open Interactive Calendar Picker"
            >
              <span className="material-symbols-outlined text-[17px]">calendar_month</span>
              <span className="hidden sm:inline">Pick Date</span>
            </button>

            {/* Direct Text Input for typing or displaying date */}
            <input
              type="text"
              value={value}
              onChange={handleTextChange}
              placeholder="e.g. 28 Oct 2026 or DD/MM/YYYY"
              className="flex-1 min-w-0 text-xs font-bold text-gray-900 px-2 py-1 bg-transparent focus:outline-none placeholder:text-gray-400"
            />

            {/* Native OS date picker trigger */}
            <div className="relative shrink-0 flex items-center">
              <input
                ref={nativeInputRef}
                type="date"
                value={isoVal || ''}
                min={minIso}
                max={maxIso}
                onChange={handleNativeChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                title="Use Browser OS Calendar"
              />
              <span
                onClick={() => {
                  try {
                    nativeInputRef.current?.showPicker?.();
                  } catch {
                    nativeInputRef.current?.focus();
                  }
                }}
                className="text-[11px] bg-gray-100 hover:bg-gray-200 border border-gray-300 px-1.5 py-1 text-gray-700 font-semibold cursor-pointer rounded-xs"
                title="Use Browser Native Picker"
              >
                OS
              </span>
            </div>

            {/* Clear Button */}
            {value && !required && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                title="Clear date"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Formatted Date Preview Badge */}
          {value && (
            <div className="flex items-center justify-between text-[11px] px-1 text-gray-600">
              <span className="font-bold text-[#850008] truncate">
                📅 {formattedDisplay || value}
              </span>
              {relativeStatus && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-xs font-black uppercase bg-[#fee2de] text-[#850008] border border-[#f9dcd9] whitespace-nowrap ml-1">
                  {relativeStatus}
                </span>
              )}
            </div>
          )}

          {/* INTERACTIVE VISUAL CALENDAR POPUP MODAL/DROPDOWN */}
          {calendarOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 bg-white border-2 border-[#850008] shadow-2xl p-3 w-72 sm:w-80 rounded-xs animate-in fade-in">
              {/* Header: Month & Year Selectors with Prev/Next */}
              <div className="flex items-center justify-between gap-1 mb-2 pb-2 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    if (viewMonth === 0) {
                      setViewMonth(11);
                      setViewYear(viewYear - 1);
                    } else {
                      setViewMonth(viewMonth - 1);
                    }
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-700 cursor-pointer font-bold"
                  title="Previous Month"
                >
                  &larr;
                </button>

                <div className="flex items-center gap-1">
                  {/* Month Dropdown */}
                  <select
                    value={viewMonth}
                    onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                    className="text-xs font-bold bg-gray-50 border border-gray-300 p-1 rounded-xs"
                  >
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={idx} value={idx}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {/* Year Dropdown */}
                  <select
                    value={viewYear}
                    onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                    className="text-xs font-bold bg-gray-50 border border-gray-300 p-1 rounded-xs"
                  >
                    {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (viewMonth === 11) {
                      setViewMonth(0);
                      setViewYear(viewYear + 1);
                    } else {
                      setViewMonth(viewMonth + 1);
                    }
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-700 cursor-pointer font-bold"
                  title="Next Month"
                >
                  &rarr;
                </button>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-gray-500 uppercase mb-1">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Leading blanks from previous month */}
                {leadingBlanks.map((b, i) => (
                  <span key={'blank-' + i} className="text-[11px] text-gray-300 p-1.5 select-none">
                    {b}
                  </span>
                ))}

                {/* Days of current month */}
                {currentMonthDays.map((d) => {
                  const checkIso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                  const isSelected = isoVal === checkIso;
                  const isToday =
                    new Date().getDate() === d &&
                    new Date().getMonth() === viewMonth &&
                    new Date().getFullYear() === viewYear;

                  return (
                    <button
                      key={'day-' + d}
                      type="button"
                      onClick={() => selectDay(d)}
                      className={`text-xs p-1.5 font-bold rounded-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#850008] text-white font-black'
                          : isToday
                          ? 'bg-[#fee2de] text-[#850008] border border-[#f9dcd9] font-black'
                          : 'hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              {/* Footer quick action inside popup */}
              <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const todayStr = getOffsetDateString(0);
                    onChange(todayStr);
                    setCalendarOpen(false);
                  }}
                  className="text-[10px] text-[#000066] hover:underline font-black cursor-pointer uppercase"
                >
                  Set to Today
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarOpen(false)}
                  className="text-[10px] text-gray-600 hover:text-black font-bold cursor-pointer uppercase px-2 py-0.5 border border-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Presets */}
      {quickPills && quickPills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mt-0.5">
          <span className="text-[10px] text-gray-500 font-bold">Quick:</span>
          {quickPills.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (pill.fixed) {
                  onChange(pill.fixed);
                } else if (pill.days !== undefined) {
                  if (baseDateForOffset) {
                    onChange(getOffsetFromDateString(baseDateForOffset, pill.days));
                  } else {
                    onChange(getOffsetDateString(pill.days));
                  }
                }
              }}
              className="text-[10px] bg-gray-100 hover:bg-[#fee2de] hover:text-[#850008] border border-gray-300 px-1.5 py-0.5 rounded-xs cursor-pointer transition-colors font-semibold"
            >
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <span className="text-[11px] text-red-600 font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          <span>{errorMessage}</span>
        </span>
      )}

      {/* Helper Text */}
      {helperText && !errorMessage && (
        <span className="text-[10px] text-gray-500 leading-tight">{helperText}</span>
      )}
    </div>
  );
};

export const AdminCMS: React.FC = () => {
  const {
    notifications,
    tickerItems,
    featuredTiles,
    addNotification,
    updateNotification,
    trashNotification,
    restoreNotification,
    permanentDeleteNotification,
    addTickerItem,
    toggleTickerItem,
    deleteTickerItem,
    updateFeaturedTile,
    resetToDefaults,
    goHome,
  } = usePortal();

  type AdminTab =
    | 'dashboard'
    | 'publish'
    | 'content'
    | 'jobs'
    | 'results'
    | 'admit-cards'
    | 'answer-keys'
    | 'syllabus'
    | 'admissions'
    | 'certificates'
    | 'outsourcing'
    | 'important'
    | 'ticker'
    | 'featured'
    | 'radar'
    | 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [successMsg, setSuccessMsg] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  const handleImportToPublish = (title: string, category: NotificationCategory, org: string) => {
    setPubTitle(title);
    setPubCategory(category);
    setPubOrg(org);
    setActiveTab('publish');
    triggerSuccess(`Pre-filled "${title}" into Quick Publish form. Check details and click Publish!`);
  };

  // Quick Publish Form State
  const [pubTitle, setPubTitle] = useState('');
  const [pubCategory, setPubCategory] = useState<NotificationCategory>('latest-job');
  const [pubOrg, setPubOrg] = useState('');
  const [pubState, setPubState] = useState('All India');
  const [pubQual, setPubQual] = useState('');
  const [pubVacancies, setPubVacancies] = useState('');

  // Dates with real calendar support
  const [pubPostDate, setPubPostDate] = useState('28 Sep 2026');
  const [pubLastDate, setPubLastDate] = useState('28 Oct 2026');
  const [pubExamDate, setPubExamDate] = useState('Nov 2026');
  const [pubAdmitDate, setPubAdmitDate] = useState('Before Exam');
  const [pubResultDate, setPubResultDate] = useState('');

  // Answer Key specific fields (Publish Date, Closing/Objection Date, Direct Link)
  const [pubAnswerKeyDate, setPubAnswerKeyDate] = useState('');
  const [pubAnswerKeyCloseDate, setPubAnswerKeyCloseDate] = useState('');
  const [pubAnswerKeyUrl, setPubAnswerKeyUrl] = useState('');
  const [pubObjectionUrl, setPubObjectionUrl] = useState('');

  // Teaching specific fields (PRT/TGT/PGT, Subjects, TET)
  const [pubTeachingLevel, setPubTeachingLevel] = useState('TGT (Trained Graduate Teacher)');
  const [pubTeachingSubject, setPubTeachingSubject] = useState('All Subjects');
  const [pubTetRequirement, setPubTetRequirement] = useState('CTET / State TET (BTET/JTET/UPTET)');

  // Dynamically calculate registration duration difference between Start Date and End Date
  const pubDatesDiff = (pubPostDate && pubLastDate) ? getDaysDifference(pubPostDate, pubLastDate) : null;

  // Fees & Age
  const [pubFeeGen, setPubFeeGen] = useState('₹500');
  const [pubFeeRes, setPubFeeRes] = useState('₹250');
  const [pubAgeMin, setPubAgeMin] = useState('18 Years');
  const [pubAgeMax, setPubAgeMax] = useState('35 Years');
  const [pubAgeAsOnDate, setPubAgeAsOnDate] = useState('01/07/2026');
  const [pubAgeRelaxation, setPubAgeRelaxation] = useState('Age Relaxation Extra as per Official Recruitment Rules');
  const [pubPostWiseAge, setPubPostWiseAge] = useState('');
  const [calcDob, setCalcDob] = useState('2000-01-01');
  const [showAgeCalcHelper, setShowAgeCalcHelper] = useState(false);

  // Helper to calculate candidate age from DOB against benchmark
  const getCalculatedAgeStatus = (dobString: string, benchmarkStr: string, minStr: string, maxStr: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;

    let refDate = new Date();
    if (benchmarkStr) {
      const parts = benchmarkStr.split('/');
      if (parts.length === 3) {
        refDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      } else {
        const parsed = new Date(benchmarkStr);
        if (!isNaN(parsed.getTime())) refDate = parsed;
      }
    }

    let years = refDate.getFullYear() - dob.getFullYear();
    let months = refDate.getMonth() - dob.getMonth();
    let days = refDate.getDate() - dob.getDate();
    if (days < 0) {
      months -= 1;
      days += 30;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const minNum = parseInt(minStr) || 18;
    const maxNum = parseInt(maxStr) || 35;
    const isEligible = years >= minNum && (years < maxNum || (years === maxNum && months === 0 && days === 0));

    return { years, months, days, isEligible, minNum, maxNum };
  };

  const [pubEligibility, setPubEligibility] = useState('');
  const [pubShortDesc, setPubShortDesc] = useState('');

  // Useful Important Links
  const [pubApplyUrl, setPubApplyUrl] = useState('https://upsssc.gov.in/');
  const [pubApplyUrlServer2, setPubApplyUrlServer2] = useState('https://upsssc.gov.in/');
  const [pubNoticeUrl, setPubNoticeUrl] = useState('https://upsssc.gov.in/');
  const [pubOfficialUrl, setPubOfficialUrl] = useState('https://upsssc.gov.in/');
  const [pubTelegramUrl, setPubTelegramUrl] = useState('https://t.me/getsarkariresultme');
  const [pubWhatsappUrl, setPubWhatsappUrl] = useState('https://whatsapp.com/channel/0029VbDTiYy1dAw2mrPX7a2m');

  // PDF Upload / Dropzone State
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');
  const [pdfUploadMode, setPdfUploadMode] = useState<'upload' | 'url'>('upload');
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [editPdfFileName, setEditPdfFileName] = useState('');
  const [editPdfUploadMode, setEditPdfUploadMode] = useState<'upload' | 'url'>('upload');

  const handlePdfUpload = (file: File, isEdit = false) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid .pdf file.');
      return;
    }
    const sizeStr = file.size > 1024 * 1024
      ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      : (file.size / 1024).toFixed(1) + ' KB';

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (isEdit && editingItem) {
        setEditPdfFileName(file.name);
        setEditingItem((prev) => prev ? { ...prev, notificationUrl: dataUrl } : null);
      } else {
        setPdfFileName(file.name);
        setPdfFileSize(sizeStr);
        setPubNoticeUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // PDF Preview In-App Modal State
  const [pdfPreviewModal, setPdfPreviewModal] = useState<{ isOpen: boolean; url: string; fileName: string } | null>(null);

  const handleOpenPdfPreview = (url: string, fileName = 'Official_Notice.pdf') => {
    if (!url) {
      alert('No PDF file attached to preview.');
      return;
    }
    if (url.startsWith('data:')) {
      const blob = createPdfBlob(url);
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        setPdfPreviewModal({ isOpen: true, url: blobUrl, fileName });
        return;
      }
    }
    setPdfPreviewModal({ isOpen: true, url, fileName });
  };

  // Custom Extra Links
  const [pubCustomLinks, setPubCustomLinks] = useState<CustomLinkItem[]>([]);

  // Comprehensive Article Content
  const [pubArticleContent, setPubArticleContent] = useState('');
  const [pubHowToApply, setPubHowToApply] = useState('');
  const [pubStatusBadge, setPubStatusBadge] = useState<StatusBadgeType>('NEW');

  // Edit Notification Modal
  const [editingItem, setEditingItem] = useState<NotificationItem | null>(null);

  // Content Table filters
  const [contentFilter, setContentFilter] = useState<'all' | 'trash'>('all');
  const [contentCategory, setContentCategory] = useState<string>('all');
  const [contentSearch, setContentSearch] = useState('');

  // Ticker Manager State
  const [newTickerTitle, setNewTickerTitle] = useState('');
  const [newTickerUrl, setNewTickerUrl] = useState('');
  const [newTickerBadge, setNewTickerBadge] = useState('NEW');

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddCustomLink = () => {
    const newLink: CustomLinkItem = {
      id: 'custom-link-' + Date.now(),
      title: 'Check Exam District / City Slip',
      url: 'https://upsssc.gov.in/',
      actionText: 'Click Here',
      isButton: false,
      buttonColor: 'default',
    };
    setPubCustomLinks([...pubCustomLinks, newLink]);
  };

  const handleRemoveCustomLink = (id: string) => {
    setPubCustomLinks(pubCustomLinks.filter((l) => l.id !== id));
  };

  const handleUpdateCustomLink = (id: string, updates: Partial<CustomLinkItem>) => {
    setPubCustomLinks(pubCustomLinks.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubOrg.trim()) {
      alert('Please fill at least the Title and Organization / Board');
      return;
    }

    if (!pubPostDate.trim()) {
      alert('Please select a valid Application Started / Post Date using the calendar.');
      return;
    }

    if (!pubLastDate.trim()) {
      alert('Please select a valid Application Last Date using the calendar.');
      return;
    }

    const dateDiff = getDaysDifference(pubPostDate, pubLastDate);
    if (dateDiff !== null && dateDiff < 0) {
      alert(
        `Invalid Date Range: Application Last Date (${pubLastDate}) cannot be earlier than Application Started Date (${pubPostDate})! Please pick a valid end date on the calendar.`
      );
      return;
    }

    const slug =
      pubTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Math.floor(Math.random() * 1000);

    addNotification({
      slug,
      title: pubTitle,
      category: pubCategory,
      organization: pubOrg,
      state: pubState,
      qualification: pubQual || 'Graduate / 10+2',
      totalVacancies: pubVacancies || 'Multiple Posts',
      postDate: pubPostDate,
      lastDate: pubLastDate,
      examDate: pubExamDate,
      admitCardDate: pubAdmitDate,
      resultDate: pubResultDate,
      answerKeyDate: pubAnswerKeyDate,
      answerKeyCloseDate: pubAnswerKeyCloseDate,
      answerKeyUrl: pubAnswerKeyUrl,
      objectionUrl: pubObjectionUrl,
      teachingLevel: pubTeachingLevel,
      teachingSubject: pubTeachingSubject,
      tetRequirement: pubTetRequirement,
      feeGeneral: pubFeeGen,
      feeReserved: pubFeeRes,
      ageMin: pubAgeMin,
      ageMax: pubAgeMax,
      ageAsOnDate: pubAgeAsOnDate,
      ageRelaxationNotes: pubAgeRelaxation,
      postWiseAgeLimits: pubPostWiseAge,
      eligibility: pubEligibility || 'As per official advertisement criteria.',
      shortDescription: pubShortDesc || pubTitle + ' has been published. Check criteria and apply.',
      applyUrl: pubApplyUrl,
      applyUrlServer2: pubApplyUrlServer2,
      notificationUrl: pubNoticeUrl,
      officialUrl: pubOfficialUrl,
      telegramUrl: pubTelegramUrl,
      whatsappUrl: pubWhatsappUrl,
      customLinks: pubCustomLinks,
      articleContent: pubArticleContent,
      howToApply: pubHowToApply,
      statusBadge: pubStatusBadge,
      published: true,
      inTrash: false,
    });

    triggerSuccess(`Successfully published "${pubTitle}"! It is now live on the portal.`);

    // Reset fields
    setPubTitle('');
    setPubOrg('');
    setPubQual('');
    setPubVacancies('');
    setPubEligibility('');
    setPubShortDesc('');
    setPubArticleContent('');
    setPubHowToApply('');
    setPubCustomLinks([]);
    setPubAgeMin('18 Years');
    setPubAgeMax('35 Years');
    setPubAgeAsOnDate('01/07/2026');
    setPubAgeRelaxation('Age Relaxation Extra as per Official Recruitment Rules');
    setPubPostWiseAge('');
    setPubAnswerKeyDate('');
    setPubAnswerKeyCloseDate('');
    setPubAnswerKeyUrl('');
    setPubObjectionUrl('');
    setActiveTab('content');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateNotification(editingItem.id, editingItem);
    setEditingItem(null);
    triggerSuccess(`Updated "${editingItem.title}" successfully.`);
  };

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerTitle.trim()) return;
    addTickerItem(newTickerTitle, newTickerUrl || 'home', newTickerBadge);
    setNewTickerTitle('');
    setNewTickerUrl('');
    triggerSuccess('Added new Breaking Alert ticker item!');
  };

  const handleQuickPinNotification = (notifId: string) => {
    const notif = notifications.find((n) => n.id === notifId);
    if (!notif) return;
    addTickerItem(notif.title + ' (Apply Online / Result Live)', notif.slug, notif.statusBadge || 'NEW');
    triggerSuccess(`Pinned "${notif.title}" directly to the homepage breaking ticker!`);
  };

  // Dashboard Job List Filter & Search
  const [dashboardJobFilter, setDashboardJobFilter] = useState<'all' | 'live' | 'expired'>('all');
  const [dashboardSearch, setDashboardSearch] = useState('');

  // Stats
  const activeCount = notifications.filter((n) => !n.inTrash).length;
  const trashCount = notifications.filter((n) => n.inTrash).length;
  const jobsCount = notifications.filter((n) => n.category === 'latest-job' && !n.inTrash).length;
  const resultsCount = notifications.filter((n) => n.category === 'result' && !n.inTrash).length;
  const admitsCount = notifications.filter((n) => n.category === 'admit-card' && !n.inTrash).length;
  const answerKeysCount = notifications.filter((n) => n.category === 'answer-key' && !n.inTrash).length;
  const syllabusCount = notifications.filter((n) => n.category === 'syllabus' && !n.inTrash).length;
  const admissionsCount = notifications.filter((n) => n.category === 'admission' && !n.inTrash).length;
  const certificatesCount = notifications.filter((n) => n.category === 'certificate' && !n.inTrash).length;
  const outsourcingCount = notifications.filter((n) => n.category === 'outsourcing' && !n.inTrash).length;
  const importantCount = notifications.filter((n) => n.category === 'important' && !n.inTrash).length;
  const flashTilesCount = featuredTiles.length;
  const tickerCount = tickerItems.length;
  const totalCount = activeCount;

  // Filter jobs for live vs expired lifecycle analysis
  const jobItems = notifications.filter(
    (n) => (n.category === 'latest-job' || n.category === 'outsourcing') && !n.inTrash
  );

  const jobsWithLifecycle = jobItems.map((job) => {
    const status = checkJobExpirationStatus(job.lastDate, job.statusBadge);
    return {
      ...job,
      isExpired: status.isExpired,
      statusText: status.statusText,
      daysRemaining: status.daysRemaining,
    };
  });

  const liveJobsList = jobsWithLifecycle.filter((j) => !j.isExpired);
  const expiredJobsList = jobsWithLifecycle.filter((j) => j.isExpired);
  const expiringSoonList = jobsWithLifecycle.filter(
    (j) => !j.isExpired && j.daysRemaining !== null && j.daysRemaining <= 7
  );

  const liveJobsCount = liveJobsList.length;
  const expiredJobsCount = expiredJobsList.length;
  const totalJobsCount = jobsWithLifecycle.length;

  const livePercentage = totalJobsCount > 0 ? Math.round((liveJobsCount / totalJobsCount) * 100) : 0;
  const expiredPercentage = totalJobsCount > 0 ? 100 - livePercentage : 0;

  const doughnutData = [
    {
      name: 'Live Jobs',
      value: liveJobsCount,
      color: '#16a34a',
      percentage: livePercentage,
      description: 'Active application window currently open',
    },
    {
      name: 'Expired Jobs',
      value: expiredJobsCount,
      color: '#dc2626',
      percentage: expiredPercentage,
      description: 'Application deadline concluded / closed',
    },
  ];

  const handleQuickExtendLastDate = (jobId: string, days = 30) => {
    const newDateStr = getOffsetDateString(days);
    updateNotification(jobId, {
      lastDate: newDateStr,
      statusBadge: 'EXTENDED',
    });
    triggerSuccess(`Extended application last date to ${newDateStr} (+${days} days)! Job is now Live.`);
  };

  const filteredDashboardJobs = jobsWithLifecycle.filter((job) => {
    if (dashboardJobFilter === 'live' && job.isExpired) return false;
    if (dashboardJobFilter === 'expired' && !job.isExpired) return false;
    if (dashboardSearch.trim()) {
      const q = dashboardSearch.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.organization.toLowerCase().includes(q) ||
        (job.state && job.state.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const displayList = notifications.filter((item) => {
    if (contentFilter === 'all' && item.inTrash) return false;
    if (contentFilter === 'trash' && !item.inTrash) return false;
    if (contentCategory !== 'all' && item.category !== contentCategory) return false;
    if (contentSearch.trim()) {
      const q = contentSearch.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.organization.toLowerCase().includes(q);
    }
    return true;
  });

  const renderCategoryView = (
    cat: NotificationCategory,
    title: string,
    hindiTitle: string,
    icon: string
  ) => {
    const catItems = notifications.filter((n) => n.category === cat && !n.inTrash);
    const filtered = catItems.filter((item) => {
      if (!categorySearch.trim()) return true;
      const q = categorySearch.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.organization.toLowerCase().includes(q);
    });

    return (
      <div className="space-y-4">
        {/* Category Header */}
        <div className="bg-[#001a40] text-white p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{icon}</span>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight">
                {title} <span className="text-amber-300 font-normal">({hindiTitle})</span>
              </h2>
              <p className="text-[11px] text-gray-300">
                Total {catItems.length} active published entries in this section
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPubCategory(cat);
              setActiveTab('publish');
            }}
            className="bg-[#850008] hover:bg-[#a0000a] text-white text-xs font-bold px-3 py-1.5 uppercase rounded-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            <span>+ Add New {title}</span>
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()} or board...`}
              className="border border-gray-300 p-1.5 text-xs w-64 focus:outline-none bg-white font-medium"
            />
            {categorySearch && (
              <button
                onClick={() => setCategorySearch('')}
                className="text-xs text-gray-500 hover:text-black cursor-pointer font-bold"
              >
                Clear
              </button>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Showing {filtered.length} of {catItems.length} records
          </span>
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto border border-gray-300 shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#001a40] text-white font-bold uppercase text-[11px]">
                <th className="p-2 border-r border-white/20 whitespace-nowrap">Date</th>
                <th className="p-2 border-r border-white/20">Title</th>
                <th className="p-2 border-r border-white/20 whitespace-nowrap">Organization</th>
                <th className="p-2 border-r border-white/20 text-center whitespace-nowrap">Last Date</th>
                <th className="p-2 text-center whitespace-nowrap">Live Direct Links</th>
                <th className="p-2 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-2 font-bold text-gray-600 whitespace-nowrap border-r border-gray-200">
                    {item.postDate || 'N/A'}
                  </td>
                  <td className="p-2 font-bold text-gray-900 border-r border-gray-200 max-w-sm">
                    <div className="line-clamp-2">{item.title}</div>
                    {item.statusBadge && (
                      <span className="mt-1 inline-block bg-[#850008] text-white text-[9px] font-black px-1.5 py-0.5 uppercase rounded-xs">
                        {item.statusBadge}
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-gray-600 border-r border-gray-200 whitespace-nowrap">
                    {item.organization}
                  </td>
                  <td className="p-2 font-bold text-[#850008] border-r border-gray-200 whitespace-nowrap text-center">
                    {item.lastDate || 'N/A'}
                  </td>
                  <td className="p-2 text-center border-r border-gray-200 whitespace-nowrap space-x-1.5">
                    {item.applyUrl ? (
                      <a
                        href={item.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300 rounded-xs text-[10px] font-bold"
                      >
                        <span>Portal</span>
                        <span>↗</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 text-[10px]">—</span>
                    )}
                    {item.notificationUrl ? (
                      <a
                        href={item.notificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-xs text-[10px] font-bold"
                      >
                        <span>Download</span>
                        <span>📥</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 text-[10px]">—</span>
                    )}
                  </td>
                  <td className="p-2 text-center whitespace-nowrap space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setEditPdfFileName(
                          item.notificationUrl?.startsWith('data:')
                            ? `${item.slug}-notification.pdf`
                            : item.notificationUrl?.toLowerCase().endsWith('.pdf')
                            ? item.notificationUrl.split('/').pop() || 'official_notice.pdf'
                            : ''
                        );
                        setEditPdfUploadMode(item.notificationUrl?.startsWith('data:') ? 'upload' : 'url');
                      }}
                      className="text-[#000dff] hover:underline font-bold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        trashNotification(item.id);
                        triggerSuccess(`Moved "${item.title}" to trash.`);
                      }}
                      className="text-red-600 hover:underline font-bold cursor-pointer"
                    >
                      Trash
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    No {title.toLowerCase()} found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Admin CMS Sub-header Strip */}
      <div className="bg-[#f0f4f8] text-gray-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-[#ab1818] text-white font-black text-[11px] tracking-wider uppercase shadow-2xs">
            ADMIN CMS
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs sm:text-sm font-black text-gray-900 uppercase">
              PORTAL CONTROL CENTER
            </span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-[11px] sm:text-xs text-gray-600 font-medium">
              Manage Live Jobs, Results, Admit Cards & Portal Settings
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goHome}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded border border-gray-300 shadow-2xs transition-colors cursor-pointer"
          >
            <span className="text-green-600 text-sm">🌐</span>
            <span>Return to Public Site</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-gray-300 text-xs font-bold text-gray-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-gray-900 font-bold">Admin Active</span>
          </div>
        </div>
      </div>

      {/* Success alert message */}
      {successMsg && (
        <div className="bg-green-100 border-b border-green-500 text-green-900 px-4 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-green-700 text-[18px]">check_circle</span>
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-green-800 hover:text-black cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-60px)]">
        {/* Left Sidebar (240px / w-60) */}
        <aside className="w-full md:w-60 bg-white border-r border-gray-200 p-3 sm:p-4 flex flex-col justify-between shrink-0 shadow-2xs">
          <div>
            <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase px-2 py-1.5 mb-1">
              PORTAL CONTROL CENTER
            </div>
            <nav className="space-y-0.5 text-xs">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'publish', label: 'Quick Publish', icon: '📝' },
                { id: 'jobs', label: 'Manage Jobs', icon: '💼' },
                { id: 'results', label: 'Manage Results', icon: '🏆' },
                { id: 'admit-cards', label: 'Admit Cards', icon: '🎫' },
                { id: 'answer-keys', label: 'Answer Keys', icon: '🔑' },
                { id: 'syllabus', label: 'Syllabus', icon: '📚' },
                { id: 'admissions', label: 'Admissions', icon: '🏫' },
                { id: 'certificates', label: 'Certificates', icon: '📜' },
                { id: 'outsourcing', label: 'Outsourcing Jobs', icon: '🏢' },
                { id: 'important', label: 'Important Links', icon: '📌' },
                { id: 'featured', label: 'Flash Tiles', icon: '⚡' },
                { id: 'ticker', label: 'Moving Ticker', icon: '📡' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-[#000066] font-bold border-l-3 border-[#850008]'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={goHome}
                className="w-full text-left px-2.5 py-1.5 rounded-sm font-semibold flex items-center gap-2 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
              >
                <span className="text-sm">🌐</span>
                <span>Public Site</span>
              </button>
            </nav>
          </div>

          {/* Instant Sync alert box at bottom of sidebar */}
          <div className="mt-6 p-2.5 bg-[#fdf6f5] border border-[#f5c6cb] rounded-xs text-center">
            <div className="flex items-center justify-center gap-1 text-[#850008] font-bold text-xs">
              <span>⚡</span>
              <span>Instant Sync</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-1 leading-tight font-medium">
              Every edit, add, or delete made in this admin panel updates the public homepage immediately!
            </p>
          </div>
        </aside>

        {/* Right Main Body */}
        <div className="flex-1 p-3 sm:p-5 bg-white min-w-0">

      {/* TAB 1: DASHBOARD (SCREENSHOT-MATCHED COMMAND CENTER) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Top Command Center Card */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#001a40] tracking-tight uppercase">
                PORTAL COMMAND CENTER
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Complete administration for <strong className="text-gray-700">Sarkari Result Me</strong> (sarkariresultme.com). Direct portal &amp; download link management active.
              </p>
            </div>
            <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
              <button
                type="button"
                onClick={goHome}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xs flex items-center gap-1.5 border border-gray-300 transition-colors cursor-pointer"
              >
                <span className="text-sky-600">🌐</span>
                <span>Open Public Site</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('publish')}
                className="px-3.5 py-1.5 bg-[#850008] hover:bg-[#a0000a] text-white text-xs font-bold rounded-xs flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
              >
                <span>+ Quick Publish</span>
              </button>
            </div>
          </div>

          {/* 12 Stat Cards (6 x 2 Grid matching screenshot) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {/* 1. LATEST JOBS */}
            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className="bg-[#1e7e34] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{jobsCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">LATEST JOBS</span>
            </button>

            {/* 2. EXAM RESULTS */}
            <button
              type="button"
              onClick={() => setActiveTab('results')}
              className="bg-[#0056b3] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{resultsCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">EXAM RESULTS</span>
            </button>

            {/* 3. ADMIT CARDS */}
            <button
              type="button"
              onClick={() => setActiveTab('admit-cards')}
              className="bg-[#b02a37] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{admitsCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">ADMIT CARDS</span>
            </button>

            {/* 4. ANSWER KEYS */}
            <button
              type="button"
              onClick={() => setActiveTab('answer-keys')}
              className="bg-[#3d5a80] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{answerKeysCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">ANSWER KEYS</span>
            </button>

            {/* 5. SYLLABUS */}
            <button
              type="button"
              onClick={() => setActiveTab('syllabus')}
              className="bg-[#0d6efd] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{syllabusCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">SYLLABUS</span>
            </button>

            {/* 6. ADMISSIONS */}
            <button
              type="button"
              onClick={() => setActiveTab('admissions')}
              className="bg-[#6f42c1] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{admissionsCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">ADMISSIONS</span>
            </button>

            {/* 7. CERTIFICATES */}
            <button
              type="button"
              onClick={() => setActiveTab('certificates')}
              className="bg-[#b07d62] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{certificatesCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">CERTIFICATES</span>
            </button>

            {/* 8. OUTSOURCING */}
            <button
              type="button"
              onClick={() => setActiveTab('outsourcing')}
              className="bg-[#d97706] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{outsourcingCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">OUTSOURCING</span>
            </button>

            {/* 9. IMPORTANT */}
            <button
              type="button"
              onClick={() => setActiveTab('important')}
              className="bg-[#dc3545] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{importantCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">IMPORTANT</span>
            </button>

            {/* 10. FLASH TILES */}
            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className="bg-[#d63384] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{flashTilesCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">FLASH TILES</span>
            </button>

            {/* 11. TICKER HEADLINES */}
            <button
              type="button"
              onClick={() => setActiveTab('ticker')}
              className="bg-[#6610f2] hover:brightness-105 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{tickerCount}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">TICKER HEADLINES</span>
            </button>

            {/* 12. TOTAL CONTENT */}
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className="bg-[#0a1128] hover:brightness-110 text-white p-3 rounded-xs text-center flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs"
            >
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 text-sm font-bold">✓</span>
                <span className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{totalCount}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider">TOTAL CONTENT</span>
            </button>
          </div>

          {/* Two-Column Split: Recently Updated Entries & Quick Direct Access */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column (7 cols on lg, approx 58%) */}
            <div className="lg:col-span-7 border border-gray-300 rounded-xs overflow-hidden shadow-2xs">
              {/* Burgundy Header */}
              <div className="bg-[#850008] text-white px-3.5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs">📰</span>
                  <span className="text-xs font-black uppercase tracking-wider">RECENTLY UPDATED ENTRIES</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('publish')}
                  className="text-[11px] font-bold uppercase hover:underline cursor-pointer tracking-wider"
                >
                  + ADD NEW
                </button>
              </div>

              {/* Entries list matching screenshot */}
              <div className="bg-white divide-y divide-gray-200">
                {notifications.filter((n) => !n.inTrash).slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 sm:px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        onClick={() => {
                          setEditingItem(item);
                          setEditPdfFileName(
                            item.notificationUrl?.startsWith('data:')
                              ? `${item.slug}-notification.pdf`
                              : item.notificationUrl?.toLowerCase().endsWith('.pdf')
                              ? item.notificationUrl.split('/').pop() || 'official_notice.pdf'
                              : ''
                          );
                          setEditPdfUploadMode(item.notificationUrl?.startsWith('data:') ? 'upload' : 'url');
                        }}
                        className="font-bold text-gray-900 text-xs sm:text-sm hover:text-[#850008] cursor-pointer truncate"
                        title={item.title}
                      >
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>
                          {item.category === 'latest-job' && '💼 Job'}
                          {item.category === 'result' && '🏆 Result'}
                          {item.category === 'admit-card' && '🎫 Admit Card'}
                          {item.category === 'answer-key' && '🔑 Answer Key'}
                          {item.category === 'syllabus' && '📚 Syllabus'}
                          {item.category === 'admission' && '🏫 Admission'}
                          {item.category === 'certificate' && '📜 Certificate'}
                          {item.category === 'outsourcing' && '🏢 Outsourcing'}
                          {item.category === 'important' && '📌 Important'}
                        </span>
                        <span>•</span>
                        <span>{item.postDate || '2026-09-28'}</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-700">{item.organization}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                      {item.applyUrl && (
                        <a
                          href={item.applyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-xs flex items-center gap-1 cursor-pointer"
                          title="Direct Portal Link"
                        >
                          <span>Portal</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      )}
                      {item.notificationUrl && (
                        <a
                          href={item.notificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-xs flex items-center gap-1 cursor-pointer"
                          title="Direct Notification Download"
                        >
                          <span>Download</span>
                          <span className="text-[10px]">📥</span>
                        </a>
                      )}
                      <span className="bg-[#28a745] text-white text-[10px] font-black px-2 py-0.5 rounded-xs uppercase tracking-wider">
                        {item.statusBadge || 'PUBLISHED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (5 cols on lg, approx 42%) */}
            <div className="lg:col-span-5 border border-gray-300 rounded-xs overflow-hidden shadow-2xs flex flex-col justify-between">
              <div>
                {/* Dark Navy Header */}
                <div className="bg-[#001a40] text-white px-3.5 py-2 flex items-center gap-2">
                  <span className="text-xs">⚡</span>
                  <span className="text-xs font-black uppercase tracking-wider">QUICK DIRECT ACCESS</span>
                </div>

                {/* 2-Column Buttons Grid */}
                <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                  {[
                    { label: 'Jobs Hub', icon: '💼', tab: 'jobs' },
                    { label: 'Results Hub', icon: '🏆', tab: 'results' },
                    { label: 'Admit Cards', icon: '🎫', tab: 'admit-cards' },
                    { label: 'Answer Keys', icon: '🔑', tab: 'answer-keys' },
                    { label: 'Syllabus Hub', icon: '📚', tab: 'syllabus' },
                    { label: 'Admissions', icon: '🏫', tab: 'admissions' },
                    { label: 'Certificate Verif.', icon: '📜', tab: 'certificates' },
                    { label: 'Outsourcing Jobs', icon: '🏢', tab: 'outsourcing' },
                    { label: 'Important Links', icon: '📌', tab: 'important' },
                    { label: 'Flash Banner Tiles', icon: '⚡', tab: 'featured' },
                    { label: 'Oscillating Ticker', icon: '📡', tab: 'ticker' },
                    { label: 'Full Quick Form', icon: '➕', tab: 'publish' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setActiveTab(item.tab as AdminTab)}
                      className="flex items-center gap-2 p-2.5 bg-white hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 rounded-xs text-xs font-bold text-gray-800 transition-all cursor-pointer shadow-2xs text-left"
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Footer inside card */}
              <div className="p-2.5 px-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600 font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Public Status: Online &amp; Synced</span>
                </div>
                <button
                  type="button"
                  onClick={goHome}
                  className="text-blue-700 hover:underline font-bold cursor-pointer flex items-center gap-0.5"
                >
                  <span>Open Website</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Status Banner */}
          <div className="bg-[#fff8f7] border border-[#f5c6cb] rounded-xs p-3 sm:p-4 text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-black text-[#850008] uppercase tracking-wide">
                PERSISTENCE &amp; LIVE SERVER STATUS
              </span>
              <span className="bg-[#28a745] text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
                ONLINE
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed font-medium">
              All changes made in this admin panel write directly to disk (<code className="bg-white px-1 py-0.5 border border-gray-300 text-[11px] font-mono text-gray-800">src/data/db.json</code>). Changes immediately update on the homepage, category pages, search bar, and individual post pages. Direct portal links and downloads are available for every item.
            </p>
          </div>
        </div>
      )}

      {/* 9 CATEGORY SPECIFIC MANAGEMENT HUBS */}
      {activeTab === 'jobs' && renderCategoryView('latest-job', 'Latest Jobs', 'सरकारी नौकरी', '💼')}
      {activeTab === 'results' && renderCategoryView('result', 'Exam Results', 'परीक्षा परिणाम', '🏆')}
      {activeTab === 'admit-cards' && renderCategoryView('admit-card', 'Admit Cards', 'प्रवेश पत्र', '🎫')}
      {activeTab === 'answer-keys' && renderCategoryView('answer-key', 'Answer Keys', 'उत्तर कुंजी', '🔑')}
      {activeTab === 'syllabus' && renderCategoryView('syllabus', 'Syllabus & Pattern', 'पाठ्यक्रम', '📚')}
      {activeTab === 'admissions' && renderCategoryView('admission', 'Admissions', 'प्रवेश', '🏫')}
      {activeTab === 'certificates' && renderCategoryView('certificate', 'Certificates & Verif.', 'प्रमाण पत्र सत्यापन', '📜')}
      {activeTab === 'outsourcing' && renderCategoryView('outsourcing', 'Outsourcing Jobs', 'आउटसोर्सिंग भर्ती', '🏢')}
      {activeTab === 'important' && renderCategoryView('important', 'Important Links', 'महत्वपूर्ण लिंक', '📌')}

      {/* TAB 2: QUICK PUBLISH FORM */}
      {activeTab === 'publish' && (
        <form onSubmit={handlePublish} className="space-y-4">
          <div className="bg-[#fff0ee] p-3.5 border border-[#f9dcd9]">
            <h2 className="text-sm font-bold text-[#850008] uppercase mb-1 font-serif">
              Publish New Examination, Job, or Result
            </h2>
            <p className="text-xs text-gray-600">
              Fill the parameters below. Real interactive calendar pickers are enabled for application start, last dates, and exam dates.
            </p>
          </div>

          {/* Core Post Information */}
          <div className="bg-white p-3.5 border border-gray-300 space-y-3.5 text-xs shadow-2xs">
            {/* Row 1: Title & Target Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Title */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Title / Recruitment Post Heading <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-gray-500 font-normal">Click a quick title or type custom</span>
                </label>
                <input
                  type="text"
                  required
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  placeholder="e.g. BPSC School Teacher TRE 4.0 Online Form 2026 (Class 1 to 12)"
                  className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium text-gray-900"
                />

                {/* Quick Popular Recruitment Titles */}
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  <span className="text-[10px] text-gray-500 font-bold">Quick Titles:</span>
                  {[
                    { label: 'BPSC School Teacher (TRE 4.0)', title: 'BPSC Bihar School Teacher TRE 4.0 Online Form 2026 (Class 1 to 12)', cat: 'teaching', org: 'BPSC Bihar Public Service Commission', state: 'Bihar', qual: 'Graduate, Post Graduate, Teaching' },
                    { label: 'UP TGT / PGT Teacher', title: 'UP TGT / PGT Teacher Recruitment Online Form 2026', cat: 'teaching', org: 'UP Education Commission / UPSESSB', state: 'Uttar Pradesh', qual: 'Graduate, Post Graduate, Teaching' },
                    { label: 'Jharkhand Sahayak Acharya / JTET', title: 'JSSC Jharkhand Primary School Trained Teacher (Sahayak Acharya / JTET) 2026', cat: 'teaching', org: 'JSSC Jharkhand Staff Selection Commission', state: 'Jharkhand', qual: 'Diploma, Graduate, Teaching' },
                    { label: 'Railway RRB (NTPC / Group D / ALP)', title: 'Railway RRB Recruitment 2026 Online Application Form', cat: 'latest-job', org: 'Railway RRB / RRC', state: 'All India', qual: '10th Pass, 12th Pass, ITI, Graduate' },
                    { label: 'SSC CGL / CHSL / MTS / GD', title: 'SSC Combined Graduate Level CGL / CHSL Online Form 2026', cat: 'latest-job', org: 'SSC', state: 'All India', qual: '10th Pass, 12th Pass, Graduate' },
                    { label: 'UPSC Civil Services / NDA', title: 'UPSC Civil Services / NDA Examination Online Form 2026', cat: 'latest-job', org: 'UPSC', state: 'All India', qual: '12th Pass, Graduate' },
                    { label: 'NTA NEET / JEE Portal', title: 'NTA NEET UG / JEE Main Official Examination Portal 2026', cat: 'latest-job', org: 'NTA NEET / JEE', state: 'All India', qual: '12th Pass, Medical, B.Tech' },
                    { label: 'State Police Constable / SI', title: 'State Police Constable & Sub Inspector SI Recruitment 2026', cat: 'latest-job', org: 'State Police Recruitment Board', state: 'Uttar Pradesh', qual: '12th Pass, Graduate' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPubTitle(preset.title);
                        setPubCategory(preset.cat as NotificationCategory);
                        setPubOrg(preset.org);
                        setPubState(preset.state);
                        setPubQual(preset.qual);
                      }}
                      className="text-[10px] bg-gray-100 hover:bg-[#fee2de] hover:text-[#850008] border border-gray-300 px-1.5 py-0.5 rounded-xs cursor-pointer transition-colors font-semibold"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Category (Admission & Certificate completely removed; Teaching added) */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-800">Target Section / Directory <span className="text-red-500">*</span></label>
                <select
                  value={pubCategory}
                  onChange={(e) => setPubCategory(e.target.value as NotificationCategory)}
                  className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-bold text-[#850008]"
                >
                  <option value="latest-job">Latest Job (सरकारी नौकरी)</option>
                  <option value="teaching">Teaching Jobs (शिक्षक भर्ती - UP, Bihar, Jharkhand)</option>
                  <option value="admit-card">Admit Card (प्रवेश पत्र)</option>
                  <option value="result">Result (परीक्षा परिणाम)</option>
                  <option value="answer-key">Answer Key & Objection (उत्तर कुंजी)</option>
                  <option value="syllabus">Syllabus & Exam Pattern</option>
                  <option value="admission">Admission (प्रवेश परीक्षा / काउंसलिंग)</option>
                  <option value="certificate">Certificate Verification (प्रमाण पत्र सत्यापन)</option>
                  <option value="outsourcing">Outsourcing & Contract Jobs</option>
                  <option value="important">Important Portals & Forms</option>
                </select>
                <span className="text-[10px] text-gray-500">
                  Target directory where this notification will appear across portal
                </span>
              </div>
            </div>

            {/* Row 2: Commission/Board & State/Region with All State / All India options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Recruitment Commission / Board */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Recruitment Commission / Board <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-gray-500">Select preset or type</span>
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    value={pubOrg}
                    onChange={(e) => setPubOrg(e.target.value)}
                    placeholder="e.g. Railway RRB, UPSC, BPSC, SSC, NEET, JEE, Teacher Board"
                    className="flex-1 border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setPubOrg(e.target.value);
                    }}
                    value=""
                    className="border border-gray-300 p-2 text-xs bg-gray-50 cursor-pointer font-bold"
                  >
                    <option value="" disabled>-- Quick Boards --</option>
                    <optgroup label="Teacher Boards (शिक्षक भर्ती)">
                      <option value="BPSC Teacher (TRE) - Bihar">BPSC Teacher (TRE) Bihar</option>
                      <option value="UP Education Commission (UPSESSB / TGT / PGT)">UP Teacher (TGT/PGT/Super TET)</option>
                      <option value="JSSC Teacher (Sahayak Acharya / JTET) - Jharkhand">JSSC Teacher Jharkhand</option>
                      <option value="CTET / CBSE Teacher Eligibility">CTET / CBSE</option>
                      <option value="KVS (Kendriya Vidyalaya Sangathan)">KVS Teacher</option>
                      <option value="NVS (Navodaya Vidyalaya Samiti)">NVS Teacher</option>
                      <option value="EMRS (Eklavya Residential Schools)">EMRS Teacher</option>
                      <option value="DSSSB Teacher (Delhi Subordinate)">DSSSB Delhi Teacher</option>
                      <option value="NTA UGC NET / CSIR NET">NTA UGC NET</option>
                    </optgroup>
                    <optgroup label="Central & Major Exams">
                      <option value="Railway RRB / RRC">Railway RRB / RRC</option>
                      <option value="UPSC (Civil Services / NDA / CDS)">UPSC</option>
                      <option value="SSC (CGL / CHSL / MTS / GD)">SSC</option>
                      <option value="NTA NEET (UG / PG Medical)">NTA NEET</option>
                      <option value="NTA JEE (Main / Advanced)">NTA JEE</option>
                      <option value="Banking (IBPS / SBI / RBI)">Banking (IBPS / SBI)</option>
                      <option value="Defence (Army / Navy / Airforce Agniveer)">Indian Defence / Agniveer</option>
                    </optgroup>
                    <optgroup label="State Selection Commissions">
                      <option value="BPSC / BSSC (Bihar)">BPSC / BSSC (Bihar)</option>
                      <option value="UPPSC / UPSSSC (Uttar Pradesh)">UPPSC / UPSSSC (UP)</option>
                      <option value="JPSC / JSSC (Jharkhand)">JPSC / JSSC (Jharkhand)</option>
                      <option value="State Police Recruitment Board">State Police (UP/Bihar/Jharkhand)</option>
                      <option value="RPSC / RSMSSB (Rajasthan)">RPSC / RSMSSB (Rajasthan)</option>
                      <option value="MPPSC / MPESB (Madhya Pradesh)">MPPSC / MPESB (MP)</option>
                      <option value="HSSC / HPSC (Haryana)">HSSC / HPSC (Haryana)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Quick Commission Chips */}
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[10px] text-gray-500 font-bold">Popular:</span>
                  {[
                    'Railway', 'UPSC', 'BPSC', 'SSC', 'NEET', 'JEE',
                    'BPSC Teacher (TRE)', 'UP Teacher (TGT/PGT)', 'JSSC Teacher (Sahayak Acharya)',
                    'CTET', 'KVS', 'State Police', 'Banking',
                  ].map((board) => (
                    <button
                      key={board}
                      type="button"
                      onClick={() => setPubOrg(board)}
                      className={`text-[10px] px-1.5 py-0.5 rounded-xs border cursor-pointer font-semibold transition-colors ${
                        pubOrg === board
                          ? 'bg-[#850008] text-white border-[#850008]'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                      }`}
                    >
                      {board}
                    </button>
                  ))}
                </div>
              </div>

              {/* State / Region (All State and All India options added for all target sections) */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>State / Region Selection (Target Section Location)</span>
                  <span className="text-[10px] text-gray-500">All India &amp; All States</span>
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={pubState}
                    onChange={(e) => setPubState(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 text-xs bg-white font-bold text-gray-900 focus:outline-none"
                  >
                    {ALL_INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={pubState}
                    onChange={(e) => setPubState(e.target.value)}
                    placeholder="Custom State"
                    className="w-28 border border-gray-300 p-2 text-xs bg-white focus:outline-none"
                  />
                </div>

                {/* Quick State Pills */}
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[10px] text-gray-500 font-bold">Quick:</span>
                  {['All India', 'Jharkhand', 'Bihar', 'Uttar Pradesh', 'Delhi NCR', 'Rajasthan', 'Madhya Pradesh', 'Haryana', 'Uttarakhand'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPubState(st)}
                      className={`text-[10px] px-1.5 py-0.5 rounded-xs border cursor-pointer font-semibold transition-colors ${
                        pubState === st
                          ? 'bg-[#000066] text-white border-[#000066]'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Vacancies & Highlight Badge (Includes UPCOMING) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Total Vacancies */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-800">Total Vacancies / Posts</label>
                <input
                  type="text"
                  value={pubVacancies}
                  onChange={(e) => setPubVacancies(e.target.value)}
                  placeholder="e.g. 87,774 Posts, 51,112 Posts or Scorecard"
                  className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
                />
              </div>

              {/* Highlight Badge with UPCOMING option */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Highlight Badge (Live Alert Pill)</span>
                  <span className="text-[10px] text-purple-700 font-black">UPCOMING Highlight</span>
                </label>
                <select
                  value={pubStatusBadge || ''}
                  onChange={(e) => setPubStatusBadge((e.target.value as StatusBadgeType) || null)}
                  className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-bold"
                >
                  <option value="">None (Standard Link)</option>
                  <option value="UPCOMING">UPCOMING (Purple Glow - Upcoming Exam / Answer Key / Result)</option>
                  <option value="NEW">NEW (Red Pulsing - Fresh Recruitment)</option>
                  <option value="ACTIVE">ACTIVE (Green - Application Live)</option>
                  <option value="OUT">OUT (Red - Answer Key / Admit Card Released)</option>
                  <option value="DECLARED">DECLARED (Crimson - Scorecard Live)</option>
                  <option value="EXTENDED">EXTENDED (Amber - Deadline Extended)</option>
                </select>
              </div>

              {/* Quick Status Pill selector */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-800">1-Click Highlight</label>
                <div className="flex flex-wrap gap-1 items-center pt-1">
                  {(['UPCOMING', 'NEW', 'ACTIVE', 'OUT', 'DECLARED', 'EXTENDED'] as StatusBadgeType[]).map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => setPubStatusBadge(badge)}
                      className={`text-[10px] px-2 py-1 rounded-xs font-black uppercase cursor-pointer border transition-colors ${
                        pubStatusBadge === badge
                          ? badge === 'UPCOMING'
                            ? 'bg-[#6b21a8] text-white border-[#6b21a8]'
                            : badge === 'ACTIVE'
                            ? 'bg-[#15803d] text-white border-[#15803d]'
                            : 'bg-[#ab1818] text-white border-[#ab1818]'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 4: Minimum Qualification (With 13 Specific Requested Qualification Pills) */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-200">
              <label className="font-bold text-gray-800 flex items-center justify-between">
                <span>Minimum Qualification Criteria <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-gray-500">Click any qualification pill below to add or remove</span>
              </label>
              <input
                type="text"
                value={pubQual}
                onChange={(e) => setPubQual(e.target.value)}
                placeholder="e.g. 10th Pass, 12th Pass, Graduate, Teaching"
                className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
              />

              {/* Exact 13 Qualifications requested by user */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-600 font-bold block">
                  Select Minimum Qualifications (1-Click Add / Toggle):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUALIFICATION_OPTIONS.map((q) => {
                    const isSelected = pubQual.toLowerCase().includes(q.toLowerCase());
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            // Remove qualification
                            const parts = pubQual.split(',').map((s) => s.trim()).filter((s) => s.toLowerCase() !== q.toLowerCase());
                            setPubQual(parts.join(', '));
                          } else {
                            // Add qualification
                            setPubQual(pubQual ? `${pubQual}, ${q}` : q);
                          }
                        }}
                        className={`text-xs px-2.5 py-1 rounded-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#000066] text-white border-[#000066] shadow-xs'
                            : 'bg-gray-100 hover:bg-blue-50 text-gray-800 border-gray-300'
                        }`}
                      >
                        <span>{isSelected ? '✓' : '+'}</span>
                        <span>{q}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* DEDICATED ANSWER KEY & OBJECTION TRACKER BOX (When Answer Key or Enabled) */}
          {(pubCategory === 'answer-key' || pubAnswerKeyDate || pubAnswerKeyUrl) && (
            <div className="border-2 border-purple-600 bg-purple-50/40 p-3.5 space-y-3 shadow-sm rounded-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-700 text-[22px]">key</span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-purple-900 uppercase font-serif tracking-tight">
                      Answer Key &amp; Candidate Objection Tracker Configuration
                    </h3>
                    <p className="text-[11px] text-gray-600">
                      Configure official answer key release date, objection closing deadline, download link, and objection submission portal.
                    </p>
                  </div>
                </div>
                <span className="bg-purple-700 text-white text-[10px] font-black px-2 py-0.5 uppercase rounded-xs animate-pulse">
                  Answer Key Special Settings
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 border border-purple-200 shadow-2xs">
                {/* Answer Key Release Date */}
                <NativeDatePicker
                  label="Answer Key Release / Publish Date"
                  value={pubAnswerKeyDate}
                  onChange={setPubAnswerKeyDate}
                  quickPills={[
                    { label: 'Today', days: 0 },
                    { label: 'Yesterday', days: -1 },
                    { label: 'Upcoming Soon', fixed: 'Upcoming Soon' },
                  ]}
                  helperText="Date when official question paper & answer key became available"
                />

                {/* Answer Key Closing Date / Last Date to File Objection */}
                <NativeDatePicker
                  label="Answer Key Closing Date (Objection Last Date)"
                  value={pubAnswerKeyCloseDate}
                  onChange={setPubAnswerKeyCloseDate}
                  minDate={pubAnswerKeyDate}
                  quickPills={[
                    { label: '+5 Days', days: 5 },
                    { label: '+7 Days', days: 7 },
                    { label: '+10 Days', days: 10 },
                    { label: '+15 Days', days: 15 },
                  ]}
                  helperText="Final deadline for candidates to submit challenges / objections online"
                />
              </div>

              {/* Direct URLs for Answer Key and Objections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 border border-purple-200 shadow-2xs text-xs">
                <div>
                  <label className="font-bold text-purple-900 block mb-1">
                    Direct Official Answer Key Download URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={pubAnswerKeyUrl}
                    onChange={(e) => setPubAnswerKeyUrl(e.target.value)}
                    placeholder="https://official-commission.gov.in/answerkey.pdf"
                    className="w-full border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
                  />
                  <span className="text-[10px] text-gray-500">
                    Direct link where candidates go to view / download the answer key
                  </span>
                </div>

                <div>
                  <label className="font-bold text-purple-900 block mb-1">
                    Direct Objection / Challenge Submission Portal URL
                  </label>
                  <input
                    type="url"
                    value={pubObjectionUrl}
                    onChange={(e) => setPubObjectionUrl(e.target.value)}
                    placeholder="https://official-commission.gov.in/objection-login"
                    className="w-full border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
                  />
                  <span className="text-[10px] text-gray-500">
                    Direct server link for raising objections on question paper
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED TEACHING RECRUITMENT SPECIFIC BOX (For JHARKHAND, BIHAR, UP, CENTRAL) */}
          {(pubCategory === 'teaching' || pubTitle.toLowerCase().includes('teacher')) && (
            <div className="border-2 border-[#15803d] bg-emerald-50/40 p-3.5 space-y-3 shadow-sm rounded-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-800 text-[22px]">school</span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-emerald-900 uppercase font-serif tracking-tight">
                      Teaching &amp; Faculty Recruitment Specific Parameters (शिक्षक भर्ती)
                    </h3>
                    <p className="text-[11px] text-gray-600">
                      Optimized for Teacher recruitments across Jharkhand, Bihar, Uttar Pradesh, and Central (CTET / KVS / NVS / EMRS).
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 uppercase rounded-xs">
                  Teacher Specific
                </span>
              </div>

              {/* 1-Click State Quick Presets for Teacher */}
              <div className="bg-white p-2.5 border border-emerald-300 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-emerald-900">1-Click Teacher Region Setup:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPubCategory('teaching');
                    setPubState('Bihar');
                    setPubOrg('BPSC Bihar Public Service Commission');
                    setPubTeachingLevel('PRT, TGT, PGT (Class 1 to 12)');
                    setPubTetRequirement('CTET / Bihar STET Paper 1 & 2');
                    setPubQual('D.El.Ed / B.Ed / CTET / STET');
                  }}
                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 rounded-xs cursor-pointer"
                >
                  Bihar (BPSC TRE)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPubCategory('teaching');
                    setPubState('Jharkhand');
                    setPubOrg('JSSC Jharkhand Staff Selection Commission');
                    setPubTeachingLevel('Primary (PRT) / Sahayak Acharya / PGT');
                    setPubTetRequirement('JTET (Jharkhand TET) Paper 1 & 2');
                    setPubQual('Intermediate / Degree + JTET + D.El.Ed / B.Ed');
                  }}
                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 rounded-xs cursor-pointer"
                >
                  Jharkhand (JSSC / JTET)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPubCategory('teaching');
                    setPubState('Uttar Pradesh');
                    setPubOrg('UP Education Commission / UPSESSB');
                    setPubTeachingLevel('UP TGT / PGT / Super TET Assistant Teacher');
                    setPubTetRequirement('UPTET / Super TET / CTET');
                    setPubQual('Graduation / PG + B.Ed / BTC');
                  }}
                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 rounded-xs cursor-pointer"
                >
                  Uttar Pradesh (UP TGT/PGT)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPubCategory('teaching');
                    setPubState('All India');
                    setPubOrg('CBSE / KVS / NVS / EMRS');
                    setPubTeachingLevel('PRT / TGT / PGT Central Schools');
                    setPubTetRequirement('CTET Paper 1 & 2 Qualified');
                    setPubQual('D.El.Ed / B.Ed + CTET');
                  }}
                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 rounded-xs cursor-pointer"
                >
                  Central (CTET / KVS / EMRS)
                </button>
              </div>

              {/* Teaching Level, TET Requirement, and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 border border-emerald-200 shadow-2xs text-xs">
                {/* Teaching Level */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-800">Teacher Post Level</label>
                  <select
                    value={pubTeachingLevel}
                    onChange={(e) => setPubTeachingLevel(e.target.value)}
                    className="border border-gray-300 p-2 text-xs bg-white font-medium focus:outline-none"
                  >
                    <option value="PRT (Primary Teacher - Class 1 to 5)">PRT (Primary Teacher - Class 1 to 5)</option>
                    <option value="TGT (Trained Graduate Teacher - Class 6 to 10)">TGT (Trained Graduate - Class 6 to 10)</option>
                    <option value="PGT (Post Graduate Teacher - Class 11 to 12)">PGT (Post Graduate - Class 11 to 12)</option>
                    <option value="PRT, TGT, PGT (All School Levels)">PRT, TGT, PGT (All School Levels)</option>
                    <option value="Assistant Professor / College Lecturer">Assistant Professor / College Lecturer</option>
                    <option value="Head Teacher / Principal / Headmaster">Head Teacher / Principal / Headmaster</option>
                  </select>
                </div>

                {/* TET Requirement */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-800">TET / Eligibility Requirement</label>
                  <input
                    type="text"
                    value={pubTetRequirement}
                    onChange={(e) => setPubTetRequirement(e.target.value)}
                    placeholder="e.g. CTET Paper 1 / Bihar STET / JTET / UPTET"
                    className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
                  />
                </div>

                {/* Subject / Discipline */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-800">Subject / Discipline</label>
                  <input
                    type="text"
                    value={pubTeachingSubject}
                    onChange={(e) => setPubTeachingSubject(e.target.value)}
                    placeholder="e.g. Mathematics, Science, Hindi, English, All Subjects"
                    className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* APPLICATION RECRUITMENT WINDOW: NATIVE CALENDAR DATEPICKERS */}
          <div className="border-2 border-[#850008]/40 p-3.5 sm:p-4 bg-gradient-to-b from-[#fff8f7] to-white space-y-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f3d0cc] pb-2 gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#850008] text-[22px]">calendar_month</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#850008] uppercase font-serif tracking-tight">
                    Application Recruitment Schedule (Native Calendar DatePicker)
                  </h3>
                  <p className="text-[11px] text-gray-600">
                    Select valid start and end dates via the native calendar picker. Registration window validity is enforced automatically.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold bg-[#ab1818] text-white px-2 py-0.5 uppercase rounded-xs">
                Calendar Validated
              </span>
            </div>

            {/* Application Start and End Date side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 border border-gray-200 shadow-2xs">
              {/* 1. Application Started / Start Date */}
              <NativeDatePicker
                label="Application Started / Start Date"
                value={pubPostDate}
                onChange={setPubPostDate}
                required
                allowCustomText={false}
                quickPills={[
                  { label: 'Today', days: 0 },
                  { label: 'Yesterday', days: -1 },
                  { label: '7 Days Ago', days: -7 },
                ]}
                helperText="Official opening date for online registration (click calendar to select)"
              />

              {/* 2. Application Last Date (End Date) with minDate constrained to Start Date */}
              <NativeDatePicker
                label="Application Last Date / End Date"
                value={pubLastDate}
                onChange={setPubLastDate}
                required
                minDate={pubPostDate}
                allowCustomText={false}
                baseDateForOffset={pubPostDate}
                quickPills={[
                  { label: '+15 Days', days: 15 },
                  { label: '+30 Days', days: 30 },
                  { label: '+45 Days', days: 45 },
                  { label: '+60 Days', days: 60 },
                ]}
                isInvalid={pubDatesDiff !== null && pubDatesDiff < 0}
                errorMessage={
                  pubDatesDiff !== null && pubDatesDiff < 0
                    ? `End Date (${pubLastDate}) cannot be earlier than Start Date (${pubPostDate})!`
                    : undefined
                }
                helperText="Final deadline for application submission & fee payment (restricted by start date)"
              />
            </div>

            {/* Dynamic Application Window Health & Duration Banner */}
            {pubPostDate && pubLastDate && (
              <div
                className={`p-2.5 rounded-xs border text-xs flex flex-wrap items-center justify-between gap-2 ${
                  pubDatesDiff !== null && pubDatesDiff < 0
                    ? 'bg-red-50 border-red-300 text-red-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                {pubDatesDiff !== null && pubDatesDiff < 0 ? (
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
                    <span>
                      Invalid Date Selection: End Date ({pubLastDate}) is before Start Date ({pubPostDate})! Please select an end date on or after the start date.
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 font-bold">
                      <span className="material-symbols-outlined text-[18px] text-emerald-700">verified</span>
                      <span>
                        Application Window: <span className="underline">{pubDatesDiff} {pubDatesDiff === 1 ? 'Day' : 'Days'} Duration</span>
                      </span>
                      <span className="text-gray-600 font-normal">
                        ({pubPostDate} &rarr; {pubLastDate})
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 border border-emerald-300">
                      {checkJobExpirationStatus(pubLastDate).statusText}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Other Examination Milestones (Exam, Admit Card, Result Dates) */}
            <div className="pt-2 border-t border-gray-200">
              <span className="text-xs font-bold text-gray-700 uppercase block mb-2 font-serif">
                Other Recruitment Milestones (Calendar DatePicker or Official Status)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Exam Date */}
                <NativeDatePicker
                  label="Exam Date"
                  value={pubExamDate}
                  onChange={setPubExamDate}
                  allowCustomText={true}
                  quickPills={[
                    { label: '+30 Days', days: 30 },
                    { label: '+60 Days', days: 60 },
                    { label: 'Notified Soon', fixed: 'Notified Soon' },
                  ]}
                  helperText="Date of examination or status"
                />

                {/* Admit Card Date */}
                <NativeDatePicker
                  label="Admit Card Available Date"
                  value={pubAdmitDate}
                  onChange={setPubAdmitDate}
                  allowCustomText={true}
                  quickPills={[
                    { label: 'Before Exam', fixed: 'Before Exam' },
                    { label: 'Out Now', fixed: 'Out Now' },
                    { label: '+20 Days', days: 20 },
                  ]}
                  helperText="Hall ticket download availability"
                />

                {/* Result Date */}
                <NativeDatePicker
                  label="Result Declared Date (Optional)"
                  value={pubResultDate}
                  onChange={setPubResultDate}
                  allowCustomText={true}
                  quickPills={[
                    { label: 'Declared Today', days: 0 },
                    { label: 'Will Notify', fixed: 'Will Notify' },
                  ]}
                  helperText="Merit list / score announcement"
                />
              </div>
            </div>
          </div>

          {/* Application Fee Details */}
          <div className="border border-gray-300 p-3.5 bg-white space-y-2.5">
            <h3 className="text-xs font-bold text-[#850008] uppercase font-serif border-b border-gray-200 pb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>Application Fee Structure</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-800">General / OBC / EWS Fee</label>
                <input
                  type="text"
                  value={pubFeeGen}
                  onChange={(e) => setPubFeeGen(e.target.value)}
                  placeholder="e.g. ₹750 or ₹500"
                  className="border border-gray-300 p-2 text-xs focus:outline-none bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-800">SC / ST / Reserved / PH Fee</label>
                <input
                  type="text"
                  value={pubFeeRes}
                  onChange={(e) => setPubFeeRes(e.target.value)}
                  placeholder="e.g. ₹200 or Nil (Exempted)"
                  className="border border-gray-300 p-2 text-xs focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* DEDICATED AGE LIMIT MANAGER CARD */}
          <div className="border-2 border-[#000066] p-4 bg-[#f0f4ff] space-y-3.5 text-xs shadow-xs">
            <div className="flex flex-wrap items-center justify-between border-b border-blue-200 pb-2 gap-2">
              <div>
                <h3 className="text-sm font-black text-[#000066] uppercase font-serif flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[22px]">badge</span>
                  <span>Candidate Age Limit Criteria &amp; Rules Configuration</span>
                </h3>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Set candidate minimum &amp; maximum age eligibility, calculation benchmark date, and relaxation rules.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAgeCalcHelper(!showAgeCalcHelper)}
                  className="bg-white hover:bg-blue-100 text-[#000066] border border-blue-300 text-[11px] font-bold px-2.5 py-1 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">calculate</span>
                  <span>{showAgeCalcHelper ? 'Hide Age Calculator' : 'Test Age Eligibility'}</span>
                </button>
                <span className="text-[11px] text-blue-900 font-semibold bg-blue-100 px-2 py-0.5 border border-blue-300">
                  Official Criteria
                </span>
              </div>
            </div>

            {/* Main Age Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Minimum Age */}
              <div className="flex flex-col gap-1 bg-white p-2.5 border border-gray-300 shadow-2xs">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Minimum Age</span>
                  <span className="text-[10px] text-red-600 font-semibold">* Required</span>
                </label>
                <input
                  type="text"
                  value={pubAgeMin}
                  onChange={(e) => setPubAgeMin(e.target.value)}
                  placeholder="e.g. 18 Years"
                  className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-bold text-gray-900"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[10px] text-gray-500 font-semibold">1-Click:</span>
                  {['18 Years', '20 Years', '21 Years', '25 Years', 'No Min'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPubAgeMin(preset)}
                      className={`text-[10px] border px-1.5 py-0.5 cursor-pointer rounded-[2px] font-medium transition-colors ${
                        pubAgeMin === preset
                          ? 'bg-[#000066] text-white border-[#000066]'
                          : 'bg-gray-50 hover:bg-blue-100 border-gray-300 text-gray-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Maximum Age */}
              <div className="flex flex-col gap-1 bg-white p-2.5 border border-gray-300 shadow-2xs">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Maximum Age</span>
                  <span className="text-[10px] text-red-600 font-semibold">* Required</span>
                </label>
                <input
                  type="text"
                  value={pubAgeMax}
                  onChange={(e) => setPubAgeMax(e.target.value)}
                  placeholder="e.g. 35 Years"
                  className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-bold text-gray-900"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[10px] text-gray-500 font-semibold">1-Click:</span>
                  {['25 Years', '28 Years', '30 Years', '32 Years', '35 Years', '40 Years', '42 Years', 'No Max'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPubAgeMax(preset)}
                      className={`text-[10px] border px-1.5 py-0.5 cursor-pointer rounded-[2px] font-medium transition-colors ${
                        pubAgeMax === preset
                          ? 'bg-[#000066] text-white border-[#000066]'
                          : 'bg-gray-50 hover:bg-blue-100 border-gray-300 text-gray-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age As on Date */}
              <div className="bg-white p-2.5 border border-gray-300 shadow-2xs">
                <NativeDatePicker
                  label="Age Benchmark As On Date"
                  value={pubAgeAsOnDate}
                  onChange={setPubAgeAsOnDate}
                  allowCustomText={true}
                  quickPills={[
                    { label: '01/07/2026', fixed: '01/07/2026' },
                    { label: '01/01/2026', fixed: '01/01/2026' },
                    { label: '01/08/2026', fixed: '01/08/2026' },
                    { label: 'Today', days: 0 },
                  ]}
                  helperText="Date on which candidate's age is calculated."
                />
              </div>
            </div>

            {/* Post-Wise / Cadre Age Limit (Optional) */}
            <div className="flex flex-col gap-1 bg-white p-2.5 border border-gray-300 shadow-2xs">
              <label className="font-bold text-gray-800 flex items-center justify-between">
                <span>Post-Wise / Department-Wise Age Criteria (Optional)</span>
                <span className="text-[10px] text-gray-500 font-normal">For recruitments with different limits per post</span>
              </label>
              <input
                type="text"
                value={pubPostWiseAge}
                onChange={(e) => setPubPostWiseAge(e.target.value)}
                placeholder="e.g. Clerk: 18-27 Yrs | Sub Inspector: 21-28 Yrs | Senior Officer: 21-35 Yrs"
                className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="text-[10px] text-gray-500 font-semibold">Quick Presets:</span>
                {[
                  '18-25 Years for Group C Posts, 21-30 Years for Group B Officers',
                  'Post-wise Age Details given in Official Notice Table',
                  '21-32 Years for General Officers, 21-35 Years for Specialist',
                ].map((eg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPubPostWiseAge(eg)}
                    className="text-[10px] bg-gray-50 hover:bg-blue-100 border border-gray-300 px-1.5 py-0.5 text-gray-700 cursor-pointer rounded-[2px]"
                  >
                    {eg}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Relaxation Description with 1-click pills */}
            <div className="flex flex-col gap-1 bg-white p-2.5 border border-gray-300 shadow-2xs">
              <label className="font-bold text-gray-800">
                Age Relaxation Rules &amp; Category Reservation Guidelines
              </label>
              <input
                type="text"
                value={pubAgeRelaxation}
                onChange={(e) => setPubAgeRelaxation(e.target.value)}
                placeholder="e.g. Age Relaxation Extra as per Official Recruitment Rules (OBC: 3 Yrs, SC/ST: 5 Yrs, PwD: 10 Yrs)"
                className="border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="text-[10px] text-gray-500 font-semibold">1-Click Rules:</span>
                {[
                  'Age Relaxation Extra as per Official Recruitment Rules',
                  'OBC: 3 Yrs | SC/ST: 5 Yrs | PwD: 10 Yrs Relaxation as per Govt Norms',
                  'Ex-Servicemen: 3 to 5 Years Relaxation | Departmental: Up to 40 Yrs',
                  'No Age Relaxation Applicable for this Recruitment',
                ].map((rule) => (
                  <button
                    key={rule}
                    type="button"
                    onClick={() => setPubAgeRelaxation(rule)}
                    className={`text-[10px] border px-1.5 py-0.5 cursor-pointer rounded-[2px] transition-colors ${
                      pubAgeRelaxation === rule
                        ? 'bg-[#000066] text-white border-[#000066]'
                        : 'bg-gray-50 hover:bg-blue-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    {rule}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="bg-white border-2 border-dashed border-[#000066]/40 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#000066] uppercase">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>Live Candidate Notification Preview (How Candidates Will See This)</span>
                </span>
                <span className="text-green-700 font-bold">● Active Configuration</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#f8f9fa] p-2 text-center border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Minimum Age</span>
                  <span className="font-black text-[#850008] text-sm">{pubAgeMin || '18 Years'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Maximum Age</span>
                  <span className="font-black text-[#850008] text-sm">{pubAgeMax || '35 Years'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Benchmark Date</span>
                  <span className="font-bold text-[#000066] text-xs">As on {pubAgeAsOnDate || '01/07/2026'}</span>
                </div>
              </div>
              <div className="text-[11px] text-gray-700 bg-[#fff0ee] p-1.5 border border-[#f9dcd9]">
                <strong className="text-[#850008]">Relaxation:</strong> {pubAgeRelaxation}
                {pubPostWiseAge && (
                  <div className="mt-1 pt-1 border-t border-[#f9dcd9] text-[#000066]">
                    <strong>Post-Wise Criteria:</strong> {pubPostWiseAge}
                  </div>
                )}
              </div>
            </div>

            {/* Optional Interactive DOB Age Eligibility Tester */}
            {showAgeCalcHelper && (
              <div className="bg-white border border-blue-400 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#000066] text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Admin Age Eligibility Validator (Test Candidate DOB)</span>
                  </span>
                  <span className="text-[10px] text-gray-500">Benchmark: {pubAgeAsOnDate}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-[11px] font-bold text-gray-700">Enter Sample Date of Birth:</label>
                  <input
                    type="date"
                    value={calcDob}
                    onChange={(e) => setCalcDob(e.target.value)}
                    className="border border-gray-300 p-1 text-xs bg-gray-50 font-bold"
                  />
                  {(() => {
                    const status = getCalculatedAgeStatus(calcDob, pubAgeAsOnDate, pubAgeMin, pubAgeMax);
                    if (!status) return null;
                    return (
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-gray-900 bg-gray-100 px-2 py-1 border border-gray-300">
                          Candidate Age: {status.years} Yrs, {status.months} Mos, {status.days} Days
                        </span>
                        <span
                          className={`px-2 py-1 text-white uppercase text-[10px] font-black ${
                            status.isEligible ? 'bg-green-700' : 'bg-red-700'
                          }`}
                        >
                          {status.isEligible ? 'Eligible for this Job ✅' : 'Out of Age Range ❌'}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* DEDICATED USEFUL IMPORTANT LINKS BUILDER (Matching Image 2) */}
          <div className="border-2 border-[#ab1818] p-4 bg-[#fff9f8] space-y-3.5">
            <div className="flex flex-wrap items-center justify-between border-b border-[#ab1818]/30 pb-2 gap-2">
              <div>
                <h3 className="text-sm font-black text-[#850008] uppercase font-serif flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px]">link</span>
                  <span>Useful Important Links (Server I, Server II, Notice PDF &amp; Portals)</span>
                </h3>
                <p className="text-[11px] text-gray-600">
                  Configure direct URLs matching candidate portal buttons as seen on official notifications.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddCustomLink}
                className="bg-[#000066] hover:bg-[#001a40] text-white text-[11px] font-bold px-3 py-1.5 uppercase cursor-pointer"
              >
                + Add Extra Useful Link
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {/* Row 1: Apply Online (Server I) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center bg-white p-2.5 border border-gray-300 shadow-2xs">
                <div className="font-bold text-[#850008]">
                  Apply Online (Server I)
                  <span className="block text-[10px] text-gray-500 font-normal">Button: [CLICK HERE]</span>
                </div>
                <div className="md:col-span-3">
                  <input
                    type="url"
                    value={pubApplyUrl}
                    onChange={(e) => setPubApplyUrl(e.target.value)}
                    placeholder="https://official-server1-apply.gov.in"
                    className="w-full border border-gray-300 p-2 text-xs focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Apply Online (Server II Backup) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center bg-white p-2.5 border border-gray-300 shadow-2xs">
                <div className="font-bold text-[#850008]">
                  Apply Online (Server II Backup)
                  <span className="block text-[10px] text-gray-500 font-normal">Button: [SERVER II]</span>
                </div>
                <div className="md:col-span-3">
                  <input
                    type="url"
                    value={pubApplyUrlServer2}
                    onChange={(e) => setPubApplyUrlServer2(e.target.value)}
                    placeholder="https://official-server2-backup.gov.in"
                    className="w-full border border-gray-300 p-2 text-xs focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Row 3: Official Commission Website (Placed before Notification PDF as requested) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center bg-white p-2.5 border border-gray-300 shadow-2xs">
                <div className="font-bold text-[#850008]">
                  Official Commission Website
                  <span className="block text-[10px] text-gray-500 font-normal">Link: Official Portal</span>
                </div>
                <div className="md:col-span-3">
                  <input
                    type="url"
                    value={pubOfficialUrl}
                    onChange={(e) => setPubOfficialUrl(e.target.value)}
                    placeholder="https://official-board.gov.in/"
                    className="w-full border border-gray-300 p-2 text-xs focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Row 4: Download Official Notification PDF (With PDF Drag-and-Drop Uploader) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start bg-white p-2.5 border border-gray-300 shadow-2xs">
                <div className="font-bold text-[#850008] pt-1">
                  Download Official Notification PDF
                  <span className="block text-[10px] text-gray-500 font-normal">Upload PDF document or paste URL</span>
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      type="button"
                      onClick={() => setPdfUploadMode('upload')}
                      className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-xs border cursor-pointer ${
                        pdfUploadMode === 'upload'
                          ? 'bg-[#ab1818] text-white border-[#ab1818]'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      Upload PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfUploadMode('url')}
                      className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-xs border cursor-pointer ${
                        pdfUploadMode === 'url'
                          ? 'bg-[#ab1818] text-white border-[#ab1818]'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      Web Link URL
                    </button>
                  </div>
                </div>

                <div className="md:col-span-3 space-y-2">
                  {pdfUploadMode === 'upload' ? (
                    <div>
                      {/* Drag & Drop PDF Dropzone */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingPdf(true);
                        }}
                        onDragLeave={() => setIsDraggingPdf(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingPdf(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handlePdfUpload(e.dataTransfer.files[0], false);
                          }
                        }}
                        onClick={() => document.getElementById('pdf-upload-input')?.click()}
                        className={`border-2 border-dashed rounded-xs p-4 text-center cursor-pointer transition-colors ${
                          isDraggingPdf
                            ? 'border-[#ab1818] bg-[#fee2de]'
                            : pubNoticeUrl.startsWith('data:application/pdf') || pdfFileName
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-gray-400 hover:border-[#ab1818] bg-gray-50 hover:bg-[#fff9f8]'
                        }`}
                      >
                        <input
                          id="pdf-upload-input"
                          type="file"
                          accept="application/pdf,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handlePdfUpload(e.target.files[0], false);
                            }
                          }}
                        />

                        {pubNoticeUrl.startsWith('data:application/pdf') || pdfFileName ? (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-left">
                              <span className="material-symbols-outlined text-[32px] text-red-600">
                                picture_as_pdf
                              </span>
                              <div>
                                <p className="font-bold text-gray-900 text-xs">
                                  {pdfFileName || 'official_notification.pdf'}
                                </p>
                                <p className="text-[10px] text-emerald-700 font-bold">
                                  ✅ PDF Attached successfully {pdfFileSize && `(${pdfFileSize})`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleOpenPdfPreview(pubNoticeUrl, pdfFileName || 'Official_Notification.pdf')}
                                className="px-2.5 py-1 bg-[#000066] hover:bg-[#001a40] text-white text-[11px] font-bold rounded-xs cursor-pointer inline-flex items-center gap-1 shadow-xs"
                                title="Open interactive PDF viewer"
                              >
                                <span>Preview</span>
                                <span className="material-symbols-outlined text-[13px]">visibility</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => downloadPdfFile(pubNoticeUrl, pdfFileName || 'Official_Notification.pdf')}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-xs cursor-pointer inline-flex items-center gap-1 shadow-xs"
                                title="Download PDF directly to computer"
                              >
                                <span>Download</span>
                                <span className="material-symbols-outlined text-[13px]">download</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPdfFileName('');
                                  setPdfFileSize('');
                                  setPubNoticeUrl('https://official-board.gov.in/notification.pdf');
                                }}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-xs cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1 text-gray-600 py-1">
                            <span className="material-symbols-outlined text-[32px] text-[#ab1818]">
                              upload_file
                            </span>
                            <p className="font-bold text-xs text-gray-800">
                              Drop your official notification PDF here, or <span className="text-[#ab1818] underline">browse file</span>
                            </p>
                            <p className="text-[10px] text-gray-500">
                              Upload official PDF recruitment notice (.pdf document)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={pubNoticeUrl}
                        onChange={(e) => setPubNoticeUrl(e.target.value)}
                        placeholder="https://official-board.gov.in/notification.pdf"
                        className="w-full border border-gray-300 p-2 text-xs focus:outline-none bg-white font-medium"
                      />
                      <span className="text-[10px] text-gray-500 block mt-1">
                        Paste the direct URL to the official notification PDF if hosted externally.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 5: Telegram & WhatsApp Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-white p-2.5 border border-gray-300">
                  <label className="font-bold text-[#1b5e20] block mb-1">
                    Telegram Channel Alert URL
                  </label>
                  <input
                    type="url"
                    value={pubTelegramUrl}
                    onChange={(e) => setPubTelegramUrl(e.target.value)}
                    placeholder="https://t.me/getsarkariresultme"
                    className="w-full border border-gray-300 p-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="bg-white p-2.5 border border-gray-300">
                  <label className="font-bold text-[#1b5e20] block mb-1">
                    WhatsApp Channel Alert URL
                  </label>
                  <input
                    type="url"
                    value={pubWhatsappUrl}
                    onChange={(e) => setPubWhatsappUrl(e.target.value)}
                    placeholder="https://whatsapp.com"
                    className="w-full border border-gray-300 p-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Custom Extra Links List */}
              {pubCustomLinks.map((custom) => (
                <div
                  key={custom.id}
                  className="bg-yellow-50/70 p-2.5 border border-yellow-300 grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
                >
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      value={custom.title}
                      onChange={(e) => handleUpdateCustomLink(custom.id, { title: e.target.value })}
                      placeholder="Link Title (e.g. Check Exam District)"
                      className="w-full border border-gray-300 p-1.5 text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <input
                      type="url"
                      value={custom.url}
                      onChange={(e) => handleUpdateCustomLink(custom.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="w-full border border-gray-300 p-1.5 text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={custom.actionText}
                      onChange={(e) => handleUpdateCustomLink(custom.id, { actionText: e.target.value })}
                      placeholder="Action (e.g. Click Here)"
                      className="w-full border border-gray-300 p-1.5 text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-1.5">
                    <select
                      value={custom.isButton ? 'button' : 'link'}
                      onChange={(e) =>
                        handleUpdateCustomLink(custom.id, {
                          isButton: e.target.value === 'button',
                          buttonColor: e.target.value === 'button' ? 'red' : 'default',
                        })
                      }
                      className="border border-gray-300 p-1.5 text-xs bg-white"
                    >
                      <option value="link">Text Link</option>
                      <option value="button">Red Button</option>
                    </select>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomLink(custom.id)}
                      className="text-red-700 hover:text-red-900 font-bold text-xs"
                      title="Remove custom link"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ARTICLE CONTENT & HOW TO APPLY SECTION */}
          <div className="border border-gray-300 p-3.5 bg-white space-y-3 text-xs">
            <h3 className="font-bold text-[#850008] uppercase font-serif border-b border-gray-200 pb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">article</span>
              <span>Comprehensive Recruitment Article &amp; Step-by-Step Instructions</span>
            </h3>

            <div>
              <label className="font-bold text-gray-800 block mb-1">
                Short Description / Header Summary
              </label>
              <textarea
                rows={2}
                value={pubShortDesc}
                onChange={(e) => setPubShortDesc(e.target.value)}
                placeholder="Brief 1-2 sentence overview shown in search results and top summary box..."
                className="w-full border border-gray-300 p-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">
                Detailed Eligibility &amp; Vacancy Criteria
              </label>
              <textarea
                rows={2}
                value={pubEligibility}
                onChange={(e) => setPubEligibility(e.target.value)}
                placeholder="Detailed qualifications, required degrees, experience, or tier guidelines..."
                className="w-full border border-gray-300 p-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">
                How to Fill Online Application Form (Step-by-Step Guide)
              </label>
              <textarea
                rows={3}
                value={pubHowToApply}
                onChange={(e) => setPubHowToApply(e.target.value)}
                placeholder="Step 1: Registration on portal...&#10;Step 2: Upload photo and signature...&#10;Step 3: Online fee payment..."
                className="w-full border border-gray-300 p-2 text-xs focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">
                Full Article Body / Official Examination Guidelines (Optional)
              </label>
              <textarea
                rows={4}
                value={pubArticleContent}
                onChange={(e) => setPubArticleContent(e.target.value)}
                placeholder="Enter complete article details, selection procedure, syllabus summary, or document verification instructions..."
                className="w-full border border-gray-300 p-2 text-xs focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#ab1818] hover:bg-[#8a0c0c] text-white px-6 py-2.5 text-sm font-bold uppercase cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>Publish Notification Now</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CONTENT MANAGER */}
      {activeTab === 'content' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#fff0ee] p-3 border border-[#f9dcd9] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-[#850008] uppercase mb-0.5">
                Manage Live Portal Content &amp; Notifications
              </h2>
              <p className="text-[11px] text-gray-600">
                View, filter, edit dates and links, or soft-delete notifications across all 9 directory categories.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setContentFilter('all')}
                className={`px-3 py-1 font-bold uppercase transition-colors cursor-pointer border ${
                  contentFilter === 'all'
                    ? 'bg-[#ab1818] text-white border-[#ab1818]'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                Live Active ({activeCount})
              </button>
              <button
                onClick={() => setContentFilter('trash')}
                className={`px-3 py-1 font-bold uppercase transition-colors cursor-pointer border ${
                  contentFilter === 'trash'
                    ? 'bg-[#850008] text-white border-[#850008]'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                Trash Bin ({trashCount})
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
                placeholder="Search title or board..."
                className="border border-gray-300 p-1.5 w-64 focus:outline-none"
              />
              <select
                value={contentCategory}
                onChange={(e) => setContentCategory(e.target.value)}
                className="border border-gray-300 p-1.5 bg-white focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="latest-job">Latest Job</option>
                <option value="teaching">Teaching Jobs</option>
                <option value="admit-card">Admit Card</option>
                <option value="result">Result</option>
                <option value="answer-key">Answer Key</option>
                <option value="syllabus">Syllabus</option>
                <option value="admission">Admissions</option>
                <option value="certificate">Certificates & Verification</option>
                <option value="outsourcing">Outsourcing</option>
                <option value="important">Important</option>
              </select>
            </div>

            <span className="text-gray-500">Showing {displayList.length} items</span>
          </div>

          {/* Content Table */}
          <div className="overflow-x-auto border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#001a40] text-white font-bold uppercase text-[11px]">
                  <th className="p-2 border-r border-white/20">Date</th>
                  <th className="p-2 border-r border-white/20">Title</th>
                  <th className="p-2 border-r border-white/20">Category</th>
                  <th className="p-2 border-r border-white/20">Organization</th>
                  <th className="p-2 border-r border-white/20 text-center">Age Limit</th>
                  <th className="p-2 border-r border-white/20">Last Date</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fff0ee]">
                    <td className="p-2 font-bold text-gray-600 whitespace-nowrap border-r border-gray-200">
                      {item.postDate}
                    </td>
                    <td className="p-2 font-bold text-gray-900 border-r border-gray-200 max-w-sm">
                      <div className="line-clamp-1">{item.title}</div>
                      {item.statusBadge && (
                        <span className="bg-[#d32f2f] text-white text-[9px] font-black px-1.5 py-0.2 uppercase rounded-[1px]">
                          {item.statusBadge}
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-gray-700 border-r border-gray-200 whitespace-nowrap uppercase">
                      {item.category}
                    </td>
                    <td className="p-2 text-gray-600 border-r border-gray-200 whitespace-nowrap">
                      {item.organization}
                    </td>
                    <td className="p-2 border-r border-gray-200 whitespace-nowrap text-center">
                      <span className="bg-blue-50 border border-blue-200 text-[#000066] px-1.5 py-0.5 rounded-[2px] block text-[11px] font-bold">
                        {item.ageMin || '18 Yrs'} - {item.ageMax || '35 Yrs'}
                      </span>
                      {item.ageAsOnDate && (
                        <span className="text-[9px] text-gray-500 block mt-0.5">As on {item.ageAsOnDate}</span>
                      )}
                    </td>
                    <td className="p-2 font-bold text-[#850008] border-r border-gray-200 whitespace-nowrap">
                      {item.lastDate || 'N/A'}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap space-x-2">
                      {contentFilter === 'all' ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setEditPdfFileName(
                                item.notificationUrl?.startsWith('data:')
                                  ? `${item.slug}-notification.pdf`
                                  : item.notificationUrl?.toLowerCase().endsWith('.pdf')
                                  ? item.notificationUrl.split('/').pop() || 'official_notice.pdf'
                                  : ''
                              );
                              setEditPdfUploadMode(item.notificationUrl?.startsWith('data:') ? 'upload' : 'url');
                            }}
                            className="text-[#000dff] hover:underline font-bold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              trashNotification(item.id);
                              triggerSuccess(`Moved "${item.title}" to trash.`);
                            }}
                            className="text-red-600 hover:underline font-bold cursor-pointer"
                          >
                            Trash
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              restoreNotification(item.id);
                              triggerSuccess(`Restored "${item.title}".`);
                            }}
                            className="text-green-700 hover:underline font-bold cursor-pointer"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Permanently delete "${item.title}"? This cannot be undone.`)) {
                                permanentDeleteNotification(item.id);
                                triggerSuccess(`Permanently removed "${item.title}".`);
                              }
                            }}
                            className="text-red-700 hover:underline font-bold cursor-pointer"
                          >
                            Delete Forever
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

                {displayList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No records found in this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TICKER MANAGER */}
      {activeTab === 'ticker' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#fff0ee] p-3.5 border border-[#f9dcd9]">
            <h2 className="text-sm font-bold text-[#850008] uppercase mb-1 font-serif">
              Live Breaking Alert Marquee Ticker
            </h2>
            <p className="text-xs text-gray-600">
              Manage the moving announcement bar that appears directly beneath the navigation on the public home page.
            </p>
          </div>

          {/* Quick 1-Click Pin From Published Notifications */}
          <div className="bg-[#f0f4ff] p-3.5 border border-blue-300 flex flex-col md:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-[#001a40] uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">push_pin</span>
                <span>Quick Pin from Live Published Notifications</span>
              </h4>
              <p className="text-[11px] text-gray-600">
                Pick any active job or result to instantly create a breaking marquee ticker link:
              </p>
            </div>
            <div className="w-full md:w-auto flex items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleQuickPinNotification(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="border border-blue-400 bg-white p-2 text-xs font-semibold focus:outline-none max-w-xs"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Select Notification to Pin --
                </option>
                {notifications
                  .filter((n) => !n.inTrash && n.published)
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      [{n.category.toUpperCase()}] {n.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Add new custom ticker item */}
          <form
            onSubmit={handleAddTicker}
            className="bg-[#f4f6f9] p-3.5 border border-gray-300 flex flex-col md:flex-row items-center gap-2"
          >
            <input
              type="text"
              required
              value={newTickerTitle}
              onChange={(e) => setNewTickerTitle(e.target.value)}
              placeholder="e.g. SSC MTS 2026 Online Form Date Extended"
              className="flex-1 bg-white border border-gray-300 p-2 focus:outline-none"
            />
            <input
              type="text"
              value={newTickerUrl}
              onChange={(e) => setNewTickerUrl(e.target.value)}
              placeholder="Target slug or URL (or leave blank for home)..."
              className="w-full md:w-64 bg-white border border-gray-300 p-2 focus:outline-none"
            />
            <select
              value={newTickerBadge}
              onChange={(e) => setNewTickerBadge(e.target.value)}
              className="bg-white border border-gray-300 p-2 focus:outline-none"
            >
              <option value="NEW">NEW</option>
              <option value="DECLARED">DECLARED</option>
              <option value="OUT">OUT</option>
              <option value="LIVE">LIVE</option>
              <option value="EXTENDED">EXTENDED</option>
            </select>
            <button
              type="submit"
              className="bg-[#ab1818] text-white px-4 py-2 font-bold uppercase hover:bg-[#8a0c0c] cursor-pointer whitespace-nowrap"
            >
              + Add to Ticker
            </button>
          </form>

          {/* Ticker list */}
          <div className="border border-gray-300 divide-y divide-gray-200">
            {tickerItems.map((item) => (
              <div key={item.id} className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50">
                <div className="flex items-center gap-2 flex-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.active ? 'bg-green-600' : 'bg-gray-400'
                    }`}
                  />
                  {item.badge && (
                    <span className="bg-[#d32f2f] text-white text-[9px] font-black px-1.5 py-0.2 uppercase rounded-[1px]">
                      {item.badge}
                    </span>
                  )}
                  <span className="font-bold text-gray-900">{item.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTickerItem(item.id)}
                    className={`px-2 py-1 text-[10px] font-bold uppercase cursor-pointer ${
                      item.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {item.active ? 'Active' : 'Disabled'}
                  </button>
                  <button
                    onClick={() => {
                      deleteTickerItem(item.id);
                      triggerSuccess(`Removed "${item.title}" from ticker.`);
                    }}
                    className="text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FEATURED TILES MANAGER */}
      {activeTab === 'featured' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#fff0ee] p-3 border border-[#f9dcd9]">
            <h2 className="text-xs font-bold text-[#850008] uppercase mb-1">
              Featured 8 Vibrant Action Tiles Grid
            </h2>
            <p className="text-[11px] text-gray-600">
              Customize the prominent 8 recruitment buttons located at the top of the homepage (titles, action labels, colors, and links).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {featuredTiles.map((tile) => (
              <div key={tile.id} className="border border-gray-300 p-3 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">Tile #{tile.id}</span>
                  <div
                    style={{ backgroundColor: tile.bgColor }}
                    className="w-4 h-4 rounded-xs border border-black/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-600 font-semibold block mb-0.5">Recruitment Title</label>
                  <input
                    type="text"
                    value={tile.title}
                    onChange={(e) => updateFeaturedTile(tile.id, { title: e.target.value })}
                    className="w-full border border-gray-300 p-1.5 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-600 font-semibold block mb-0.5">Action Label</label>
                    <input
                      type="text"
                      value={tile.actionText}
                      onChange={(e) => updateFeaturedTile(tile.id, { actionText: e.target.value })}
                      className="w-full border border-gray-300 p-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 font-semibold block mb-0.5">Background Hex</label>
                    <input
                      type="text"
                      value={tile.bgColor}
                      onChange={(e) => updateFeaturedTile(tile.id, { bgColor: e.target.value })}
                      className="w-full border border-gray-300 p-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-600 font-semibold block mb-0.5">Target Notification Slug</label>
                  <input
                    type="text"
                    value={tile.slug}
                    onChange={(e) => updateFeaturedTile(tile.id, { slug: e.target.value })}
                    className="w-full border border-gray-300 p-1.5 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: COMPETITOR RADAR & SEO */}
      {activeTab === 'radar' && (
        <CompetitorRadar onImportToPublish={handleImportToPublish} />
      )}

      {/* TAB 7: SETTINGS & RESET */}
      {activeTab === 'settings' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#fff0ee] p-3 border border-[#f9dcd9]">
            <h2 className="text-xs font-bold text-[#850008] uppercase mb-1">
              Portal System &amp; Data Maintenance
            </h2>
            <p className="text-[11px] text-gray-600">
              Manage database state, reset to seed data, and examine system health.
            </p>
          </div>

          <div className="border border-gray-300 p-4 bg-[#f4f6f9] space-y-3 max-w-xl">
            <h3 className="font-bold text-gray-900">Reset to Default Seed Data</h3>
            <p className="text-gray-600 leading-relaxed">
              If you wish to discard changes or restore all authentic notifications, tickers, and default board matrices as seen in the official portal prototype, use the reset option below.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all portal data to the default official dataset?')) {
                  resetToDefaults();
                  triggerSuccess('Portal data has been reset to official default state.');
                }
              }}
              className="bg-[#ab1818] hover:bg-[#8a0c0c] text-white font-bold text-xs px-4 py-2 uppercase cursor-pointer"
            >
              Reset All Portal Data
            </button>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* EDIT MODAL - FULL SUITE WITH CALENDAR PICKERS AND LINKS */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white max-w-3xl w-full p-4 sm:p-5 border-2 border-[#ab1818] shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-3">
              <h3 className="text-sm sm:text-base font-black text-[#850008] uppercase font-serif">
                Edit Notification: {editingItem.title}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-500 hover:text-black font-bold p-1 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              {/* Title */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full border border-gray-300 p-2 focus:outline-none bg-white font-medium"
                />
              </div>

              {/* Organization & Total Vacancies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Organization / Board</label>
                  <input
                    type="text"
                    value={editingItem.organization}
                    onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })}
                    className="w-full border border-gray-300 p-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Total Vacancies</label>
                  <input
                    type="text"
                    value={editingItem.totalVacancies}
                    onChange={(e) => setEditingItem({ ...editingItem, totalVacancies: e.target.value })}
                    className="w-full border border-gray-300 p-1.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* DATES WITH CALENDAR PICKERS IN EDIT MODAL */}
              <div className="border border-gray-300 p-3 bg-[#fbfbfb] space-y-2.5">
                <span className="font-bold text-[#850008] uppercase block font-serif">
                  Schedule Dates (With Native Calendar Selection)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NativeDatePicker
                    label="Application Started Date"
                    value={editingItem.postDate}
                    onChange={(val) => setEditingItem({ ...editingItem, postDate: val })}
                    allowCustomText={false}
                    quickPills={[{ label: 'Today', days: 0 }, { label: 'Yesterday', days: -1 }]}
                  />

                  <NativeDatePicker
                    label="Application Last Date"
                    value={editingItem.lastDate || ''}
                    onChange={(val) => setEditingItem({ ...editingItem, lastDate: val })}
                    minDate={editingItem.postDate}
                    allowCustomText={false}
                    baseDateForOffset={editingItem.postDate}
                    quickPills={[{ label: '+15 Days', days: 15 }, { label: '+30 Days', days: 30 }]}
                  />

                  <NativeDatePicker
                    label="Exam Date"
                    value={editingItem.examDate || ''}
                    onChange={(val) => setEditingItem({ ...editingItem, examDate: val })}
                    allowCustomText={true}
                    quickPills={[{ label: 'Notified Soon', fixed: 'Notified Soon' }]}
                  />

                  <NativeDatePicker
                    label="Admit Card Available Date"
                    value={editingItem.admitCardDate || ''}
                    onChange={(val) => setEditingItem({ ...editingItem, admitCardDate: val })}
                    allowCustomText={true}
                    quickPills={[{ label: 'Before Exam', fixed: 'Before Exam' }, { label: 'Out Now', fixed: 'Out Now' }]}
                  />
                </div>
              </div>

              {/* Edit Modal: Fees & Age Limits */}
              <div className="border border-blue-200 bg-[#f0f4ff] p-3 space-y-2.5">
                <span className="font-bold text-[#000066] uppercase block font-serif text-xs">
                  Candidate Age Limits &amp; Application Fee Parameters
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="font-bold text-gray-700 block mb-0.5">Minimum Age</label>
                    <input
                      type="text"
                      value={editingItem.ageMin || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, ageMin: e.target.value })}
                      placeholder="e.g. 18 Years"
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white font-medium"
                    />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['18 Years', '20 Years', '21 Years', '25 Years', 'No Min'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, ageMin: preset })}
                          className="text-[9px] bg-white hover:bg-blue-100 border border-gray-300 px-1 py-0.2 rounded-[1px] cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-0.5">Maximum Age</label>
                    <input
                      type="text"
                      value={editingItem.ageMax || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, ageMax: e.target.value })}
                      placeholder="e.g. 35-40 Years"
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white font-medium"
                    />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['25 Years', '28 Years', '30 Years', '35 Years', '40 Years', '42 Years', 'No Max'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, ageMax: preset })}
                          className="text-[9px] bg-white hover:bg-blue-100 border border-gray-300 px-1 py-0.2 rounded-[1px] cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <NativeDatePicker
                    label="Age As On Date"
                    value={editingItem.ageAsOnDate || '01/07/2026'}
                    onChange={(val) => setEditingItem({ ...editingItem, ageAsOnDate: val })}
                    allowCustomText={true}
                    quickPills={[{ label: '01/07/2026', fixed: '01/07/2026' }, { label: '01/01/2026', fixed: '01/01/2026' }, { label: '01/08/2026', fixed: '01/08/2026' }]}
                  />
                </div>

                {/* Post-Wise Age Limits */}
                <div>
                  <label className="font-bold text-gray-700 block mb-0.5">Post-Wise / Cadre Age Criteria (Optional)</label>
                  <input
                    type="text"
                    value={editingItem.postWiseAgeLimits || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, postWiseAgeLimits: e.target.value })}
                    placeholder="e.g. Clerk: 18-27 Yrs | Inspector: 21-30 Yrs | Officer: 21-35 Yrs"
                    className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-0.5">Age Relaxation Rules / Notes</label>
                  <input
                    type="text"
                    value={editingItem.ageRelaxationNotes || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, ageRelaxationNotes: e.target.value })}
                    placeholder="e.g. Age Relaxation Extra as per Rules (SC/ST: 5 Yrs, OBC: 3 Yrs)"
                    className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {[
                      'Age Relaxation Extra as per Official Recruitment Rules',
                      'OBC: 3 Yrs | SC/ST: 5 Yrs | PwD: 10 Yrs Relaxation',
                      'Ex-Servicemen: 3 to 5 Years Relaxation',
                    ].map((rule) => (
                      <button
                        key={rule}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, ageRelaxationNotes: rule })}
                        className="text-[9px] bg-white hover:bg-blue-100 border border-gray-300 px-1.5 py-0.5 rounded-[1px] cursor-pointer"
                      >
                        {rule}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-blue-200">
                  <div>
                    <label className="font-bold text-gray-700 block mb-0.5">General / OBC Fee</label>
                    <input
                      type="text"
                      value={editingItem.feeGeneral || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, feeGeneral: e.target.value })}
                      placeholder="e.g. ₹500"
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-0.5">SC / ST / Reserved Fee</label>
                    <input
                      type="text"
                      value={editingItem.feeReserved || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, feeReserved: e.target.value })}
                      placeholder="e.g. ₹200 or Nil"
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Category, Status Badge & State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Target Category / Directory</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as NotificationCategory })}
                    className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white font-bold text-[#850008]"
                  >
                    <option value="latest-job">Latest Job</option>
                    <option value="teaching">Teaching Jobs</option>
                    <option value="admit-card">Admit Card</option>
                    <option value="result">Result</option>
                    <option value="answer-key">Answer Key & Objection</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="admission">Admissions</option>
                    <option value="certificate">Certificates & Verification</option>
                    <option value="outsourcing">Outsourcing</option>
                    <option value="important">Important</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">State / Region</label>
                  <input
                    type="text"
                    value={editingItem.state}
                    onChange={(e) => setEditingItem({ ...editingItem, state: e.target.value })}
                    className="w-full border border-gray-300 p-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Highlight Badge</label>
                  <select
                    value={editingItem.statusBadge || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        statusBadge: (e.target.value as StatusBadgeType) || null,
                      })
                    }
                    className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white font-bold"
                  >
                    <option value="">None</option>
                    <option value="UPCOMING">UPCOMING (Purple Glow)</option>
                    <option value="NEW">NEW (Red)</option>
                    <option value="ACTIVE">ACTIVE (Green)</option>
                    <option value="DECLARED">DECLARED (Red)</option>
                    <option value="OUT">OUT (Red)</option>
                    <option value="EXTENDED">EXTENDED (Amber)</option>
                  </select>
                </div>
              </div>

              {/* Minimum Qualification with 13 pills in Edit Modal */}
              <div className="bg-gray-50 p-2.5 border border-gray-200 space-y-1.5">
                <label className="font-bold text-gray-800 block">Minimum Qualification</label>
                <input
                  type="text"
                  value={editingItem.qualification}
                  onChange={(e) => setEditingItem({ ...editingItem, qualification: e.target.value })}
                  className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white"
                />
                <div className="flex flex-wrap gap-1">
                  {QUALIFICATION_OPTIONS.map((q) => {
                    const isSelected = (editingItem.qualification || '').toLowerCase().includes(q.toLowerCase());
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          const cur = editingItem.qualification || '';
                          if (isSelected) {
                            const parts = cur.split(',').map((s) => s.trim()).filter((s) => s.toLowerCase() !== q.toLowerCase());
                            setEditingItem({ ...editingItem, qualification: parts.join(', ') });
                          } else {
                            setEditingItem({ ...editingItem, qualification: cur ? `${cur}, ${q}` : q });
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-xs font-bold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#000066] text-white border-[#000066]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answer Key Specific Configuration in Edit Modal */}
              <div className="border border-purple-300 bg-purple-50/30 p-2.5 space-y-2">
                <span className="font-black text-purple-900 uppercase block text-xs">
                  Answer Key Dates &amp; Download / Objection Links
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <NativeDatePicker
                    label="Answer Key Release Date"
                    value={editingItem.answerKeyDate || ''}
                    onChange={(val) => setEditingItem({ ...editingItem, answerKeyDate: val })}
                    quickPills={[{ label: 'Today', days: 0 }, { label: 'Upcoming Soon', fixed: 'Upcoming Soon' }]}
                  />
                  <NativeDatePicker
                    label="Answer Key Closing (Objection Last Date)"
                    value={editingItem.answerKeyCloseDate || ''}
                    onChange={(val) => setEditingItem({ ...editingItem, answerKeyCloseDate: val })}
                    minDate={editingItem.answerKeyDate}
                    quickPills={[{ label: '+7 Days', days: 7 }, { label: '+10 Days', days: 10 }]}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-purple-900 block mb-0.5">Answer Key Download Link</label>
                    <input
                      type="url"
                      value={editingItem.answerKeyUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, answerKeyUrl: e.target.value })}
                      placeholder="https://official-commission.gov.in/answerkey.pdf"
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-purple-900 block mb-0.5">Objection Challenge Portal Link</label>
                    <input
                      type="url"
                      value={editingItem.objectionUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, objectionUrl: e.target.value })}
                      placeholder="https://official-commission.gov.in/objection"
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Teaching Specific Configuration in Edit Modal */}
              <div className="border border-emerald-300 bg-emerald-50/30 p-2.5 space-y-2">
                <span className="font-black text-emerald-900 uppercase block text-xs">
                  Teacher Specific Criteria (PRT/TGT/PGT, TET Requirement, Subject)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-0.5">Teacher Post Level</label>
                    <input
                      type="text"
                      value={editingItem.teachingLevel || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, teachingLevel: e.target.value })}
                      placeholder="e.g. PRT / TGT / PGT"
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-0.5">TET Requirement</label>
                    <input
                      type="text"
                      value={editingItem.tetRequirement || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, tetRequirement: e.target.value })}
                      placeholder="e.g. CTET / JTET / Bihar STET / UPTET"
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-0.5">Subject / Discipline</label>
                    <input
                      type="text"
                      value={editingItem.teachingSubject || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, teachingSubject: e.target.value })}
                      placeholder="e.g. Mathematics, Science, Hindi"
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* USEFUL IMPORTANT LINKS IN EDIT MODAL */}
              <div className="border border-[#ab1818] p-3 bg-[#fff8f7] space-y-2">
                <span className="font-bold text-[#850008] uppercase block font-serif">
                  Useful Important Links (Server I, Server II, PDF &amp; Portals)
                </span>

                <div>
                  <label className="font-bold text-gray-700 block mb-0.5">Apply Online (Server I) URL</label>
                  <input
                    type="url"
                    value={editingItem.applyUrl}
                    onChange={(e) => setEditingItem({ ...editingItem, applyUrl: e.target.value })}
                    className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-0.5">Apply Online (Server II Backup) URL</label>
                  <input
                    type="url"
                    value={editingItem.applyUrlServer2 || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, applyUrlServer2: e.target.value })}
                    className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white"
                  />
                </div>

                {/* Row 3: Official Commission Website URL */}
                <div>
                  <label className="font-bold text-gray-700 block mb-0.5">Official Commission Website URL</label>
                  <input
                    type="url"
                    value={editingItem.officialUrl}
                    onChange={(e) => setEditingItem({ ...editingItem, officialUrl: e.target.value })}
                    className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white"
                  />
                </div>

                {/* Row 4: Download Official Notification PDF (With Upload Dropzone) */}
                <div className="bg-white p-2.5 border border-gray-300 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#850008] block">Download Official Notification PDF</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditPdfUploadMode('upload')}
                        className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-xs border cursor-pointer ${
                          editPdfUploadMode === 'upload'
                            ? 'bg-[#ab1818] text-white border-[#ab1818]'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        Upload PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditPdfUploadMode('url')}
                        className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-xs border cursor-pointer ${
                          editPdfUploadMode === 'url'
                            ? 'bg-[#ab1818] text-white border-[#ab1818]'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        Web Link URL
                      </button>
                    </div>
                  </div>

                  {editPdfUploadMode === 'upload' ? (
                    <div>
                      <div
                        onClick={() => document.getElementById('edit-pdf-upload-input')?.click()}
                        className="border-2 border-dashed border-gray-300 hover:border-[#ab1818] rounded-xs p-3 text-center cursor-pointer bg-gray-50 hover:bg-[#fff9f8] transition-colors"
                      >
                        <input
                          id="edit-pdf-upload-input"
                          type="file"
                          accept="application/pdf,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handlePdfUpload(e.target.files[0], true);
                            }
                          }}
                        />
                        {editingItem.notificationUrl?.startsWith('data:application/pdf') || editPdfFileName ? (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-left">
                              <span className="material-symbols-outlined text-[26px] text-red-600">picture_as_pdf</span>
                              <div>
                                <p className="font-bold text-gray-900 text-xs">{editPdfFileName || 'official_notice.pdf'}</p>
                                <p className="text-[10px] text-emerald-700 font-bold">✅ PDF Attached</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleOpenPdfPreview(editingItem.notificationUrl || '', editPdfFileName || `${editingItem.slug}-notification.pdf`)}
                                className="px-2 py-0.5 bg-[#000066] hover:bg-[#001a40] text-white text-[10px] font-bold rounded-xs cursor-pointer inline-flex items-center gap-1 shadow-xs"
                                title="Open interactive PDF viewer"
                              >
                                <span>Preview</span>
                                <span className="material-symbols-outlined text-[12px]">visibility</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => downloadPdfFile(editingItem.notificationUrl || '', editPdfFileName || `${editingItem.slug}-notification.pdf`)}
                                className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold rounded-xs cursor-pointer inline-flex items-center gap-1 shadow-xs"
                                title="Download PDF to computer"
                              >
                                <span>Download</span>
                                <span className="material-symbols-outlined text-[12px]">download</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditPdfFileName('');
                                  setEditingItem({ ...editingItem, notificationUrl: '' });
                                }}
                                className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-xs cursor-pointer"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-gray-600 py-1">
                            <span className="material-symbols-outlined text-[24px] text-[#ab1818]">upload_file</span>
                            <span className="font-bold text-xs">Click to browse or drop replacement PDF notice (.pdf)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={editingItem.notificationUrl}
                      onChange={(e) => setEditingItem({ ...editingItem, notificationUrl: e.target.value })}
                      className="w-full border border-gray-300 p-1.5 focus:outline-none bg-white text-xs font-medium"
                      placeholder="https://official-board.gov.in/notification.pdf"
                    />
                  )}
                </div>
              </div>

              {/* Short Desc & Eligibility */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingItem.shortDescription}
                  onChange={(e) => setEditingItem({ ...editingItem, shortDescription: e.target.value })}
                  className="w-full border border-gray-300 p-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Eligibility Criteria</label>
                <textarea
                  rows={2}
                  value={editingItem.eligibility}
                  onChange={(e) => setEditingItem({ ...editingItem, eligibility: e.target.value })}
                  className="w-full border border-gray-300 p-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Step-by-Step How to Apply</label>
                <textarea
                  rows={2}
                  value={editingItem.howToApply || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, howToApply: e.target.value })}
                  className="w-full border border-gray-300 p-1.5 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Full Article / Notice Guidelines Content</label>
                <textarea
                  rows={3}
                  value={editingItem.articleContent || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, articleContent: e.target.value })}
                  className="w-full border border-gray-300 p-1.5 focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ab1818] text-white px-5 py-1.5 font-bold uppercase hover:bg-[#8a0c0c] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive PDF Preview In-App Modal */}
      {pdfPreviewModal && pdfPreviewModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded shadow-2xl w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden border border-gray-400">
            {/* Modal Header */}
            <div className="bg-[#000066] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="material-symbols-outlined text-[22px] text-red-400">picture_as_pdf</span>
                <span className="font-bold text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                  {pdfPreviewModal.fileName}
                </span>
                <span className="hidden sm:inline bg-white/20 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                  PDF Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadPdfFile(pdfPreviewModal.url, pdfPreviewModal.fileName)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xs cursor-pointer inline-flex items-center gap-1 shadow-xs"
                  title="Download PDF to computer"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => openPdfInBrowser(pdfPreviewModal.url, pdfPreviewModal.fileName)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xs cursor-pointer inline-flex items-center gap-1 shadow-xs"
                  title="Open in new browser tab"
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  <span>New Tab</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPdfPreviewModal(null)}
                  className="p-1 hover:bg-white/20 rounded-xs cursor-pointer text-white"
                  title="Close Preview"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body with embedded PDF viewer */}
            <div className="flex-1 bg-gray-200 relative overflow-hidden flex flex-col">
              <iframe
                src={pdfPreviewModal.url}
                className="w-full flex-1 border-0 bg-white"
                title="PDF Preview Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
