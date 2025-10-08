# PayMatch Email System Overview

## 🎯 **System Architecture**

The PayMatch email system is a **hybrid, type-safe, and scalable** solution that handles all email communications with proper unsubscribe functionality, database integration, and Swiss compliance. It uses **Server Actions for authentication emails** and **API Routes for external-facing email operations**.

## 🏗️ **Core Components**

### 1. **Centralized Email Service** (`src/features/email/email-service.ts`)

**Main Classes:**

- `EmailService` - Core email sending with unsubscribe headers
- `NewsletterService` - Newsletter subscription management
- `EmailPreferencesService` - Email preference management
- `UnsubscribeService` - Centralized unsubscribe handling
- `SupportEmailService` - Support email functionality

**Key Features:**

- ✅ **Unified API** - Single service for all email types
- ✅ **Automatic Unsubscribe** - Headers generated automatically
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Database Integration** - Supabase for data persistence
- ✅ **Error Handling** - Comprehensive error management

### 2. **Authentication Server Actions** (`src/features/auth/server/actions/`)

**Server-Side Email Operations:**

- `registerUser()` - User registration with email verification
- `resendVerificationEmail()` - Resend verification emails
- `sendPasswordResetEmail()` - Password reset functionality

**Email Service Integration** (`src/features/auth/server/services/email-service.ts`):

- `sendPendingRegistrationEmail()` - Verification email for new registrations
- `sendVerificationEmail()` - Verification email for existing users
- `sendPasswordResetEmail()` - Password reset email functionality

**Key Features:**

- ✅ **Server-Side Security** - Access to environment variables
- ✅ **Rate Limiting** - Built-in abuse prevention
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Error Handling** - Comprehensive error management
- ✅ **No Network Overhead** - Direct function calls

### 3. **Unsubscribe System** (`src/features/email/unsubscribe.ts`)

**Token Management:**

- **Secure Generation** - SHA256 + HMAC for token security
- **Expiration Support** - Configurable token lifetime
- **Type Support** - Newsletter, support, and transactional emails
- **URL Generation** - Both standard and one-click unsubscribe URLs

**RFC Compliance:**

- ✅ **List-Unsubscribe Headers** - Email client integration
- ✅ **One-Click Unsubscribe** - RFC 8058 compliance
- ✅ **Token Verification** - Secure token validation

### 4. **API Endpoints** (`src/app/api/email/`)

**Organized Structure:**

```
/api/email/
├── newsletter/          # Newsletter subscription
├── support/            # Support request handling
└── unsubscribe/        # Unsubscribe functionality
    └── one-click/      # RFC-compliant one-click
```

**All endpoints use:**

- ✅ **Consolidated Service** - Same underlying email service
- ✅ **Unified Error Handling** - Consistent response formats
- ✅ **Type Validation** - Zod schemas for input validation

### 5. **Email Templates** (`src/emails/`)

**React Email Templates:**

- `EmailVerification` - User account verification
- `PasswordReset` - Password reset functionality
- `SupportConfirmationEmail` - User confirmation
- `SupportTeamNotificationEmail` - Team notifications
- `NewsletterWelcomeEmail` - Welcome messages
- `EmailLayout` - Shared layout component

**Email Assets System:**

- Direct logo URL approach (no attachments needed)
- Simplified asset management via `email-assets.ts`
- PayMatch logo served from public directory

**Features:**

- ✅ **React Components** - Type-safe email templates
- ✅ **Unsubscribe Integration** - Automatic unsubscribe URLs
- ✅ **Responsive Design** - Mobile-friendly layouts
- ✅ **Simplified Assets** - Direct URL approach for images
- ✅ **Brand Consistency** - PayMatch styling

### 6. **Database Schema**

**Tables:**

- `newsletter_subscribers` - Newsletter subscription data (legacy)
- `email_preferences` - Granular email type preferences and unsubscribes
- `consent_records` - GDPR/FADP compliance with full audit trail
- `email_type_categories` - Email type categorization and consent requirements

**Features:**

