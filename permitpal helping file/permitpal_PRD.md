# PermitPal — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** May 2026  
**Status:** In Progress  
**Stack:** .NET 8 Web API · MySQL 8 · React 18  

---

## 1. Product Overview

### 1.1 Vision
PermitPal is the first compliance platform built specifically for Airbnb hosts and short-term rental operators — tracking permits, night caps, registration numbers, levies and regulatory changes across the US, EU, and Australia in one dashboard.

### 1.2 The Problem
STR regulations have entered a new era of strict enforcement:

- **EU Regulation 2024/1028** (May 2026): every EU host must register and display a registration number on all listings. Platforms auto-remove non-compliant listings. Spain fined Airbnb €64M for hosting unlicensed listings.
- **Australia 2025**: WA mandatory STRA registration (Jan 2025), Victoria 7.5% Short Stay Levy (Jan 2025), Brisbane new permits and 60-minute complaint response requirement (mid-2026), fines up to $140,000 AUD.
- **US**: 500+ cities each with different permit types, renewal dates, night caps, TOT rates. NYC, SF, Austin, Honolulu all aggressively enforcing.

Hosts manage this in spreadsheets, miss renewal deadlines, and get fined or delisted. No affordable, modern, host-facing compliance tool exists.

### 1.3 Target Market
- **Primary:** Solo Airbnb hosts (1–5 properties), AU and EU (highest urgency)
- **Secondary:** Small portfolio operators (5–20 properties), US + international
- **Tertiary:** Property managers running 20+ properties for clients (white-label tier)

---

## 2. Users & Roles

| Role | Description | Key Needs |
|---|---|---|
| `owner` | Host who owns the account | Full access — permits, docs, billing |
| `admin` | Co-host or VA | Can manage permits and documents, cannot change billing |
| `viewer` | Accountant or silent partner | Read-only — reports and tax summaries |

---

## 3. Feature Requirements

### 3.1 Phase 1 — Core MVP (Months 1–4)

#### 3.1.1 Property & Jurisdiction
- **F-001:** Property create — address, type, hosted/unhosted, primary residence flag
- **F-002:** Jurisdiction resolver — postcode + country → jurisdiction ruleset (permit types, night cap, TOT, fees)
- **F-003:** Compliance profile page — shows all requirements for a property in plain English
- **F-004:** Compliance score 0–100 per property (Red / Amber / Green)
- **F-005:** Multi-property portfolio view (Host plan — up to 5 properties)

#### 3.1.2 Permit Tracker
- **F-010:** Permit CRUD — number, issuing authority, issued date, expiry date
- **F-011:** Document vault — upload permit PDFs, safety certificates, insurance docs (Cloudflare R2)
- **F-012:** Renewal alerts — 90/30/7 day via email + SMS (Hangfire recurring job)
- **F-013:** One-click renewal link — direct link to the renewal portal for 200+ jurisdictions
- **F-014:** Permit number display checker — verify permit appears in Airbnb listing description

#### 3.1.3 Night-Cap Counter
- **F-020:** iCal sync — import calendar URL from Airbnb, VRBO, Booking.com
- **F-021:** Night counter — parse VEVENT entries, count booked nights per calendar year
- **F-022:** Multi-platform de-duplication — same night on Airbnb + VRBO counts once
- **F-023:** Night-cap alerts — push notification at 80%, 90%, 100% of annual limit
- **F-024:** Calendar year reset — Jan 1 for most jurisdictions, custom dates (e.g. Byron Shire)

#### 3.1.4 Regulatory Change Alerts
- **F-030:** Regulatory change monitoring — nightly Hangfire job checks rule database for updates
- **F-031:** Claude API summaries — changes converted to plain-English summaries for hosts
- **F-032:** Alert delivery — email to all affected hosts within 24h of rule change
- **F-033:** Alert subscription — host can subscribe/unsubscribe per jurisdiction

---

### 3.2 Phase 2 — EU Compliance (Months 3–6)

- **F-040:** EU Reg 2024/1028 wizard — step-by-step per member state
- **F-041:** France — Déclaratrion/Déclaraloc guide (120-night cap, Loi Le Meur)
- **F-042:** Spain — NRU registration guide (link to national registry)
- **F-043:** Netherlands — BRP registration (Amsterdam 30-night cap)
- **F-044:** Germany — Zweckentfremdung guide (city by city — Berlin, Munich, Hamburg)
- **F-045:** Portugal — RNAL registration (Registo Nacional AL)
- **F-046:** Italy — CIR code registration (Codice Identificativo Regionale)
- **F-047:** Registration number validator — API check against national registries
- **F-048:** EU night-cap monitoring — Paris 120, Amsterdam 30, Lyon 120, Barcelona phase-out
- **F-049:** Platform data reconciliation — show what Airbnb has reported to EU authorities about host's listing
- **F-050:** France Loi Le Meur tracker — 275-day principal residence requirement, energy DPE rating

