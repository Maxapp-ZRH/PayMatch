# PayMatch Email Preferences System

## 🎯 **Overview**

The PayMatch Email Preferences System provides **granular control** over email communications with **9 distinct email types**, comprehensive unsubscribe functionality, and full GDPR/FADP compliance. Users can manage their email preferences through a dedicated interface while maintaining essential business communications.

## 🏗️ **System Architecture**

### **Core Components**

#### 1. **Email Preferences Service** (`src/features/email/services/email-preferences-server.ts`)

**Server Actions:**

- `subscribeToEmailType()` - Subscribe to specific email types
- `unsubscribeFromEmailType()` - Unsubscribe from specific email types
- `getEmailPreferences()` - Retrieve current preferences

**Key Features:**

- ✅ **Server-Side Security** - Protected environment variables
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Conflict Resolution** - Proper upsert with `onConflict`
- ✅ **Mandatory Protection** - Prevents unsubscribing from essential emails

#### 2. **API Layer** (`src/app/api/email/preferences/route.ts`)

**Endpoints:**

- `GET /api/email/preferences?type={emailType}` - Get preferences for specific type
- `POST /api/email/preferences` - Update preferences for specific type

**Features:**

- ✅ **Authentication Required** - User must be logged in
- ✅ **Input Validation** - Zod schema validation
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Type Safety** - Validates email types

#### 3. **Client Interface** (`src/app/[locale]/(common)/email-preferences/page.tsx`)

**User Experience:**

- ✅ **Marketing Design** - Matches PayMatch design language
- ✅ **Real-Time Updates** - Immediate preference changes
- ✅ **Visual Feedback** - Success/error messages
- ✅ **Responsive Design** - Mobile and desktop optimized

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

### **Email Type Categories**

```typescript
interface EmailType {
  emailType: EmailType;
  category: 'newsletter' | 'business' | 'essential';
  mandatory?: boolean;
  description: string;
  icon: React.ComponentType;
  consequence?: string;
}
```

## 🎨 **User Interface Design**

### **Design Language**

**Marketing-Style Design:**

- **Typography**: `text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight`
- **Spacing**: `py-12 sm:py-20 lg:py-32` and `space-y-12`
- **Cards**: `rounded-2xl` corners with `p-6 sm:p-8` padding
- **Colors**: Teal accents (`teal-600`, `teal-500`) for interactive elements

### **Visual Elements**

#### **Email Type Cards**

- **Category Badges**: Color-coded by category (newsletter, business, essential)
- **Mandatory Indicators**: Shield icons for essential emails
- **Toggle Switches**: Teal-colored switches for optional emails
- **Descriptions**: Clear explanations of each email type
- **Consequences**: Warnings for disabling important emails

#### **Color Scheme**

- **Teal**: Interactive elements, switches, info boxes
- **Swiss Red**: Primary action buttons
- **Gray**: Text and borders
- **Green**: Success messages
- **Red**: Error messages

## 🔐 **Security & Compliance**

### **Authentication & Authorization**

**User Authentication:**

- ✅ **Login Required** - Must be authenticated to access preferences
- ✅ **User Isolation** - Users can only manage their own preferences
- ✅ **Session Validation** - Validates user session on each request

**Data Protection:**

- ✅ **RLS Policies** - Row Level Security on database
- ✅ **Input Validation** - Zod schema validation
- ✅ **Type Safety** - TypeScript throughout

### **GDPR/FADP Compliance**

**Consent Management:**

- ✅ **Granular Control** - 9 distinct email types
- ✅ **Mandatory Protection** - Essential emails cannot be disabled
- ✅ **Audit Trail** - All preference changes logged
- ✅ **Consent Categories** - Proper classification of email types

**Data Rights:**

- ✅ **Right to Withdraw** - Easy unsubscribe from optional emails
- ✅ **Data Portability** - Export preferences functionality
- ✅ **Transparency** - Clear descriptions of each email type

## 🚀 **Usage Examples**

### **Client-Side Usage**

```typescript
// Get current preferences for a specific email type
const response = await fetch(
  '/api/email/preferences?type=business_notifications'
);
const result = await response.json();

if (result.success) {
  const isActive = result.subscriber.isActive;
  console.log('Business notifications enabled:', isActive);
}
```

```typescript
// Update email preferences
const response = await fetch('/api/email/preferences', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emailType: 'newsletter_promotional',
    isActive: true,
    firstName: 'John',
    lastName: 'Doe',
  }),
});

const result = await response.json();
if (result.success) {
  console.log('Successfully updated preferences');
}
```

### **Server-Side Usage**

