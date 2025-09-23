# PayMatch Sidebar & Pages Specification

## Overview

This document defines the complete navigation structure and page specifications for PayMatch, designed around the single-organization model with plan-specific feature access.

---

## 1. Sidebar Layout

### Top Section

- **Organization Avatar:** Logo or initials + Organization/Company name
- **Click Action:** Org profile / switcher (if user belongs to multiple orgs)
- **Visual:** Prominent display to reinforce organization context

### Navigation (Main Links)

1. **Overview (Dashboard)** - Business health snapshot
2. **Invoices** - Invoice management and creation
3. **Clients** - Client CRM and management
4. **Payments / Reconciliation** - Bank payment matching
5. **Reports** - Financial exports and insights

### Collapsible Settings Section

- **Company Profile** - Organization details and branding
- **Bank & QR-bill** - Payment configuration
- **Invoice Defaults & Templates** - Invoice customization
- **Team Members** - Team management (Business Plan only)
- **Billing & Subscription** - Plan and payment management
- **Integrations** - External service connections
- **Notifications & Reminders** - Communication settings

### Footer

- **User Avatar + Name + Role** (Owner, Admin, Accountant, Staff)
- **Click Action:** Profile menu with options:
  - My Profile
  - Switch Organization
  - Help / Docs
  - Logout

---

## 2. Page Documentation

### 🟢 Overview (Dashboard)

**Purpose:** Snapshot of business health, quick actions, onboarding checklist.

**UI Elements:**

- **KPI Cards:** Outstanding, Overdue, Due this week, Paid this month
- **Checklist Card:** Getting Started progress
- **Recent Invoices:** Table with 5 rows
- **Recent Bank Imports:** Last CAMT upload + unmatched count
- **Cash Flow Chart:** 30 days inflow/outflow visualization
- **Quick Actions:** Create invoice, Upload CAMT, Invite member (if Business)

**Actions:**

- Drill-down from KPI to filtered invoice list
- Resume checklist tasks
- Quick invoice creation
- Bank file upload

**Technical Requirements:**

```typescript
interface DashboardData {
  kpis: {
    outstanding: number;
    overdue: number;
    dueThisWeek: number;
    paidThisMonth: number;
  };
  recentInvoices: Invoice[];
  recentBankImports: BankImport[];
  cashFlow: CashFlowData[];
  checklistProgress: ChecklistProgress;
}
```

---

### 🟠 Invoices

**Purpose:** Manage all invoices (create, send, track).

**UI Elements:**

