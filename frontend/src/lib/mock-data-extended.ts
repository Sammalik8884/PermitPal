import type { NotificationLog, RegulatoryChange } from "@/types";

// ─── Alerts & Notifications Extended Mock Data ───────────────────────────────

export const mockNotificationsExtended: NotificationLog[] = [
  { id: "notif-001", organisationId: "org-001", userId: "user-001", type: "permit_expiry", channel: "in_app", subject: "Permit Expiring Soon", body: "Your permit for Alpine Chalet Zermatt expires in 6 days. Please initiate the renewal process.", isRead: false, readAt: null, createdAt: "2026-05-23T08:00:00Z" },
  { id: "notif-002", organisationId: "org-001", userId: "user-001", type: "night_cap_warning", channel: "in_app", subject: "Night Cap Critical — 93%", body: "Bondi Beach House has used 167 of 180 nights (93%). Consider blocking new bookings.", isRead: false, readAt: null, createdAt: "2026-05-22T09:00:00Z" },
  { id: "notif-003", organisationId: "org-001", userId: "user-001", type: "regulatory_change", channel: "in_app", subject: "Paris Night Cap Reduction", body: "Paris is reducing the annual night cap from 120 to 90 nights effective January 2027.", isRead: false, readAt: null, createdAt: "2026-05-21T14:00:00Z" },
  { id: "notif-004", organisationId: "org-001", userId: "user-001", type: "night_cap_warning", channel: "in_app", subject: "Night Cap Warning — 82%", body: "Montmartre Loft has used 98 of 120 nights (82%). Only 22 nights remaining.", isRead: false, readAt: null, createdAt: "2026-05-21T09:00:00Z" },
  { id: "notif-005", organisationId: "org-001", userId: "user-001", type: "system", channel: "in_app", subject: "iCal Sync Failed", body: "Manhattan Airbnb feed returned 403 Forbidden. Please re-generate the iCal link.", isRead: false, readAt: null, createdAt: "2026-05-20T07:00:00Z" },
  { id: "notif-006", organisationId: "org-001", userId: "user-001", type: "permit_expiry", channel: "in_app", subject: "Permit Renewal Submitted", body: "Your permit renewal application for Alpine Chalet Zermatt has been submitted successfully.", isRead: true, readAt: "2026-05-19T12:00:00Z", createdAt: "2026-05-19T11:30:00Z" },
  { id: "notif-007", organisationId: "org-001", userId: "user-001", type: "regulatory_change", channel: "in_app", subject: "NSW STRA Code Update", body: "Updated code of conduct for short-term rental accommodation providers in NSW published.", isRead: true, readAt: "2026-05-18T15:00:00Z", createdAt: "2026-05-18T13:20:00Z" },
  { id: "notif-008", organisationId: "org-001", userId: "user-001", type: "system", channel: "in_app", subject: "Payment Processed", body: "Your monthly subscription payment of $79.00 has been processed successfully.", isRead: true, readAt: "2026-05-15T10:00:00Z", createdAt: "2026-05-15T09:00:00Z" },
  { id: "notif-009", organisationId: "org-001", userId: "user-001", type: "permit_expiry", channel: "in_app", subject: "Fire Safety Certificate Expired", body: "The fire safety certificate for Bondi Beach House expired on Nov 20, 2025. Schedule reinspection.", isRead: true, readAt: "2026-05-14T08:00:00Z", createdAt: "2026-05-14T07:00:00Z" },
  { id: "notif-010", organisationId: "org-001", userId: "user-001", type: "night_cap_warning", channel: "in_app", subject: "Night Cap 55% — Manhattan Studio", body: "Manhattan Studio has used 201 of 365 nights (55%). Usage is accelerating.", isRead: true, readAt: "2026-05-13T11:00:00Z", createdAt: "2026-05-13T09:00:00Z" },
  { id: "notif-011", organisationId: "org-001", userId: "user-001", type: "system", channel: "in_app", subject: "New Team Member Joined", body: "Sarah Chen has accepted your invitation and joined Coastal Properties Group.", isRead: true, readAt: "2026-05-12T16:00:00Z", createdAt: "2026-05-12T14:30:00Z" },
  { id: "notif-012", organisationId: "org-001", userId: "user-001", type: "regulatory_change", channel: "in_app", subject: "NYC Registration Fee Increase", body: "Annual registration fee for NYC short-term rental operators increased from $145 to $200.", isRead: true, readAt: "2026-05-10T10:00:00Z", createdAt: "2026-05-10T09:00:00Z" },
  { id: "notif-013", organisationId: "org-001", userId: "user-001", type: "permit_expiry", channel: "in_app", subject: "Permit Verified — Melbourne", body: "Permit VIC-SSA-2026-2201 for Melbourne Docklands Apt has been verified as active.", isRead: true, readAt: "2026-05-08T09:00:00Z", createdAt: "2026-05-08T08:00:00Z" },
  { id: "notif-014", organisationId: "org-001", userId: "user-001", type: "system", channel: "in_app", subject: "Document Uploaded", body: "Levy payment receipt Q2 2026 uploaded for Melbourne Docklands Apt.", isRead: true, readAt: "2026-05-06T11:00:00Z", createdAt: "2026-05-06T10:00:00Z" },
  { id: "notif-015", organisationId: "org-001", userId: "user-001", type: "night_cap_warning", channel: "in_app", subject: "Night Cap Reset Approaching", body: "Bondi Beach House night cap resets on June 15. Current usage: 167/180 nights.", isRead: true, readAt: "2026-05-05T09:00:00Z", createdAt: "2026-05-05T08:00:00Z" },
  { id: "notif-016", organisationId: "org-001", userId: "user-001", type: "permit_expiry", channel: "in_app", subject: "Business License Expiring", body: "Business License BL-LA-2025-9912 for Oceanview Retreat expires on Jan 15, 2026.", isRead: true, readAt: "2026-05-03T10:00:00Z", createdAt: "2026-05-03T08:00:00Z" },
  { id: "notif-017", organisationId: "org-001", userId: "user-001", type: "system", channel: "in_app", subject: "Compliance Score Updated", body: "Overall compliance score updated to 84%. 2 properties require attention.", isRead: true, readAt: "2026-05-01T12:00:00Z", createdAt: "2026-05-01T09:00:00Z" },
  { id: "notif-018", organisationId: "org-001", userId: "user-001", type: "regulatory_change", channel: "in_app", subject: "Barcelona Tourism Tax Update", body: "Tourist tax (IEET) rates updated for 2026. New rate: €3.50 per guest per night.", isRead: true, readAt: "2026-04-28T14:00:00Z", createdAt: "2026-04-28T10:00:00Z" },
];

