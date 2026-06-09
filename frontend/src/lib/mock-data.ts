import type {
  Property,
  Permit,
  NightCapSummary,
  NotificationLog,
  RegulatoryChange,
  ComplianceBreakdown,
  Document,
} from "@/types";

// ─── Dashboard-Specific Types ────────────────────────────────────────────────

export interface DashboardStats {
  totalProperties: number;
  complianceScore: number;
  activePermits: number;
  nightsUsed: number;
  totalNightCap: number;
  propertiesAddedThisMonth: number;
}

export interface ComplianceHistoryPoint {
  month: string;
  score: number;
  properties: number;
}

export interface PropertyAtRisk {
  id: string;
  name: string;
  issue: "low_compliance" | "expiring_permit" | "night_cap_warning";
  issueLabel: string;
  value: string;
}

export interface UpcomingDeadline {
  id: string;
  type: "permit_renewal" | "night_cap_reset" | "levy_due" | "registration";
  title: string;
  propertyName: string;
  dueDate: string;
  daysRemaining: number;
}

export interface ActivityItem {
  id: string;
  type: "permit" | "ical_sync" | "regulatory" | "compliance" | "night_cap" | "property" | "document";
  description: string;
  timestamp: string;
  propertyName?: string;
  propertyId?: string;
}

// ─── Property Detail Types ───────────────────────────────────────────────────

export interface PropertyDetail extends Property {
  addressLine2?: string;
  registrationNumber?: string;
  bathroomCount: number;
  notes?: string;
  jurisdictionName: string;
}

// ─── Mock Jurisdictions ──────────────────────────────────────────────────────

export const mockJurisdictions = [
  { id: "jur-us-ca-la", name: "Los Angeles, California", countryCode: "US" },
  { id: "jur-fr-idf-paris", name: "Paris, Île-de-France", countryCode: "FR" },
  { id: "jur-au-nsw-sydney", name: "Sydney, New South Wales", countryCode: "AU" },
  { id: "jur-ch-vs-zermatt", name: "Zermatt, Valais", countryCode: "CH" },
  { id: "jur-us-ny-nyc", name: "New York City, New York", countryCode: "US" },
  { id: "jur-es-cat-bcn", name: "Barcelona, Catalonia", countryCode: "ES" },
  { id: "jur-au-vic-melb", name: "Melbourne, Victoria", countryCode: "AU" },
];

// ─── Mock Properties ─────────────────────────────────────────────────────────

export const mockProperties: Property[] = [
  { id: "prop-001", organisationId: "org-001", name: "Oceanview Retreat", address: "142 Pacific Coast Highway", city: "Malibu", stateRegion: "California", countryCode: "US", postalCode: "90265", propertyType: "villa", jurisdictionId: "jur-us-ca-la", complianceScore: 94, complianceStatus: "compliant", latitude: 34.0259, longitude: -118.7798, bedroomCount: 4, maxGuests: 8, isActive: true, createdAt: "2025-03-15T10:00:00Z", updatedAt: "2026-05-20T14:30:00Z" },
  { id: "prop-002", organisationId: "org-001", name: "Montmartre Loft", address: "28 Rue Lepic", city: "Paris", stateRegion: "Île-de-France", countryCode: "FR", postalCode: "75018", propertyType: "apartment", jurisdictionId: "jur-fr-idf-paris", complianceScore: 87, complianceStatus: "compliant", latitude: 48.8847, longitude: 2.3326, bedroomCount: 2, maxGuests: 4, isActive: true, createdAt: "2025-06-01T08:00:00Z", updatedAt: "2026-05-18T09:15:00Z" },
  { id: "prop-003", organisationId: "org-001", name: "Bondi Beach House", address: "15 Campbell Parade", city: "Sydney", stateRegion: "New South Wales", countryCode: "AU", postalCode: "2026", propertyType: "house", jurisdictionId: "jur-au-nsw-sydney", complianceScore: 62, complianceStatus: "warning", latitude: -33.8908, longitude: 151.2743, bedroomCount: 3, maxGuests: 6, isActive: true, createdAt: "2025-01-10T12:00:00Z", updatedAt: "2026-05-21T16:45:00Z" },
  { id: "prop-004", organisationId: "org-001", name: "Alpine Chalet Zermatt", address: "Bahnhofstrasse 42", city: "Zermatt", stateRegion: "Valais", countryCode: "CH", postalCode: "3920", propertyType: "cabin", jurisdictionId: "jur-ch-vs-zermatt", complianceScore: 45, complianceStatus: "non_compliant", latitude: 46.0207, longitude: 7.7491, bedroomCount: 5, maxGuests: 10, isActive: true, createdAt: "2025-09-20T14:00:00Z", updatedAt: "2026-05-19T11:20:00Z" },
  { id: "prop-005", organisationId: "org-001", name: "Manhattan Studio", address: "350 West 42nd Street", city: "New York", stateRegion: "New York", countryCode: "US", postalCode: "10036", propertyType: "apartment", jurisdictionId: "jur-us-ny-nyc", complianceScore: 78, complianceStatus: "warning", latitude: 40.7580, longitude: -73.9855, bedroomCount: 1, maxGuests: 2, isActive: true, createdAt: "2025-11-05T09:00:00Z", updatedAt: "2026-05-22T08:00:00Z" },
  { id: "prop-006", organisationId: "org-001", name: "Barcelona Penthouse", address: "Passeig de Gràcia 92", city: "Barcelona", stateRegion: "Catalonia", countryCode: "ES", postalCode: "08008", propertyType: "condo", jurisdictionId: "jur-es-cat-bcn", complianceScore: 100, complianceStatus: "compliant", latitude: 41.3954, longitude: 2.1631, bedroomCount: 3, maxGuests: 6, isActive: true, createdAt: "2026-01-15T11:00:00Z", updatedAt: "2026-05-20T17:30:00Z" },
  { id: "prop-007", organisationId: "org-001", name: "Melbourne Docklands Apt", address: "800 Bourke Street", city: "Melbourne", stateRegion: "Victoria", countryCode: "AU", postalCode: "3008", propertyType: "apartment", jurisdictionId: "jur-au-vic-melb", complianceScore: 91, complianceStatus: "compliant", latitude: -37.8136, longitude: 144.9631, bedroomCount: 2, maxGuests: 4, isActive: true, createdAt: "2026-03-01T07:00:00Z", updatedAt: "2026-05-21T13:00:00Z" },
];

// ─── Mock Property Details ───────────────────────────────────────────────────

const jurisdictionNames: Record<string, string> = {
  "jur-us-ca-la": "Los Angeles, California",
  "jur-fr-idf-paris": "Paris, Île-de-France",
  "jur-au-nsw-sydney": "Sydney, New South Wales",
  "jur-ch-vs-zermatt": "Zermatt, Valais",
  "jur-us-ny-nyc": "New York City, New York",
  "jur-es-cat-bcn": "Barcelona, Catalonia",
  "jur-au-vic-melb": "Melbourne, Victoria",
};

const detailExtras: Record<string, { addressLine2?: string; registrationNumber?: string; bathroomCount: number; notes?: string }> = {
  "prop-001": { addressLine2: "Suite 4B", registrationNumber: "STR-LA-2025-4821", bathroomCount: 3, notes: "Beachfront property with ocean views. Premium listing." },
  "prop-002": { addressLine2: "4ème étage", registrationNumber: "PAR-MT-2025-7392", bathroomCount: 1, notes: "Historic building in Montmartre. 120-night annual cap applies." },
  "prop-003": { bathroomCount: 2, registrationNumber: "NSW-STRA-2025-1156", notes: "Walking distance to Bondi Beach. Fire safety inspection due." },
  "prop-004": { addressLine2: "Chalet Edelweiss", bathroomCount: 3, notes: "Ski-in/ski-out property. Permit renewal overdue." },
  "prop-005": { addressLine2: "Apt 12F", registrationNumber: "NYC-OSE-2025-8834", bathroomCount: 1, notes: "Host must be present during stays per NYC regulations." },
  "prop-006": { addressLine2: "Ático", registrationNumber: "BCN-HUT-2026-0412", bathroomCount: 2, notes: "Rooftop terrace with city views. Fully compliant." },
  "prop-007": { addressLine2: "Level 22, Unit 2204", registrationNumber: "VIC-SSA-2026-2201", bathroomCount: 1, notes: "Modern apartment in Docklands precinct." },
};

export const mockPropertyDetails: PropertyDetail[] = mockProperties.map((p) => ({
  ...p,
  ...detailExtras[p.id],
  bathroomCount: detailExtras[p.id]?.bathroomCount ?? 1,
  jurisdictionName: jurisdictionNames[p.jurisdictionId] ?? "Unknown",
}));

// ─── Mock Compliance Breakdowns ──────────────────────────────────────────────

