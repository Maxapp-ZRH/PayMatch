---
Product Name: PayMatch – Simple Invoicing for Swiss SMEs
Tagline: _“Create. Send. Get Paid. The Swiss way.”_
---

## 1. Project Overview

Since **September 2022**, QR-bills are mandatory in Switzerland, replacing old payment slips. While larger companies adopted ERP solutions, **600k+ SMEs, freelancers, and associations still struggle** with QR-bill invoicing and payment reconciliation.

**PayMatch** is a **cloud-based invoicing platform** built specifically for the Swiss market, enabling small businesses to:

- Create and send **compliant QR-bill invoices**.
- Automatically **reconcile payments** via ISO 20022 with Swiss banks.
- Manage clients, recurring payments, and overdue reminders – **without ERP complexity**.

---

## 2. Problem Statement

- **Complexity:** Swiss QR-bill & ISO 20022 standards are difficult for non-technical users.
- **Overkill Solutions:** SAP, Abacus, and Bexio are expensive and heavy for freelancers/small businesses.
- **Inefficiency:** Many SMEs still rely on Excel, Word, or manual invoicing → errors, late payments, wasted time.
- **Missed Compliance:** Incorrect QR-bill formats risk rejected payments and fines.

---

## 3. Solution

**PayMatch** offers a **dead-simple, affordable, and compliant SaaS**:

1. **Invoice Creation & Sending**
   - **Swiss QR-bill generation** for compliant invoice creation and management.
   - **PDF generation** with integrated Swiss QR-bill codes.
   - Branded invoices in Swiss German and Swiss English.
   - Recurring invoices for rent, subscriptions, or member fees.
   - **Swiss tax calculations** for automatic compliance.

2. **Payment Reconciliation**
   - **Open Banking (bLink) integration** for automatic bank reconciliation and payment matching.
   - **CAMT.053 import** as fallback for manual bank reconciliation.
   - Real-time payment matching algorithms for Swiss banking.
   - Real-time dashboard: "Paid / Pending / Overdue".
   - **Swiss compliance** for tax reporting and regulations.

3. **Business Features**
   - Client & project tracking.
   - Swiss currency support (CHF only).
   - **Resend** for all email communications (auth, invoices, reminders).
   - **Swiss QR-bill** for complete invoice lifecycle management.

---

## 4. Unique Selling Proposition (USP)

- **Swiss-focused:** Built for QR-bills & ISO 20022 compliance.
- **Simplicity first:** Easy for freelancers; powerful enough for SMEs.
- **Affordable:** Fraction of ERP costs (CHF 10–30/month).
- **Bank-ready:** Real-time payment reconciliation via Open Banking (bLink) across all major Swiss banks.
- **Multilingual:** Swiss German (de-CH) and Swiss English (en-CH).

---

## 5. Market Opportunity

- **600,000+ SMEs** in Switzerland (99% of all companies).
- **Freelancers & self-employed**: ~1 million active.
- **Associations & landlords**: Thousands with recurring invoicing needs.

💰 **TAM:** ~CHF 500M/year (invoicing & financial SaaS for SMEs).  
🎯 **SAM:** ~CHF 100M/year (SMEs without ERP).

---

## 6. Business Model

### 4-Tier Pricing Structure

**🆓 Free**

- **Price:** CHF 0/month
- **Target:** Freelancers, consultants, small businesses
- **Features:** 5 invoices/month, 3 clients, 1 user, QR-bill invoices, Open Banking (bLink) integration, automatic bank sync, basic reminders, reports/export
- **Limitation:** No team features, limited volume

**👤 Freelancer**

- **Price:** CHF 5/month (CHF 48/year - 20% off)
- **Target:** Freelancers, consultants, landlords
- **Features:** Unlimited invoices/clients, 1 user, QR-bill invoices, Open Banking (bLink) integration, automatic bank sync, basic reminders, reports/export

**🏢 Business**

- **Price:** CHF 50/month (CHF 480/year - 20% off)
- **Target:** SMEs, fiduciaries, associations
- **Features:** Everything in Freelancer + up to 3 users, team management with roles, advanced reminders, analytics, advanced Open Banking features

**🏦 Enterprise**