- ✅ **RLS Security** - Row Level Security policies
- ✅ **Performance Optimized** - Proper indexes
- ✅ **Audit Trail** - Created/updated timestamps
- ✅ **Type Support** - All 9 email types supported
- ✅ **GDPR Compliance** - Full consent management with audit trails
- ✅ **Switzerland FADP** - 2-year consent expiry tracking

## 🏛️ **Email Architecture Patterns**

### **Server Actions vs API Routes**

**Server Actions** (`src/features/auth/server/actions/`):

- ✅ **Authentication emails** - Registration, verification, password reset
- ✅ **Server-side security** - Access to environment variables
- ✅ **Rate limiting** - Built-in abuse prevention
- ✅ **Direct function calls** - No network overhead
- ✅ **Type safety** - Full TypeScript support

**API Routes** (`src/app/api/email/`):

- ✅ **External-facing emails** - Newsletter, support, marketing
- ✅ **Public endpoints** - Can be called from external sources
- ✅ **RESTful design** - Standard HTTP methods
- ✅ **CORS support** - Cross-origin requests
- ✅ **Webhook integration** - External service integration

### **When to Use Each Pattern**

**Use Server Actions for:**

- User authentication flows
- Password reset emails
- Email verification
- Account-related notifications
- Internal system emails

**Use API Routes for:**

- Newsletter subscriptions
- Support requests
- Marketing campaigns
- External integrations
- Webhook handlers

## 📧 **Email Types & Flows**

### **Supported Email Types (9 Total)**

The system supports **9 granular email types** for comprehensive user control:

#### **📢 Newsletter Types**

- `newsletter_promotional` - Marketing emails, offers, sales
- `newsletter_informational` - Educational content, tips, guides
- `newsletter_news` - Company news, announcements

#### **🔧 Business Types**

- `business_notifications` - Invoice status, payment confirmations
- `overdue_alerts` - Overdue payment alerts (sent to business owner)

#### **🛡️ Essential Types**

- `support` - Customer support communications
- `transactional` - Account-related emails (receipts, confirmations)
- `security` - Login alerts, password resets, email verification
- `legal` - Terms updates, privacy policy changes

### 1. **Newsletter Emails**

**Flow:**

1. User subscribes via `/api/email/newsletter`
2. Data stored in `newsletter_subscribers` table + `email_preferences` table
3. Welcome email sent with unsubscribe link
4. Future newsletters include unsubscribe headers

**Email Templates:**

- `NewsletterWelcomeEmail` - Welcome email for new subscribers

**Features:**

- ✅ **Dual Storage** - Newsletter table + email preferences
- ✅ **Unsubscribe Support** - Both token and one-click
- ✅ **User Management** - Name, email, subscription status
- ✅ **GDPR Compliance** - Marketing consent required

### 2. **Support Emails**

**Flow:**

1. User submits support form via `/api/email/support`
2. **Two emails sent:**
   - Team notification → `support@paymatch.app` (emailType: `support`)
   - User confirmation → User's email (emailType: `support`)
3. Both emails include unsubscribe functionality

**Email Templates:**

- `SupportConfirmationEmail` - User confirmation with request details
- `SupportTeamNotificationEmail` - Team notification with full request info

**Features:**

- ✅ **Dual Recipients** - Team and user notifications
- ✅ **Priority Handling** - Visual priority indicators
- ✅ **Attachment Support** - File upload handling
- ✅ **Reply-to Setup** - Team can reply directly
- ✅ **GDPR Compliance** - Support emails are essential for service operation

### 3. **Authentication Emails** (Server Actions)

**Flow:**

1. User triggers auth action (register, reset password, etc.)
2. Server action calls `registerUser()` or `sendPasswordResetEmail()`
3. Email sent via unified email service (emailType: `security`)
4. User redirected to appropriate page

**Features:**

- ✅ **Server-Side Security** - Environment variables protected
- ✅ **Rate Limiting** - Built-in abuse prevention
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Direct Integration** - No API overhead
- ✅ **GDPR Compliance** - Security emails are essential for service operation

### 4. **Business Notification Emails**

**Flow:**

