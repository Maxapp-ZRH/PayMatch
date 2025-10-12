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
├── preferences/        # Email preference management
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

**Features:**

- ✅ **React Components** - Type-safe email templates
- ✅ **Unsubscribe Integration** - Automatic unsubscribe URLs
- ✅ **Responsive Design** - Mobile-friendly layouts
- ✅ **Brand Consistency** - PayMatch styling

### 6. **Database Schema**

**Tables:**

- `newsletter_subscribers` - Newsletter subscription data (legacy)
- `email_preferences` - Granular email type preferences and unsubscribes
- `consent_records` - GDPR/FADP compliance with full audit trail

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

**API Routes** (`src/app/api/email/`):

- ✅ **External-facing emails** - Newsletter, support, marketing
- ✅ **Public endpoints** - Can be called from external sources
- ✅ **RESTful design** - Standard HTTP methods
- ✅ **CORS support** - Cross-origin requests

## 📧 **Email Types & Categories**

### **9 Granular Email Types**

#### **📢 Newsletter Types** (Optional - Marketing Consent Required)

- `newsletter_promotional` - Marketing emails, offers, sales
- `newsletter_informational` - Educational content, tips, guides
- `newsletter_news` - Company news, announcements

#### **🔧 Business Types** (Default Enabled - Data Processing Consent)

- `business_notifications` - Invoice status, payment confirmations
- `overdue_alerts` - Overdue payment alerts (sent to business owner)

#### **🛡️ Essential Types** (Mandatory - Cannot Be Disabled)

- `support` - Customer support communications
- `transactional` - Account-related emails (receipts, confirmations)
- `security` - Login alerts, password resets, email verification
- `legal` - Terms updates, privacy policy changes

## 🔐 **Security & Compliance**

### **Email Compliance**

- **RFC 8058** - One-click unsubscribe standard
- **List-Unsubscribe Headers** - Email client integration
- **Swiss Compliance** - QR-bill integration ready
- **GDPR/FADP Compliant** - Full data protection compliance with consent management

### **Token Security**

- **HMAC-SHA256** - Cryptographically secure tokens
- **Nonce Protection** - Prevents replay attacks
- **Expiration Control** - Configurable token lifetime

## 🚀 **Quick Usage Examples**

### **Authentication Emails** (Server Actions)

```typescript
import { registerUser } from '@/features/auth/server/actions/registration';

const result = await registerUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@example.com',
  password: 'securepassword123',
});
```

### **Newsletter Emails** (API Routes)

```typescript
const response = await fetch('/api/email/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
  }),
});
```

### **Support Emails** (API Routes)

```typescript
const response = await fetch('/api/email/support', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'user@example.com',
    subject: 'Need help',
    message: 'I need assistance...',
  }),
});
```

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Email Service
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@paymatch.app
RESEND_FROM_NAME=PayMatch

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## 📊 **System Benefits**

### **For Developers**

- ✅ **Hybrid Architecture** - Server Actions for auth, API Routes for external
- ✅ **Type Safety** - Full TypeScript support across all patterns
- ✅ **Consistent APIs** - Unified patterns across all email types
- ✅ **Security by Design** - Server Actions protect sensitive operations

### **For Users**

- ✅ **Unified Experience** - Consistent unsubscribe process
- ✅ **Email Control** - Manage preferences by type
- ✅ **Compliance** - Proper unsubscribe functionality
- ✅ **Reliability** - Robust error handling and rate limiting

### **For Business**

- ✅ **Swiss Compliance** - Ready for Swiss market with FADP compliance
- ✅ **GDPR Compliance** - Full consent management with audit trails
- ✅ **Scalable Architecture** - Easy to add new email types
- ✅ **Audit Trail** - Complete email and consent history

## 📚 **Detailed Documentation**

For comprehensive information about specific components:

- **[Email Preferences System](../email-preferences.md)** - Detailed email preference management
- **[Cookie Management System](../cookies/cookies.md)** - Cookie consent and management
- **[Authentication System](../authentication.md)** - User authentication flows
- **[Onboarding System](../Onboarding-Flow.md)** - User onboarding process

---

The PayMatch email system provides a **hybrid, robust, scalable, and fully compliant** foundation for all email communications. By using **Server Actions for authentication emails** and **API Routes for external-facing operations**, it ensures both technical excellence and user satisfaction while meeting Swiss market requirements.

## 🎯 **Key Features Summary**

- ✅ **9 Granular Email Types** - Complete user control over email preferences
- ✅ **GDPR/FADP Compliant** - Full consent management with audit trails
- ✅ **Swiss Market Ready** - 2-year consent expiry tracking
- ✅ **Hybrid Architecture** - Server Actions for auth, API Routes for external
- ✅ **Business Integration** - Onboarding email preferences sync
- ✅ **Cookie Integration** - Marketing consent synchronization
- ✅ **Comprehensive Audit** - Complete email and consent history
- ✅ **User-Friendly** - Granular unsubscribe and preference management
