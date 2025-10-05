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

### 2. **Authentication Server Actions** (`src/server/actions/auth.ts`)

**Server-Side Email Operations:**

- `registerUser()` - User registration with email verification
- `changeUserEmail()` - Email change during verification
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
└── unsubscribe/        # Unsubscribe functionality
    └── one-click/      # RFC-compliant one-click
```

**All endpoints use:**

- ✅ **Consolidated Service** - Same underlying email service
- ✅ **Unified Error Handling** - Consistent response formats
- ✅ **Type Validation** - Zod schemas for input validation

### 5. **Email Templates** (`src/emails/`)

**React Email Templates:**

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

- `newsletter_subscribers` - Newsletter subscription data
- `email_preferences` - Email type preferences and unsubscribes

**Features:**

- ✅ **RLS Security** - Row Level Security policies
- ✅ **Performance Optimized** - Proper indexes
- ✅ **Audit Trail** - Created/updated timestamps
- ✅ **Type Support** - Newsletter, support, transactional

## 🏛️ **Email Architecture Patterns**

### **Server Actions vs API Routes**

**Server Actions** (`src/server/actions/auth.ts`):

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

### 1. **Newsletter Emails**

**Flow:**

1. User subscribes via `/api/email/newsletter`
2. Data stored in `newsletter_subscribers` table
3. Welcome email sent with unsubscribe link
4. Future newsletters include unsubscribe headers

**Features:**

- ✅ **Dual Storage** - Newsletter table + email preferences
- ✅ **Unsubscribe Support** - Both token and one-click
- ✅ **User Management** - Name, email, subscription status

### 2. **Support Emails**

**Flow:**

1. User submits support form via `/api/email/support`
2. **Two emails sent:**
   - Team notification → `support@paymatch.app`
   - User confirmation → User's email
3. Both emails include unsubscribe functionality

**Features:**

- ✅ **Dual Recipients** - Team and user notifications
- ✅ **Priority Handling** - Visual priority indicators
- ✅ **Attachment Support** - File upload handling
- ✅ **Reply-to Setup** - Team can reply directly

### 3. **Authentication Emails** (Server Actions)

**Flow:**

1. User triggers auth action (register, reset password, etc.)
2. Server action calls `registerUser()` or `sendPasswordResetEmail()`
3. Email sent via unified email service
4. User redirected to appropriate page

**Features:**

- ✅ **Server-Side Security** - Environment variables protected
- ✅ **Rate Limiting** - Built-in abuse prevention
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Direct Integration** - No API overhead

### 4. **Transactional Emails**

**Flow:**

1. System-triggered emails (invoices, receipts, etc.)
2. Stored in `email_preferences` table
3. Include unsubscribe headers
4. Support both token and one-click unsubscribe

**Features:**

- ✅ **System Integration** - Automated email sending
- ✅ **Preference Management** - User can control receipt
- ✅ **Compliance Ready** - Swiss QR-bill integration

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
- **GDPR Ready** - Data protection compliance

## 🚀 **Usage Examples**

### **Authentication Emails** (Server Actions)

```typescript
// User registration with email verification
import { registerUser } from '@/features/auth/server/auth';

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
import { sendPasswordResetEmail } from '@/features/auth/server/auth';

const result = await sendPasswordResetEmail('user@example.com');
if (result.success) {
  // User will receive password reset email
  setMessage('Password reset email sent!');
}
```

```typescript
// Resend verification email
import { resendVerificationEmail } from '@/features/auth/server/auth';

const result = await resendVerificationEmail('user@example.com');
if (result.success) {
  // User will receive new verification email
  setMessage('Verification email sent!');
}
```

### **Newsletter Emails** (API Routes)

```typescript
// Newsletter subscription
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
  // User subscribed successfully
  setMessage('Successfully subscribed to newsletter!');
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

await sendEmailWithComponent({
  to: 'user@example.com',
  subject: 'Verify your account',
  emailType: 'transactional',
  userId: 'user-id',
  component: EmailVerification({
    verificationUrl: 'https://app.paymatch.app/verify?token=...',
    userName: 'John Doe',
    appUrl: 'https://app.paymatch.app',
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

- ✅ **Swiss Compliance** - Ready for Swiss market
- ✅ **Scalable Architecture** - Easy to add new email types
- ✅ **Audit Trail** - Complete email history
- ✅ **Performance** - Optimized database queries
- ✅ **Security** - Server-side protection for sensitive operations
- ✅ **Flexibility** - Choose the right pattern for each use case

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

- Newsletter subscribers table with RLS policies
- Email preferences table for unsubscribe management
- Proper indexes for performance
- Audit triggers for data tracking

## 🎯 **Future Enhancements**

### **Planned Features**

- Email analytics and tracking
- Template management system
- A/B testing for email campaigns
- Advanced segmentation
- Automated email sequences

### **Integration Ready**

- Swiss QR-bill generation
- Stripe payment notifications
- Multi-language support
- Advanced reporting

## 📈 **Monitoring & Maintenance**

### **Error Tracking**

- Comprehensive error logging
- Failed email retry logic
- Database operation monitoring
- API endpoint health checks

### **Performance**

- Database query optimization
- Email delivery monitoring
- Unsubscribe rate tracking
- System health metrics

---

The PayMatch email system provides a **hybrid, robust, scalable, and compliant** foundation for all email communications. By using **Server Actions for authentication emails** and **API Routes for external-facing operations**, it ensures both technical excellence and user satisfaction while meeting Swiss market requirements and maintaining optimal security and performance.