1. System-triggered emails (invoices, receipts, overdue alerts, etc.)
2. Stored in `email_preferences` table with specific email types:
   - `business_notifications` - Invoice status, payment confirmations
   - `overdue_alerts` - Overdue payment alerts (sent to business owner)
   - `transactional` - Account-related emails, receipts
3. Include unsubscribe headers
4. Support both token and one-click unsubscribe

**Features:**

- ✅ **System Integration** - Automated email sending
- ✅ **Preference Management** - User can control receipt by type
- ✅ **Compliance Ready** - Swiss QR-bill integration
- ✅ **GDPR Compliance** - Business notifications classified as `data_processing` consent (necessary for service operation)

## 🔐 **Security & Compliance**

### **Token Security**

- **HMAC-SHA256** - Cryptographically secure tokens
- **Nonce Protection** - Prevents replay attacks
- **Expiration Control** - Configurable token lifetime
- **Type Validation** - Email type verification

### **Database Security**

- **Row Level Security** - User data isolation
- **Service Role Access** - API operations secured
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Parameterized queries

### **Email Compliance**

- **RFC 8058** - One-click unsubscribe standard
- **List-Unsubscribe Headers** - Email client integration
- **Swiss Compliance** - QR-bill integration ready
- **GDPR/FADP Compliant** - Full data protection compliance with consent management
- **Consent Categories** - Proper classification of email types:
  - `necessary` - Always enabled (security, transactional, legal)
  - `data_processing` - Business notifications (necessary for service operation)
  - `marketing` - Newsletter and promotional emails (requires explicit consent)

## 🚀 **Usage Examples**

### **Authentication Emails** (Server Actions)

```typescript
// User registration with email verification
import { registerUser } from '@/features/auth/server/actions/registration';

const result = await registerUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@example.com',
  password: 'securepassword123',
  referralSource: 'google',
});

if (result.success) {
  // User will be redirected to verify-email page
  router.push('/verify-email');
}
```

```typescript
// Password reset email
import { sendPasswordResetEmail } from '@/features/auth/server/actions/password-reset';

const result = await sendPasswordResetEmail('user@example.com');
if (result.success) {
  // User will receive password reset email
  setMessage('Password reset email sent!');
}
```

```typescript
// Resend verification email
import { resendVerificationEmail } from '@/features/auth/server/actions/registration';

const result = await resendVerificationEmail('user@example.com');
if (result.success) {
  // User will receive new verification email
  setMessage('Verification email sent!');
}
```

### **Newsletter Emails** (API Routes)

```typescript
// Newsletter subscription (requires marketing consent)
const response = await fetch('/api/email/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
  }),
});

const result = await response.json();
if (result.success) {
  // User subscribed successfully to newsletter_promotional emails
  setMessage('Successfully subscribed to newsletter!');
} else if (result.requiresCookieConsent) {
  // User needs to enable marketing cookies first
  showCookieConsentModal();
}
```

### **Support Emails** (API Routes)

```typescript
// Support request
const response = await fetch('/api/email/support', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'user@example.com',
    subject: 'Need help',
    message: 'I need assistance...',
    category: 'technical',
    priority: 'medium',
  }),
});

const result = await response.json();
if (result.success) {
  // Support request submitted successfully
  setMessage('Support request submitted!');
}
```

### **Unsubscribe Handling** (API Routes)

```typescript
// Token-based unsubscribe
const response = await fetch('/api/email/unsubscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: 'unsubscribe_token' }),
});

// One-click unsubscribe (RFC compliant)
const response = await fetch('/api/email/unsubscribe/one-click?token=...', {
  method: 'POST',
});
```

### **Direct Email Service Usage**

```typescript
// For server-side operations (Edge Functions, etc.)
import { sendEmailWithComponent } from '@/features/email/email-service';
import { EmailVerification } from '@/emails/email-verification';

// Authentication email (security type)
await sendEmailWithComponent({
  to: 'user@example.com',
  subject: 'Verify your account',
  emailType: 'security',
  userId: 'user-id',
  component: EmailVerification({
    verificationUrl: 'https://app.paymatch.app/verify?token=...',
    userName: 'John Doe',
    appUrl: 'https://app.paymatch.app',
  }),
});

// Business notification email
await sendEmailWithComponent({
  to: 'business@example.com',
  subject: 'Invoice Payment Received',
  emailType: 'business_notifications',
  userId: 'user-id',
  component: InvoicePaymentNotification({
    invoiceNumber: 'INV-2024-001',
    amount: 'CHF 1,500.00',
    businessName: 'Acme Corp',
  }),
});
```