```typescript
import {
  subscribeToEmailType,
  unsubscribeFromEmailType,
  getEmailPreferences,
} from '@/features/email/services/email-preferences-server';

// Subscribe to business notifications
const result = await subscribeToEmailType(
  'user@example.com',
  'business_notifications',
  'user-id',
  'John',
  'Doe'
);

// Get current preferences
const preferences = await getEmailPreferences(
  'user@example.com',
  'newsletter_promotional'
);

// Unsubscribe from newsletter
const unsubscribe = await unsubscribeFromEmailType(
  'user@example.com',
  'newsletter_promotional',
  'user-id'
);
```

## 🗄️ **Database Schema**

### **Email Preferences Table**

```sql
CREATE TABLE email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  email_type TEXT NOT NULL CHECK (email_type IN (
    'newsletter_promotional',
    'newsletter_informational',
    'newsletter_news',
    'business_notifications',
    'overdue_alerts',
    'support',
    'transactional',
    'security',
    'legal'
  )),
  is_active BOOLEAN NOT NULL DEFAULT true,
  first_name TEXT,
  last_name TEXT,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, email_type)
);
```

### **RLS Policies**

```sql
-- Users can view and update their own email preferences
CREATE POLICY "email_preferences_comprehensive_policy" ON email_preferences
  FOR ALL USING (
    current_setting('role') = 'service_role'
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );
```

## 🔄 **Integration Points**

### **Onboarding Integration**

**Automatic Setup:**

- ✅ **Default Preferences** - Business notifications and overdue alerts enabled
- ✅ **Consent Records** - GDPR consent automatically recorded
- ✅ **User Experience** - Seamless onboarding flow

### **Cookie Consent Integration**

**Marketing Consent:**

- ✅ **Newsletter Activation** - Requires marketing cookie consent
- ✅ **Preference Sync** - Cookie consent affects email preferences
- ✅ **Compliance** - Proper consent chain

### **Unsubscribe Integration**

**Unsubscribe Flow:**

- ✅ **Token-Based** - Secure unsubscribe tokens
- ✅ **One-Click** - RFC 8058 compliant
- ✅ **Preference Updates** - Automatically updates preferences

## 📊 **Analytics & Monitoring**

### **User Behavior Tracking**

**Metrics:**

- Email type subscription rates
- Unsubscribe rates by category
- Preference change frequency
- User engagement by email type

### **Compliance Monitoring**

**Audit Trail:**

- All preference changes logged
- Consent status tracking
- GDPR compliance reports
- Data retention monitoring

## 🎯 **Future Enhancements**

### **Planned Features**

- **Bulk Operations** - Select multiple email types at once
- **Scheduled Changes** - Set future preference changes
- **Email Frequency** - Control how often emails are sent
- **Time-Based Preferences** - Different preferences for different times
- **Advanced Analytics** - Detailed preference analytics

### **Integration Ready**

- **Swiss QR-Bill** - Business notification integration
- **Stripe Webhooks** - Payment notification preferences
- **Multi-Language** - Localized email type descriptions
- **Advanced Segmentation** - User-based email preferences

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Email Service
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@paymatch.app
```

### **Email Type Configuration**

```typescript
// Email types are defined in the database schema
// Each type has specific properties:
interface EmailTypeConfig {
  emailType: string;
  category: 'newsletter' | 'business' | 'essential';
  mandatory: boolean;
  requiresConsent: 'marketing' | 'data_processing' | 'none';
  description: string;
  consequence?: string;
}
```

## 📈 **Performance Considerations**

### **Database Optimization**

- **Indexes**: On `email`, `user_id`, and `email_type`
- **RLS Policies**: Optimized for performance
- **Query Patterns**: Efficient preference lookups

### **Caching Strategy**

- **User Preferences**: Cache frequently accessed preferences
- **Email Types**: Static configuration caching
- **Consent Status**: Cache consent decisions

## 🎉 **Key Benefits**

### **For Users**

- ✅ **Granular Control** - 9 distinct email types
- ✅ **Easy Management** - Intuitive interface
- ✅ **Essential Protection** - Cannot disable critical emails
- ✅ **Transparency** - Clear descriptions and consequences

### **For Business**

- ✅ **Compliance** - Full GDPR/FADP compliance
- ✅ **User Satisfaction** - Reduced unsubscribe rates
- ✅ **Audit Trail** - Complete preference history
- ✅ **Flexibility** - Easy to add new email types

### **For Developers**

- ✅ **Type Safety** - Full TypeScript support
- ✅ **Server Actions** - Secure server-side operations
- ✅ **API Design** - RESTful and consistent
- ✅ **Integration** - Easy to integrate with other systems

---

The PayMatch Email Preferences System provides **comprehensive, user-friendly, and compliant** email preference management that balances user control with business needs while maintaining full regulatory compliance.
