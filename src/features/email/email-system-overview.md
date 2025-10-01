# PayMatch Email System Overview

## 🎯 **System Architecture**

The PayMatch email system is a **consolidated, type-safe, and scalable** solution that handles all email communications with proper unsubscribe functionality, database integration, and Swiss compliance.

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

### 2. **Unsubscribe System** (`src/features/email/unsubscribe.ts`)

**Token Management:**

- **Secure Generation** - SHA256 + HMAC for token security
- **Expiration Support** - Configurable token lifetime
- **Type Support** - Newsletter, support, and transactional emails
- **URL Generation** - Both standard and one-click unsubscribe URLs

**RFC Compliance:**

- ✅ **List-Unsubscribe Headers** - Email client integration
- ✅ **One-Click Unsubscribe** - RFC 8058 compliance
- ✅ **Token Verification** - Secure token validation

### 3. **API Endpoints** (`src/app/api/email/`)

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

### 4. **Email Templates** (`src/emails/`)

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

### 5. **Database Schema**

**Tables:**

- `newsletter_subscribers` - Newsletter subscription data
- `email_preferences` - Email type preferences and unsubscribes

**Features:**

- ✅ **RLS Security** - Row Level Security policies
- ✅ **Performance Optimized** - Proper indexes
- ✅ **Audit Trail** - Created/updated timestamps
- ✅ **Type Support** - Newsletter, support, transactional

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

### 3. **Transactional Emails**

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

### **Sending Newsletter Email**

```typescript
import { EmailService } from '@/lib/email-service';

await EmailService.sendEmailWithComponent({
  to: 'user@example.com',
  subject: 'Weekly Newsletter',
  emailType: 'newsletter',
  component: NewsletterTemplate({ content: '...' }),
});
```

### **Support Request**

```typescript
// Frontend form submission
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
```

### **Unsubscribe Handling**

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

## 📊 **System Benefits**

### **For Developers**

- ✅ **Single Source of Truth** - All email logic centralized
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Easy Testing** - Mockable service classes
- ✅ **Consistent APIs** - Unified patterns across all email types

### **For Users**

- ✅ **Unified Experience** - Consistent unsubscribe process
- ✅ **Email Control** - Manage preferences by type
- ✅ **Compliance** - Proper unsubscribe functionality
- ✅ **Reliability** - Robust error handling

### **For Business**

- ✅ **Swiss Compliance** - Ready for Swiss market
- ✅ **Scalable Architecture** - Easy to add new email types
- ✅ **Audit Trail** - Complete email history
- ✅ **Performance** - Optimized database queries

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

The PayMatch email system provides a **robust, scalable, and compliant** foundation for all email communications, ensuring both technical excellence and user satisfaction while meeting Swiss market requirements.