## 📊 **System Benefits**

### **For Developers**

- ✅ **Hybrid Architecture** - Server Actions for auth, API Routes for external
- ✅ **Type Safety** - Full TypeScript support across all patterns
- ✅ **Easy Testing** - Mockable service classes and functions
- ✅ **Consistent APIs** - Unified patterns across all email types
- ✅ **Security by Design** - Server Actions protect sensitive operations
- ✅ **Performance** - Direct function calls for auth, HTTP for external

### **For Users**

- ✅ **Unified Experience** - Consistent unsubscribe process
- ✅ **Email Control** - Manage preferences by type
- ✅ **Compliance** - Proper unsubscribe functionality
- ✅ **Reliability** - Robust error handling and rate limiting
- ✅ **Security** - Protected authentication flows

### **For Business**

- ✅ **Swiss Compliance** - Ready for Swiss market with FADP compliance
- ✅ **GDPR Compliance** - Full consent management with audit trails
- ✅ **Scalable Architecture** - Easy to add new email types
- ✅ **Audit Trail** - Complete email and consent history
- ✅ **Performance** - Optimized database queries
- ✅ **Security** - Server-side protection for sensitive operations
- ✅ **Flexibility** - Choose the right pattern for each use case
- ✅ **User Control** - Granular email preferences by type
- ✅ **Legal Protection** - Comprehensive consent records for compliance audits

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Email Service
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@paymatch.app
RESEND_FROM_NAME=PayMatch

# Support
SUPPORT_EMAIL=support@paymatch.app

# Unsubscribe
UNSUBSCRIBE_TOKEN_SECRET=your_secret_key
UNSUBSCRIBE_TOKEN_EXPIRES_DAYS=30

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### **Database Setup**

- Newsletter subscribers table with RLS policies (legacy)
- Email preferences table for granular unsubscribe management
- Consent records table for GDPR/FADP compliance
- Email type categories table for consent requirements
- Proper indexes for performance
- Audit triggers for data tracking
- 2-year consent expiry tracking for Switzerland FADP

## 🎯 **Future Enhancements**

### **Planned Features**

- Email analytics and tracking
- Template management system
- A/B testing for email campaigns
- Advanced segmentation
- Automated email sequences

### **Integration Ready**

- Swiss QR-bill generation with business notifications
- Stripe payment notifications (business_notifications type)
- Multi-language support
- Advanced reporting with consent analytics
- Onboarding email preference integration
- Cookie consent synchronization

## 📈 **Monitoring & Maintenance**

### **Error Tracking**

- Comprehensive error logging
- Failed email retry logic
- Database operation monitoring
- API endpoint health checks

### **Performance**

- Database query optimization
- Email delivery monitoring
- Unsubscribe rate tracking by email type
- System health metrics
- Consent compliance monitoring
- GDPR audit trail generation

---

The PayMatch email system provides a **hybrid, robust, scalable, and fully compliant** foundation for all email communications. By using **Server Actions for authentication emails** and **API Routes for external-facing operations**, it ensures both technical excellence and user satisfaction while meeting Swiss market requirements and maintaining optimal security and performance.

## 🎯 **Key Features Summary**

- ✅ **9 Granular Email Types** - Complete user control over email preferences
- ✅ **GDPR/FADP Compliant** - Full consent management with audit trails
- ✅ **Swiss Market Ready** - 2-year consent expiry tracking
- ✅ **Hybrid Architecture** - Server Actions for auth, API Routes for external
- ✅ **Business Integration** - Onboarding email preferences sync
- ✅ **Cookie Integration** - Marketing consent synchronization
- ✅ **Comprehensive Audit** - Complete email and consent history
- ✅ **User-Friendly** - Granular unsubscribe and preference management
