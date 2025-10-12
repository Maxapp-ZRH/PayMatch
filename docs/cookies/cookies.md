# PayMatch Cookie Management System

## 🎯 **Overview**

The PayMatch Cookie Management System provides **GDPR/FADP compliant** cookie consent management with **granular control** over different cookie categories. Users can manage their cookie preferences through an intuitive interface while maintaining essential website functionality.

## 🏗️ **System Architecture**

### **Core Components**

#### 1. **Cookie Consent Service** (`src/features/cookies/services/consent-service.ts`)

**Server-Side Operations:**

- `recordConsent()` - Record user consent decisions
- `getConsentStatus()` - Retrieve current consent status
- `generateConsentProof()` - Generate compliance proof
- `recordCookieConsentChange()` - Track preference changes

**Key Features:**

- ✅ **GDPR Compliance** - Full consent management
- ✅ **Audit Trail** - Complete consent history
- ✅ **Expiry Tracking** - 2-year consent expiry for Switzerland FADP
- ✅ **Type Safety** - Full TypeScript support

#### 2. **Cookie Integration Service** (`src/features/email/services/cookie-integration.ts`)

**Client-Side Operations:**

- `getCookiePreferences()` - Get current cookie preferences
- `isMarketingConsentGiven()` - Check marketing consent status
- `handleCookiePreferenceChange()` - Process preference changes

**Features:**

- ✅ **Local Storage** - Client-side preference storage
- ✅ **Marketing Integration** - Newsletter consent validation
- ✅ **Real-Time Updates** - Immediate preference changes

#### 3. **Cookie Components**

**Cookie Banner** (`src/features/cookies/components/CookieBanner.tsx`):

- ✅ **Initial Consent** - First-time user consent
- ✅ **Marketing Design** - Matches PayMatch design language
- ✅ **Granular Control** - Category-specific consent

**Cookie Consent Modal** (`src/features/cookies/components/CookieConsentModal.tsx`):

- ✅ **Detailed Settings** - Full preference management
- ✅ **Category Descriptions** - Clear explanations
- ✅ **Consent Recording** - Audit trail creation

**Cookie Settings Page** (`src/app/[locale]/(legal)/cookie-settings/page.tsx`):

- ✅ **Comprehensive Management** - All cookie categories
- ✅ **Marketing Design** - Teal color scheme
- ✅ **Real-Time Updates** - Immediate preference changes

## 🍪 **Cookie Categories**

### **3 Cookie Categories**

#### **✅ Necessary Cookies** (Always Enabled)

- **Purpose**: Essential website functionality
- **Examples**: Authentication, security, basic functionality
- **Consent**: Not required (legitimate interest)
- **Cannot Be Disabled**: Required for website operation

#### **📊 Analytics Cookies** (Optional)

- **Purpose**: Website analytics and performance monitoring
- **Examples**: Google Analytics, performance metrics, user behavior
- **Consent**: Explicit consent required
- **Can Be Disabled**: User choice

#### **📢 Marketing Cookies** (Optional)

- **Purpose**: Marketing and advertising
- **Examples**: Targeted ads, marketing campaigns, social media
- **Consent**: Explicit consent required
- **Can Be Disabled**: User choice

### **Cookie Type Configuration**

```typescript
interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean; // User choice
  marketing: boolean; // User choice
}

interface ConsentRecord {
  consentType:
    | 'marketing_cookies'
    | 'analytics_cookies'
    | 'data_processing'
    | 'marketing_emails';
  consentGiven: boolean;
  consentMethod:
    | 'cookie_banner'
    | 'newsletter_form'
    | 'account_settings'
    | 'email_link'
    | 'api_request'
    | 'admin_action';
  consentSource: string;
  privacyPolicyVersion: string;
  consentFormVersion: string;
  expiresAt?: Date;
}
```

## 🎨 **User Interface Design**

### **Design Language**

**Marketing-Style Design:**

- **Typography**: `text-xl sm:text-2xl font-medium tracking-tight`
- **Spacing**: `space-y-8` and `p-6 sm:p-8` padding
- **Cards**: `rounded-xl` and `rounded-2xl` corners
- **Colors**: Teal accents (`teal-600`, `teal-500`) for consistency

### **Visual Elements**

#### **Cookie Settings Page**

- **Category Cards**: Clear separation of cookie types
- **Toggle Switches**: Teal-colored switches for optional cookies
- **Descriptions**: Detailed explanations of each category
- **Benefits Lists**: Clear benefits of enabling each category
- **Warnings**: Consequences of disabling cookies