---

### 3.3 Phase 3 — AU Compliance (Months 4–6)

- **F-060:** NSW STRA registration guide — $65 new / $25 renewal, PID display requirement
- **F-061:** NSW 180-night cap tracker — Greater Sydney, Ballina, Clarence Valley
- **F-062:** Byron Shire 60-night cap variant (from Sept 2024)
- **F-063:** Victoria 7.5% Short Stay Levy calculator — total booking value including cleaning fees
- **F-064:** Victoria SRO quarterly report generator — CSV export for lodgement
- **F-065:** Victoria strata/OC ban tracker — monitor Land Use Victoria register
- **F-066:** WA STRA registration guide — $250 new / $100 renewal, 90-night Perth threshold
- **F-067:** Brisbane permit guide — mid-2026 laws, annual renewal
- **F-068:** Brisbane complaint log — 60-minute response timer, 24h resolution, council report
- **F-069:** AU fire safety compliance checklist — AS 3786 by state, maintenance log
- **F-070:** Queensland 2027 interconnected photoelectric alarm deadline tracker
- **F-071:** ATO income report export — myTax-ready, GST flag for commercial-residential

---

### 3.4 Phase 4 — US Expansion (Months 7–10)

- **F-080:** City rules database — top 10 US cities (NYC, SF, Austin, Nashville, Miami, Denver, Seattle, Chicago, LA, Honolulu)
- **F-081:** City rules database — expand to 500 cities by month 12
- **F-082:** TOT / occupancy tax tracker — city + county rates, platform vs self-remit split
- **F-083:** Zoning check — enter address → confirm STR permitted in that zone (GIS API)
- **F-084:** License display checker — scan Airbnb listing URL for permit number in description
- **F-085:** Quarterly TOT filing report for direct bookings

---

### 3.5 Phase 5 — Scale & Integrations (Months 10–18)

- **F-090:** Hospitable integration — auto-import booking data for night-cap counting
- **F-091:** Hostaway integration — app store listing
- **F-092:** Guesty integration (enterprise PMS)
- **F-093:** White-label compliance report PDF (Operator plan — for property manager clients)
- **F-094:** Team seats + multi-user access (Operator plan)
- **F-095:** API access for PMS integrations
- **F-096:** UK STR licensing (Scotland, England, Wales) — post-Brexit frameworks
- **F-097:** Canada STR compliance (Toronto, Vancouver, BC)

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Jurisdiction resolver < 500ms (postcode → ruleset JSON)
- Compliance score calculation < 1 second per property
- iCal sync completes < 30 seconds per calendar
- API p95 < 300ms

### 4.2 Data Accuracy (Most Important NFR)
- Jurisdiction rules verified by regulatory analyst before publishing
- Source URL required for every rule in database
- Last-verified date displayed to users for transparency
- Rule changes reviewed within 48h of regulatory announcement
- Each jurisdiction has a next-review-date — never more than 90 days stale

### 4.3 Security
- All PHI-equivalent data (addresses, permit numbers) encrypted at rest
- TenantMiddleware.cs enforces organisation_id isolation on every query
- Audit log on all permit and document access
- MFA mandatory for Operator and Manager plans
- Document vault access via pre-signed URLs (15-minute expiry)

### 4.4 Reliability
- 99.9% uptime SLA
- Hangfire alert jobs retry 3× on failure with exponential backoff
- iCal sync retries on parse errors (some calendars have malformed entries)
- Regulatory change monitoring failsafe: alert team if monitoring job fails

---

## 5. Technical Architecture

```
┌──────────────────────────────────────────┐
│        React 18 (Vite + Tailwind)        │  ← Host dashboard + public pages
│        shadcn/ui + Leaflet.js map        │
└────────────────┬─────────────────────────┘
                 │ REST API
┌────────────────▼─────────────────────────┐
│         .NET 8 Web API (C#)              │  ← Business logic + integrations
│         Hangfire background jobs         │  ← Permit alerts, iCal sync, rule monitoring
└────────┬─────────────────────────────────┘
         │
┌────────▼────────┐  ┌──────────┐  ┌──────────────┐
│   MySQL 8.0     │  │  Redis   │  │ Cloudflare R2│
│ (PlanetScale)   │  │ (Upstash)│  │ Permit PDFs  │
│ 12 domain tables│  │ Job queue│  │ Safety certs │
└─────────────────┘  └──────────┘  └──────────────┘

External Integrations:
├── Google Maps API   → Geocode address + zoning check
├── Twilio            → SMS renewal alerts
├── Resend            → Email notifications + regulatory alerts
├── Stripe            → Subscription billing (Solo/Host/Operator)
├── Anthropic Claude  → Plain-English rule change summaries
├── iCalendar (.ics)  → Airbnb/VRBO/Booking booking import
├── Hospitable API    → Phase 5 booking sync
├── Hostaway API      → Phase 5 booking sync
└── National registries → EU registration number validation
```