- **Price:** CHF 150/month (CHF 1,440/year - 20% off)
- **Target:** Large fiduciaries, banks, advanced SMEs
- **Features:** Everything in Business + unlimited users, dedicated support/SLA, enterprise Open Banking features

### Pricing Strategy Benefits

- **Free Trial Experience:** Free plan gives users full feature access to experience the platform
- **Low Barrier to Entry:** CHF 5/month captures the long tail of Swiss freelancers
- **Main Revenue Engine:** CHF 50/month "no-brainer" pricing for SMEs
- **Scalable Growth:** Enterprise tier opens doors for banks and large organizations
- **Annual Discount:** 20% off encourages longer commitments and improves cash flow
- **Clear Upsell Path:** Free → Freelancer (unlimited volume) → Business (team needs) → Enterprise (scale/features)

### Payment Processing

- **Subscription Billing:** Stripe Billing for plan management
- **Invoice Payments:** Swiss QR-bill for direct bank transfers
- **Money-Back Guarantee:** 30-day refund guarantee

---

## 7. Data Architecture & Organization Model

### Single Source of Truth: Organization

**Definition:** An organization represents the business entity (company) using PayMatch. It owns invoices, clients, payments, settings, billing and membership. Every piece of data that belongs to a company is scoped to an `organization.id`.

### Core Principles

- **One canonical entity:** organization (never company + org separately). Use "Company" label in user-facing documents where appropriate.
- **Every user has an organization:** created automatically at signup, even for freelancers.
- **Org-scoped data:** invoices, clients, payments, templates, bank settings → must include `org_id`.
- **User membership:** users join one or more organizations via `organization_users` with roles.
- **Billing-per-org:** Stripe customer/subscription is tied to an organization.
- **Team features by plan:** multi-user collaboration unlocked with Business Plan (CHF 50/month) or higher.

### Database Schema

