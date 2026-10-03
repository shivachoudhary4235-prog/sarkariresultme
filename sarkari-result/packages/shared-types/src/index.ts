/**
 * @sarkari/shared-types
 *
 * Shared TypeScript types used across:
 *   - apps/web       (Next.js public website)
 *   - apps/admin     (Next.js admin CMS)
 *   - services/api   (Node.js / Express backend)
 *
 * This is the single source of truth for all data models.
 * Migrated from the original src/types/index.ts.
 */

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationCategory =
  | 'result'
  | 'admit-card'
  | 'latest-job'
  | 'teaching'
  | 'answer-key'
  | 'syllabus'
  | 'outsourcing'
  | 'important';

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
  applyUrl: string;               // Apply Online (Server I)
  applyUrlServer2?: string;       // Apply Online (Server II Backup)
  notificationUrl: string;        // Download Official Notification PDF
  officialUrl: string;            // Official Commission Website
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
  // Database-only fields (added after migration)
  createdAt?: string;             // ISO timestamp
  updatedAt?: string;             // ISO timestamp
  createdBy?: string;             // user id
  updatedBy?: string;             // user id
}

// ─────────────────────────────────────────────────────────────────────────────
// TICKER TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface TickerItem {
  id: string;
  title: string;
  url: string;
  active: boolean;
  category?: string;
  badge?: string;
  targetSlug?: string;
  sortOrder?: number;
  createdAt?: string;
  createdBy?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED TILE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface FeaturedTile {
  id: string;
  title: string;
  actionText: string;
  bgColor: string;       // e.g. '#d32f2f', '#004076', '#2e7d32'
  actionColor: string;   // e.g. '#ffea00', '#ffffff'
  slug: string;
  active: boolean;
  sortOrder?: number;
  updatedAt?: string;
  updatedBy?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA / STORAGE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface MediaFile {
  id: string;
  storagePath: string;
  publicUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string;
  uploadedBy: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN / AUTH TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type AdminRole = 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'EDITOR' | 'MODERATOR';

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  avatarUrl?: string;
  lastSignInAt?: string;
  createdAt: string;
  isActive: boolean;
}

export interface RolePermissions {
  canCreateNotification: boolean;
  canEditNotification: boolean;
  canDeleteNotification: boolean;
  canPublishNotification: boolean;
  canManageTicker: boolean;
  canManageFeatured: boolean;
  canManageFAQ: boolean;
  canUploadMedia: boolean;
  canDeleteMedia: boolean;
  canManageUsers: boolean;
  canChangeRoles: boolean;
  canViewAuditLogs: boolean;
  canManageSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<AdminRole, RolePermissions> = {
  SUPER_ADMIN: {
    canCreateNotification: true,
    canEditNotification: true,
    canDeleteNotification: true,
    canPublishNotification: true,
    canManageTicker: true,
    canManageFeatured: true,
    canManageFAQ: true,
    canUploadMedia: true,
    canDeleteMedia: true,
    canManageUsers: true,
    canChangeRoles: true,
    canViewAuditLogs: true,
    canManageSettings: true,
  },
  CONTENT_ADMIN: {
    canCreateNotification: true,
    canEditNotification: true,
    canDeleteNotification: false,
    canPublishNotification: true,
    canManageTicker: true,
    canManageFeatured: true,
    canManageFAQ: true,
    canUploadMedia: true,
    canDeleteMedia: false,
    canManageUsers: false,
    canChangeRoles: false,
    canViewAuditLogs: true,
    canManageSettings: false,
  },
  EDITOR: {
    canCreateNotification: true,
    canEditNotification: true,
    canDeleteNotification: false,
    canPublishNotification: false,
    canManageTicker: false,
    canManageFeatured: false,
    canManageFAQ: false,
    canUploadMedia: true,
    canDeleteMedia: false,
    canManageUsers: false,
    canChangeRoles: false,
    canViewAuditLogs: false,
    canManageSettings: false,
  },
  MODERATOR: {
    canCreateNotification: false,
    canEditNotification: true,
    canDeleteNotification: false,
    canPublishNotification: false,
    canManageTicker: false,
    canManageFeatured: false,
    canManageFAQ: false,
    canUploadMedia: false,
    canDeleteMedia: false,
    canManageUsers: false,
    canChangeRoles: false,
    canViewAuditLogs: false,
    canManageSettings: false,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOG TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'CREATE_NOTIFICATION'
  | 'UPDATE_NOTIFICATION'
  | 'DELETE_NOTIFICATION'
  | 'RESTORE_NOTIFICATION'
  | 'PUBLISH_NOTIFICATION'
  | 'UNPUBLISH_NOTIFICATION'
  | 'CREATE_TICKER'
  | 'UPDATE_TICKER'
  | 'DELETE_TICKER'
  | 'UPDATE_FEATURED'
  | 'CREATE_FAQ'
  | 'UPDATE_FAQ'
  | 'DELETE_FAQ'
  | 'UPLOAD_MEDIA'
  | 'DELETE_MEDIA'
  | 'ROLE_CHANGED'
  | 'USER_CREATED'
  | 'USER_DEACTIVATED'
  | 'SETTINGS_CHANGED'
  | 'ADMIN_LOGIN'
  | 'ADMIN_LOGOUT';

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorEmail: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteSettings {
  id: string;
  siteName: string;
  siteTagline: string;
  telegramChannelUrl: string;
  whatsappGroupUrl: string;
  footerText: string;
  maintenanceMode: boolean;
  updatedAt: string;
  updatedBy: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;        // Generic, safe for users
  code?: string;          // e.g. 'VALIDATION_ERROR', 'NOT_FOUND'
  // Never expose: stack traces, SQL errors, internal paths, secrets
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION / VIEW TYPES (kept for client-side routing compat)
// ─────────────────────────────────────────────────────────────────────────────

export type ActiveScreen = 'home' | 'directory' | 'detail' | 'admin' | 'search';

export type FontScale = 'standard' | 'large' | 'xlarge';

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchFilters {
  query?: string;
  category?: NotificationCategory | 'all';
  state?: string;
  qualification?: string;
  status?: StatusBadgeType;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  items: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