---

## 6. Pricing

| Plan | Price (USD) | Price (AUD) | Price (EUR) | Properties | Users |
|---|---|---|---|---|---|
| Solo | $19/mo | $29/mo | €19/mo | 1 | 1 |
| Host | $49/mo | $79/mo | €49/mo | Up to 5 | 2 |
| Operator | $129/mo | $199/mo | €129/mo | Up to 20 | 5 |
| Manager | Custom | Custom | Custom | Unlimited | Unlimited |

Annual billing: 2 months free.

---

## 7. Go-to-Market

### 7.1 Phase 1: EU urgency campaign (Month 1–3)
EU Reg 2024/1028 applies from May 2026 — every EU host must register. Run Google Ads against "EU STR registration 2026", "France Déclaratrion airbnb", "Spain NRU Airbnb". This is a hard deadline creating natural urgency.

### 7.2 Phase 2: AU beta launch (Month 2–4)
Three AU regulatory events in 2025: WA mandatory registration, Victoria 7.5% levy, Brisbane new permits. Target Australian host Facebook groups: "Airbnb Australia Hosts" (45K members), "Short Term Rental Australia" (30K members).

### 7.3 Phase 3: SEO content moat (Month 4–18)
Write the definitive compliance guide for every target city and country. "Austin Airbnb permit 2025", "Paris STR registration number", "Sydney 180 night cap". Zero competitors have good content here. 50 guides targeting 50 cities = dominant organic traffic.

### 7.4 Phase 4: PMS integrations (Month 10+)
App store listings on Hospitable, Hostaway, Guesty, Lodgify. These platforms collectively manage millions of STR properties. Distribution without CAC.

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Jurisdiction rules become stale | High | High | Regulatory analyst + 90-day review cadence + last-verified date shown to users |
| Airbnb builds native compliance tool | Low | Critical | Focus on multi-platform (VRBO, Booking, direct) and multi-country — hard for Airbnb |
| EU registration APIs not publicly accessible | Medium | High | Build manual wizard flow first; API validation added when available |
| Australian state rules change quickly | High | Medium | Monitoring job + alert within 48h + regulatory analyst |
| City rules vary block by block (US) | High | Medium | Show source URL + last-verified date; disclaimer that rules should be verified |

---

## 9. Success Metrics

| Metric | Month 6 | Month 12 | Month 24 |
|---|---|---|---|
| Paying hosts | 200 | 1,200 | 4,200 |
| MRR | $4,500 | $28,000 | $83,000 |
| Monthly churn | < 6% | < 4% | < 3% |
| Data accuracy | > 95% | > 97% | > 99% |
| Permit alerts opened | > 80% | > 85% | > 85% |
| NPS | > 7 | > 8 | > 8 |

---

## Appendix A — Key Regulatory References

| Market | Regulation | Effective | Key Requirement |
|---|---|---|---|
| EU (all 27 states) | Regulation (EU) 2024/1028 | May 20, 2026 | Mandatory registration number on all listings |
| France | Loi Le Meur | 2025 progressive | 120-night cap (primary), energy DPE rating |
| Spain | NRU scheme | Existing | Registration number; €64M Airbnb fine 2025 |
| Amsterdam | Municipal ordinance | Existing | 30 nights/year (proposals for 15) |
| NSW Australia | STRA Code of Conduct | Existing | 180-night cap (60 Byron Shire); $65 registration |
| Victoria Australia | Short Stay Levy Act | Jan 1, 2025 | 7.5% levy on stays < 28 days |
| WA Australia | STRA Register | Jan 1, 2025 | Mandatory registration; $250 fee |
| Brisbane Australia | STR Local Law | Mid-2026 | Annual permit; 60-min complaint response |
| New York City | Local Law 18 | 2023 | Banned unhosted STR; ~70% listing reduction |
| San Francisco | Admin Code | Existing | 90 nights/year; must be primary residence |
| Austin TX | STR Ordinance | Oct 2025 | Type 1/2/3 categories; license # in all ads |