```sql
-- organizations (single source of truth)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  legal_name TEXT,
  country TEXT DEFAULT 'CH',
  canton TEXT,
  city TEXT,
  zip TEXT,
  street TEXT,
  vat_number TEXT,
  uid TEXT, -- swiss business id
  logo_url TEXT,
  default_language TEXT DEFAULT 'de',
  default_currency TEXT DEFAULT 'CHF',
  default_vat_rates JSONB DEFAULT '[]'::jsonb,
  default_payment_terms_days INT DEFAULT 30,
  iban TEXT,
  qr_iban TEXT,
  plan TEXT DEFAULT 'free', -- free/freelancer/business/enterprise
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_seen TIMESTAMPTZ
);

-- membership
CREATE TABLE organization_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner', -- owner, admin, accountant, staff
  status TEXT NOT NULL DEFAULT 'active', -- active, pending
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  UNIQUE(org_id, user_id)
);

-- example: invoices (org-scoped)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  client_id UUID,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CHF',
  amount_total NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, pending, paid, overdue
  qr_payload JSONB,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- clients table (org-scoped)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  address JSONB,
  vat_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- payments table (org-scoped)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  bank_tx_id TEXT,
  amount NUMERIC(12,2),
  currency TEXT DEFAULT 'CHF',
  value_date DATE,
  raw_camt JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Onboarding Flow

**Complete onboarding flow documented in:** [Onboarding-Flow.md](./Onboarding-Flow.md)

**Complete navigation and page specifications documented in:** [Sidebar-Pages-Specification.md](./Sidebar-Pages-Specification.md)

**High-level flow:**

1. User submits signup (email, password, display name)
2. Backend creates user record and organization
3. Email verification required
4. Plan selection (Free, Freelancer, Business, Enterprise)
5. Onboarding wizard (organization details, settings, compliance)
6. Dashboard checklist (guided completion with plan-specific items)

**Key principles:**

- Plan selection before onboarding wizard
- Compliance setup upfront (IBAN, address for QR-bill)
- Gamified checklist completion
- Plan-specific feature unlocks

### Multi-User Organizations (Business Plan Feature)

**Goal:** Allow SMEs and fiduciaries to manage invoicing collaboratively.

**Key Points:**

- Every user always has an organization (created at signup)
- For freelancers/free plan → organization behaves as a single-user company
- For Business Plan and higher → team features are unlocked (invites, roles, permissions)

**Team Features Workflow:**

1. **Upgrade to Business Plan**
   - User upgrades subscription
   - App reveals Team Members section in Settings
   - Message: "Invite teammates to collaborate on invoicing"

2. **Invite Members**
   - Owner goes to Settings → Team Members
   - Clicks "Invite Member" → enters email + selects role
   - Invitation email sent with secure join link

3. **Accept Invitation**
   - Invited user clicks link → signs up (or logs in)
   - They are added to the existing organization with assigned role

4. **Role-Based Permissions**
   - **Owner (Admin):** Manage subscription, billing, settings, invite/remove members, full access
   - **Accountant:** Access invoices, reconciliation, exports, cannot change subscription
   - **Staff:** Create/edit invoices, manage clients, cannot access billing or invite members

**UI Behavior by Plan:**

- **Free Plan (single-user):** Full feature access with volume limits, Team/Invite button hidden or shows CTA: "Invite teammates — Upgrade to Business"
- **Freelancer Plan (single-user):** Unlimited volume, Team/Invite button hidden or shows CTA: "Invite teammates — Upgrade to Business"
- **Business Plan:** Team section visible, invite flow enabled, seat count on Billing page

### User Journey: Free Plan → Business Plan

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER SIGNUP FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│ 1. User signs up with email/password                           │
│ 2. Backend creates user record                                 │
│ 3. Backend creates organization (single-user)                  │
│ 4. User becomes organization owner                             │
│ 5. Onboarding wizard collects company details                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FREE PLAN (CHF 0)                           │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Single-user organization                                    │
│ ✅ 5 invoices/month, 3 clients                                │
│ ✅ QR-bill invoices, bank sync, reports                        │
│ ✅ Manual CAMT reconciliation, reminders                       │
│ ❌ Team features hidden                                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ User clicks "Invite Teammates"
                                │ or hits user limit
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                UPGRADE TO BUSINESS PLAN                        │
├─────────────────────────────────────────────────────────────────┤
│ 💳 User upgrades to CHF 50/month                              │
│ 🔓 Team features unlocked                                      │
│ 👥 Team Members section appears in Settings                    │
│ 📧 Invite flow becomes available                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BUSINESS PLAN (CHF 50)                        │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Multi-user organization (up to 10 users)                   │
│ ✅ Unlimited invoices and clients                              │
│ ✅ Team management with roles                                  │
│ ✅ Advanced reconciliation                                     │
│ ✅ Analytics and reporting                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Key Benefits:**

- **Consistent Model:** Every user has an organization from day one
- **Seamless Upgrade:** No data migration needed when upgrading
- **Free Trial Experience:** Users get full feature access to experience the platform value
- **Clear Value Prop:** Team features are the main differentiator for Business Plan
- **Scalable:** Same organization can grow from 1 to 10+ users
- **Conversion Strategy:** Free users experience full value, then upgrade for volume or team features

### Roles & Permissions

- **owner:** full rights (manage plan, invites, delete org, settings, invoices, reconciliation)
- **admin:** edit invoices/clients, reconciliation, settings except billing and owner-only actions
- **accountant:** reconciliation, exports, invoices read/write; no billing or org deletion
- **staff:** create/edit invoices & clients, but cannot change settings or billing or invite

### Required Org Data for Invoice Generation

At minimum, for the user to create invoices with QR-bill:

- `organizations.name` (legal/company name)
- `organizations.street`, `zip`, `city`, `country` (addresses)
- `organizations.iban` OR `organizations.qr_iban`
- `default_language`

Without IBAN, app must disallow finalizing invoice with QR or show clear warning CTA to add IBAN.

### Plan Limits Implementation

```json
{
  "free": {
    "invoice_limit_monthly": 5,
    "client_limit": 3,
    "user_limit": 1,
    "manual_reconciliation": true,
    "bank_sync": true,
    "reports_enabled": true,
    "team_features": false,
    "qr_bill_enabled": true,
    "reminders_enabled": true
  },
  "freelancer": {
    "invoice_limit_monthly": -1,
    "client_limit": -1,
    "user_limit": 1,
    "manual_reconciliation": true,
    "bank_sync": true,
    "reports_enabled": true,
    "team_features": false,
    "qr_bill_enabled": true,
    "reminders_enabled": true
  },
  "business": {
    "invoice_limit_monthly": -1,
    "client_limit": -1,
    "user_limit": 3,
    "manual_reconciliation": true,
    "bank_sync": true,
    "reports_enabled": true,
    "team_features": true,
    "qr_bill_enabled": true,
    "reminders_enabled": true,
    "analytics_enabled": true
  },
  "enterprise": {
    "invoice_limit_monthly": -1,
    "client_limit": -1,
    "user_limit": -1,
    "manual_reconciliation": true,
    "bank_sync": true,
    "reports_enabled": true,
    "team_features": true,
    "qr_bill_enabled": true,
    "reminders_enabled": true,
    "analytics_enabled": true,
    "dedicated_support": true
  }
}
```

---

## 8. Technical Architecture & Code Organization

### Feature-Based Architecture

PayMatch uses a **feature-based organization** where each business capability is self-contained within its own feature directory. This ensures maintainability, scalability, and clear separation of concerns.

### Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── dashboard/         # Main app routes
│   │   ├── invoices/
│   │   ├── clients/
│   │   ├── payments/
│   │   ├── reports/
│   │   └── settings/
│   └── api/               # API routes
├── features/              # Feature-based organization
│   ├── auth/
│   ├── invoices/
│   ├── clients/
│   ├── payments/
│   ├── reports/
│   ├── dashboard/
│   └── settings/
├── components/            # Shared UI components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Core utilities & integrations
├── schemas/              # Validation schemas
├── types/                # Type definitions
└── utils/                # Shared utilities
```