- **Create Invoice Button:** Prominent CTA
- **Filters:** Status, Client, Date range, Currency, Search
- **Invoice List:** Table with columns (#, Date, Client, Amount, Status, Actions)
- **Invoice Detail View:** PDF preview with QR-bill, Send email option, Download PDF

**Actions:**

- Create, Edit, Delete invoice
- Send via email (with template)
- Download PDF
- Duplicate invoice
- Mark as paid manually

**Business Rules:**

- Invoice # must be unique per organization
- Issue date ≤ Due date
- IBAN required for QR-bill invoices
- Negative totals not allowed unless credit note

**Technical Requirements:**

```typescript
interface InvoiceListProps {
  invoices: Invoice[];
  filters: InvoiceFilters;
  onFilterChange: (filters: InvoiceFilters) => void;
  onInvoiceAction: (action: InvoiceAction, invoice: Invoice) => void;
}

interface InvoiceFilters {
  status?: InvoiceStatus[];
  clientId?: string;
  dateRange?: { start: Date; end: Date };
  currency?: Currency;
  search?: string;
}
```

---

### 🟡 Create/Edit Invoice (Invoice Editor)

**Purpose:** Generate compliant invoices with QR-bill.

**UI Elements:**

- **Invoice Meta:** Number (auto), Issue Date, Due Date, Currency
- **Client Selector:** Dropdown + quick add option
- **Line Items:** Description, Qty, Unit Price, Tax %
- **Totals Panel:** Subtotal, Tax breakdown, Grand total
- **QR-bill Section:** Reference type (QR structured default), IBAN, Note (optional)
- **Preview Panel:** Live invoice preview with QR code

**Actions:**

- Save draft
- Save & send (opens email modal)
- Download PDF
- Add/remove line items
- Calculate totals automatically

**Business Rules:**

- IBAN required before finalizing QR invoice
- Negative totals not allowed unless credit note
- Swiss QR-bill compliance validation
- Multi-language support (DE/FR/IT/EN)

**Technical Requirements:**

```typescript
interface InvoiceEditorProps {
  invoice?: Invoice;
  clients: Client[];
  onSave: (invoice: Invoice) => void;
  onSend: (invoice: Invoice, emailData: EmailData) => void;
  onDownload: (invoice: Invoice) => void;
}

interface InvoiceFormData {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  currency: Currency;
  clientId: string;
  lineItems: LineItem[];
  qrBillData: QRBillData;
  notes?: string;
}
```

---

### 🔵 Clients

**Purpose:** Simple CRM for invoice recipients.

**UI Elements:**

- **Client List:** Table/cards with Name, Email, Outstanding, Last paid date
- **Add Client Button:** Quick client creation
- **Client Detail View:** Contact info, Invoices history, Total billed/paid, Notes

**Actions:**

- Create/Edit/Delete client
- Quick action: Create invoice for client
- Export client data
- View client invoice history

**Technical Requirements:**

```typescript
interface ClientListProps {
  clients: Client[];
  onClientAction: (action: ClientAction, client: Client) => void;
  onCreateInvoice: (client: Client) => void;
}

interface Client {
  id: string;
  orgId: string;
  name: string;
  email?: string;
  address: Address;
  vatNumber?: string;
  outstanding: number;
  lastPaidDate?: Date;
  totalBilled: number;
  totalPaid: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 🟣 Payments / Reconciliation

**Purpose:** Match bank payments with invoices.

**UI Elements:**

- **Upload CAMT.053:** Drag & drop interface
- **Last Import Status:** Time, transactions count
- **Matched Payments:** Table with Invoice #, Amount, Date, Status
- **Unmatched Payments:** Table with Amount, Date, Payer, Reference
  - Suggested matches with confidence score
  - Actions: Confirm, Assign, Ignore
- **Partial Payment Handling:** Link multiple payments to invoice

**Actions:**

- Upload new bank file
- Confirm/Assign unmatched payments
- Export reconciliation report
- Manual payment matching

**Business Rules:**

- Exact QR ref → auto-match
- Fuzzy match (amount ± tolerance, client name, free text) → suggested
- Partial payments supported
- Audit trail for all matches

**Technical Requirements:**

```typescript
interface ReconciliationProps {
  matchedPayments: MatchedPayment[];
  unmatchedPayments: UnmatchedPayment[];
  onUploadCAMT: (file: File) => Promise<void>;
  onConfirmMatch: (paymentId: string, invoiceId: string) => void;
  onAssignMatch: (paymentId: string, invoiceId: string) => void;
  onIgnorePayment: (paymentId: string) => void;
}

interface MatchedPayment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  date: Date;
  status: 'confirmed' | 'pending';
  confidence: number;
}
```

---

### 🟤 Reports

**Purpose:** Exports and financial insights.

**UI Elements:**

- **Filters:** Period, Client, Status, Currency
- **Export Options:** CSV / Excel
- **Reports List:**
  - Invoices
  - Payments
  - Aging report (30/60/90+)
  - Revenue by client/period
  - VAT summary

**Actions:**

- Download selected report
- Schedule export (future)
- Custom date ranges
- Filter by multiple criteria

**Technical Requirements:**

```typescript
interface ReportsProps {
  availableReports: ReportType[];
  filters: ReportFilters;
  onGenerateReport: (type: ReportType, filters: ReportFilters) => void;
  onDownloadReport: (reportId: string) => void;
}