export const mockComplianceBreakdowns: ComplianceBreakdown[] = [
  { propertyId: "prop-001", totalScore: 94, components: [
    { name: "Permit", maxPoints: 30, earnedPoints: 30, status: "compliant", description: "Active STR license" },
    { name: "Night Cap", maxPoints: 25, earnedPoints: 25, status: "compliant", description: "39% of annual cap used" },
    { name: "Registration", maxPoints: 15, earnedPoints: 15, status: "compliant", description: "Registration current" },
    { name: "Documents", maxPoints: 15, earnedPoints: 12, status: "warning", description: "Insurance document expiring soon" },
    { name: "Renewals", maxPoints: 15, earnedPoints: 12, status: "warning", description: "Permit renewal in 60 days" },
  ], recommendations: ["Upload updated insurance certificate before expiry", "Begin permit renewal process (due in 60 days)"] },
  { propertyId: "prop-002", totalScore: 87, components: [
    { name: "Permit", maxPoints: 30, earnedPoints: 30, status: "compliant", description: "Meublé de Tourisme active" },
    { name: "Night Cap", maxPoints: 25, earnedPoints: 18, status: "warning", description: "82% of 120-night cap used" },
    { name: "Registration", maxPoints: 15, earnedPoints: 15, status: "compliant", description: "Registration current" },
    { name: "Documents", maxPoints: 15, earnedPoints: 12, status: "warning", description: "Energy certificate needed" },
    { name: "Renewals", maxPoints: 15, earnedPoints: 12, status: "compliant", description: "Permit valid until Jul 2026" },
  ], recommendations: ["Monitor night cap usage closely — only 22 nights remaining", "Upload energy performance certificate (DPE)"] },
  { propertyId: "prop-003", totalScore: 62, components: [
    { name: "Permit", maxPoints: 30, earnedPoints: 25, status: "compliant", description: "STRA registration active" },
    { name: "Night Cap", maxPoints: 25, earnedPoints: 5, status: "non_compliant", description: "93% of 180-night cap used" },
    { name: "Registration", maxPoints: 15, earnedPoints: 15, status: "compliant", description: "Registration current" },
    { name: "Documents", maxPoints: 15, earnedPoints: 10, status: "warning", description: "Fire safety inspection overdue" },
    { name: "Renewals", maxPoints: 15, earnedPoints: 7, status: "warning", description: "Permit expires in 24 days" },
  ], recommendations: ["URGENT: Night cap at 93% — consider blocking new bookings", "Schedule fire safety inspection immediately", "Begin permit renewal process (expires Jun 15)"] },
  { propertyId: "prop-004", totalScore: 45, components: [
    { name: "Permit", maxPoints: 30, earnedPoints: 0, status: "non_compliant", description: "Permit expired Dec 2025" },
    { name: "Night Cap", maxPoints: 25, earnedPoints: 22, status: "compliant", description: "13% of 90-night cap used" },
    { name: "Registration", maxPoints: 15, earnedPoints: 8, status: "warning", description: "Registration renewal pending" },
    { name: "Documents", maxPoints: 15, earnedPoints: 10, status: "warning", description: "Missing updated insurance" },
    { name: "Renewals", maxPoints: 15, earnedPoints: 5, status: "non_compliant", description: "Permit renewal overdue" },
  ], recommendations: ["CRITICAL: Renew expired permit immediately", "Submit registration renewal application", "Upload current insurance documentation"] },
  { propertyId: "prop-005", totalScore: 78, components: [
    { name: "Permit", maxPoints: 30, earnedPoints: 30, status: "compliant", description: "NYC STR registration active" },
    { name: "Night Cap", maxPoints: 25, earnedPoints: 15, status: "warning", description: "55% of annual cap used" },
    { name: "Registration", maxPoints: 15, earnedPoints: 15, status: "compliant", description: "Registration current" },
    { name: "Documents", maxPoints: 15, earnedPoints: 8, status: "warning", description: "Host presence log incomplete" },
    { name: "Renewals", maxPoints: 15, earnedPoints: 10, status: "compliant", description: "Permit valid until Dec 2026" },
  ], recommendations: ["Complete host presence documentation for recent stays", "Monitor night cap usage — on track but accelerating"] },
  { propertyId: "prop-006", totalScore: 100, components: [
    { name: "Permit", maxPoints: 30, earnedPoints: 30, status: "compliant", description: "HUT license active until 2031" },
    { name: "Night Cap", maxPoints: 25, earnedPoints: 25, status: "compliant", description: "24% of annual cap used" },
    { name: "Registration", maxPoints: 15, earnedPoints: 15, status: "compliant", description: "Registration current" },
    { name: "Documents", maxPoints: 15, earnedPoints: 15, status: "compliant", description: "All documents up to date" },
    { name: "Renewals", maxPoints: 15, earnedPoints: 15, status: "compliant", description: "No renewals due" },
  ], recommendations: [] },
  { propertyId: "prop-007", totalScore: 91, components: [
    { name: "Permit", maxPoints: 30, earnedPoints: 30, status: "compliant", description: "SSA registration active" },
    { name: "Night Cap", maxPoints: 25, earnedPoints: 22, status: "compliant", description: "25% of 180-night cap used" },
    { name: "Registration", maxPoints: 15, earnedPoints: 15, status: "compliant", description: "Registration current" },
    { name: "Documents", maxPoints: 15, earnedPoints: 12, status: "warning", description: "Levy payment receipt pending" },
    { name: "Renewals", maxPoints: 15, earnedPoints: 12, status: "compliant", description: "Permit valid until Mar 2027" },
  ], recommendations: ["Upload quarterly levy payment receipt", "Schedule next fire safety check"] },
];

// ─── Mock Property Activity Logs ─────────────────────────────────────────────

export const mockPropertyActivity: Record<string, ActivityItem[]> = {
  "prop-001": [
    { id: "pa-001", type: "ical_sync", description: "iCal synced: 3 new nights added from Airbnb", timestamp: "2026-05-22T06:15:00Z", propertyName: "Oceanview Retreat", propertyId: "prop-001" },
    { id: "pa-002", type: "compliance", description: "Compliance score updated: 94/100", timestamp: "2026-05-20T14:30:00Z", propertyName: "Oceanview Retreat", propertyId: "prop-001" },
    { id: "pa-003", type: "document", description: "Insurance certificate uploaded", timestamp: "2026-05-15T10:00:00Z", propertyName: "Oceanview Retreat", propertyId: "prop-001" },
    { id: "pa-004", type: "permit", description: "Permit STR-LA-2025-4821 verified as active", timestamp: "2026-05-10T09:00:00Z", propertyName: "Oceanview Retreat", propertyId: "prop-001" },
    { id: "pa-005", type: "night_cap", description: "Night cap usage: 142/365 nights (39%)", timestamp: "2026-05-08T08:00:00Z", propertyName: "Oceanview Retreat", propertyId: "prop-001" },
  ],
  "prop-002": [
    { id: "pa-006", type: "night_cap", description: "Night cap warning: 98/120 nights used (82%)", timestamp: "2026-05-21T09:00:00Z", propertyName: "Montmartre Loft", propertyId: "prop-002" },
    { id: "pa-007", type: "regulatory", description: "Regulatory alert: Paris night cap reduction planned for 2027", timestamp: "2026-05-21T14:00:00Z", propertyName: "Montmartre Loft", propertyId: "prop-002" },
    { id: "pa-008", type: "ical_sync", description: "iCal synced: 2 new nights from Booking.com", timestamp: "2026-05-19T07:00:00Z", propertyName: "Montmartre Loft", propertyId: "prop-002" },
    { id: "pa-009", type: "compliance", description: "Compliance score updated: 87/100", timestamp: "2026-05-18T09:15:00Z", propertyName: "Montmartre Loft", propertyId: "prop-002" },
  ],
  "prop-003": [
    { id: "pa-010", type: "night_cap", description: "CRITICAL: Night cap at 93% — 167/180 nights used", timestamp: "2026-05-21T09:00:00Z", propertyName: "Bondi Beach House", propertyId: "prop-003" },
    { id: "pa-011", type: "compliance", description: "Compliance score dropped: 62/100 (was 71)", timestamp: "2026-05-21T16:45:00Z", propertyName: "Bondi Beach House", propertyId: "prop-003" },
    { id: "pa-012", type: "regulatory", description: "NSW STRA Code of Conduct update published", timestamp: "2026-05-18T13:20:00Z", propertyName: "Bondi Beach House", propertyId: "prop-003" },
  ],
  "prop-004": [
    { id: "pa-014", type: "permit", description: "Permit application submitted for renewal", timestamp: "2026-05-19T11:30:00Z", propertyName: "Alpine Chalet Zermatt", propertyId: "prop-004" },
    { id: "pa-015", type: "compliance", description: "Compliance score updated: 45/100", timestamp: "2026-05-19T11:20:00Z", propertyName: "Alpine Chalet Zermatt", propertyId: "prop-004" },
    { id: "pa-016", type: "permit", description: "Permit VS-FW-2024-0093 expired", timestamp: "2025-12-31T00:00:00Z", propertyName: "Alpine Chalet Zermatt", propertyId: "prop-004" },
  ],
  "prop-005": [
    { id: "pa-017", type: "ical_sync", description: "iCal synced: 5 new nights from VRBO", timestamp: "2026-05-20T07:00:00Z", propertyName: "Manhattan Studio", propertyId: "prop-005" },
    { id: "pa-018", type: "compliance", description: "Compliance score updated: 78/100", timestamp: "2026-05-22T08:00:00Z", propertyName: "Manhattan Studio", propertyId: "prop-005" },
  ],
  "prop-006": [
    { id: "pa-020", type: "compliance", description: "Compliance score: 100/100 — fully compliant", timestamp: "2026-05-20T17:30:00Z", propertyName: "Barcelona Penthouse", propertyId: "prop-006" },
    { id: "pa-021", type: "ical_sync", description: "iCal synced: 2 new nights from Airbnb", timestamp: "2026-05-18T06:00:00Z", propertyName: "Barcelona Penthouse", propertyId: "prop-006" },
  ],
  "prop-007": [
    { id: "pa-022", type: "permit", description: "Permit renewed for Melbourne Docklands Apt", timestamp: "2026-05-22T08:30:00Z", propertyName: "Melbourne Docklands Apt", propertyId: "prop-007" },
    { id: "pa-023", type: "compliance", description: "Compliance score updated: 91/100", timestamp: "2026-05-21T13:00:00Z", propertyName: "Melbourne Docklands Apt", propertyId: "prop-007" },
    { id: "pa-024", type: "document", description: "Levy payment receipt uploaded", timestamp: "2026-05-20T10:00:00Z", propertyName: "Melbourne Docklands Apt", propertyId: "prop-007" },
  ],
};