export const mockRegulatoryChangesExtended: RegulatoryChange[] = [
  { id: "reg-001", jurisdictionId: "jur-fr-idf-paris", title: "Paris Night Cap Reduction", summary: "Annual night cap for primary residences reduced from 120 to 90 nights effective January 2027. Secondary residences remain unrestricted but require change of use authorization.", detailUrl: "https://example.com/paris-regulation", effectiveDate: "2027-01-01T00:00:00Z", severity: "high", isAcknowledged: false, acknowledgedBy: null, acknowledgedAt: null, createdAt: "2026-05-21T14:00:00Z" },
  { id: "reg-002", jurisdictionId: "jur-au-nsw-sydney", title: "NSW STRA Code of Conduct Update", summary: "Updated code of conduct for short-term rental accommodation providers in NSW. New requirements include mandatory noise monitoring devices and enhanced complaint handling procedures.", detailUrl: "https://example.com/nsw-stra", effectiveDate: "2026-09-01T00:00:00Z", severity: "medium", isAcknowledged: false, acknowledgedBy: null, acknowledgedAt: null, createdAt: "2026-05-18T13:20:00Z" },
  { id: "reg-003", jurisdictionId: "jur-us-ny-nyc", title: "NYC Registration Fee Increase", summary: "Annual registration fee for short-term rental operators increased from $145 to $200. Applies to all new and renewal registrations from July 2026.", detailUrl: "https://example.com/nyc-fee", effectiveDate: "2026-07-01T00:00:00Z", severity: "low", isAcknowledged: true, acknowledgedBy: "user-001", acknowledgedAt: "2026-05-19T10:00:00Z", createdAt: "2026-05-15T09:00:00Z" },
  { id: "reg-004", jurisdictionId: "jur-es-cat-bcn", title: "Barcelona Tourist Tax Rate Update", summary: "Tourist tax (IEET) rates updated for 2026. New rate: €3.50 per guest per night for apartments, €4.00 for villas. Effective immediately for new bookings.", detailUrl: "https://example.com/bcn-tax", effectiveDate: "2026-06-01T00:00:00Z", severity: "medium", isAcknowledged: false, acknowledgedBy: null, acknowledgedAt: null, createdAt: "2026-05-10T11:00:00Z" },
  { id: "reg-005", jurisdictionId: "jur-au-vic-melb", title: "Victoria Short Stay Levy Increase", summary: "Short stay accommodation levy increased from $7.50 to $9.00 per night for properties in metropolitan Melbourne. Regional properties remain at $5.50.", detailUrl: "https://example.com/vic-levy", effectiveDate: "2026-10-01T00:00:00Z", severity: "medium", isAcknowledged: true, acknowledgedBy: "user-001", acknowledgedAt: "2026-05-08T09:00:00Z", createdAt: "2026-05-05T08:00:00Z" },
  { id: "reg-006", jurisdictionId: "jur-us-ca-la", title: "LA Home Sharing Ordinance Amendment", summary: "Los Angeles amends home sharing ordinance to require hosts to obtain a new Enhanced STR License for properties with more than 3 bedrooms. Existing licenses grandfathered until renewal.", detailUrl: "https://example.com/la-ordinance", effectiveDate: "2026-12-01T00:00:00Z", severity: "high", isAcknowledged: false, acknowledgedBy: null, acknowledgedAt: null, createdAt: "2026-04-28T10:00:00Z" },
  { id: "reg-007", jurisdictionId: "jur-ch-vs-zermatt", title: "Zermatt Kurtaxe Digital Reporting", summary: "Gemeinde Zermatt now requires digital reporting of guest stays and Kurtaxe payments through the new online portal. Paper submissions no longer accepted.", detailUrl: "https://example.com/zermatt-digital", effectiveDate: "2026-08-01T00:00:00Z", severity: "low", isAcknowledged: true, acknowledgedBy: "user-001", acknowledgedAt: "2026-04-20T14:00:00Z", createdAt: "2026-04-15T09:00:00Z" },
  { id: "reg-008", jurisdictionId: "jur-fr-idf-paris", title: "Paris Energy Performance Requirements", summary: "All short-term rental properties in Paris must display an energy performance certificate (DPE) with a minimum rating of E. Properties rated F or G prohibited from renting from 2028.", detailUrl: "https://example.com/paris-energy", effectiveDate: "2027-06-01T00:00:00Z", severity: "medium", isAcknowledged: false, acknowledgedBy: null, acknowledgedAt: null, createdAt: "2026-04-10T08:00:00Z" },
];