interface ReportFilters {
  period: { start: Date; end: Date };
  clientIds?: string[];
  statuses?: InvoiceStatus[];
  currencies?: Currency[];
}
```

---

## 3. Settings Pages

### A) Company Profile

**Fields:**

- Company / Legal name
- Address (street, ZIP, city, canton, country)
- VAT number (optional)
- UID (optional)
- Logo upload
- Default language & timezone

**Validation:**

- Swiss address format compliance
- VAT number format validation
- Logo file type and size limits

### B) Bank & QR-bill

**Fields:**

- IBAN / QR-IBAN
- Creditor name (auto from company)
- Creditor address (auto from company)
- Default reference type (QR structured default)
- Preview QR payload

**Validation:**

- IBAN format validation
- Swiss QR-bill compliance
- Real-time QR payload preview

### C) Invoice Defaults & Templates

**Fields:**

- Default due days
- Default VAT rate(s)
- Numbering pattern (prefix, reset yearly toggle)
- Default footer / terms
- Email templates for invoice send
- Template selector (layout styles)

**Features:**

- Template preview
- Multi-language support
- Custom branding options

### D) Team Members (Business Plan only)

**UI Elements:**

- Team list: Name, Email, Role, Status
- Invite member (email + role)
- Pending invites list (resend/cancel)
- Change role / Remove member

**Roles:**

- Owner: Full access
- Admin: All except billing
- Accountant: Invoices, reconciliation, exports
- Staff: Invoices, clients only

### E) Billing & Subscription

**UI Elements:**

- Current plan info
- Upgrade/Downgrade options
- Payment method (Stripe portal link)
- Billing history (PDF receipts)
- Seat usage (for Business plan)

**Plan Management:**

- Real-time plan limits display
- Upgrade/downgrade restrictions
- Seat usage tracking

### F) Integrations

**Available Integrations:**

- Bank connections (manual CAMT, EBICS/API future)
- Accounting exports (CSV, DATEV)
- Email provider (default or custom SMTP)

**Future Integrations:**

- EBICS banking
- Open Banking APIs
- Accounting software (DATEV, Abacus)

### G) Notifications & Reminders

**Settings:**

- Reminder schedule (e.g., 7d/14d overdue)
- Email templates for reminders
- Enable/disable email or SMS reminders

**Templates:**

- Invoice sent
- Payment reminder
- Payment received
- Overdue notice

---

## 4. Cross-Cutting Rules

### Organization Scoping

- All pages scoped to `organization.id`
- Data isolation between organizations
- Consistent org context throughout app

### Role-Based Access

- **Owner:** Full access to all features
- **Admin:** All except billing and owner-only actions
- **Accountant:** Invoices, reconciliation, exports, no billing
- **Staff:** Invoices and clients only, no settings access

### Localization

- **Languages:** DE/FR/IT/EN for all labels + templates
- **Currency:** CHF default, EUR support
- **Date Formats:** Swiss standard (DD.MM.YYYY)
- **Number Formats:** Swiss standard (1'234.56)

### Plan-Specific Features

- **Free Plan:** Hide Team + advanced billing settings
- **Freelancer Plan:** Standard features, no team management
- **Business Plan:** Enable Team & seat management
- **Enterprise Plan (CHF 150/month):** All features + dedicated support

### Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Optimized for tablet and desktop

---

## 5. Technical Implementation

### State Management

```typescript
interface AppState {
  organization: Organization;
  user: User;
  plan: Plan;
  navigation: NavigationState;
  ui: UIState;
}

interface NavigationState {
  currentPage: string;
  sidebarCollapsed: boolean;
  breadcrumbs: Breadcrumb[];
}
```

### API Integration

```typescript
// Page-specific API calls
const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async (filters: InvoiceFilters) => {
    setLoading(true);
    const data = await api.invoices.list(filters);
    setInvoices(data);
    setLoading(false);
  };

  return { invoices, loading, fetchInvoices };
};
```

### Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Invoices/
│   │   ├── Clients/
│   │   ├── Payments/
│   │   ├── Reports/
│   │   └── Settings/
│   └── ui/
│       ├── DataTable.tsx
│       ├── Filters.tsx
│       └── ActionButtons.tsx
```

---

## 6. Success Metrics

### Navigation Usage

- **Most Used Pages:** Dashboard, Invoices, Clients
- **Settings Access:** Company Profile, Billing
- **Feature Discovery:** Team management, Reports

### User Engagement

- **Time on Page:** Dashboard > Invoices > Clients
- **Action Completion:** Invoice creation, Payment matching
- **Settings Configuration:** 80% complete basic setup

### Plan Conversion

- **Free → Freelancer:** Volume limit triggers
- **Freelancer → Business:** Team invitation attempts
- **Business → Enterprise:** Scale needs and dedicated support

---

This specification provides a complete blueprint for implementing PayMatch's navigation and page structure, ensuring consistency, usability, and plan-appropriate feature access.