### Feature Structure

Each feature follows a consistent structure:

```
src/features/[feature-name]/
├── components/           # Feature-specific components
│   ├── [component].tsx
│   └── index.ts         # Public component exports
├── hooks/               # Feature-specific hooks
│   ├── use-[hook].ts
│   └── index.ts         # Public hook exports
├── types/               # Feature-specific types
│   ├── [feature].ts
│   └── index.ts         # Public type exports
├── utils/               # Feature-specific utilities
│   ├── [helper].ts
│   └── index.ts         # Public utility exports
└── index.ts             # Main feature export
```

### Core Features

#### 1. **Invoices Feature** (`src/features/invoices/`)

- **Components:** InvoiceList, InvoiceForm, InvoicePreview, QRBillGenerator
- **Hooks:** useInvoices, useInvoiceForm, useQRBill
- **Types:** Invoice, InvoiceFormData, QRBillData
- **Utils:** Invoice helpers, QR-bill generation, PDF creation

#### 2. **Clients Feature** (`src/features/clients/`)

- **Components:** ClientList, ClientForm, ClientCard
- **Hooks:** useClients, useClientForm
- **Types:** Client, ClientFormData
- **Utils:** Client validation, address formatting

#### 3. **Payments Feature** (`src/features/payments/`)

- **Components:** PaymentList, CAMTUploader, PaymentMatcher
- **Hooks:** usePayments, useReconciliation
- **Types:** Payment, MatchedPayment, CAMTData
- **Utils:** CAMT parser, payment matching algorithms

#### 4. **Reports Feature** (`src/features/reports/`)

- **Components:** ReportList, ReportGenerator, ReportFilters
- **Hooks:** useReports, useReportGeneration
- **Types:** Report, ReportFilters, ReportData
- **Utils:** Report generation, data export

#### 5. **Dashboard Feature** (`src/features/dashboard/`)

- **Components:** KPICards, Checklist, RecentActivity, CashFlowChart
- **Hooks:** useDashboard, useChecklist
- **Types:** DashboardData, ChecklistItem
- **Utils:** Dashboard calculations, progress tracking

#### 6. **Settings Feature** (`src/features/settings/`)

- **Components:** CompanyProfile, TeamManagement, BillingSettings
- **Hooks:** useSettings, useTeamManagement
- **Types:** Settings, TeamMember, PlanLimits
- **Utils:** Settings validation, plan enforcement

### Page Component Pattern

Page components in `/src/app/` only import and render feature components:

