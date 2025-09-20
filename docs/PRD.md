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
   - **Stripe Invoicing** for invoice creation, sending, and management.
   - **Swiss QR-bill integration** with Stripe payment links.
   - Branded invoices in DE/FR/IT/EN.
   - Recurring invoices for rent, subscriptions, or member fees.
   - **Stripe Tax** for automatic tax calculations and compliance.

2. **Payment Reconciliation**
   - **Stripe webhooks** for automatic payment status updates.
   - Import ISO 20022 CAMT.053 files for additional bank reconciliation.
   - Real-time dashboard: "Paid / Pending / Overdue".
   - **Stripe Tax** integration for tax reporting and compliance.

3. **Business Features**
   - Client & project tracking.
   - Multi-currency support (CHF, EUR).
   - **Resend** for all email communications (auth, invoices, reminders).
   - **Stripe Invoicing** for complete invoice lifecycle management.

---

## 4. Unique Selling Proposition (USP)

- **Swiss-focused:** Built for QR-bills & ISO 20022 compliance.
- **Simplicity first:** Easy for freelancers; powerful enough for SMEs.
- **Affordable:** Fraction of ERP costs (CHF 10–30/month).
- **Bank-ready:** Payment reconciliation across all major Swiss banks.
- **Multilingual:** DE, FR, IT, EN out of the box.

---

## 5. Market Opportunity

- **600,000+ SMEs** in Switzerland (99% of all companies).
- **Freelancers & self-employed**: ~1 million active.
- **Associations & landlords**: Thousands with recurring invoicing needs.

💰 **TAM:** ~CHF 500M/year (invoicing & financial SaaS for SMEs).  
🎯 **SAM:** ~CHF 100M/year (SMEs without ERP).

---

## 6. Business Model

- **Freemium:** Free tier (5 invoices/month, 3 clients/month).
- **Subscriptions:**
  - **Freelancer/Small Business:**
    - Monthly: CHF 5/month → unlimited invoices, unlimited clients, branded PDFs, basic reconciliation.
    - Annual: CHF 48/year (20% discount) → same features, 2 months free.
  - **Enterprise:**
    - Monthly: CHF 50/month → multi-user, advanced reconciliation, accountant dashboard, priority support, custom branding.
    - Annual: CHF 480/year (20% discount) → same features, 2 months free.
- **Payment Processing:** Stripe Invoicing + Stripe Payments with native currency support (CHF, EUR).
- **Money-Back Guarantee:** 30-day refund guarantee if customers aren't satisfied.
- **Pricing Strategy Benefits:**
  - **Low Barrier to Entry:** CHF 5/month makes it accessible to all freelancers
  - **Annual Discount:** 20% off encourages longer commitments and improves cash flow
  - **Risk-Free Trial:** 30-day guarantee reduces signup friction
  - **Clear Value Tiers:** Simple 10x pricing jump (CHF 5 → CHF 50) for enterprise features
- **Upsell:** White-label for fiduciaries, accountants, and agencies.

---

## 7. Competitive Landscape

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

## 8.5. Regional Strategy & Market Focus

**Geographic Focus:**

- **Primary Market:** Switzerland (CHF, German/French/Italian/English)
- **Secondary Markets:** Germany, France, Italy (EUR, local languages)
- **Region Locking:** App restricted to DACH + France/Italy regions

**Why Region Locking:**

- **Compliance:** Swiss QR-bill and EU invoicing regulations are complex and region-specific
- **Support Quality:** Native language support and local business hours
- **Payment Processing:** Stripe Tax optimized for specific tax jurisdictions
- **Legal Requirements:** Each country has unique invoicing and tax requirements
- **Market Validation:** Focus on proving product-market fit in core markets first

**Regional Features:**

- **Switzerland:** Full QR-bill compliance, Swiss tax rates, multi-language (DE/FR/IT/EN)
- **Germany:** EU invoicing standards, German tax rates, German language
- **France:** EU invoicing standards, French tax rates, French language
- **Italy:** EU invoicing standards, Italian tax rates, Italian language

**Expansion Strategy:**

1. **Phase 1:** Dominate Swiss market (CHF, QR-bill focus)
2. **Phase 2:** Expand to Germany (EUR, EU standards)
3. **Phase 3:** Add France and Italy (EUR, local compliance)
4. **Phase 4:** Consider other EU markets based on success

**Technical Implementation:**

- **IP Geolocation:** Block signups from outside target regions
- **Currency Restrictions:** CHF for Switzerland, EUR for EU markets
- **Language Detection:** Auto-detect and default to local language
- **Tax Configuration:** Region-specific tax rates and compliance rules

---

## 8.6. Payment Processing Strategy

**Dual Payment Architecture:**

### Subscription Billing (Stripe)

- **Stripe Billing:** Subscription management for Freelancer (CHF 5/month) and Enterprise (CHF 50/month) plans
- **Stripe Customer Portal:** Self-service subscription management
- **Stripe Webhooks:** Real-time subscription events (created, updated, cancelled)
- **Multi-currency Support:** CHF and EUR for subscription billing

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
- **Subscription Billing:** Stripe Billing for plan management
- **Invoice Payments:** Swiss QR-bill for direct bank transfers
- **Email Service:** Resend for all transactional emails (auth, invoices, reminders)
- **QR-bill:** `node-swiss-qr-bill` for Swiss compliance integration
- **Bank Integration:** ISO 20022 (CAMT.053), later EBICS/OpenBanking
- **Hosting:** Vercel (frontend), Supabase (backend & database)
- **Type Safety:** TypeScript with generated database types

---

## 10. Roadmap

**Phase 1 (MVP – 3 months)**  
✅ Invoice creation + QR-bill  
✅ Export as PDF/email  
✅ Basic client database

**Phase 2 (Launch – 6 months)**  
✅ CAMT.053 reconciliation  
✅ Recurring invoices  
✅ Multi-language support

**Phase 3 (Scale – 12 months)**  
✅ Bank API integrations (EBICS/OpenBanking)  
✅ Mobile app  
✅ White-label for fiduciaries

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

- **Acquisition:** Swiss banks, fiduciary networks, ERP firms (Bexio, Abacus).
- **IPO/Scale:** EU expansion (SEPA invoicing + PSD2).

---

# 🧩 Layers of the App

1. **Presentation Layer (Frontend):** Web app → invoices, dashboard, reconciliation.
2. **Application Layer (Backend):** Invoice/QR generation, reconciliation logic.
3. **Data Layer (DB/Storage):** Invoices, clients, users, CAMT.053, PDFs.
4. **Integration Layer:** Banks (CAMT.053, EBICS, APIs), email/SMS, Stripe billing.

---

# 👥 User Roles

1. **Business Owner / Freelancer** → creates invoices, reconciles, tracks.
2. **Accountant / Fiduciary** → manages multiple businesses.
3. **Client** → receives invoice + QR-bill, pays.
4. **Internal Admin** → support, billing, monitoring.

---

# 🔄 User Flow

**Phase 1 – MVP (Manual Upload → Auto-Matching)**

- Sign up & onboard → Add client → Create invoice → Send → Client pays → User uploads CAMT.053 → App matches → Dashboard updates → Send reminders.

**Phase 2 – Future Automation (Bank Connected → Zero Touch)**

- Setup EBICS/Open Banking → Automatic daily CAMT.053 fetch → Auto reconciliation → Real-time cash flow dashboard → Bulk reminders.

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
- Professional invoices (branded, multilingual).
- Scales across freelancers, SMEs, associations, accountants.

---