// ─── Alert Preferences Mock Data ─────────────────────────────────────────────

export interface AlertPreferences {
  permitAlerts: {
    email: boolean;
    sms: boolean;
    days30: boolean;
    days14: boolean;
    days7: boolean;
    days1: boolean;
  };
  nightCapAlerts: {
    email: boolean;
    sms: boolean;
    threshold80: boolean;
    threshold90: boolean;
    threshold100: boolean;
  };
  regulatoryAlerts: {
    email: boolean;
    sms: boolean;
    newChanges: boolean;
  };
  systemAlerts: {
    email: boolean;
    sms: boolean;
    syncFailures: boolean;
    paymentIssues: boolean;
  };
}

export const mockAlertPreferences: AlertPreferences = {
  permitAlerts: {
    email: true,
    sms: true,
    days30: true,
    days14: true,
    days7: true,
    days1: true,
  },
  nightCapAlerts: {
    email: true,
    sms: false,
    threshold80: true,
    threshold90: true,
    threshold100: true,
  },
  regulatoryAlerts: {
    email: true,
    sms: false,
    newChanges: true,
  },
  systemAlerts: {
    email: true,
    sms: false,
    syncFailures: true,
    paymentIssues: true,
  },
};

// ─── Organisation & Team Mock Data ───────────────────────────────────────────

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  avatarUrl: string | null;
  joinedAt: string;
  lastActiveAt: string;
}

export interface OrganisationDetail {
  id: string;
  name: string;
  logoUrl: string | null;
  defaultCountry: string;
  plan: "free" | "starter" | "professional" | "enterprise";
  members: TeamMember[];
  createdAt: string;
}

export const mockOrganisation: OrganisationDetail = {
  id: "org-001",
  name: "Coastal Properties Group",
  logoUrl: null,
  defaultCountry: "US",
  plan: "professional",
  members: [
    { id: "user-001", firstName: "Alex", lastName: "Morgan", email: "alex@coastalproperties.com", role: "owner", avatarUrl: null, joinedAt: "2025-01-15T00:00:00Z", lastActiveAt: "2026-05-23T16:00:00Z" },
    { id: "user-002", firstName: "Sarah", lastName: "Chen", email: "sarah@coastalproperties.com", role: "admin", avatarUrl: null, joinedAt: "2025-03-20T00:00:00Z", lastActiveAt: "2026-05-23T14:30:00Z" },
    { id: "user-003", firstName: "Marcus", lastName: "Williams", email: "marcus@coastalproperties.com", role: "member", avatarUrl: null, joinedAt: "2025-06-10T00:00:00Z", lastActiveAt: "2026-05-22T09:15:00Z" },
    { id: "user-004", firstName: "Emily", lastName: "Rodriguez", email: "emily@coastalproperties.com", role: "member", avatarUrl: null, joinedAt: "2025-09-01T00:00:00Z", lastActiveAt: "2026-05-21T17:45:00Z" },
    { id: "user-005", firstName: "James", lastName: "Park", email: "james@coastalproperties.com", role: "viewer", avatarUrl: null, joinedAt: "2026-02-15T00:00:00Z", lastActiveAt: "2026-05-20T11:00:00Z" },
  ],
  createdAt: "2025-01-15T00:00:00Z",
};