```typescript
// ✅ CORRECT - Page component pattern
// src/app/dashboard/invoices/page.tsx
import { InvoicesFeature } from '@/features/invoices';

export default function InvoicesPage() {
  return <InvoicesFeature />;
}

// ❌ WRONG - Business logic in page component
// src/app/dashboard/invoices/page.tsx
export default function InvoicesPage() {
  const { data } = useQuery(/* complex logic */);
  return <div>{/* complex UI */}</div>;
}
```

### Feature Communication

Features communicate through:

- **Shared stores** (Zustand) for global state
- **Event system** for cross-feature communication
- **API layer** for data fetching
- **No direct imports** between features

### Benefits of Feature-Based Architecture

1. **Maintainability:** Each feature is self-contained
2. **Scalability:** Easy to add new features
3. **Team Collaboration:** Clear ownership boundaries
4. **Testing:** Isolated feature testing
5. **Code Reuse:** Shared components and utilities
6. **Performance:** Lazy loading of features

### Backend Architecture: Supabase Edge Functions

PayMatch uses **Supabase Edge Functions** for complex business operations that require server-side processing, external API integrations, and privileged database access.

#### When to Use Edge Functions

**✅ USE Edge Functions for:**

- **Complex Business Logic** - Multi-step operations with external API calls
- **File Processing** - CAMT.053 parsing, PDF generation, image processing
- **External Integrations** - Stripe webhooks, Resend emails, bank APIs
- **Heavy Calculations** - Dashboard KPIs, reporting, analytics
- **Error-Prone Operations** - Operations that need retry logic and detailed error handling
- **Real-time Processing** - Operations that need immediate response
- **Webhook Handlers** - Stripe, Resend, bank notifications
- **Email/Notification Systems** - All transactional communications
- **Payment Processing** - Payment matching, reconciliation algorithms
- **Swiss QR-Bill Generation** - Complex QR-bill creation and validation

**❌ DON'T USE Edge Functions for:**

- **Simple CRUD Operations** - Basic database queries and updates
- **Data Validation** - Use database constraints and Zod schemas
- **Authentication** - Use Supabase Auth directly
- **Real-time Subscriptions** - Use Supabase Realtime directly
- **File Storage** - Use Supabase Storage directly
- **Basic Calculations** - Simple math operations in database
- **RLS Policies** - Keep in database for security

#### Edge Functions Architecture

```
supabase/functions/
├── core/                    # Core business operations
│   ├── process-invoice/     # Invoice creation & processing
│   ├── reconcile-payments/  # Payment matching & reconciliation
│   ├── generate-qr-bill/    # Swiss QR-bill generation
│   └── process-camt-file/   # CAMT.053 file processing
├── integrations/            # External service integrations
│   ├── stripe-webhook/      # Stripe event processing
│   ├── resend-email/        # Email sending service
│   ├── blink-open-banking/  # Open Banking (bLink) integration
│   ├── bank-api-sync/       # Bank API integration
│   └── tax-calculation/     # Stripe Tax integration
├── management/              # Admin and management functions
│   ├── dashboard-data/      # Dashboard KPIs & reports
│   ├── manage-countries/    # Country management
│   ├── user-onboarding/     # Onboarding flow
│   └── audit-logging/       # Audit trail management
└── notifications/           # Communication functions
    ├── send-reminders/      # Payment reminders
    ├── overdue-notifications/ # Overdue invoice alerts
    └── welcome-emails/      # User onboarding emails
```

#### Key Edge Functions for PayMatch

1. **`generate-qr-bill`** - Swiss QR-bill generation with compliance validation
2. **`blink-open-banking`** - Real-time Open Banking (bLink) integration for automatic payment reconciliation
3. **`process-camt-file`** - CAMT.053 file parsing and payment extraction (fallback)
4. **`reconcile-payments`** - Payment matching algorithms for Swiss banking
5. **`stripe-webhook`** - Subscription management and billing events
6. **`resend-email`** - Transactional email delivery (invoices, reminders)
7. **`process-invoice`** - Complex invoice creation with tax calculations
8. **`dashboard-data`** - KPI calculations and analytics
9. **`send-reminders`** - Automated payment reminder system

#### Security & Performance