#### **Color Scheme**

- **Teal**: Interactive elements, switches, info boxes
- **Swiss Red**: Primary action buttons
- **Gray**: Text and borders
- **Green**: Success messages
- **Red**: Error messages

## 🔐 **Security & Compliance**

### **GDPR/FADP Compliance**

**Consent Management:**

- ✅ **Explicit Consent** - Clear consent for optional cookies
- ✅ **Granular Control** - Category-specific consent
- ✅ **Easy Withdrawal** - Simple consent withdrawal
- ✅ **Audit Trail** - Complete consent history

**Data Protection:**

- ✅ **Minimal Data** - Only necessary data collected
- ✅ **Purpose Limitation** - Clear purpose for each cookie type
- ✅ **Storage Limitation** - 2-year consent expiry
- ✅ **Transparency** - Clear information about cookies

### **Consent Categories**

**Necessary Cookies:**

- **Legal Basis**: Legitimate interest
- **Consent Required**: No
- **Can Be Disabled**: No

**Analytics Cookies:**

- **Legal Basis**: Explicit consent
- **Consent Required**: Yes
- **Can Be Disabled**: Yes

**Marketing Cookies:**

- **Legal Basis**: Explicit consent
- **Consent Required**: Yes
- **Can Be Disabled**: Yes

## 📊 **Analytics Functionality**

### **Vercel Analytics Integration**

The PayMatch system includes **conditional Vercel Analytics** that respects user consent preferences:

#### **How It Works**

1. **Initial Load**: Analytics are disabled by default
2. **Consent Check**: System checks analytics cookie consent
3. **Conditional Loading**: Vercel Analytics only loads if consent is given
4. **Real-Time Updates**: Analytics enable/disable immediately when consent changes

#### **Technical Implementation**

```typescript
// ConditionalAnalytics component
export function ConditionalAnalytics() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const preferences = CookieEmailIntegrationService.getCookiePreferences();
      const hasConsent = preferences?.analytics === true;
      setAnalyticsEnabled(hasConsent);
    };

    checkConsent();

    // Listen for consent changes
    window.addEventListener('cookieConsentChanged', checkConsent);
  }, []);

  // Only render analytics if consent is given
  if (!analyticsEnabled) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
```

#### **Analytics Features**

**When Enabled:**

- ✅ **Page Views**: Track page navigation and user behavior
- ✅ **Performance Metrics**: Core Web Vitals and speed insights
- ✅ **User Interactions**: Button clicks, form submissions
- ✅ **Error Tracking**: JavaScript errors and performance issues

**When Disabled:**

- ❌ **No Data Collection**: Zero analytics data is collected
- ❌ **No Performance Impact**: Analytics scripts don't load
- ❌ **Privacy Compliant**: Full GDPR/FADP compliance
- ❌ **User Control**: Complete user control over data collection

## 🚀 **Usage Examples**

### **Client-Side Usage**

```typescript
import { CookieEmailIntegrationService } from '@/features/email';

// Get current cookie preferences
const preferences = CookieEmailIntegrationService.getCookiePreferences();
console.log('Analytics enabled:', preferences.analytics);
console.log('Marketing enabled:', preferences.marketing);

// Check marketing consent for newsletter
const hasMarketingConsent =
  CookieEmailIntegrationService.isMarketingConsentGiven();
if (hasMarketingConsent) {
  // User can subscribe to newsletter
  subscribeToNewsletter();
} else {
  // Show cookie consent modal
  showCookieConsentModal();
}

// Handle preference changes
CookieEmailIntegrationService.handleCookiePreferenceChange(
  'analytics',
  true,
  'user-id',
  'user@example.com'
);
```

### **Server-Side Usage**

```typescript
import { ConsentService } from '@/features/cookies/services/consent-service';

// Record cookie consent
const result = await ConsentService.recordConsent({
  email: 'user@example.com',
  userId: 'user-id',
  consentType: 'analytics_cookies',
  consentGiven: true,
  consentMethod: 'cookie_banner',
  consentSource: 'initial_visit',
  privacyPolicyVersion: '1.0',
  consentFormVersion: '1.0',
  userAgent: 'Mozilla/5.0...',
});

// Get consent status
const status = await ConsentService.getConsentStatus('user-id');
console.log(
  'Analytics consent:',
  status.status?.find((s) => s.consentType === 'analytics_cookies')
);

// Generate consent proof
const proof = await ConsentService.generateConsentProof('user-id');
console.log('Consent proof:', proof.proof);
```