// ─── Mock Documents ──────────────────────────────────────────────────────────

export const mockDocuments: Document[] = [
  { id: "doc-001", propertyId: "prop-001", organisationId: "org-001", fileName: "STR_License_LA.pdf", fileType: "application/pdf", fileSizeBytes: 245000, documentType: "permit", storageKey: "docs/prop-001/str-license.pdf", uploadedBy: "user-001", uploadedAt: "2025-04-01T00:00:00Z" },
  { id: "doc-002", propertyId: "prop-002", organisationId: "org-001", fileName: "Meuble_Tourisme_Registration.pdf", fileType: "application/pdf", fileSizeBytes: 189000, documentType: "permit", storageKey: "docs/prop-002/mt-registration.pdf", uploadedBy: "user-001", uploadedAt: "2025-07-01T00:00:00Z" },
  { id: "doc-003", propertyId: "prop-003", organisationId: "org-001", fileName: "STRA_Registration_NSW.pdf", fileType: "application/pdf", fileSizeBytes: 312000, documentType: "permit", storageKey: "docs/prop-003/stra-registration.pdf", uploadedBy: "user-001", uploadedAt: "2025-02-15T00:00:00Z" },
  { id: "doc-004", propertyId: "prop-004", organisationId: "org-001", fileName: "Ferienwohnung_Bewilligung.pdf", fileType: "application/pdf", fileSizeBytes: 156000, documentType: "permit", storageKey: "docs/prop-004/fw-bewilligung.pdf", uploadedBy: "user-001", uploadedAt: "2024-01-01T00:00:00Z" },
  { id: "doc-005", propertyId: "prop-005", organisationId: "org-001", fileName: "NYC_STR_Registration.pdf", fileType: "application/pdf", fileSizeBytes: 278000, documentType: "permit", storageKey: "docs/prop-005/nyc-str.pdf", uploadedBy: "user-001", uploadedAt: "2025-12-01T00:00:00Z" },
  { id: "doc-006", propertyId: "prop-006", organisationId: "org-001", fileName: "HUT_License_Barcelona.pdf", fileType: "application/pdf", fileSizeBytes: 198000, documentType: "permit", storageKey: "docs/prop-006/hut-license.pdf", uploadedBy: "user-001", uploadedAt: "2026-02-01T00:00:00Z" },
  { id: "doc-007", propertyId: "prop-007", organisationId: "org-001", fileName: "SSA_Registration_VIC.pdf", fileType: "application/pdf", fileSizeBytes: 167000, documentType: "permit", storageKey: "docs/prop-007/ssa-registration.pdf", uploadedBy: "user-001", uploadedAt: "2026-03-15T00:00:00Z" },
  { id: "doc-008", propertyId: "prop-001", organisationId: "org-001", fileName: "Insurance_Certificate_2026.pdf", fileType: "application/pdf", fileSizeBytes: 445000, documentType: "insurance", storageKey: "docs/prop-001/insurance-2026.pdf", uploadedBy: "user-001", uploadedAt: "2026-05-15T10:00:00Z" },
  { id: "doc-009", propertyId: "prop-002", organisationId: "org-001", fileName: "Energy_Performance_Certificate.pdf", fileType: "application/pdf", fileSizeBytes: 520000, documentType: "other", storageKey: "docs/prop-002/energy-cert.pdf", uploadedBy: "user-001", uploadedAt: "2026-04-10T14:30:00Z" },
  { id: "doc-010", propertyId: "prop-003", organisationId: "org-001", fileName: "Fire_Safety_Inspection.pdf", fileType: "application/pdf", fileSizeBytes: 380000, documentType: "other", storageKey: "docs/prop-003/fire-safety.pdf", uploadedBy: "user-001", uploadedAt: "2025-11-20T09:00:00Z" },
  { id: "doc-011", propertyId: "prop-001", organisationId: "org-001", fileName: "Property_Photo_Front.jpg", fileType: "image/jpeg", fileSizeBytes: 2450000, documentType: "other", storageKey: "docs/prop-001/photo-front.jpg", uploadedBy: "user-001", uploadedAt: "2025-03-20T11:00:00Z" },
  { id: "doc-012", propertyId: "prop-005", organisationId: "org-001", fileName: "Host_ID_Verification.png", fileType: "image/png", fileSizeBytes: 1200000, documentType: "identity", storageKey: "docs/prop-005/host-id.png", uploadedBy: "user-001", uploadedAt: "2025-11-28T16:00:00Z" },
  { id: "doc-013", propertyId: "prop-006", organisationId: "org-001", fileName: "Tax_Registration_Spain.pdf", fileType: "application/pdf", fileSizeBytes: 290000, documentType: "tax", storageKey: "docs/prop-006/tax-registration.pdf", uploadedBy: "user-001", uploadedAt: "2026-01-20T10:00:00Z" },
  { id: "doc-014", propertyId: "prop-007", organisationId: "org-001", fileName: "Levy_Payment_Q1_2026.pdf", fileType: "application/pdf", fileSizeBytes: 125000, documentType: "tax", storageKey: "docs/prop-007/levy-q1-2026.pdf", uploadedBy: "user-001", uploadedAt: "2026-05-20T10:00:00Z" },
  { id: "doc-015", propertyId: "prop-004", organisationId: "org-001", fileName: "Insurance_Policy_Zermatt.docx", fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", fileSizeBytes: 890000, documentType: "insurance", storageKey: "docs/prop-004/insurance-policy.docx", uploadedBy: "user-001", uploadedAt: "2025-10-05T08:00:00Z" },
];

// ─── Mock Permits ────────────────────────────────────────────────────────────

export const mockPermits: Permit[] = [
  { id: "perm-001", propertyId: "prop-001", permitType: "Short-Term Rental License", permitNumber: "STR-LA-2025-4821", status: "active", issuedAt: "2025-04-01T00:00:00Z", expiresAt: "2026-04-01T00:00:00Z", issuingAuthority: "City of Los Angeles", notes: null, documentId: "doc-001", createdAt: "2025-04-01T00:00:00Z", updatedAt: "2025-04-01T00:00:00Z" },
  { id: "perm-002", propertyId: "prop-002", permitType: "Meublé de Tourisme Registration", permitNumber: "PAR-MT-2025-7392", status: "active", issuedAt: "2025-07-01T00:00:00Z", expiresAt: "2026-07-01T00:00:00Z", issuingAuthority: "Mairie de Paris", notes: "120-night annual cap applies", documentId: "doc-002", createdAt: "2025-07-01T00:00:00Z", updatedAt: "2025-07-01T00:00:00Z" },
  { id: "perm-003", propertyId: "prop-003", permitType: "STRA Registration", permitNumber: "NSW-STRA-2025-1156", status: "active", issuedAt: "2025-02-15T00:00:00Z", expiresAt: "2026-06-15T00:00:00Z", issuingAuthority: "NSW Fair Trading", notes: null, documentId: "doc-003", createdAt: "2025-02-15T00:00:00Z", updatedAt: "2025-02-15T00:00:00Z" },
  { id: "perm-004", propertyId: "prop-005", permitType: "NYC STR Registration", permitNumber: "NYC-OSE-2025-8834", status: "active", issuedAt: "2025-12-01T00:00:00Z", expiresAt: "2026-12-01T00:00:00Z", issuingAuthority: "NYC Office of Special Enforcement", notes: "Host must be present during stays", documentId: "doc-005", createdAt: "2025-12-01T00:00:00Z", updatedAt: "2025-12-01T00:00:00Z" },
  { id: "perm-005", propertyId: "prop-006", permitType: "Habitatge d'Ús Turístic", permitNumber: "BCN-HUT-2026-0412", status: "active", issuedAt: "2026-02-01T00:00:00Z", expiresAt: "2031-02-01T00:00:00Z", issuingAuthority: "Generalitat de Catalunya", notes: null, documentId: "doc-006", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-02-01T00:00:00Z" },
  { id: "perm-006", propertyId: "prop-007", permitType: "Short Stay Accommodation Registration", permitNumber: "VIC-SSA-2026-2201", status: "active", issuedAt: "2026-03-15T00:00:00Z", expiresAt: "2027-03-15T00:00:00Z", issuingAuthority: "Consumer Affairs Victoria", notes: null, documentId: "doc-007", createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-03-15T00:00:00Z" },
  { id: "perm-007", propertyId: "prop-004", permitType: "Ferienwohnung Bewilligung", permitNumber: "VS-FW-2024-0093", status: "expired", issuedAt: "2024-01-01T00:00:00Z", expiresAt: "2025-12-31T00:00:00Z", issuingAuthority: "Gemeinde Zermatt", notes: "Renewal required", documentId: "doc-004", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2025-12-31T00:00:00Z" },
  { id: "perm-008", propertyId: "prop-001", permitType: "Business License", permitNumber: "BL-LA-2025-9912", status: "active", issuedAt: "2025-01-15T00:00:00Z", expiresAt: "2026-01-15T00:00:00Z", issuingAuthority: "City of Los Angeles", notes: "Annual business license for rental operations", documentId: null, createdAt: "2025-01-15T00:00:00Z", updatedAt: "2025-01-15T00:00:00Z" },
  { id: "perm-009", propertyId: "prop-004", permitType: "Ferienwohnung Bewilligung", permitNumber: "VS-FW-2026-0147", status: "pending", issuedAt: "2026-05-19T00:00:00Z", expiresAt: "2027-12-31T00:00:00Z", issuingAuthority: "Gemeinde Zermatt", notes: "Renewal application submitted, awaiting approval", documentId: null, createdAt: "2026-05-19T00:00:00Z", updatedAt: "2026-05-19T00:00:00Z" },
  { id: "perm-010", propertyId: "prop-003", permitType: "Fire Safety Certificate", permitNumber: "NSW-FS-2025-0442", status: "expired", issuedAt: "2024-11-20T00:00:00Z", expiresAt: "2025-11-20T00:00:00Z", issuingAuthority: "NSW Fire & Rescue", notes: "Inspection overdue — must schedule renewal", documentId: "doc-010", createdAt: "2024-11-20T00:00:00Z", updatedAt: "2025-11-20T00:00:00Z" },
];

// ─── Mock Permit Status History ──────────────────────────────────────────────

export interface PermitStatusHistoryEntry {
  id: string;
  permitId: string;
  fromStatus: string | null;
  toStatus: string;
  changedAt: string;
  changedBy: string;
  note?: string;
}

export const mockPermitStatusHistory: PermitStatusHistoryEntry[] = [
  { id: "psh-001", permitId: "perm-001", fromStatus: null, toStatus: "pending", changedAt: "2025-03-15T00:00:00Z", changedBy: "Alex Morgan", note: "Application submitted" },
  { id: "psh-002", permitId: "perm-001", fromStatus: "pending", toStatus: "active", changedAt: "2025-04-01T00:00:00Z", changedBy: "City of Los Angeles", note: "Permit approved and issued" },
  { id: "psh-003", permitId: "perm-002", fromStatus: null, toStatus: "pending", changedAt: "2025-06-15T00:00:00Z", changedBy: "Alex Morgan", note: "Registration submitted" },
  { id: "psh-004", permitId: "perm-002", fromStatus: "pending", toStatus: "active", changedAt: "2025-07-01T00:00:00Z", changedBy: "Mairie de Paris", note: "Registration confirmed" },
  { id: "psh-005", permitId: "perm-003", fromStatus: null, toStatus: "active", changedAt: "2025-02-15T00:00:00Z", changedBy: "NSW Fair Trading", note: "STRA registration approved" },
  { id: "psh-006", permitId: "perm-007", fromStatus: null, toStatus: "active", changedAt: "2024-01-01T00:00:00Z", changedBy: "Gemeinde Zermatt", note: "Permit issued" },
  { id: "psh-007", permitId: "perm-007", fromStatus: "active", toStatus: "expired", changedAt: "2025-12-31T00:00:00Z", changedBy: "System", note: "Permit expired automatically" },
  { id: "psh-008", permitId: "perm-009", fromStatus: null, toStatus: "pending", changedAt: "2026-05-19T00:00:00Z", changedBy: "Alex Morgan", note: "Renewal application submitted" },
  { id: "psh-009", permitId: "perm-004", fromStatus: null, toStatus: "pending", changedAt: "2025-11-15T00:00:00Z", changedBy: "Alex Morgan", note: "Application submitted to OSE" },
  { id: "psh-010", permitId: "perm-004", fromStatus: "pending", toStatus: "active", changedAt: "2025-12-01T00:00:00Z", changedBy: "NYC OSE", note: "Registration approved" },
  { id: "psh-011", permitId: "perm-005", fromStatus: null, toStatus: "active", changedAt: "2026-02-01T00:00:00Z", changedBy: "Generalitat de Catalunya", note: "HUT license granted" },
  { id: "psh-012", permitId: "perm-006", fromStatus: null, toStatus: "pending", changedAt: "2026-03-01T00:00:00Z", changedBy: "Alex Morgan", note: "Application submitted" },
  { id: "psh-013", permitId: "perm-006", fromStatus: "pending", toStatus: "active", changedAt: "2026-03-15T00:00:00Z", changedBy: "Consumer Affairs Victoria", note: "Registration approved" },
  { id: "psh-014", permitId: "perm-010", fromStatus: null, toStatus: "active", changedAt: "2024-11-20T00:00:00Z", changedBy: "NSW Fire & Rescue", note: "Certificate issued after inspection" },
  { id: "psh-015", permitId: "perm-010", fromStatus: "active", toStatus: "expired", changedAt: "2025-11-20T00:00:00Z", changedBy: "System", note: "Certificate expired — reinspection required" },
];

// ─── Mock Night Cap Summaries ────────────────────────────────────────────────

export const mockNightCaps: NightCapSummary[] = [
  { propertyId: "prop-001", year: 2026, nightCap: 365, nightsUsed: 142, nightsRemaining: 223, percentage: 39, status: "on_track" },
  { propertyId: "prop-002", year: 2026, nightCap: 120, nightsUsed: 98, nightsRemaining: 22, percentage: 82, status: "warning" },
  { propertyId: "prop-003", year: 2026, nightCap: 180, nightsUsed: 167, nightsRemaining: 13, percentage: 93, status: "critical" },
  { propertyId: "prop-004", year: 2026, nightCap: 90, nightsUsed: 12, nightsRemaining: 78, percentage: 13, status: "on_track" },
  { propertyId: "prop-005", year: 2026, nightCap: 365, nightsUsed: 201, nightsRemaining: 164, percentage: 55, status: "on_track" },
  { propertyId: "prop-006", year: 2026, nightCap: 365, nightsUsed: 89, nightsRemaining: 276, percentage: 24, status: "on_track" },
  { propertyId: "prop-007", year: 2026, nightCap: 180, nightsUsed: 45, nightsRemaining: 135, percentage: 25, status: "on_track" },
];

// ─── Mock Compliance History ─────────────────────────────────────────────────

export const mockComplianceHistory: ComplianceHistoryPoint[] = [
  { month: "Dec", score: 72, properties: 5 },
  { month: "Jan", score: 76, properties: 6 },
  { month: "Feb", score: 79, properties: 6 },
  { month: "Mar", score: 82, properties: 7 },
  { month: "Apr", score: 80, properties: 7 },
  { month: "May", score: 84, properties: 7 },
];

// ─── Mock Properties at Risk ─────────────────────────────────────────────────

export const mockPropertiesAtRisk: PropertyAtRisk[] = [
  { id: "prop-004", name: "Alpine Chalet Zermatt", issue: "low_compliance", issueLabel: "Low Compliance", value: "45%" },
  { id: "prop-003", name: "Bondi Beach House", issue: "night_cap_warning", issueLabel: "Night Cap 93%", value: "167/180 nights" },
  { id: "prop-002", name: "Montmartre Loft", issue: "night_cap_warning", issueLabel: "Night Cap 82%", value: "98/120 nights" },
];

// ─── Mock Upcoming Deadlines ─────────────────────────────────────────────────

export const mockUpcomingDeadlines: UpcomingDeadline[] = [
  { id: "dl-001", type: "permit_renewal", title: "Permit Renewal Due", propertyName: "Alpine Chalet Zermatt", dueDate: "2026-05-28T00:00:00Z", daysRemaining: 6 },
  { id: "dl-002", type: "night_cap_reset", title: "Night Cap Reset", propertyName: "Bondi Beach House", dueDate: "2026-06-15T00:00:00Z", daysRemaining: 24 },
  { id: "dl-003", type: "levy_due", title: "Quarterly Levy Payment", propertyName: "Melbourne Docklands Apt", dueDate: "2026-06-30T00:00:00Z", daysRemaining: 39 },
  { id: "dl-004", type: "registration", title: "EU Registration Renewal", propertyName: "Barcelona Penthouse", dueDate: "2026-08-15T00:00:00Z", daysRemaining: 85 },
  { id: "dl-005", type: "permit_renewal", title: "Permit Renewal Due", propertyName: "Montmartre Loft", dueDate: "2026-07-01T00:00:00Z", daysRemaining: 40 },
];

// ─── Mock Recent Activity ────────────────────────────────────────────────────

export const mockRecentActivity: ActivityItem[] = [
  { id: "act-001", type: "permit", description: "Permit renewed for Melbourne Docklands Apt", timestamp: "2026-05-22T08:30:00Z", propertyName: "Melbourne Docklands Apt" },
  { id: "act-002", type: "ical_sync", description: "iCal synced: 3 new nights for Oceanview Retreat", timestamp: "2026-05-22T06:15:00Z", propertyName: "Oceanview Retreat" },
  { id: "act-003", type: "regulatory", description: "Regulatory change in Île-de-France: Night cap reduced to 90 days", timestamp: "2026-05-21T14:00:00Z" },
  { id: "act-004", type: "night_cap", description: "Night cap warning: Bondi Beach House at 93%", timestamp: "2026-05-21T09:00:00Z", propertyName: "Bondi Beach House" },
  { id: "act-005", type: "compliance", description: "Compliance score updated for Alpine Chalet Zermatt", timestamp: "2026-05-20T16:45:00Z", propertyName: "Alpine Chalet Zermatt" },
  { id: "act-006", type: "ical_sync", description: "iCal synced: 5 new nights for Manhattan Studio", timestamp: "2026-05-20T07:00:00Z", propertyName: "Manhattan Studio" },
  { id: "act-007", type: "permit", description: "Permit application submitted for Alpine Chalet Zermatt", timestamp: "2026-05-19T11:30:00Z", propertyName: "Alpine Chalet Zermatt" },
  { id: "act-008", type: "regulatory", description: "New regulation published for NSW short-term rentals", timestamp: "2026-05-18T13:20:00Z" },
];

// ─── Mock Notifications ──────────────────────────────────────────────────────

export const mockNotifications: NotificationLog[] = [
  { id: "notif-001", organisationId: "org-001", userId: "user-001", type: "permit_expiry", channel: "in_app", subject: "Permit Expiring Soon", body: "Your permit for Alpine Chalet Zermatt expires in 6 days.", isRead: false, readAt: null, createdAt: "2026-05-22T08:00:00Z" },
  { id: "notif-002", organisationId: "org-001", userId: "user-001", type: "night_cap_warning", channel: "in_app", subject: "Night Cap Warning", body: "Bondi Beach House has used 93% of its annual night cap.", isRead: false, readAt: null, createdAt: "2026-05-21T09:00:00Z" },
];

// ─── Mock Regulatory Changes ─────────────────────────────────────────────────

export const mockRegulatoryChanges: RegulatoryChange[] = [
  { id: "reg-001", jurisdictionId: "jur-fr-idf-paris", title: "Paris Night Cap Reduction", summary: "Annual night cap for primary residences reduced from 120 to 90 nights effective January 2027.", detailUrl: "https://example.com/paris-regulation", effectiveDate: "2027-01-01T00:00:00Z", severity: "high", isAcknowledged: false, acknowledgedBy: null, acknowledgedAt: null, createdAt: "2026-05-21T14:00:00Z" },
  { id: "reg-002", jurisdictionId: "jur-au-nsw-sydney", title: "NSW STRA Code of Conduct Update", summary: "Updated code of conduct for short-term rental accommodation providers in NSW.", detailUrl: "https://example.com/nsw-stra", effectiveDate: "2026-09-01T00:00:00Z", severity: "medium", isAcknowledged: false, acknowledgedBy: null, acknowledgedAt: null, createdAt: "2026-05-18T13:20:00Z" },
  { id: "reg-003", jurisdictionId: "jur-us-ny-nyc", title: "NYC Registration Fee Increase", summary: "Annual registration fee for short-term rental operators increased from $145 to $200.", detailUrl: "https://example.com/nyc-fee", effectiveDate: "2026-07-01T00:00:00Z", severity: "low", isAcknowledged: true, acknowledgedBy: "user-001", acknowledgedAt: "2026-05-19T10:00:00Z", createdAt: "2026-05-15T09:00:00Z" },
];

// ─── Mock Dashboard Stats ────────────────────────────────────────────────────

export const mockDashboardStats: DashboardStats = {
  totalProperties: mockProperties.length,
  complianceScore: Math.round(
    mockProperties.reduce((sum, p) => sum + p.complianceScore, 0) / mockProperties.length
  ),
  activePermits: mockPermits.filter((p) => p.status === "active").length,
  nightsUsed: mockNightCaps.reduce((sum, nc) => sum + nc.nightsUsed, 0),
  totalNightCap: mockNightCaps.reduce((sum, nc) => sum + nc.nightCap, 0),
  propertiesAddedThisMonth: 2,
};

// ─── Mock Booked Nights ──────────────────────────────────────────────────────

export interface MockBookedNight {
  id: string;
  propertyId: string;
  date: string;
  source: "airbnb" | "vrbo" | "booking_com" | "manual" | "other";
  guestName: string | null;
  notes?: string;
}

function generateBookedNights(propertyId: string, count: number, source: "airbnb" | "vrbo" | "booking_com" | "manual" | "other", guestNames: string[]): MockBookedNight[] {
  const nights: MockBookedNight[] = [];
  const startDate = new Date(2026, 0, 1);
  let dayOffset = 0;

  for (let i = 0; i < count; i++) {
    // Create clusters of 2-5 nights (bookings)
    const clusterSize = Math.floor(Math.random() * 4) + 2;
    dayOffset += Math.floor(Math.random() * 8) + 1; // gap between bookings
    const guest = guestNames[Math.floor(Math.random() * guestNames.length)];

    for (let j = 0; j < clusterSize && nights.length < count; j++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayOffset + j);
      if (date > new Date(2026, 4, 23)) break; // Don't go past "today"

      nights.push({
        id: `bn-${propertyId}-${nights.length}`,
        propertyId,
        date: date.toISOString().split("T")[0],
        source,
        guestName: guest,
      });
    }
    dayOffset += clusterSize;
  }

  return nights.slice(0, count);
}

export const mockBookedNights: MockBookedNight[] = [
  // prop-001: Oceanview Retreat - 142 nights, mix of Airbnb + VRBO
  ...generateBookedNights("prop-001", 100, "airbnb", ["Sarah Johnson", "Mike Chen", "Emma Wilson", "David Park", "Lisa Anderson"]),
  ...generateBookedNights("prop-001", 42, "vrbo", ["Robert Taylor", "Jennifer Lee", "Chris Martinez"]),
  // prop-002: Montmartre Loft - 98 nights, mostly Airbnb + Booking.com
  ...generateBookedNights("prop-002", 65, "airbnb", ["Pierre Dupont", "Marie Laurent", "Jean-Claude Petit", "Sophie Martin"]),
  ...generateBookedNights("prop-002", 33, "booking_com", ["Hans Mueller", "Anna Schmidt", "Yuki Tanaka"]),
  // prop-003: Bondi Beach House - 167 nights, heavy usage
  ...generateBookedNights("prop-003", 90, "airbnb", ["James Cook", "Olivia Brown", "Liam Wilson", "Ava Thompson"]),
  ...generateBookedNights("prop-003", 50, "vrbo", ["Noah Davis", "Mia Garcia", "Ethan Robinson"]),
  ...generateBookedNights("prop-003", 27, "manual", ["Local Guest", "Friend Stay"]),
  // prop-004: Alpine Chalet - 12 nights, low usage
  ...generateBookedNights("prop-004", 12, "airbnb", ["Klaus Weber", "Heidi Braun"]),
  // prop-005: Manhattan Studio - 201 nights
  ...generateBookedNights("prop-005", 120, "vrbo", ["Tom Williams", "Rachel Green", "Joey Tribbiani"]),
  ...generateBookedNights("prop-005", 81, "airbnb", ["Monica Geller", "Ross Geller", "Chandler Bing"]),
  // prop-006: Barcelona Penthouse - 89 nights
  ...generateBookedNights("prop-006", 60, "airbnb", ["Carlos Rodriguez", "Maria Garcia", "Pablo Sanchez"]),
  ...generateBookedNights("prop-006", 29, "booking_com", ["Francois Blanc", "Giulia Rossi"]),
  // prop-007: Melbourne Docklands - 45 nights
  ...generateBookedNights("prop-007", 30, "airbnb", ["Jack Thompson", "Ruby Mitchell", "Finn O'Brien"]),
  ...generateBookedNights("prop-007", 15, "vrbo", ["Grace Kim", "Leo Nguyen"]),
];

// ─── Mock Monthly Breakdown ──────────────────────────────────────────────────

export interface MonthlyBreakdown {
  propertyId: string;
  year: number;
  months: { month: number; monthName: string; nightsBooked: number }[];
}

export const mockMonthlyBreakdowns: MonthlyBreakdown[] = [
  {
    propertyId: "prop-001", year: 2026,
    months: [
      { month: 1, monthName: "Jan", nightsBooked: 28 },
      { month: 2, monthName: "Feb", nightsBooked: 24 },
      { month: 3, monthName: "Mar", nightsBooked: 30 },
      { month: 4, monthName: "Apr", nightsBooked: 32 },
      { month: 5, monthName: "May", nightsBooked: 28 },
      { month: 6, monthName: "Jun", nightsBooked: 0 },
      { month: 7, monthName: "Jul", nightsBooked: 0 },
      { month: 8, monthName: "Aug", nightsBooked: 0 },
      { month: 9, monthName: "Sep", nightsBooked: 0 },
      { month: 10, monthName: "Oct", nightsBooked: 0 },
      { month: 11, monthName: "Nov", nightsBooked: 0 },
      { month: 12, monthName: "Dec", nightsBooked: 0 },
    ],
  },
  {
    propertyId: "prop-002", year: 2026,
    months: [
      { month: 1, monthName: "Jan", nightsBooked: 18 },
      { month: 2, monthName: "Feb", nightsBooked: 20 },
      { month: 3, monthName: "Mar", nightsBooked: 22 },
      { month: 4, monthName: "Apr", nightsBooked: 20 },
      { month: 5, monthName: "May", nightsBooked: 18 },
      { month: 6, monthName: "Jun", nightsBooked: 0 },
      { month: 7, monthName: "Jul", nightsBooked: 0 },
      { month: 8, monthName: "Aug", nightsBooked: 0 },
      { month: 9, monthName: "Sep", nightsBooked: 0 },
      { month: 10, monthName: "Oct", nightsBooked: 0 },
      { month: 11, monthName: "Nov", nightsBooked: 0 },
      { month: 12, monthName: "Dec", nightsBooked: 0 },
    ],
  },
  {
    propertyId: "prop-003", year: 2026,
    months: [
      { month: 1, monthName: "Jan", nightsBooked: 30 },
      { month: 2, monthName: "Feb", nightsBooked: 28 },
      { month: 3, monthName: "Mar", nightsBooked: 31 },
      { month: 4, monthName: "Apr", nightsBooked: 30 },
      { month: 5, monthName: "May", nightsBooked: 48 },
      { month: 6, monthName: "Jun", nightsBooked: 0 },
      { month: 7, monthName: "Jul", nightsBooked: 0 },
      { month: 8, monthName: "Aug", nightsBooked: 0 },
      { month: 9, monthName: "Sep", nightsBooked: 0 },
      { month: 10, monthName: "Oct", nightsBooked: 0 },
      { month: 11, monthName: "Nov", nightsBooked: 0 },
      { month: 12, monthName: "Dec", nightsBooked: 0 },
    ],
  },
  {
    propertyId: "prop-004", year: 2026,
    months: [
      { month: 1, monthName: "Jan", nightsBooked: 5 },
      { month: 2, monthName: "Feb", nightsBooked: 4 },
      { month: 3, monthName: "Mar", nightsBooked: 3 },
      { month: 4, monthName: "Apr", nightsBooked: 0 },
      { month: 5, monthName: "May", nightsBooked: 0 },
      { month: 6, monthName: "Jun", nightsBooked: 0 },
      { month: 7, monthName: "Jul", nightsBooked: 0 },
      { month: 8, monthName: "Aug", nightsBooked: 0 },
      { month: 9, monthName: "Sep", nightsBooked: 0 },
      { month: 10, monthName: "Oct", nightsBooked: 0 },
      { month: 11, monthName: "Nov", nightsBooked: 0 },
      { month: 12, monthName: "Dec", nightsBooked: 0 },
    ],
  },
  {
    propertyId: "prop-005", year: 2026,
    months: [
      { month: 1, monthName: "Jan", nightsBooked: 38 },
      { month: 2, monthName: "Feb", nightsBooked: 35 },
      { month: 3, monthName: "Mar", nightsBooked: 42 },
      { month: 4, monthName: "Apr", nightsBooked: 45 },
      { month: 5, monthName: "May", nightsBooked: 41 },
      { month: 6, monthName: "Jun", nightsBooked: 0 },
      { month: 7, monthName: "Jul", nightsBooked: 0 },
      { month: 8, monthName: "Aug", nightsBooked: 0 },
      { month: 9, monthName: "Sep", nightsBooked: 0 },
      { month: 10, monthName: "Oct", nightsBooked: 0 },
      { month: 11, monthName: "Nov", nightsBooked: 0 },
      { month: 12, monthName: "Dec", nightsBooked: 0 },
    ],
  },
  {
    propertyId: "prop-006", year: 2026,
    months: [
      { month: 1, monthName: "Jan", nightsBooked: 15 },
      { month: 2, monthName: "Feb", nightsBooked: 18 },
      { month: 3, monthName: "Mar", nightsBooked: 20 },
      { month: 4, monthName: "Apr", nightsBooked: 18 },
      { month: 5, monthName: "May", nightsBooked: 18 },
      { month: 6, monthName: "Jun", nightsBooked: 0 },
      { month: 7, monthName: "Jul", nightsBooked: 0 },
      { month: 8, monthName: "Aug", nightsBooked: 0 },
      { month: 9, monthName: "Sep", nightsBooked: 0 },
      { month: 10, monthName: "Oct", nightsBooked: 0 },
      { month: 11, monthName: "Nov", nightsBooked: 0 },
      { month: 12, monthName: "Dec", nightsBooked: 0 },
    ],
  },
  {
    propertyId: "prop-007", year: 2026,
    months: [
      { month: 1, monthName: "Jan", nightsBooked: 8 },
      { month: 2, monthName: "Feb", nightsBooked: 10 },
      { month: 3, monthName: "Mar", nightsBooked: 12 },
      { month: 4, monthName: "Apr", nightsBooked: 8 },
      { month: 5, monthName: "May", nightsBooked: 7 },
      { month: 6, monthName: "Jun", nightsBooked: 0 },
      { month: 7, monthName: "Jul", nightsBooked: 0 },
      { month: 8, monthName: "Aug", nightsBooked: 0 },
      { month: 9, monthName: "Sep", nightsBooked: 0 },
      { month: 10, monthName: "Oct", nightsBooked: 0 },
      { month: 11, monthName: "Nov", nightsBooked: 0 },
      { month: 12, monthName: "Dec", nightsBooked: 0 },
    ],
  },
];

// ─── Mock iCal Feeds ─────────────────────────────────────────────────────────

export interface MockICalFeed {
  id: string;
  propertyId: string;
  feedUrl: string;
  source: "airbnb" | "vrbo" | "booking_com" | "other";
  label: string;
  isActive: boolean;
  lastSyncAt: string | null;
  lastSyncStatus: "success" | "error" | null;
  syncErrorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mockICalFeeds: MockICalFeed[] = [
  {
    id: "feed-001",
    propertyId: "prop-001",
    feedUrl: "https://www.airbnb.com/calendar/ical/12345678.ics?s=abc123def456",
    source: "airbnb",
    label: "Oceanview Airbnb Calendar",
    isActive: true,
    lastSyncAt: "2026-05-23T06:00:00Z",
    lastSyncStatus: "success",
    syncErrorMessage: null,
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2026-05-23T06:00:00Z",
  },
  {
    id: "feed-002",
    propertyId: "prop-001",
    feedUrl: "https://www.vrbo.com/icalendar/property-9876543.ics",
    source: "vrbo",
    label: "Oceanview VRBO Calendar",
    isActive: true,
    lastSyncAt: "2026-05-23T06:00:00Z",
    lastSyncStatus: "success",
    syncErrorMessage: null,
    createdAt: "2025-05-15T00:00:00Z",
    updatedAt: "2026-05-23T06:00:00Z",
  },
  {
    id: "feed-003",
    propertyId: "prop-002",
    feedUrl: "https://www.airbnb.com/calendar/ical/87654321.ics?s=xyz789ghi012",
    source: "airbnb",
    label: "Montmartre Airbnb",
    isActive: true,
    lastSyncAt: "2026-05-22T18:00:00Z",
    lastSyncStatus: "success",
    syncErrorMessage: null,
    createdAt: "2025-07-01T00:00:00Z",
    updatedAt: "2026-05-22T18:00:00Z",
  },
  {
    id: "feed-004",
    propertyId: "prop-002",
    feedUrl: "https://admin.booking.com/hotel/hoteladmin/ical.html?t=abc123",
    source: "booking_com",
    label: "Montmartre Booking.com",
    isActive: true,
    lastSyncAt: "2026-05-22T18:00:00Z",
    lastSyncStatus: "success",
    syncErrorMessage: null,
    createdAt: "2025-08-10T00:00:00Z",
    updatedAt: "2026-05-22T18:00:00Z",
  },
  {
    id: "feed-005",
    propertyId: "prop-003",
    feedUrl: "https://www.airbnb.com/calendar/ical/11223344.ics?s=bondi2026",
    source: "airbnb",
    label: "Bondi Airbnb Calendar",
    isActive: true,
    lastSyncAt: "2026-05-23T04:00:00Z",
    lastSyncStatus: "success",
    syncErrorMessage: null,
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2026-05-23T04:00:00Z",
  },
  {
    id: "feed-006",
    propertyId: "prop-003",
    feedUrl: "https://www.vrbo.com/icalendar/property-5544332.ics",
    source: "vrbo",
    label: "Bondi VRBO Calendar",
    isActive: true,
    lastSyncAt: "2026-05-23T04:00:00Z",
    lastSyncStatus: "success",
    syncErrorMessage: null,
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2026-05-23T04:00:00Z",
  },
  {
    id: "feed-007",
    propertyId: "prop-005",
    feedUrl: "https://www.vrbo.com/icalendar/property-7788990.ics",
    source: "vrbo",
    label: "Manhattan VRBO",
    isActive: true,
    lastSyncAt: "2026-05-22T12:00:00Z",
    lastSyncStatus: "success",
    syncErrorMessage: null,
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2026-05-22T12:00:00Z",
  },
  {
    id: "feed-008",
    propertyId: "prop-005",
    feedUrl: "https://www.airbnb.com/calendar/ical/99887766.ics?s=nyc2026",
    source: "airbnb",
    label: "Manhattan Airbnb",
    isActive: false,
    lastSyncAt: "2026-05-10T06:00:00Z",
    lastSyncStatus: "error",
    syncErrorMessage: "Feed URL returned 403 Forbidden. Please re-generate the iCal link.",
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2026-05-10T06:00:00Z",
  },
  {
    id: "feed-009",
    propertyId: "prop-006",
    feedUrl: "https://www.airbnb.com/calendar/ical/55443322.ics?s=bcn2026",
    source: "airbnb",
    label: "Barcelona Airbnb",
    isActive: true,
    lastSyncAt: "2026-05-23T02:00:00Z",
    lastSyncStatus: "success",
    syncErrorMessage: null,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-05-23T02:00:00Z",
  },
  {
    id: "feed-010",
    propertyId: "prop-007",
    feedUrl: "https://www.airbnb.com/calendar/ical/33221100.ics?s=melb2026",
    source: "airbnb",
    label: "Melbourne Airbnb",
    isActive: true,
    lastSyncAt: "2026-05-22T20:00:00Z",
    lastSyncStatus: "success",
    syncErrorMessage: null,
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-05-22T20:00:00Z",
  },
];

// ─── Mock Feed Preview Events ────────────────────────────────────────────────

export interface FeedPreviewEvent {
  startDate: string;
  endDate: string;
  nightsCount: number;
  summary: string;
}

export const mockFeedPreviewEvents: FeedPreviewEvent[] = [
  { startDate: "2026-06-01", endDate: "2026-06-04", nightsCount: 3, summary: "Reserved - Sarah J." },
  { startDate: "2026-06-10", endDate: "2026-06-15", nightsCount: 5, summary: "Reserved - Mike C." },
  { startDate: "2026-06-22", endDate: "2026-06-25", nightsCount: 3, summary: "Reserved - Emma W." },
  { startDate: "2026-07-01", endDate: "2026-07-08", nightsCount: 7, summary: "Reserved - David P." },
  { startDate: "2026-07-15", endDate: "2026-07-18", nightsCount: 3, summary: "Reserved - Lisa A." },
];

// ─── Mock User Context ───────────────────────────────────────────────────────

export const mockUser = {
  firstName: "Alex",
  lastName: "Morgan",
  organisationName: "Coastal Properties Group",
};

// ─── EU Registration Mock Data ───────────────────────────────────────────────

export interface EuRegistrationStepData {
  id: string;
  stepName: string;
  displayName: string;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
  order: number;
  requiresUpload: boolean;
  externalPortalUrl: string | null;
}

export interface EuPropertyRegistration {
  propertyId: string;
  propertyName: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  status: "not_started" | "in_progress" | "completed";
  completedSteps: number;
  totalSteps: number;
  percentComplete: number;
  registrationNumber: string | null;
  steps: EuRegistrationStepData[];
}

export const mockEuRegistrations: EuPropertyRegistration[] = [
  {
    propertyId: "prop-002",
    propertyName: "Montmartre Loft",
    countryCode: "FR",
    countryName: "France",
    countryFlag: "🇫🇷",
    status: "completed",
    completedSteps: 5,
    totalSteps: 5,
    percentComplete: 100,
    registrationNumber: "PAR-MT-2025-7392",
    steps: [
      { id: "step-fr-1", stepName: "identity_verification", displayName: "Identity Verification", description: "Upload government-issued ID and confirm personal details for French registration.", isCompleted: true, completedAt: "2025-06-01T10:00:00Z", order: 1, requiresUpload: true, externalPortalUrl: null },
      { id: "step-fr-2", stepName: "property_details", displayName: "Property Details", description: "Confirm property address, type (meublé de tourisme), capacity, and amenities.", isCompleted: true, completedAt: "2025-06-05T14:00:00Z", order: 2, requiresUpload: false, externalPortalUrl: null },
      { id: "step-fr-3", stepName: "local_registration", displayName: "Local Registration", description: "Register with Mairie de Paris via the teleservice portal.", isCompleted: true, completedAt: "2025-06-15T09:00:00Z", order: 3, requiresUpload: false, externalPortalUrl: "https://teleservices.paris.fr/locmeuble/" },
      { id: "step-fr-4", stepName: "platform_submission", displayName: "Platform Submission", description: "Submit registration number to Airbnb, Booking.com, and other platforms.", isCompleted: true, completedAt: "2025-06-20T11:00:00Z", order: 4, requiresUpload: false, externalPortalUrl: null },
      { id: "step-fr-5", stepName: "confirmation", displayName: "Confirmation", description: "Receive and enter your official registration number from the Mairie.", isCompleted: true, completedAt: "2025-07-01T08:00:00Z", order: 5, requiresUpload: true, externalPortalUrl: null },
    ],
  },
  {
    propertyId: "prop-006",
    propertyName: "Barcelona Penthouse",
    countryCode: "ES",
    countryName: "Spain",
    countryFlag: "🇪🇸",
    status: "in_progress",
    completedSteps: 3,
    totalSteps: 5,
    percentComplete: 60,
    registrationNumber: null,
    steps: [
      { id: "step-es-1", stepName: "identity_verification", displayName: "Identity Verification", description: "Upload NIE/passport and confirm personal details for Catalonia registration.", isCompleted: true, completedAt: "2026-01-10T10:00:00Z", order: 1, requiresUpload: true, externalPortalUrl: null },
      { id: "step-es-2", stepName: "property_details", displayName: "Property Details", description: "Confirm property address, type (habitatge d'ús turístic), capacity, and amenities.", isCompleted: true, completedAt: "2026-01-15T14:00:00Z", order: 2, requiresUpload: false, externalPortalUrl: null },
      { id: "step-es-3", stepName: "local_registration", displayName: "Local Registration", description: "Register with Generalitat de Catalunya via the RTC portal.", isCompleted: true, completedAt: "2026-01-20T09:00:00Z", order: 3, requiresUpload: false, externalPortalUrl: "https://web.gencat.cat/ca/tramits/tramits-temes/Habitatges-dus-turistic" },
      { id: "step-es-4", stepName: "platform_submission", displayName: "Platform Submission", description: "Submit HUT registration number to all booking platforms.", isCompleted: false, completedAt: null, order: 4, requiresUpload: false, externalPortalUrl: null },
      { id: "step-es-5", stepName: "confirmation", displayName: "Confirmation", description: "Receive official HUT license number from Generalitat.", isCompleted: false, completedAt: null, order: 5, requiresUpload: true, externalPortalUrl: null },
    ],
  },
  {
    propertyId: "prop-004",
    propertyName: "Alpine Chalet Zermatt",
    countryCode: "CH",
    countryName: "Switzerland",
    countryFlag: "🇨🇭",
    status: "not_started",
    completedSteps: 0,
    totalSteps: 5,
    percentComplete: 0,
    registrationNumber: null,
    steps: [
      { id: "step-ch-1", stepName: "identity_verification", displayName: "Identity Verification", description: "Upload Swiss residence permit or passport for Valais registration.", isCompleted: false, completedAt: null, order: 1, requiresUpload: true, externalPortalUrl: null },
      { id: "step-ch-2", stepName: "property_details", displayName: "Property Details", description: "Confirm property address, type (Ferienwohnung), capacity, and amenities.", isCompleted: false, completedAt: null, order: 2, requiresUpload: false, externalPortalUrl: null },
      { id: "step-ch-3", stepName: "local_registration", displayName: "Local Registration", description: "Register with Gemeinde Zermatt for Ferienwohnung Bewilligung.", isCompleted: false, completedAt: null, order: 3, requiresUpload: false, externalPortalUrl: "https://www.zermatt.ch/en/Tourism-Office" },
      { id: "step-ch-4", stepName: "platform_submission", displayName: "Platform Submission", description: "Submit registration to booking platforms once approved.", isCompleted: false, completedAt: null, order: 4, requiresUpload: false, externalPortalUrl: null },
      { id: "step-ch-5", stepName: "confirmation", displayName: "Confirmation", description: "Receive official Bewilligung number from Gemeinde.", isCompleted: false, completedAt: null, order: 5, requiresUpload: true, externalPortalUrl: null },
    ],
  },
];

export interface EuCountryRequirements {
  countryCode: string;
  countryName: string;
  countryFlag: string;
  summary: string;
  requirements: string[];
  officialPortalUrl: string;
  nightCapDays: number | null;
  registrationMandatory: boolean;
  penaltyInfo: string;
}

export const mockEuRequirements: EuCountryRequirements[] = [
  {
    countryCode: "FR",
    countryName: "France",
    countryFlag: "🇫🇷",
    summary: "France requires all short-term rental properties to register with the local mairie. Primary residences are limited to 120 nights per year.",
    requirements: [
      "Register with local mairie (town hall)",
      "Obtain 13-digit registration number",
      "Display registration number on all listings",
      "Respect 120-night annual cap for primary residences",
      "Declare rental income for tax purposes",
      "Ensure property meets safety standards (smoke detectors, etc.)",
    ],
    officialPortalUrl: "https://teleservices.paris.fr/locmeuble/",
    nightCapDays: 120,
    registrationMandatory: true,
    penaltyInfo: "Fines up to €50,000 for non-compliance. Platforms face €12,500 per non-compliant listing.",
  },
  {
    countryCode: "ES",
    countryName: "Spain",
    countryFlag: "🇪🇸",
    summary: "Spain's regulations vary by autonomous community. Catalonia requires HUT (Habitatge d'Ús Turístic) registration. Some areas have moratoriums on new licenses.",
    requirements: [
      "Obtain HUT license from Generalitat de Catalunya",
      "Property must meet habitability standards",
      "Display license number on all advertisements",
      "Maintain guest register (Parte de Viajeros)",
      "Report guests to police within 24 hours",
      "Pay tourist tax (IEET) per guest per night",
    ],
    officialPortalUrl: "https://web.gencat.cat/ca/tramits/tramits-temes/Habitatges-dus-turistic",
    nightCapDays: null,
    registrationMandatory: true,
    penaltyInfo: "Fines range from €3,000 to €600,000 depending on severity. Operating without license is a serious infraction.",
  },
  {
    countryCode: "CH",
    countryName: "Switzerland",
    countryFlag: "🇨🇭",
    summary: "Switzerland's regulations are cantonal. Valais requires a Ferienwohnung Bewilligung for holiday rentals. Some communes limit the number of secondary residences.",
    requirements: [
      "Obtain Ferienwohnung Bewilligung from Gemeinde",
      "Property must comply with Lex Weber (secondary residence limits)",
      "Register with local tourism office",
      "Collect and remit Kurtaxe (tourist tax)",
      "Maintain guest registration book",
      "Ensure fire safety compliance",
    ],
    officialPortalUrl: "https://www.zermatt.ch/en/Tourism-Office",
    nightCapDays: 90,
    registrationMandatory: true,
    penaltyInfo: "Fines vary by canton. Unauthorized rentals may result in permit revocation and fines up to CHF 20,000.",
  },
];

// ─── AU Compliance Mock Data ─────────────────────────────────────────────────

export interface AuLevyPayment {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
  reference: string;
  quarter: string;
  year: number;
}

export interface AuLevySummaryData {
  propertyId: string;
  propertyName: string;
  year: number;
  totalNights: number;
  levyRatePerNight: number;
  totalOwed: number;
  totalPaid: number;
  balance: number;
  status: "paid" | "partial" | "unpaid";
}

export const mockAuLevySummaries: AuLevySummaryData[] = [
  {
    propertyId: "prop-003",
    propertyName: "Bondi Beach House",
    year: 2026,
    totalNights: 167,
    levyRatePerNight: 5.50,
    totalOwed: 918.50,
    totalPaid: 550.00,
    balance: 368.50,
    status: "partial",
  },
  {
    propertyId: "prop-007",
    propertyName: "Melbourne Docklands Apt",
    year: 2026,
    totalNights: 45,
    levyRatePerNight: 7.50,
    totalOwed: 337.50,
    totalPaid: 337.50,
    balance: 0,
    status: "paid",
  },
];

export const mockAuLevyPayments: AuLevyPayment[] = [
  { id: "lp-001", propertyId: "prop-003", amount: 275.00, date: "2026-01-15T00:00:00Z", reference: "LEV-NSW-2026-Q1-A", quarter: "Q1", year: 2026 },
  { id: "lp-002", propertyId: "prop-003", amount: 275.00, date: "2026-04-10T00:00:00Z", reference: "LEV-NSW-2026-Q1-B", quarter: "Q1", year: 2026 },
  { id: "lp-003", propertyId: "prop-007", amount: 112.50, date: "2026-01-20T00:00:00Z", reference: "LEV-VIC-2026-Q1", quarter: "Q1", year: 2026 },
  { id: "lp-004", propertyId: "prop-007", amount: 112.50, date: "2026-04-15T00:00:00Z", reference: "LEV-VIC-2026-Q2", quarter: "Q2", year: 2026 },
  { id: "lp-005", propertyId: "prop-007", amount: 112.50, date: "2026-05-20T00:00:00Z", reference: "LEV-VIC-2026-Q2-B", quarter: "Q2", year: 2026 },
];

export interface AuFireSafetyRecord {
  id: string;
  propertyId: string;
  propertyName: string;
  smokeAlarmsInstalled: boolean;
  smokeAlarmsLastTested: string | null;
  fireExtinguisherPresent: boolean;
  fireExtinguisherExpiry: string | null;
  evacuationPlanDisplayed: boolean;
  lastInspectionDate: string | null;
  nextInspectionDue: string | null;
  overallStatus: "compliant" | "action_required" | "overdue";
  actionItems: { description: string; deadline: string; priority: "high" | "medium" | "low" }[];
}

export const mockAuFireSafety: AuFireSafetyRecord[] = [
  {
    id: "fs-001",
    propertyId: "prop-003",
    propertyName: "Bondi Beach House",
    smokeAlarmsInstalled: true,
    smokeAlarmsLastTested: "2025-11-15T00:00:00Z",
    fireExtinguisherPresent: false,
    fireExtinguisherExpiry: null,
    evacuationPlanDisplayed: true,
    lastInspectionDate: "2025-11-20T00:00:00Z",
    nextInspectionDue: "2026-05-20T00:00:00Z",
    overallStatus: "overdue",
    actionItems: [
      { description: "Install fire extinguisher in kitchen area", deadline: "2026-06-01T00:00:00Z", priority: "high" },
      { description: "Schedule annual fire safety inspection (overdue)", deadline: "2026-05-30T00:00:00Z", priority: "high" },
      { description: "Test smoke alarms (6-month interval passed)", deadline: "2026-06-15T00:00:00Z", priority: "medium" },
    ],
  },
  {
    id: "fs-002",
    propertyId: "prop-007",
    propertyName: "Melbourne Docklands Apt",
    smokeAlarmsInstalled: true,
    smokeAlarmsLastTested: "2026-03-10T00:00:00Z",
    fireExtinguisherPresent: true,
    fireExtinguisherExpiry: "2027-03-01T00:00:00Z",
    evacuationPlanDisplayed: true,
    lastInspectionDate: "2026-03-15T00:00:00Z",
    nextInspectionDue: "2027-03-15T00:00:00Z",
    overallStatus: "compliant",
    actionItems: [],
  },
];

export interface AuComplaint {
  id: string;
  propertyId: string;
  propertyName: string;
  date: string;
  type: "noise" | "parking" | "waste" | "other";
  description: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  resolution: string | null;
  resolvedAt: string | null;
}

export const mockAuComplaints: AuComplaint[] = [
  { id: "comp-001", propertyId: "prop-003", propertyName: "Bondi Beach House", date: "2026-05-18T22:30:00Z", type: "noise", description: "Loud music and party noise reported by neighbour at 22 Campbell Parade after 10pm.", status: "investigating", resolution: null, resolvedAt: null },
  { id: "comp-002", propertyId: "prop-003", propertyName: "Bondi Beach House", date: "2026-05-10T08:00:00Z", type: "waste", description: "Bins left on street after collection day. Overflowing recycling bin.", status: "resolved", resolution: "Contacted guest and arranged immediate cleanup. Added bin schedule to house manual.", resolvedAt: "2026-05-11T14:00:00Z" },
  { id: "comp-003", propertyId: "prop-003", propertyName: "Bondi Beach House", date: "2026-04-22T19:00:00Z", type: "parking", description: "Guest vehicle blocking shared driveway access for unit 13.", status: "resolved", resolution: "Guest moved vehicle within 30 minutes of notification. Added parking instructions to check-in guide.", resolvedAt: "2026-04-22T19:45:00Z" },
  { id: "comp-004", propertyId: "prop-007", propertyName: "Melbourne Docklands Apt", date: "2026-05-05T23:15:00Z", type: "noise", description: "Excessive noise from apartment 2204 reported by building management.", status: "resolved", resolution: "Issued formal warning to guest. No further incidents reported.", resolvedAt: "2026-05-06T10:00:00Z" },
  { id: "comp-005", propertyId: "prop-007", propertyName: "Melbourne Docklands Apt", date: "2026-04-15T07:30:00Z", type: "other", description: "Guest smoking on balcony in violation of building rules.", status: "dismissed", resolution: "Investigated — no evidence found. Building CCTV inconclusive.", resolvedAt: "2026-04-17T16:00:00Z" },
  { id: "comp-006", propertyId: "prop-003", propertyName: "Bondi Beach House", date: "2026-03-28T16:00:00Z", type: "noise", description: "Construction noise from unapproved renovation work.", status: "dismissed", resolution: "Noise was from neighbouring property construction, not our rental.", resolvedAt: "2026-03-29T09:00:00Z" },
  { id: "comp-007", propertyId: "prop-003", propertyName: "Bondi Beach House", date: "2026-02-14T21:00:00Z", type: "noise", description: "Valentine's Day gathering with excessive noise after 11pm.", status: "resolved", resolution: "Guest apologised. Implemented quiet hours reminder in automated check-in message.", resolvedAt: "2026-02-15T08:00:00Z" },
  { id: "comp-008", propertyId: "prop-007", propertyName: "Melbourne Docklands Apt", date: "2026-01-20T09:00:00Z", type: "waste", description: "Large items left in building bin room without proper disposal.", status: "resolved", resolution: "Arranged council hard rubbish collection. Charged guest cleaning fee.", resolvedAt: "2026-01-22T14:00:00Z" },
];

// ─── US Tax Mock Data ────────────────────────────────────────────────────────

export interface UsTaxSummaryData {
  propertyId: string;
  propertyName: string;
  year: number;
  taxType: string;
  taxRate: number;
  totalRevenue: number;
  totalTaxOwed: number;
  totalTaxPaid: number;
  balance: number;
  status: "paid" | "partial" | "unpaid";
}

export interface UsTaxPayment {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
  reference: string;
  period: string;
  year: number;
}

export const mockUsTaxSummaries: UsTaxSummaryData[] = [
  {
    propertyId: "prop-001",
    propertyName: "Oceanview Retreat",
    year: 2026,
    taxType: "Transient Occupancy Tax (TOT)",
    taxRate: 12.0,
    totalRevenue: 89500,
    totalTaxOwed: 10740,
    totalTaxPaid: 8055,
    balance: 2685,
    status: "partial",
  },
  {
    propertyId: "prop-005",
    propertyName: "Manhattan Studio",
    year: 2026,
    taxType: "Hotel Room Occupancy Tax",
    taxRate: 14.75,
    totalRevenue: 62300,
    totalTaxOwed: 9189.25,
    totalTaxPaid: 9189.25,
    balance: 0,
    status: "paid",
  },
];

export const mockUsTaxPayments: UsTaxPayment[] = [
  { id: "tp-001", propertyId: "prop-001", amount: 2685.00, date: "2026-02-01T00:00:00Z", reference: "TOT-LA-2026-Q1", period: "Q1 2026", year: 2026 },
  { id: "tp-002", propertyId: "prop-001", amount: 2685.00, date: "2026-04-01T00:00:00Z", reference: "TOT-LA-2026-Q2A", period: "Q2 2026", year: 2026 },
  { id: "tp-003", propertyId: "prop-001", amount: 2685.00, date: "2026-05-01T00:00:00Z", reference: "TOT-LA-2026-Q2B", period: "Q2 2026", year: 2026 },
  { id: "tp-004", propertyId: "prop-005", amount: 2297.31, date: "2026-01-15T00:00:00Z", reference: "HROT-NYC-2026-Q1", period: "Q1 2026", year: 2026 },
  { id: "tp-005", propertyId: "prop-005", amount: 2297.31, date: "2026-03-15T00:00:00Z", reference: "HROT-NYC-2026-Q1B", period: "Q1 2026", year: 2026 },
  { id: "tp-006", propertyId: "prop-005", amount: 2297.31, date: "2026-04-15T00:00:00Z", reference: "HROT-NYC-2026-Q2", period: "Q2 2026", year: 2026 },
  { id: "tp-007", propertyId: "prop-005", amount: 2297.32, date: "2026-05-15T00:00:00Z", reference: "HROT-NYC-2026-Q2B", period: "Q2 2026", year: 2026 },
];