- **Service Role Access:** Edge Functions use service role key for privileged database operations
- **Input Validation:** All inputs validated with Zod schemas
- **Error Handling:** Comprehensive error handling and logging
- **CORS Support:** Proper CORS headers for cross-origin requests
- **Rate Limiting:** Built-in rate limiting for external API calls
- **Retry Logic:** Automatic retry for failed operations

---

## 9. Competitive Landscape

| Competitor        | Focus         | Gaps We Fill                                |
| ----------------- | ------------- | ------------------------------------------- |
| Bexio             | SME ERP       | Expensive, complex, not freelancer-friendly |
| Abacus            | Corporate ERP | Overkill for small businesses               |
| SAP/Oracle        | Enterprise    | Irrelevant for SMEs                         |
| Excel/Word/manual | Free          | Error-prone, non-compliant with QR-bill     |

**PayMatch** = **“Stripe for Swiss invoicing”** → lightweight, compliant, SME-first.

---

## 8. Go-to-Market Strategy

1. **Freelancers & SMEs** → online ads (LinkedIn, Google, FB).
2. **Fiduciary partnerships** → accountants onboard clients.
3. **Associations & landlords** → recurring invoice niche.
4. **Bank partnerships** → embed PayMatch into SME banking portals.

---

## 8.5. Switzerland-Only Market Focus

**Geographic Focus:**

- **Primary Market:** Switzerland only (CHF, German/English)
- **Region Locking:** App restricted to Switzerland region only
- **Language Support:** Swiss German (de-CH) and Swiss English (en-CH)

**Why Switzerland-Only:**

- **Compliance:** Swiss QR-bill regulations are complex and unique to Switzerland
- **Support Quality:** Native Swiss language support and local business hours
- **Payment Processing:** Optimized for Swiss banking and QR-bill standards
- **Legal Requirements:** Swiss invoicing and tax requirements are highly specific
- **Market Focus:** Concentrate on dominating the Swiss SME market first

**Swiss-Specific Features:**

- **Switzerland:** Full QR-bill compliance, Swiss tax rates, Swiss German/English
- **Currency:** CHF only (no EUR support)
- **Banking:** Swiss Open Banking (bLink) integration
- **Compliance:** Swiss VAT rates, Swiss business regulations
- **Language:** Swiss German (de-CH) and Swiss English (en-CH)

**Technical Implementation:**

- **IP Geolocation:** Block signups from outside Switzerland
- **Currency Restrictions:** CHF only
- **Language Detection:** Auto-detect Swiss users → de-CH, others → en-CH
- **Tax Configuration:** Swiss-specific tax rates and compliance rules

---

## 8.6. Payment Processing Strategy

**Dual Payment Architecture:**

### Subscription Billing (Stripe)

- **Stripe Billing:** Subscription management for Freelancer (CHF 5/month), Business (CHF 50/month), and Enterprise (CHF 150/month) plans
- **Stripe Customer Portal:** Self-service subscription management
- **Stripe Webhooks:** Real-time subscription events (created, updated, cancelled)
- **Swiss Currency Support:** CHF only for subscription billing

### Invoice Payments (Swiss QR-Bill)

- **Swiss QR-Bill Generation:** Compliant invoice creation with QR-codes
- **Direct Bank Transfers:** Customers pay via their Swiss bank app
- **Bank Reconciliation:** Import CAMT.053 files for payment matching
- **Resend Email Service:** All transactional emails (auth, invoices, reminders, notifications)
- **Manual Reconciliation:** Users upload bank statements to match payments

**Simplified Payment Flow:**

1. **Invoice Creation:** PayMatch generates Swiss QR-bill compliant invoice
2. **Email Delivery:** Resend sends branded invoice email to client
3. **Payment Processing:** Client pays via Swiss QR-bill (direct bank transfer)
4. **Bank Reconciliation:** User uploads CAMT.053 file to match payments
5. **Dashboard Updates:** Manual reconciliation updates invoice status

---

## 9. Technology Stack

