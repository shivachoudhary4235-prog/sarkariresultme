/**
 * Date formatting and calendar helper utilities for Sarkari Result Portal
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  january: 0, february: 1, march: 2, april: 3, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/**
 * Converts an ISO string (YYYY-MM-DD) from a date picker into display format "DD Mon YYYY" (e.g. "25 Oct 2026")
 */
export function isoToDisplayDate(iso: string): string {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(monthIdx) || isNaN(day)) return iso;
  const monthName = MONTHS[monthIdx] || '';
  return `${day} ${monthName} ${year}`;
}

/**
 * Converts a display date string ("25 Oct 2026" or "25/10/2026") into ISO string (YYYY-MM-DD) for <input type="date">
 */
export function displayDateToIso(display: string): string {
  if (!display) return '';
  const trimmed = display.trim();

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // Pattern: "DD Mon YYYY" or "D Mon YYYY"
  const textMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (textMatch) {
    const day = parseInt(textMatch[1], 10);
    const monthKey = textMatch[2].toLowerCase();
    const year = parseInt(textMatch[3], 10);
    const monthIdx = MONTH_MAP[monthKey];
    if (monthIdx !== undefined) {
      const mm = String(monthIdx + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      return `${year}-${mm}-${dd}`;
    }
  }

  // Pattern: "DD/MM/YYYY"
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const day = String(parseInt(slashMatch[1], 10)).padStart(2, '0');
    const month = String(parseInt(slashMatch[2], 10)).padStart(2, '0');
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  return '';
}

/**
 * Quick date helper to get offset date from today in "DD Mon YYYY" format
 */
export function getOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Quick date helper to get offset date from a given base date in "DD Mon YYYY" format
 */
export function getOffsetFromDateString(baseDisplayDate: string, daysOffset: number): string {
  const iso = displayDateToIso(baseDisplayDate);
  const d = iso ? new Date(iso + 'T12:00:00') : new Date();
  d.setDate(d.getDate() + daysOffset);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Calculates day difference between two dates (end - start).
 * Returns positive if end is after start, 0 if same day, negative if end is before start.
 */
export function getDaysDifference(startDateStr: string, endDateStr: string): number | null {
  const startIso = displayDateToIso(startDateStr);
  const endIso = displayDateToIso(endDateStr);
  if (!startIso || !endIso) return null;
  const start = new Date(startIso + 'T00:00:00');
  const end = new Date(endIso + 'T00:00:00');
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  const diffTime = end.getTime() - start.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Returns formatted date with weekday name, e.g. "28 Oct 2026 (Wednesday)"
 */
export function getFormattedDateWithDay(displayDate: string): string {
  const iso = displayDateToIso(displayDate);
  if (!iso) return displayDate;
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return displayDate;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[d.getDay()];
  return `${displayDate} (${dayName})`;
}

/**
 * Determines whether a job is live or expired based on its last application date and status
 */
export function checkJobExpirationStatus(lastDateStr?: string, statusBadge?: string | null): {
  isExpired: boolean;
  statusText: string;
  daysRemaining: number | null;
} {
  if (!lastDateStr) {
    return { isExpired: false, statusText: 'Live / Ongoing', daysRemaining: null };
  }

  const trimmed = lastDateStr.trim().toLowerCase();
  if (trimmed.includes('closed') || trimmed.includes('expired') || trimmed.includes('over')) {
    return { isExpired: true, statusText: 'Expired / Closed', daysRemaining: 0 };
  }

  const iso = displayDateToIso(lastDateStr);
  if (iso) {
    const targetDate = new Date(iso + 'T23:59:59');
    const now = new Date();
    if (!isNaN(targetDate.getTime())) {
      const diffMs = targetDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        return { isExpired: true, statusText: 'Application Closed', daysRemaining: diffDays };
      }
      return {
        isExpired: false,
        statusText: diffDays === 0 ? 'Last Day Today' : `${diffDays} days left`,
        daysRemaining: diffDays,
      };
    }
  }

  return { isExpired: false, statusText: 'Active', daysRemaining: null };
}
