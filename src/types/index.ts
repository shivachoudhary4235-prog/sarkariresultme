export type NotificationCategory =
  | 'result'
  | 'admit-card'
  | 'latest-job'
  | 'teaching'
  | 'answer-key'
  | 'syllabus'
  | 'outsourcing'
  | 'important'
  | 'admission'
  | 'certificate';

export type StatusBadgeType =
  | 'DECLARED'
  | 'ACTIVE'
  | 'OUT'
  | 'EXTENDED'
  | 'NEW'
  | 'CORRECTION'
  | 'UPCOMING'
  | null;

export interface CustomLinkItem {
  id: string;
  title: string;
  url: string;
  actionText: string;
  isButton?: boolean;
  buttonColor?: 'red' | 'navy' | 'green' | 'default';
}

export interface NotificationItem {
  id: string;
  slug: string;
  title: string;
  category: NotificationCategory;
  organization: string;
  department?: string;
  state: string;
  qualification: string;
  totalVacancies: string;
  postDate: string;
  lastDate?: string;
  examDate?: string;
  admitCardDate?: string;
  resultDate?: string;
  answerKeyDate?: string;
  answerKeyCloseDate?: string;
  answerKeyUrl?: string;
  objectionUrl?: string;
  teachingLevel?: string;
  teachingSubject?: string;
  tetRequirement?: string;
  feeGeneral?: string;
  feeReserved?: string;
  ageMin?: string;
  ageMax?: string;
  ageAsOnDate?: string;
  ageRelaxationNotes?: string;
  postWiseAgeLimits?: string;
  eligibility: string;
  shortDescription: string;
  applyUrl: string; // Apply Online (Server I)
  applyUrlServer2?: string; // Apply Online (Server II Backup)
  notificationUrl: string; // Download Official Notification PDF
  officialUrl: string; // Official Commission Website
  telegramUrl?: string;
  whatsappUrl?: string;
  customLinks?: CustomLinkItem[];
  articleContent?: string;
  howToApply?: string;
  selectionProcess?: string;
  statusBadge: StatusBadgeType;
  featured?: boolean;
  published: boolean;
  views?: number;
  inTrash?: boolean;
}

export interface TickerItem {
  id: string;
  title: string;
  url: string;
  active: boolean;
  category?: string;
  badge?: string;
  targetSlug?: string;
}

export interface FeaturedTile {
  id: string;
  title: string;
  actionText: string;
  bgColor: string; // e.g. '#d32f2f', '#004076', '#2e7d32', etc.
  actionColor: string; // e.g. '#ffea00', '#ffffff'
  slug: string;
  active: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type ActiveScreen =
  | 'home'
  | 'directory'
  | 'detail'
  | 'admin'
  | 'search'
  | 'about'
  | 'contact'
  | 'disclaimer'
  | 'privacy-policy'
  | 'cookie-policy'
  | 'terms'
  | 'editorial-policy'
  | 'correction-policy'
  | 'sitemap';