- **Frontend:** Next.js 15 (React 19) with App Router
- **UI Components:** Shadcn/ui with Tailwind CSS
- **State Management:** Zustand for client-side state
- **Form Validation:** Zod for type-safe validation
- **Database:** Supabase (PostgreSQL) with real-time subscriptions
- **Authentication:** Supabase Auth with RLS policies
- **Backend Logic:** Supabase Edge Functions for complex operations
- **Subscription Billing:** Stripe Billing for plan management
- **Invoice Payments:** Swiss QR-bill for direct bank transfers
- **Email Service:** Resend for all transactional emails (auth, invoices, reminders)
- **QR-bill:** `node-swiss-qr-bill` for Swiss compliance integration
- **Bank Integration:** Swiss Open Banking (bLink) for real-time payments, ISO 20022 (CAMT.053) as fallback
- **Hosting:** Vercel (frontend), Supabase (backend & database)
- **Type Safety:** TypeScript with generated database types

---

## 10. Roadmap

**Phase 1 (MVP – 3 months)**  
✅ Invoice creation + QR-bill (Edge Functions)  
✅ Export as PDF/email (Edge Functions)  
✅ Basic client database  
✅ Core Edge Functions (QR-bill, invoice processing)

**Phase 2 (Launch – 6 months)**  
✅ Swiss Open Banking (bLink) integration (Edge Functions)  
✅ CAMT.053 reconciliation (Edge Functions) as fallback  
✅ Recurring invoices  
✅ Swiss German/English language support  
✅ Email notification system (Edge Functions)  
✅ Stripe webhook integration (Edge Functions)

**Phase 3 (Scale – 12 months)**  
✅ Advanced Swiss Open Banking features (multi-bank support)  
✅ Mobile app  
✅ White-label for Swiss fiduciaries  
✅ Advanced analytics (Edge Functions)  
✅ AI-powered payment matching (Edge Functions)

---

## 11. Financial Projections (Year 3)

- **10,000 paying users** (~1% of Swiss SMEs).
- **Pricing Mix:** 70% Freelancer (CHF 5), 30% Enterprise (CHF 50).
- **Annual Plan Adoption:** 60% of users choose annual billing (20% discount).
- **Avg. Revenue:** CHF 8.50/month (blended monthly equivalent).
- **ARR:** CHF 1.02M.
- **Gross margin:** ~85% SaaS (Stripe fees: ~3%).
- **Refund Rate:** <2% (30-day guarantee builds confidence).

---

## 12. Exit Potential

- **Acquisition:** Swiss banks, Swiss fiduciary networks, Swiss ERP firms (Bexio, Abacus).
- **IPO/Scale:** Swiss market dominance with potential for European expansion.

---

# 🧩 Layers of the App

1. **Presentation Layer (Frontend):** Web app → invoices, dashboard, reconciliation.
2. **Application Layer (Edge Functions):** Invoice/QR generation, reconciliation logic, webhooks, email notifications.
3. **Data Layer (DB/Storage):** Invoices, clients, users, CAMT.053, PDFs.
4. **Integration Layer:** Swiss Open Banking (bLink), Swiss banks (CAMT.053, EBICS, APIs), email/SMS, Stripe billing.

---

# 👥 User Roles

1. **Business Owner / Freelancer** → creates invoices, reconciles, tracks.
2. **Accountant / Fiduciary** → manages multiple businesses.
3. **Client** → receives invoice + QR-bill, pays.
4. **Internal Admin** → support, billing, monitoring.

---

# 🔄 User Flow

**Phase 1 – MVP (Open Banking Integration → Real-Time Matching)**

- Sign up & onboard → Add client → Create invoice → Send → Client pays → Swiss Open Banking (bLink) automatically detects payment → Real-time reconciliation → Dashboard updates → Send reminders.

**Phase 2 – Advanced Automation (Multi-Bank → AI-Powered)**

- Multi-bank Swiss Open Banking integration → AI-powered payment matching → Real-time cash flow dashboard → Automated bulk reminders → Predictive analytics.

---

# 🎯 Scale Potential

- **Single Freelancer** → 1 user.
- **Small Business** → 2–5 users.
- **Associations** → 2–3 admins, 100–1000 members.
- **Fiduciaries** → 1 accountant, 20–50 clients.

👉 Targeting **1% of SMEs (6,000)** = ~12k–18k active seats.

---

# 🏆 Value Proposition

- Saves time (hours → minutes).
- Reduces errors (structured QR reference).
- Cash flow visibility (know who paid).
- Professional invoices (branded, Swiss German/English).
- Scales across freelancers, SMEs, associations, accountants.

---