## 🗄️ **Database Schema**

### **Consent Records Table**

```sql
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  consent_type TEXT NOT NULL CHECK (consent_type IN (
    'marketing_cookies',
    'analytics_cookies',
    'newsletter_subscription',
    'marketing_emails',
    'data_processing',
    'third_party_sharing'
  )),
  consent_given BOOLEAN NOT NULL,
  consent_method TEXT NOT NULL CHECK (consent_method IN (
    'cookie_banner',
    'newsletter_form',
    'account_settings',
    'email_link',
    'api_request',
    'admin_action'
  )),
  consent_source TEXT,
  privacy_policy_version TEXT,
  consent_form_version TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, consent_type, email)
);
```

### **RLS Policies**

```sql
-- Users can view and update their own consent records
CREATE POLICY "consent_records_user_policy" ON consent_records
  FOR ALL USING (
    current_setting('role') = 'service_role'
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );
```

## 🔄 **Integration Points**

### **Email Preferences Integration**

**Marketing Consent:**

- ✅ **Newsletter Subscription** - Requires marketing cookie consent
- ✅ **Preference Sync** - Cookie consent affects email preferences
- ✅ **Compliance Chain** - Proper consent validation

### **Analytics Integration**

**Conditional Analytics:**

- ✅ **Consent-Based Loading** - Vercel Analytics only loads with consent
- ✅ **Real-Time Control** - Analytics enable/disable immediately when consent changes
- ✅ **Performance Impact** - No analytics tracking without consent
- ✅ **User Control** - Users can disable analytics at any time
- ✅ **Development Testing** - Debug panel available in development mode

### **Onboarding Integration**

**Consent Setup:**

- ✅ **Default Preferences** - Necessary cookies always enabled
- ✅ **User Choice** - Optional cookies require explicit consent
- ✅ **Compliance** - Proper consent recording

## 📊 **Analytics & Monitoring**

### **Consent Analytics**

**Metrics:**

- Consent rates by category
- Consent withdrawal rates
- Consent method preferences
- Geographic consent patterns

### **Compliance Monitoring**

**Audit Trail:**

- All consent decisions logged
- Consent expiry tracking
- GDPR compliance reports
- Data retention monitoring

## 🎯 **Future Enhancements**

### **Planned Features**

- **Advanced Analytics** - Detailed consent analytics
- **Geographic Compliance** - Region-specific consent requirements
- **Consent Renewal** - Automated consent renewal reminders
- **Third-Party Integration** - External consent management
- **A/B Testing** - Consent banner optimization

### **Integration Ready**

- **Swiss FADP** - 2-year consent expiry tracking
- **Multi-Language** - Localized consent text
- **Advanced Segmentation** - User-based consent preferences
- **API Integration** - External consent validation

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Cookie Settings
COOKIE_CONSENT_KEY=paymatch-cookie-consent
CONSENT_EXPIRY_DAYS=730  # 2 years for Switzerland FADP
```

### **Cookie Configuration**

```typescript
// Cookie preferences are stored in localStorage
const COOKIE_CONSENT_KEY = 'paymatch-cookie-consent';

// Default preferences
const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true
  analytics: false, // Default false
  marketing: false, // Default false
};
```

## 📈 **Performance Considerations**

### **Storage Optimization**

- **Local Storage**: Client-side preference storage
- **Database**: Server-side consent records
- **Caching**: Consent status caching

### **Loading Strategy**

- **Conditional Loading**: Analytics only load with consent
- **Performance Impact**: No performance impact without consent
- **User Experience**: Fast loading regardless of consent

## 🎉 **Key Benefits**

### **For Users**

- ✅ **Granular Control** - Category-specific consent
- ✅ **Easy Management** - Intuitive interface
- ✅ **Transparency** - Clear information about cookies
- ✅ **Compliance** - Full GDPR/FADP compliance

### **For Business**

- ✅ **Legal Protection** - Comprehensive consent records
- ✅ **User Trust** - Transparent cookie management
- ✅ **Compliance** - Full regulatory compliance
- ✅ **Audit Trail** - Complete consent history

### **For Developers**

- ✅ **Type Safety** - Full TypeScript support
- ✅ **Integration** - Easy integration with other systems
- ✅ **Performance** - Conditional loading based on consent
- ✅ **Flexibility** - Easy to add new cookie categories

---

The PayMatch Cookie Management System provides **comprehensive, user-friendly, and compliant** cookie consent management that balances user privacy with business needs while maintaining full regulatory compliance.
