// ─── Enums ───────────────────────────────────────────────────────────────────

export type SubscriptionPlan = "free" | "starter" | "professional" | "enterprise";

export type UserRole = "owner" | "admin" | "member" | "viewer";

export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "condo"
  | "cabin"
  | "other";

export type PermitStatus =
  | "pending"
  | "active"
  | "expired"
  | "revoked"
  | "cancelled";

export type BookingSource =
  | "manual"
  | "airbnb"
  | "vrbo"
  | "booking_com"
  | "other";

export type ComplianceStatus =
  | "compliant"
  | "warning"
  | "non_compliant"
  | "unknown";

// ─── Core Entities ───────────────────────────────────────────────────────────

export interface Organisation {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  maxProperties: number;
  maxUsers: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organisationId: string;
  organisationName?: string;
  avatarUrl: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  organisationId: string;
  name: string;
  address: string;
  city: string;
  stateRegion: string;
  countryCode: string;
  postalCode: string;
  propertyType: PropertyType;
  jurisdictionId: string;
  complianceScore: number;
  complianceStatus: ComplianceStatus;
  latitude: number | null;
  longitude: number | null;
  bedroomCount: number;
  maxGuests: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permit {
  id: string;
  propertyId: string;
  permitType: string;
  permitNumber: string;
  status: PermitStatus;
  issuedAt: string;
  expiresAt: string;
  issuingAuthority: string;
  notes: string | null;
  documentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Jurisdiction {
  id: string;
  name: string;
  countryCode: string;
  stateCode: string;
  localityName: string | null;
  annualNightCap: number | null;
  requiresPermit: boolean;
  requiresRegistration: boolean;
  taxRate: number | null;
  regulationUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NightCapSummary {
  propertyId: string;
  year: number;
  nightCap: number;
  nightsUsed: number;
  nightsRemaining: number;
  percentage: number;
  status: string;
}

export interface BookedNight {
  id: string;
  propertyId: string;
  date: string;
  source: BookingSource;
  guestName: string | null;
  platform: string | null;
  confirmationCode: string | null;
  createdAt: string;
}

export interface Document {
  id: string;
  propertyId: string;
  organisationId: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  documentType: string;
  storageKey: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ICalFeed {
  id: string;
  propertyId: string;
  feedUrl: string;
  source: BookingSource;
  label: string;
  isActive: boolean;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  syncErrorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  organisationId: string;
  userId: string | null;
  type: string;
  channel: string;
  subject: string;
  body: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface AlertSubscription {
  id: string;
  userId: string;
  organisationId: string;
  propertyId: string | null;
  alertType: string;
  channel: string;
  isActive: boolean;
  thresholdValue: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegulatoryChange {
  id: string;
  jurisdictionId: string;
  title: string;
  summary: string;
  detailUrl: string | null;
  effectiveDate: string;
  severity: "low" | "medium" | "high" | "critical";
  isAcknowledged: boolean;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  createdAt: string;
}

// ─── Compliance Types ────────────────────────────────────────────────────────

export interface ComplianceBreakdown {
  propertyId: string;
  totalScore: number;
  components: ComplianceComponent[];
  recommendations: string[];
}

export interface ComplianceComponent {
  name: string;
  maxPoints: number;
  earnedPoints: number;
  status: ComplianceStatus;
  description: string;
}

// ─── EU Registration ─────────────────────────────────────────────────────────

export interface EuRegistrationProgress {
  propertyId: string;
  status: string;
  completedSteps: number;
  totalSteps: number;
  percentComplete: number;
  steps: RegistrationStep[];
}

export interface RegistrationStep {
  stepName: string;
  displayName: string;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
  order: number;
}

// ─── AU Compliance ───────────────────────────────────────────────────────────

export interface AuLevySummary {
  propertyId: string;
  year: number;
  totalNights: number;
  levyRatePerNight: number;
  totalOwed: number;
  totalPaid: number;
  balance: number;
  status: string;
}

export interface AuFireSafety {
  id: string;
  propertyId: string;
  smokeAlarmsInstalled: boolean;
  fireExtinguisherPresent: boolean;
  evacuationPlanDisplayed: boolean;
  lastInspectionDate: string | null;
  nextInspectionDue: string | null;
  complianceStatus: ComplianceStatus;
  actionItems: string[];
}

// ─── US Tax ──────────────────────────────────────────────────────────────────

export interface UsTaxSummary {
  propertyId: string;
  year: number;
  taxType: string;
  taxRate: number;
  totalTaxOwed: number;
  totalTaxPaid: number;
  balance: number;
  filingDeadline: string | null;
  status: string;
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organisationName: string;
  country?: string;
  timezone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ─── Billing Types ───────────────────────────────────────────────────────────

export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
}

export interface CreateCheckoutRequest {
  plan: SubscriptionPlan;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
}