// ─── User Profile Mock Data ──────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  timezone: string;
  avatarUrl: string | null;
}

export const mockUserProfile: UserProfile = {
  id: "user-001",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex@coastalproperties.com",
  phone: "+1 (310) 555-0142",
  timezone: "America/Los_Angeles",
  avatarUrl: null,
};

// ─── Active Sessions Mock Data ───────────────────────────────────────────────

export interface ActiveSession {
  id: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export const mockActiveSessions: ActiveSession[] = [
  { id: "sess-001", browser: "Chrome 125", os: "Windows 10", ip: "192.168.1.105", location: "Los Angeles, CA", lastActiveAt: "2026-05-23T16:00:00Z", isCurrent: true },
  { id: "sess-002", browser: "Safari 19", os: "macOS 15", ip: "10.0.0.42", location: "Los Angeles, CA", lastActiveAt: "2026-05-23T12:30:00Z", isCurrent: false },
  { id: "sess-003", browser: "Chrome Mobile 125", os: "iOS 19", ip: "172.16.0.88", location: "San Francisco, CA", lastActiveAt: "2026-05-22T08:15:00Z", isCurrent: false },
];

// ─── Billing & Subscription Mock Data ────────────────────────────────────────

export interface SubscriptionDetail {
  plan: "free" | "starter" | "professional" | "enterprise";
  status: "active" | "trialing" | "past_due" | "cancelled";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  propertiesUsed: number;
  propertiesLimit: number;
  membersUsed: number;
  membersLimit: number;
}

export const mockSubscription: SubscriptionDetail = {
  plan: "professional",
  status: "active",
  currentPeriodStart: "2026-05-01T00:00:00Z",
  currentPeriodEnd: "2026-06-01T00:00:00Z",
  cancelAtPeriodEnd: false,
  propertiesUsed: 7,
  propertiesLimit: 25,
  membersUsed: 5,
  membersLimit: 10,
};

export interface BillingInvoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  invoiceUrl: string;
}

export const mockBillingHistory: BillingInvoice[] = [
  { id: "inv-001", date: "2026-05-01T00:00:00Z", description: "Professional Plan — May 2026", amount: 79.00, status: "paid", invoiceUrl: "#" },
  { id: "inv-002", date: "2026-04-01T00:00:00Z", description: "Professional Plan — Apr 2026", amount: 79.00, status: "paid", invoiceUrl: "#" },
  { id: "inv-003", date: "2026-03-01T00:00:00Z", description: "Professional Plan — Mar 2026", amount: 79.00, status: "paid", invoiceUrl: "#" },
  { id: "inv-004", date: "2026-02-01T00:00:00Z", description: "Professional Plan — Feb 2026", amount: 79.00, status: "paid", invoiceUrl: "#" },
  { id: "inv-005", date: "2026-01-01T00:00:00Z", description: "Professional Plan — Jan 2026", amount: 79.00, status: "paid", invoiceUrl: "#" },
  { id: "inv-006", date: "2025-12-01T00:00:00Z", description: "Starter Plan — Dec 2025", amount: 29.00, status: "paid", invoiceUrl: "#" },
];

export interface PaymentMethod {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export const mockPaymentMethod: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expMonth: 12,
  expYear: 2027,
};

export interface PlanInfo {
  id: "free" | "starter" | "professional" | "enterprise";
  name: string;
  price: number;
  interval: "month";
  features: string[];
  propertiesLimit: number | null;
  membersLimit: number | null;
  isPopular?: boolean;
}

export const mockPlans: PlanInfo[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: ["1 property", "Basic compliance tracking", "Email alerts only", "Community support"],
    propertiesLimit: 1,
    membersLimit: 1,
  },
  {
    id: "starter",
    name: "Starter",
    price: 29,
    interval: "month",
    features: ["5 properties", "All compliance modules", "Email + SMS alerts", "Standard support", "Document storage (1GB)"],
    propertiesLimit: 5,
    membersLimit: 3,
  },
  {
    id: "professional",
    name: "Professional",
    price: 79,
    interval: "month",
    features: ["25 properties", "API access", "Priority support", "Email + SMS alerts", "Document storage (10GB)", "Team collaboration", "Custom reports"],
    propertiesLimit: 25,
    membersLimit: 10,
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    interval: "month",
    features: ["Unlimited properties", "Custom integrations", "Dedicated support", "All alert channels", "Unlimited storage", "SSO / SAML", "SLA guarantee", "Custom onboarding"],
    propertiesLimit: null,
    membersLimit: null,
  },
];
