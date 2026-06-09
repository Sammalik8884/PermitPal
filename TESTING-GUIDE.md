# PermitPal — Complete Frontend Testing Guide

> **Purpose**: Test the entire PermitPal application from the browser UI (no Postman needed).  
> **Last Updated**: May 2026  
> **Note**: The frontend currently uses **mock data** (`USE_MOCK = true` in hooks), so all CRUD operations work in-memory without requiring the backend API to be running. You can test the full UI flow immediately.

---

## How to Start the App

### Option A: Frontend Only (Mock Data — Recommended for UI Testing)

```bash
cd "D:\healthdesk saas\new saas healthdesk\permitpal\frontend"
npm run dev
```

Open browser: **http://localhost:5173**

### Option B: Full Stack (Backend + Frontend)

**Terminal 1 — Start Backend (.NET 8 API):**
```bash
cd "D:\healthdesk saas\new saas healthdesk\permitpal\src\PermitPal.Api"
dotnet run
```
Backend runs on: **http://localhost:5000**

**Terminal 2 — Start Frontend (React + Vite):**
```bash
cd "D:\healthdesk saas\new saas healthdesk\permitpal\frontend"
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

## Complete Testing Flow (Step by Step from Browser)

---

### Step 1: Landing Page

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173 |
| **What you should see** | Full marketing landing page with: animated hero section with typing effect ("Permit Tracking", "Night Cap Monitoring", "Regulatory Compliance", "Document Management"), floating 3D shapes, particle effects, feature cards (6 features), "How it Works" 3-step section, pricing table (Starter/Professional/Enterprise), customer testimonials carousel, stats counter (10,000+ properties, 50+ jurisdictions, 99.9% compliance) |
| **CTA Buttons** | "Get Started Free" and "Start Free Trial" buttons |
| **Click** | Click "Get Started Free" or navigate to `/register` |
| **Expected** | Redirects to registration page |

**Navbar Elements:**
- Logo "PermitPal"
- Navigation links (if scrolled: sticky navbar with blur background)
- "Sign In" link → `/login`
- "Get Started" button → `/register`

---

### Step 2: Registration (`/register`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/register |
| **Page Title** | "Create an account" with subtitle "Get started with PermitPal in minutes" |

**Form Fields (in order):**

| Field | Type | Placeholder | Required | Notes |
|-------|------|-------------|----------|-------|
| Organisation name | Text input | "Acme Properties" | ✅ | Building icon prefix |
| First name | Text input | "John" | ✅ | User icon prefix |
| Last name | Text input | "Doe" | ✅ | — |
| Email address | Email input | "you@company.com" | ✅ | Mail icon prefix |
| Country | Select dropdown | "Select country" | ✅ | 30 countries (US, GB, AU, DE, FR, ES, IT, PT, NL, CA, NZ, IE, AT, CH, BE, SE, NO, DK, FI, JP, SG, HK, AE, ZA, BR, MX, IN, PK, GR, HR) |
| Timezone | Select dropdown | Auto-detected | ✅ | 23 timezones, auto-detects browser timezone |
| Password | Password input | "••••••••" | ✅ | Eye toggle, password strength indicator |
| Confirm password | Password input | "••••••••" | ✅ | Eye toggle, green checkmark when passwords match |
| Accept Terms | Checkbox | — | ✅ | Links to Terms of Service and Privacy Policy |

**Additional UI Elements:**
- Google sign-up button (disabled/coming soon)
- Microsoft sign-up button (disabled/coming soon)
- "Or continue with email" divider
- "Already have an account? Sign in" link at bottom

**Test Data:**
```
Organisation: TestHost Properties
First Name: John
Last Name: Doe
Email: test@example.com
Country: United States
Timezone: (UTC-05:00) Eastern Time
Password: Test123!@#
Confirm Password: Test123!@#
Accept Terms: ✅ Check
```

**Click**: "Create account" button

**Expected Results:**
- ✅ Success: Redirects to `/dashboard`
- ❌ Validation errors shown inline under each field if empty/invalid
- ❌ API error banner at top if email already exists

---

### Step 3: Login (`/login`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/login |
| **Page Title** | "Welcome back" with subtitle "Sign in to your PermitPal account" |

**Form Fields:**

| Field | Type | Placeholder | Required |
|-------|------|-------------|----------|
| Email address | Email input | "you@company.com" | ✅ |
| Password | Password input | "••••••••" | ✅ |
| Remember me | Checkbox | — | ❌ |

**Additional UI Elements:**
- Google sign-in button (disabled)
- Microsoft sign-in button (disabled)
- "Or continue with email" divider
- "Forgot password?" link → `/forgot-password`
- "Don't have an account? Sign up" link → `/register`

**Test Data:**
```
Email: test@example.com
Password: Test123!@#
Remember me: ✅ (optional)
```

**Click**: "Sign in" button

**Expected Results:**
- ✅ Success: JWT token stored in auth store, redirects to `/dashboard`
- ❌ Error: Red alert banner "Invalid email or password"
- Auto-focus on email field on page load

---

### Step 4: Dashboard (`/dashboard`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/dashboard |
| **What you should see** | Personalized greeting ("Good morning/afternoon/evening, {firstName}"), organisation name, current date |

**Stat Cards Row (4 cards):**

| Card | Icon | Shows |
|------|------|-------|
| Total Properties | Building2 (blue) | Number + "+X this month" trend |
| Compliance Score | Shield (color-coded) | Percentage + trend, left border color (green ≥80%, amber ≥60%, red <60%) |
| Active Permits | FileCheck (violet) | Count + "All current" |
| Nights Used | Moon (orange) | Count + "of X total cap" |

**Main Content (2-column layout):**
- **Left Column (60%):**
  - Compliance Chart (line/area chart showing compliance history over time)
  - Properties at Risk (list of properties with low compliance scores)
- **Right Column (40%):**
  - Upcoming Deadlines (permit expirations, renewal dates)
  - Recent Activity (timeline of recent actions)

**Bottom Section:**
- Night Cap Usage Bars (horizontal bar chart per property showing usage vs cap)

**Loading State:** Skeleton placeholders while data loads

---

### Step 5: Add a Property (`/properties`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/properties |
| **Page Title** | "Properties" with description "Manage your short-term rental portfolio" |

**Initial State (if no properties):**
- Empty state with Building2 icon
- "No properties yet" message
- "Add Property" button

**If properties exist:**
- Grid/List view toggle (persisted in localStorage)
- Search input ("Search properties...")
- Property Type filter dropdown: All Types, Apartment, House, Villa, Condo, Cabin, Other
- Compliance Status filter: All Status, Compliant, Warning, Non-Compliant
- Sort by: Name, Compliance, Date Added

**To Add a Property:**
1. Click **"Add Property"** button (top right, has Plus icon)
2. Dialog opens with title "Add Property" (or "Edit Property" if editing)

**Property Form Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text input | ✅ | Property display name |
| Address Line 1 | Text input | ✅ | Street address |
| Address Line 2 | Text input | ❌ | Apt/Suite/Unit |
| City | Text input | ✅ | — |
| State/Region | Text input | ✅ | — |
| Postcode | Text input | ✅ | — |
| Country | Select dropdown | ✅ | US, FR, AU, CH, ES, GB, DE, IT, PT, NL, CA, JP |
| Property Type | Select dropdown | ✅ | apartment, house, villa, condo, cabin, other |
| Jurisdiction | Select dropdown | ❌ | Auto-populated based on country/location |
| Registration Number | Text input | ❌ | Existing permit/registration number |
| Bedrooms | Number input | ❌ | Number of bedrooms |
| Notes | Textarea | ❌ | Additional notes |

**Test Data:**
```
Name: Beach House Miami
Address Line 1: 123 Ocean Drive
Address Line 2: Unit 4B
City: Miami Beach
State: Florida
Postcode: 33139
Country: United States
Property Type: House
Bedrooms: 3
```

**Click**: "Create Property" button

**Expected Results:**
- ✅ Toast notification: "Property created successfully"
- ✅ Property appears in the grid/list
- ✅ Dialog closes automatically
- Property card shows: name, address, compliance score badge, property type

---

### Step 6: View Property Details (`/properties/:id`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/properties/{property-id} |
| **Navigate** | Click on any property card in the grid |

**What you should see:**
- Property name and full address
- Compliance score breakdown (visual breakdown of compliance categories)
- Linked permits list
- Night cap summary for this property
- Documents attached to this property
- Activity timeline for this property

**Actions available:**
- Edit property (pencil icon)
- Delete property (trash icon, with confirmation dialog)
- View linked permits
- Upload documents

---

### Step 7: Add a Permit (`/permits`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/permits |
| **Page Title** | "Permits" with description "Track and manage your rental permits" |

**Quick Stats Row (3 boxes):**
- Active (green count)
- Expiring Soon (amber count — within 30 days)
- Expired (red count)

**Filters:**
- Search input ("Search permits...")
- Property filter dropdown (All Properties + list of your properties)
- Status filter: All Statuses, Active, Pending, Expired, Revoked

**Permit List Items Show:**
- Permit type name
- Status badge (Active=green, Pending=amber, Expired=red, Revoked=gray)
- Property name + permit number
- Expiry date with days remaining (color-coded)
- Edit button (appears on hover)

**To Add a Permit:**
1. Click **"Add Permit"** button (top right, has Plus icon)
2. Dialog opens

**Permit Form Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Property | Select dropdown | ✅ | List of your properties |
| Permit Type | Text input | ✅ | e.g., "Short-Term Rental License" |
| Permit Number | Text input | ❌ | e.g., "STR-2024-001" |
| Status | Select dropdown | ✅ | pending, active, expired, revoked |
| Issued Date | Date input | ✅ | Date picker |
| Expiry Date | Date input | ✅ | Date picker |
| Issuing Authority | Text input | ❌ | e.g., "City of Miami Beach" |
| Notes | Textarea | ❌ | Additional notes |

**Test Data:**
```
Property: Beach House Miami (select from dropdown)
Permit Type: Short-Term Rental License
Permit Number: STR-2024-001
Status: active
Issued Date: 2024-01-15
Expiry Date: 2025-01-15
Issuing Authority: City of Miami Beach
Notes: Annual renewal required
```

**Click**: "Create Permit" button

**Expected Results:**
- ✅ Toast: "Permit created successfully"
- ✅ Permit appears in the list with status badge
- ✅ Days remaining shown (color-coded: green >90d, amber 30-90d, red <30d)

**View Permit Details:**
- Click on any permit row → Side sheet opens with full details
- Shows: permit type, number, status, dates, issuing authority, notes
- Status history timeline
- Actions: Edit, Renew, Delete

---

### Step 8: Upload a Document (`/documents`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/documents |
| **Page Title** | "Documents" with description "Your compliance document vault" |

**Filters:**
- Search input ("Search documents...")
- Property filter dropdown
- Type filter: All Types, Permit, Insurance, Tax, Identity, Other

**Document count** shown above grid

**To Upload a Document:**
1. Click **"Upload"** button (top right, has Upload icon)
2. Upload dialog opens

**Upload Dialog Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Property | Select dropdown | ✅ | Which property this belongs to |
| Document Type | Select dropdown | ✅ | permit, insurance, tax, identity, other |
| File | File upload | ✅ | Drag & drop or click to browse |

**Test:**
- Select a property
- Choose type "Permit"
- Upload any PDF or image file
- Click Upload

**Expected Results:**
- ✅ Document appears in the grid
- ✅ Document card shows: file icon, filename, type badge, upload date, property name
- ✅ Click to preview document
- ✅ Delete option available (with confirmation)

---

### Step 9: Night Cap Tracking (`/night-caps`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/night-caps |
| **Page Title** | "Night Caps" with description "Monitor your nightly rental limits" |

**Top Controls:**
- Year selector dropdown (current year, -1, -2)
- Property selector dropdown (All Properties + individual properties)

**Summary Stats Row (4 cards):**
| Card | Shows |
|------|-------|
| Total Nights Used | Sum across all properties |
| Total Cap Available | Combined night cap limit |
| Average Usage | Percentage across properties |
| Properties at Risk | Count with >80% usage |

**Three Tabs:**

#### Tab 1: Overview
- Per-property Night Cap Cards showing:
  - Property name
  - Progress bar (nights used / cap)
  - Percentage usage (color-coded)
  - Actions: "Add Night", "View Calendar", "Manage Feeds"
- Monthly Breakdown section (expandable per property)
  - Bar chart showing monthly usage vs cap

#### Tab 2: Calendar
- Must select a specific property first (prompt shown if "All Properties" selected)
- Shows booking calendar with booked nights highlighted
- "Add Manual Night" button
- Click on a day to add a booking

#### Tab 3: Feeds (iCal)
- Must select a specific property first
- Shows list of connected iCal feeds
- "Add Feed" button

**To Add Manual Nights:**
1. On a property card, click **"Add Night"** (or click a day in Calendar tab)
2. Dialog opens

**Add Nights Dialog Fields:**
- Property (pre-selected)
- Check-in date
- Check-out date
- Guest name (optional)
- Platform (Airbnb, VRBO, Booking.com, Direct, Other)

**Expected Results:**
- ✅ Night count updates on the property card
- ✅ Progress bar reflects new usage
- ✅ Calendar shows the booked dates

---

### Step 10: iCal Feed (Calendar Sync)

| Action | Details |
|--------|---------|
| **Navigate** | Night Caps page → Feeds tab (select a property first) |

**To Add an iCal Feed:**
1. Click **"Add Feed"** button
2. Add Feed Dialog opens

**Add Feed Dialog Fields:**
- Property (pre-selected or select from dropdown)
- Feed URL (paste iCal URL)
- Feed Name/Label (e.g., "Airbnb Calendar")
- Platform (Airbnb, VRBO, Booking.com, Other)

**Test URL:**
```
https://www.airbnb.com/calendar/ical/12345678.ics?s=abc123
```
(Use any valid .ics URL or a test one)

**Expected Results:**
- ✅ Feed appears in the feed list
- ✅ Shows: feed name, URL (truncated), platform, last sync time, status
- ✅ Sync button to manually trigger sync
- ✅ Delete option to remove feed

---

### Step 11: EU Registration (`/eu-registration`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/eu-registration |
| **Page Title** | "EU Registration" with description "EU Short-Term Rental registration tracker" |

**Filters:**
- Country filter dropdown (All Countries + countries with EU properties)
- Status filter: All Statuses, Not Started, In Progress, Completed

**Property Cards Grid (per EU property):**
Each card shows:
- Country flag + property name
- Country name
- Status badge (Not Started=gray, In Progress=blue, Completed=green)
- Progress bar (X/Y steps completed, Z%)
- Registration number (if completed, shown in green box)
- Action button: "Start" / "Continue" / "View Details"

**To Start/Continue Registration:**
1. Click **"Start"** or **"Continue"** on a property card
2. Navigates to `/eu-registration/{propertyId}`
3. Registration stepper/wizard opens

**Registration Wizard Steps:**
- Step-by-step guided process
- Progress tracked per step
- Fields vary by country/jurisdiction

**Expected Results:**
- ✅ Progress updates as steps are completed
- ✅ Status changes from "Not Started" → "In Progress" → "Completed"
- ✅ Registration number displayed when complete

**Bottom Section:**
- Requirements Panel showing country-specific registration requirements

---

### Step 12: AU Compliance (`/au-compliance`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/au-compliance |
| **Page Title** | "AU Compliance" with description "Australian short-term rental compliance" |

**Three Tabs:**

#### Tab 1: Levy Tracker
- Property selector dropdown (Australian properties)
- Year badge
- "Record Payment" button

**Levy Summary Card shows:**
- Total levy owed
- Total paid
- Outstanding balance
- Payment status

**Payment History Table:**
| Column | Shows |
|--------|-------|
| Date | Payment date |
| Amount | AUD amount |
| Reference | Payment reference code |
| Quarter | Q1/Q2/Q3/Q4 + year |

**To Record a Levy Payment:**
1. Click **"Record Payment"** button
2. Dialog opens with fields:
   - Amount (AUD)
   - Payment Date
   - Reference number
   - Quarter selection

#### Tab 2: Fire Safety
- Fire safety checklist cards per property
- Each card shows compliance items (smoke alarms, fire extinguisher, evacuation plan, etc.)
- Status indicators per item
- "Edit" button to update records

**Fire Safety Edit Dialog:**
- Update inspection dates
- Mark items as compliant/non-compliant
- Upload certificates

#### Tab 3: Complaints Log
- Property filter dropdown
- Status filter: All Statuses, Open, Investigating, Resolved, Dismissed
- "Log Complaint" button

**Complaints Table shows:**
- Date, property, type, description, status, actions

**To Log a Complaint:**
1. Click **"Log Complaint"**
2. Dialog with: Property, complaint type, description, date
3. Submit

**To Update a Complaint:**
- Click on complaint row → Update dialog
- Change status, add resolution notes

---

### Step 13: US Tax (`/us-tax`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/us-tax |
| **Page Title** | "US Tax" with description "Track your US tax obligations" |

**Controls:**
- Property selector (US properties: "Oceanview Retreat", "Manhattan Studio")
- Year badge
- "Record Payment" button

**Tax Summary Card shows:**
| Field | Description |
|-------|-------------|
| Tax Type | e.g., Transient Occupancy Tax |
| Rate | Percentage |
| Revenue | Total rental revenue |
| Tax Owed | Calculated tax amount (red) |
| Tax Paid | Amount paid so far (green) |
| Balance | Outstanding amount |
| Status Badge | Paid (green), Partial (yellow), Unpaid (red) |

**Payment History Table:**
| Column | Shows |
|--------|-------|
| Date | Payment date |
| Amount | USD amount |
| Reference | e.g., "TOT-LA-2026-Q2" |
| Period | Tax period badge |

**To Record a Tax Payment:**
1. Click **"Record Payment"**
2. Dialog opens:

| Field | Type | Placeholder |
|-------|------|-------------|
| Amount (USD) | Number | "0.00" |
| Payment Date | Date | Today's date |
| Reference | Text | "e.g., TOT-LA-2026-Q2" |

3. Click "Record Payment"

**Test Data:**
```
Amount: 450.00
Payment Date: 2026-05-25
Reference: TOT-LA-2026-Q2
```

**Expected Results:**
- ✅ Payment appears in history table
- ✅ Summary card updates (Tax Paid increases, Balance decreases)
- ✅ Status badge may change (Unpaid → Partial → Paid)

---

### Step 14: Alerts & Notifications (`/alerts`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/alerts |
| **Page Title** | "Alerts" with description "Regulatory changes and compliance notifications" |

**Current State:**
- Empty state with Bell icon
- Message: "You'll receive notifications here when there are regulatory changes, permit expirations, or compliance deadlines approaching."

**Components Available (in `/alerts/components/`):**
- Alert Preferences Form — configure notification preferences
- Notification Item — individual notification display
- Regulatory Change Card — shows regulatory updates

**When populated, expect:**
- List of notifications (permit expiring, regulatory change, night cap warning)
- Mark as read/unread
- Filter by type
- Alert preferences/subscription management

---

### Step 15: Settings (`/settings`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/settings |
| **Page Title** | "Settings" with description "Manage your account and organisation preferences" |

**Current State:**
- Empty state with Settings icon
- Message: "Account settings, notification preferences, team management, and API integrations will be available here."

**Components Available (in `/settings/components/`):**
- **Profile Form** — Update first name, last name, email, timezone
- **Organisation Form** — Update org name, country, settings
- **Security Form** — Change password, 2FA settings
- **Appearance Form** — Theme (light/dark/system), UI preferences
- **Team Members List** — View/manage team members
- **Invite Member Dialog** — Invite new team members by email

**When fully implemented, expect tabs/sections for:**
1. Profile (name, email, timezone)
2. Organisation (org name, billing email)
3. Security (password change, 2FA)
4. Appearance (theme toggle)
5. Team (member list, invite)

---

### Step 16: Billing (`/billing`)

| Action | Details |
|--------|---------|
| **URL** | http://localhost:5173/billing |
| **Page Title** | "Billing" with description "Manage your subscription and payment methods" |

**Current State:**
- Empty state with CreditCard icon
- Message: "Your subscription plan, invoices, and payment methods will appear here once your account is activated."

**Components Available (in `/billing/components/`):**
- **Current Plan Card** — Shows current subscription tier

**When fully implemented, expect:**
- Current plan display (Free/Pro/Enterprise)
- Usage metrics (properties used vs limit)
- Upgrade/downgrade buttons
- Payment method management
- Invoice history
- Stripe checkout integration for upgrades

---

## What Each Page Should Display

| Page | URL | Key Elements | Status |
|------|-----|--------------|--------|
| Landing | `/` | Hero with typing effect, features grid (6), how-it-works (3 steps), pricing (3 tiers), testimonials (6), stats counter, CTA buttons | ✅ Fully built |
| Register | `/register` | Organisation, name, email, country, timezone, password, confirm password, terms checkbox, social buttons | ✅ Fully built |
| Login | `/login` | Email, password, remember me, forgot password link, social buttons | ✅ Fully built |
| Forgot Password | `/forgot-password` | Email input, submit button | ✅ Route exists |
| Reset Password | `/reset-password` | New password, confirm password | ✅ Route exists |
| Dashboard | `/dashboard` | 4 stat cards, compliance chart, properties at risk, upcoming deadlines, recent activity, night cap bars | ✅ Fully built |
| Properties | `/properties` | Grid/list toggle, search, filters (type/status/sort), property cards, add/edit/delete dialogs | ✅ Fully built |
| Property Detail | `/properties/:id` | Compliance breakdown, permits, night cap, documents, activity | ✅ Fully built |
| Permits | `/permits` | Quick stats (3), search, filters (property/status), permit list with status badges, add/edit dialog, detail sheet | ✅ Fully built |
| Documents | `/documents` | Search, filters (property/type), document grid, upload dialog, preview dialog | ✅ Fully built |
| Night Caps | `/night-caps` | Year/property selectors, 4 stat cards, 3 tabs (Overview/Calendar/Feeds), add nights dialog, add feed dialog | ✅ Fully built |
| EU Registration | `/eu-registration` | Country/status filters, property cards with progress, registration wizard | ✅ Fully built |
| EU Reg Detail | `/eu-registration/:propertyId` | Step-by-step registration stepper | ✅ Fully built |
| AU Compliance | `/au-compliance` | 3 tabs (Levy/Fire Safety/Complaints), payment dialogs, checklist, complaints table | ✅ Fully built |
| US Tax | `/us-tax` | Property selector, tax summary card, payment history, record payment dialog | ✅ Fully built |
| Alerts | `/alerts` | Empty state (placeholder) | 🔲 Placeholder |
| Settings | `/settings` | Empty state (placeholder) | 🔲 Placeholder |
| Billing | `/billing` | Empty state (placeholder) | 🔲 Placeholder |

---

## Navigation (Sidebar)

The dashboard layout includes a sidebar with these navigation items:

| Icon | Label | Route |
|------|-------|-------|
| LayoutDashboard | Dashboard | `/dashboard` |
| Building2 | Properties | `/properties` |
| FileCheck | Permits | `/permits` |
| Moon | Night Caps | `/night-caps` |
| FileText | Documents | `/documents` |
| Globe2 | EU Registration | `/eu-registration` |
| Scale | AU Compliance | `/au-compliance` |
| Receipt | US Tax | `/us-tax` |
| Bell | Alerts | `/alerts` |
| Settings | Settings | `/settings` |
| CreditCard | Billing | `/billing` |

---

## Error Scenarios to Test from UI

### Authentication Errors
| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1 | Register with existing email | Register → use same email twice | Red error banner: "Email already exists" or similar |
| 2 | Login with wrong password | Login → enter wrong password | Red error banner: "Invalid email or password" |
| 3 | Login with non-existent email | Login → use unregistered email | Red error banner: "Invalid email or password" |
| 4 | Access protected route without auth | Clear localStorage → navigate to `/dashboard` | Redirects to `/login` (or `/`) |
| 5 | Already authenticated → visit login | While logged in, go to `/login` | Redirects to `/dashboard` |
| 6 | Already authenticated → visit landing | While logged in, go to `/` | Redirects to `/dashboard` |

### Form Validation Errors
| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 7 | Empty registration form | Click "Create account" with all fields empty | Red error messages under each required field |
| 8 | Invalid email format | Type "notanemail" in email field | "Invalid email address" error |
| 9 | Password too short | Type "123" as password | Password strength indicator shows weak + error |
| 10 | Passwords don't match | Type different passwords in password/confirm | "Passwords don't match" error |
| 11 | Terms not accepted | Fill all fields but don't check terms | Error under checkbox |
| 12 | Empty property form | Click "Create Property" with empty fields | Validation errors on required fields |
| 13 | Empty permit form | Click "Create Permit" with empty fields | Validation errors on required fields |

### Session/Token Errors
| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 14 | Expired token | Open DevTools → Application → Local Storage → modify/delete auth token | Next API call fails → redirect to login |
| 15 | Clear all storage | DevTools → Application → Clear site data | Logged out, redirected to landing |

### Edge Cases
| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 16 | Navigate to non-existent route | Go to `/nonexistent` | Redirects to `/` (catch-all route) |
| 17 | Property with no permits | View a property that has no permits | Empty state shown in permits section |
| 18 | Search with no results | Type gibberish in search fields | "No results found" empty state with clear filters option |
| 19 | Delete property with linked permits | Try to delete a property | Confirmation dialog appears |

---

## Mock Data Available for Testing

The frontend ships with pre-populated mock data. When you first load the dashboard, you'll see:

**Mock Properties:**
- Properties across US, EU, and AU jurisdictions
- Various compliance scores and statuses
- Different property types

**Mock Permits:**
- Active, pending, expired, and revoked permits
- Various permit types (STR License, Tourism Registration, etc.)
- Different expiry dates

**Mock Night Caps:**
- Properties with night cap limits
- Monthly breakdown data
- Booked nights history

**Mock Documents:**
- Various document types (permit, insurance, tax, identity)
- Attached to different properties

---

## Browser DevTools Tips for Testing

### Check Auth State
```javascript
// In browser console:
JSON.parse(localStorage.getItem('auth-storage'))
```

### Force Logout
```javascript
localStorage.removeItem('auth-storage')
location.reload()
```

### Check React Query Cache
- Install React Query DevTools (already included in dev mode)
- Look for the floating React Query icon in bottom-left corner
- View all cached queries, their status, and data

### Monitor Network Requests
- Open DevTools → Network tab
- Filter by "Fetch/XHR"
- Watch API calls when switching pages or submitting forms

---

## User Acquisition Strategy

### Immediate (Week 1-2): Validate Product
- Share with 5-10 Airbnb hosts you know personally
- Post in Facebook groups: "Airbnb Hosts", "Short Term Rental Investors", "STR Compliance"
- Post on Reddit: r/airbnb_hosts, r/AirBnB, r/realestateinvesting, r/digitalnomad
- Post on X/Twitter targeting #AirbnbHost #STR #ShortTermRental hashtags
- Reach out to local host meetup groups

### Short-term (Month 1-2): Build Awareness
- **SEO Content** — Write blog posts targeting:
  - "Do I need a permit for Airbnb in [city]?"
  - "Short term rental regulations [state/country]"
  - "How to stay compliant as an Airbnb host"
  - "Night cap limits for short term rentals"
  - "EU short-term rental registration requirements 2026"
  - "Australian STR levy calculator"
- **Product Hunt Launch** — Prepare assets, launch on a Tuesday
- **Free Tool** — Offer a free "compliance checker" that tells hosts what permits they need (captures emails)
- **Email Drip Campaign** — Nurture leads with compliance tips

### Medium-term (Month 3-6): Scale
- **Google Ads** — Target "STR compliance software", "Airbnb permit tracking", "short term rental management"
- **Partnerships** — Integrate with Guesty, Hostaway, Lodgify, Hospitable, OwnerRez
- **Referral Program** — Give 1 month free for each successful referral
- **Webinars** — "How to avoid $10,000 fines as an STR host"
- **YouTube** — Short videos explaining compliance requirements by city
- **Podcast Appearances** — Guest on STR/real estate podcasts
- **Affiliate Program** — Property management bloggers earn commission

### Long-term (Month 6-12): Enterprise
- **Property Management Companies** — Direct sales to companies managing 50+ properties
- **Real Estate Agencies** — White-label offering for agencies
- **API Partnerships** — Integrate with Airbnb, VRBO, Booking.com APIs
- **International Expansion** — Target EU (especially Spain, Portugal, France, Greece, Croatia) and Australia
- **Conference Presence** — Attend VRMA, STR Wealth Conference, Host events
- **Local Government Partnerships** — Become the recommended compliance tool

---

## Pricing Strategy for User Acquisition

| Tier | Price | Properties | Key Features | Target |
|------|-------|-----------|--------------|--------|
| **Starter** (Free Forever) | $0/mo | 1 property | Basic permit tracking, night cap monitoring, email alerts, community support | Hook individual hosts |
| **Professional** | $29/mo | Up to 10 | Advanced compliance scoring, iCal sync, document vault, multi-jurisdiction, regulatory alerts, priority support | Main revenue driver |
| **Enterprise** | $99/mo | Unlimited | Team collaboration, API access, custom integrations, dedicated manager, SLA guarantee, white-label, bulk operations | High-value accounts |
| **Annual Discount** | 20% off | — | All tiers | Improve retention |

---

## Key Metrics to Track

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Landing page → Signup conversion | 5-10% | Google Analytics / PostHog |
| Signup → First property added | 60% | In-app analytics |
| Free → Paid conversion | 5-10% | Stripe + internal tracking |
| Monthly churn rate | <5% | Subscription cancellations |
| Customer Acquisition Cost (CAC) | <$50 | Ad spend / new customers |
| Lifetime Value (LTV) | >$300 | Average revenue × average lifespan |
| LTV:CAC Ratio | >6:1 | Healthy SaaS benchmark |
| Time to Value | <5 minutes | Time from signup to first property added |
| NPS Score | >50 | Quarterly surveys |
| Feature Adoption | >40% | % users using each major feature |

---

## Quick Reference: Test Account Credentials

```
Email:    test@example.com
Password: Test123!@#
Org:      TestHost Properties
Country:  United States
Timezone: America/New_York
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Page shows blank/white | Check browser console for errors. Likely a missing dependency — run `npm install` |
| "Cannot GET /dashboard" on refresh | Vite dev server handles SPA routing. If deployed, ensure server has fallback to index.html |
| Mock data not showing | Ensure `USE_MOCK = true` in hook files (`use-properties.ts`, `use-permits.ts`, etc.) |
| Login doesn't work | The auth store uses mock login. Check `stores/auth-store.ts` for accepted credentials |
| Styles look broken | Run `npm run dev` (not `npm start`). Tailwind CSS needs the Vite dev server |
| Port 5173 in use | Kill the process or use `npm run dev -- --port 3000` |
| Backend connection refused | Ensure .NET API is running on port 5000. Check CORS configuration |

---

*End of Testing Guide*