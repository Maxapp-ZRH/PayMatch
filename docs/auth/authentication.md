# PayMatch Authentication System

## Overview

PayMatch implements a modern, GDPR-compliant authentication system using Supabase Auth with deferred account creation, smart auto-send logic, and comprehensive security features. The system handles both regular users and pending registrations seamlessly with intelligent flow routing.

## Table of Contents

- [Architecture](#architecture)
- [Authentication Flows](#authentication-flows)
- [Security Features](#security-features)
- [Database Schema](#database-schema)
- [Redis Integration](#redis-integration)
- [Smart Auto-Send Logic](#smart-auto-send-logic)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Current System Features

### ✅ Implemented Features

- **✅ GDPR/FADP Compliant Registration**: No password storage in pending registrations
- **✅ Deferred Account Creation**: Supabase users created only after email verification
- **✅ Smart Auto-Send Logic**: Intelligent email sending based on user flow
- **✅ Hybrid Rate Limiting**: Edge Runtime + Redis-based protection
- **✅ Comprehensive Audit Logging**: Full activity tracking for compliance
- **✅ Consent Management**: Complete consent lifecycle tracking
- **✅ Security Headers**: Production-ready security headers
- **✅ Password Policy**: 8+ chars with complexity requirements
- **✅ Internationalization**: Multi-language support (en-CH, de-CH)
- **✅ Client Information Extraction**: IP, User Agent, Browser Locale tracking
- **✅ Organization-Based Model**: Multi-user organizations with roles
- **✅ Stripe Integration**: Subscription management
- **✅ Email System**: Unified email preferences and unsubscribe
- **✅ Edge Functions**: Automated cleanup and maintenance
- **✅ Row Level Security**: Comprehensive database security

### 🎯 Key Innovations

1. **Edge Runtime Compatibility**: In-memory rate limiting for middleware
2. **Client-Side Information Extraction**: Secure IP/UA extraction without server-side headers
3. **Smart Flow Routing**: Intelligent user guidance based on account status
4. **Comprehensive Compliance**: GDPR + Switzerland FADP compliance
5. **Production-Ready Security**: Security headers, audit logging, rate limiting

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Redis Cache   │    │  Supabase DB    │
│   (Vercel)      │    │   (Vercel)      │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auth Components│    │  Token Storage  │    │  User Data      │
│  - Login        │    │  - Rate Limiting│    │  - Organizations│
│  - Register     │    │  - Password     │    │  - Profiles     │
│  - Password     │    │    Reset Tokens │    │  - Pending      │
│    Reset        │    │  - Session Data │    │    Registrations│
│  - Verify Email │    │  - Auto-Send    │    │  - Email Prefs  │
│  - Set Password │    │    State        │    │  - Newsletter   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture

```
src/features/auth/
├── components/           # UI Components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ForgotPasswordForm.tsx
│   ├── ResetPasswordForm.tsx
│   ├── VerifyEmailForm.tsx
│   └── SetPasswordForm.tsx
├── server/
│   ├── actions/         # Server Actions
│   │   ├── registration.ts
│   │   ├── login.ts
│   │   ├── password-reset.ts
│   │   └── user-operations.ts
│   ├── services/        # External Services
│   │   ├── redis.ts
│   │   ├── rate-limiting.ts
│   │   └── email-service.ts
│   └── utils/           # Utilities
│       ├── user-operations.ts
│       ├── token-operations.ts
│       └── pending-registration.ts
├── schemas/             # Validation Schemas
│   ├── login-schema.ts
│   ├── register-schema.ts
│   └── reset-password-schema.ts
└── helpers/             # Client Helpers
    └── client-auth-helpers.ts
```

## Authentication Flows

### 1. User Registration Flow (GDPR Compliant)

```mermaid
graph TD
    A[User Submits Registration] --> B{Check for Duplicate}
    B -->|Duplicate Found| C[Show Warning + Redirect to Verify]
    B -->|No Duplicate| D[Store Pending Registration<br/>NO PASSWORD STORED]
    D --> E[Send Verification Email]
    E --> F[Redirect to Verify Email Page<br/>with showResend=true]
    F --> G[Auto-Send Verification Email]
    G --> H[User Clicks Email Link]
    H --> I[Verify Token]
    I --> J[User Sets Password]
    J --> K[Create Supabase User]
    K --> L[Create Organization]
    L --> M[Redirect to Login]
```

**Key Features:**

- **GDPR Compliant**: No password storage in pending registrations
- **Deferred Account Creation**: No Supabase user until email verification + password setting
- **Smart Auto-Send**: Only auto-sends when coming from registration flow
- **Duplicate Prevention**: Prevents multiple registrations with same email
- **Automatic Cleanup**: Expired registrations cleaned up every 6 hours
- **Rate Limiting**: Prevents abuse of registration endpoint

### 2. User Login Flow

```mermaid
graph TD
    A[User Submits Login] --> B[Attempt Supabase Login]
    B --> C{Login Successful?}
    C -->|No| D{Check Pending Registration}
    D -->|Found| E[Redirect to Verify Email<br/>NO AUTO-SEND]
    D -->|Not Found| F[Show Generic Error]
    C -->|Yes| G{User Has Organization?}
    G -->|No| H[Redirect to Onboarding]
    G -->|Yes| I{Onboarding Complete?}
    I -->|No| J[Redirect to Onboarding]
    I -->|Yes| K[Redirect to Dashboard]
```

**Key Features:**

- **Smart Redirects**: Pending users guided to verification without auto-send
- **Organization Validation**: Ensures proper account setup
- **Onboarding Check**: Guides users through setup process
- **Error Handling**: Graceful fallbacks for all scenarios

### 3. Password Reset Flow

```mermaid
graph TD
    A[User Requests Password Reset] --> B{Check User Type}
    B -->|Regular User| C[Send Regular Reset Email]
    B -->|Pending User| D[Redirect to Verify Email<br/>with pendingPasswordReset=true]
    B -->|No User| E[Send Generic Success Message]
    C --> F[User Clicks Reset Link]
    D --> G[User Clicks Resend Button]
    F --> H{Token Valid?}
    G --> I[Resend Verification Email]
    H -->|No| J[Show Error Message]
    H -->|Yes| K[Update Supabase Password]
    I --> L[User Clicks Email Link]
    K --> M[Redirect to Login]
    L --> N[User Sets Password]
    N --> O[Create Supabase User]
    O --> P[Create Organization]
    P --> Q[Redirect to Login]
```

**Key Features:**

- **Smart Routing**: Pending users redirected to verify-email page
- **No Auto-Send**: Users control when to resend verification
- **Token Security**: Redis-based storage with TTL
- **No User Enumeration**: Same response for all email requests

### 4. Email Verification Flow

```mermaid
graph TD
    A[User Lands on Verify Email] --> B{Coming from Registration?}
    B -->|Yes| C[Auto-Send Verification Email]
    B -->|No| D[Show Manual Resend Button]
    C --> E[User Clicks Email Link]
    D --> F[User Clicks Resend Button]
    E --> G[Verify Token]
    F --> H[Resend Verification Email]
    G --> I[User Sets Password]
    H --> I
    I --> J[Create Supabase User]
    J --> K[Create Organization]
    K --> L[Redirect to Login]
```

**Key Features:**

- **Smart Auto-Send**: Only auto-sends from registration flow
- **Manual Control**: Users control resend in other flows
- **Password Collection**: Secure password setting during verification
- **60-Second Cooldown**: Prevents spam resends

## Security Features

### 1. GDPR Compliance

- **No Password Storage**: Passwords not stored in pending registrations
- **Data Minimization**: Only essential data stored temporarily
- **Automatic Cleanup**: Expired data automatically removed
- **User Control**: Users can control their data

### 2. Password Security

- **Supabase Hashing**: Supabase handles password hashing automatically
- **Requirements**: Minimum 8 characters with complexity validation
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&\*()\_+-=[]{}|;':",./<>?)
- **No Plain Text**: Passwords never stored in plain text
- **Secure Collection**: Passwords collected only during verification
- **Frontend Validation**: Real-time password strength indicator with requirements display

### 3. Token Management

- **Redis Storage**: All tokens stored in Redis with automatic TTL
- **URL-Safe Tokens**: Base64url encoded tokens for better URL compatibility
- **Unique Tokens**: Cryptographically secure random tokens
- **Expiration**: Tokens expire after 1 hour (configurable)
- **Cleanup**: Automatic cleanup of expired tokens

### 4. Rate Limiting

- **Edge Runtime Compatible**: In-memory rate limiting for middleware (Edge Runtime)
- **Redis-Based**: Full Redis rate limiting for server actions (Node.js Runtime)
- **Multiple Endpoints**: Registration, login, password reset all rate limited
- **IP-Based Limits**:
  - Login: 10 requests per 15 minutes
  - Registration: 5 requests per hour
  - Password Reset: 3 requests per hour
- **Configurable**: Limits can be adjusted in middleware and server actions
- **Fail-Open**: System continues working even if Redis is unavailable

### 5. Input Validation

- **Zod Schemas**: All inputs validated with Zod schemas
- **Type Safety**: Full TypeScript coverage
- **Sanitization**: Input sanitization and validation
- **Error Messages**: User-friendly error messages
- **Client-Side Validation**: Real-time validation with password strength indicators

### 6. Security Headers

- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: camera=(), microphone=(), geolocation=()

### 7. Error Handling

- **No Information Leakage**: Generic error messages for security
- **Graceful Degradation**: System continues working even with errors
- **Comprehensive Logging**: Detailed logging for debugging
- **User-Friendly Messages**: Clear, actionable error messages

## Database Schema

### Core Tables

#### `pending_registrations` (GDPR Compliant)

```sql
CREATE TABLE pending_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  user_metadata JSONB DEFAULT '{}',
  verification_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**

- **No Password Storage**: Passwords not stored (GDPR compliant)
- **Metadata Storage**: Referral source, browser locale in user_metadata
- **Automatic Cleanup**: Expired records cleaned up every 6 hours via Edge Function
- **Unique Constraints**: Prevents duplicate registrations
- **Client Information**: IP address and user agent stored for audit purposes

#### `organizations`

```sql
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
  uid TEXT, -- Swiss business ID
  logo_url TEXT,
  default_language TEXT DEFAULT 'de',
  default_currency TEXT DEFAULT 'CHF',
  default_vat_rates JSONB DEFAULT '[]'::jsonb,
  default_payment_terms_days INT DEFAULT 30,
  iban TEXT,
  qr_iban TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'freelancer', 'business', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `user_profiles`

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `organization_users`

```sql
CREATE TABLE organization_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'accountant', 'staff')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);
```

#### `email_preferences`

```sql
CREATE TABLE email_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN (
    'newsletter_promotional',
    'newsletter_informational',
    'newsletter_news',
    'support',
    'transactional',
    'security',
    'legal',
    'business_notifications',
    'overdue_alerts'
  )),
  is_active BOOLEAN DEFAULT true NOT NULL,
  first_name TEXT,
  last_name TEXT,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(email, email_type)
);
```

#### `consent_records` (GDPR/FADP Compliance)

```sql
CREATE TABLE consent_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  session_id TEXT,
  consent_type TEXT NOT NULL CHECK (consent_type IN (
    'marketing_cookies',
    'analytics_cookies',
    'newsletter_subscription',
    'marketing_emails',
    'data_processing',
    'third_party_sharing'
  )),
  consent_given BOOLEAN NOT NULL,
  consent_withdrawn BOOLEAN DEFAULT false,
  consent_method TEXT NOT NULL CHECK (consent_method IN (
    'cookie_banner',
    'newsletter_form',
    'account_settings',
    'email_link',
    'api_request',
    'admin_action'
  )),
  privacy_policy_version TEXT,
  consent_form_version TEXT,
  ip_address INET,
  user_agent TEXT,
  consent_given_at TIMESTAMPTZ,
  consent_withdrawn_at TIMESTAMPTZ,
  consent_source TEXT,
  consent_context JSONB,
  withdrawal_reason TEXT,
  consent_age_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, consent_type, email)
);
```

#### `audit_logs` (Security & Compliance)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  ip_address INET,
  user_agent TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'error')),
  error_message TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

All tables have optimized RLS policies ensuring users can only access their own data:

```sql
-- Optimized RLS policy example
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING ((SELECT auth.uid()) = id);
```

**Key Features:**

- **Performance Optimized**: Uses `(SELECT auth.uid())` to prevent re-evaluation
- **Comprehensive Coverage**: All tables protected with appropriate policies
- **Service Role Access**: Admin functions use service role for privileged operations

## Redis Integration

### Architecture

The system uses a **hybrid approach** for rate limiting:

- **Edge Runtime (Middleware)**: In-memory rate limiting for immediate protection
- **Node.js Runtime (Server Actions)**: Full Redis-based rate limiting for comprehensive tracking

### Key Patterns

#### Rate Limiting (Redis)

```
rate_limit:IP_LOGIN_ATTEMPTS:192.168.1.1
rate_limit:IP_REGISTRATION_ATTEMPTS:192.168.1.1
rate_limit:IP_PASSWORD_RESET_ATTEMPTS:192.168.1.1
```

#### Session Management (Redis)

```
session:USER_ID:session_data
session_timeout:USER_ID:last_activity
```

#### Auto-Send State

```
paymatch-auto-sent-user@example.com
```

### Configuration

```typescript
// Edge Runtime (Middleware) - In-memory
const edgeRateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

const rateLimitConfig = {
  '/login': { maxRequests: 10, windowMs: 15 * 60 * 1000 },
  '/register': { maxRequests: 5, windowMs: 60 * 60 * 1000 },
  '/forgot-password': { maxRequests: 3, windowMs: 60 * 60 * 1000 },
};

// Node.js Runtime (Server Actions) - Redis
export const REDIS_CONFIG = {
  url: process.env.REDIS_URL!,
  password: process.env.REDIS_PASSWORD,
  keyPrefixes: {
    RATE_LIMIT: 'rate_limit',
    SESSION: 'session',
    SESSION_TIMEOUT: 'session_timeout',
    AUTO_SEND: 'paymatch-auto-sent',
  },
  rateLimits: {
    IP_LOGIN_ATTEMPTS: { maxAttempts: 10, windowMs: 15 * 60 * 1000 },
    IP_REGISTRATION_ATTEMPTS: { maxAttempts: 5, windowMs: 60 * 60 * 1000 },
    IP_PASSWORD_RESET_ATTEMPTS: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
  },
};
```

## Smart Auto-Send Logic

### When Auto-Send Happens

#### ✅ WILL Auto-Send:

- **Registration Flow**: `register` → `verify-email?email=...&showResend=true`
  - User completes registration form
  - Gets redirected to verify-email page with `showResend=true`
  - **Auto-sends verification email immediately** (natural next step)

#### ❌ WON'T Auto-Send:

- **Login Flow**: `login` → `verify-email?email=...&showResend=true` (pending registration)
  - User tries to login with unverified account
  - Gets redirected to verify-email page
  - **No auto-send** - user can manually resend if needed

- **Forgot Password Flow**: `forgot-password` → `verify-email?email=...&showResend=true&pendingPasswordReset=true`
  - User requests password reset for pending registration
  - Gets redirected to verify-email page
  - **No auto-send** - user can manually resend if needed

- **Direct Access**: User navigates directly to `/verify-email`
  - **No auto-send** - user must manually enter email and resend

### Technical Implementation

```typescript
// Only auto-send if:
// 1. We have showResend=true (indicating coming from registration)
// 2. User is not verified
// 3. We have an email
// 4. We haven't already auto-sent
// 5. We're not currently auto-sending
const shouldAutoSend =
  showResend && !isVerified && currentEmail && !hasAutoSent && !isAutoSending;
```

### Benefits

- **Better UX**: Only sends emails when expected
- **Less Spam**: Users won't get duplicate emails
- **Modern Standard**: Follows industry best practices
- **User Control**: Users can choose when to resend in non-registration flows

## API Endpoints

### Authentication Endpoints

#### Server Actions (Next.js App Router)

The system uses **Server Actions** instead of traditional API endpoints for better security and performance.

#### `registerUser` Server Action

Register a new user with deferred account creation.

**Request:**

```typescript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  referralSource: "google",
  browserLocale: "en-CH",
  clientIP: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

**Response:**

```typescript
{
  success: true,
  message: "Registration successful! Please check your email to verify your account and set your password."
}
```

#### `loginUser` Server Action

Authenticate an existing user.

**Request:**

```typescript
{
  email: "john@example.com",
  password: "SecurePass123!",
  rememberMe: true
}
```

**Response:**

```typescript
{
  success: true,
  user: { id: "uuid", email: "john@example.com" },
  redirect: "/dashboard"
}
```

#### `sendPasswordResetEmail` Server Action

Request password reset for any user type.

**Request:**

```typescript
{
  email: "john@example.com",
  clientIP: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

**Response:**

```typescript
{
  success: true,
  message: "If an account with that email exists, we've sent a password reset link."
}
```

### Page Routes

#### `/[locale]/register`

Registration page with duplicate prevention and no password collection.

- Supports internationalization (en-CH, de-CH)
- Client-side information extraction (IP, User Agent, Browser Locale)

#### `/[locale]/login`

Login page with smart redirects for pending users.

- Supports internationalization (en-CH, de-CH)
- Smart routing based on user status

#### `/[locale]/verify-email`

Email verification page with smart auto-send logic and resend functionality.

- Auto-send only from registration flow
- Manual resend with 60-second cooldown

#### `/[locale]/forgot-password`

Password reset request page with smart routing for pending users.

- Client-side information extraction
- Smart routing for different user types

#### `/[locale]/reset-password?token=TOKEN`

Password reset form for existing users only.

- Password strength validation
- Real-time requirements display

## Error Handling

### Error Types

#### Authentication Errors

- `INVALID_CREDENTIALS`: Wrong email/password
- `EMAIL_NOT_VERIFIED`: User exists but email not verified
- `ACCOUNT_LOCKED`: Account temporarily locked
- `RATE_LIMIT_EXCEEDED`: Too many attempts

#### Validation Errors

- `INVALID_EMAIL`: Malformed email address
- `WEAK_PASSWORD`: Password doesn't meet requirements
- `MISSING_FIELDS`: Required fields not provided

#### System Errors

- `DATABASE_ERROR`: Database connection issues
- `REDIS_ERROR`: Redis connection issues
- `EMAIL_ERROR`: Email service failures

### Error Response Format

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "User-friendly error message",
  "details": "Technical details for debugging"
}
```

## Testing

### Manual Testing

#### Registration Flow

```bash
# Test normal registration
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "firstName": "Test", "lastName": "User"}'

# Test duplicate registration
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "firstName": "Test", "lastName": "User"}'
```

#### Login Flow

```bash
# Test login with pending registration
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!"}'
```

#### Password Reset Flow

```bash
# Test password reset
curl -X POST "http://localhost:3000/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Automated Testing

#### Test Script

```bash
#!/bin/bash
# test-auth.sh

BASE_URL="http://localhost:3000"
EMAIL="test@example.com"

echo "Testing Registration..."
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"firstName\": \"Test\", \"lastName\": \"User\"}"

echo -e "\n\nTesting Duplicate Registration..."
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"firstName\": \"Test\", \"lastName\": \"User\"}"

echo -e "\n\nTesting Login with Pending Registration..."
curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"Test123!\"}"

echo -e "\n\nTesting Password Reset..."
curl -X POST "$BASE_URL/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}"
```

### Edge Case Testing

#### Database Testing

```sql
-- Check pending registrations
SELECT * FROM pending_registrations ORDER BY created_at DESC;

-- Check Redis keys
redis-cli KEYS "*password_reset*"
redis-cli KEYS "*rate_limit*"
redis-cli KEYS "*paymatch-auto-sent*"
```

#### Rate Limiting Testing

```bash
# Test rate limiting
for i in {1..10}; do
  curl -X POST "http://localhost:3000/api/auth/forgot-password" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"test$i@example.com\"}" &
done
wait
```

## Deployment

### Environment Variables

#### Vercel (Required)

```bash
# Redis Configuration
REDIS_URL=redis://...
REDIS_PASSWORD=...

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=noreply@paymatch.app
RESEND_FROM_NAME=PayMatch

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Support Configuration
SUPPORT_EMAIL=support@paymatch.app
```

#### Supabase Edge Functions (Automatic)

```bash
# These are automatically available
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Deployment Steps

1. **Deploy to Vercel**

   ```bash
   vercel --prod
   ```

2. **Deploy Edge Functions**

   ```bash
   supabase functions deploy cleanup-expired-registrations
   supabase functions deploy cleanup-audit-logs
   supabase functions deploy cleanup-sessions
   ```

3. **Apply Database Migrations**

   ```bash
   supabase db push
   ```

4. **Verify Deployment**

   ```bash
   # Test cleanup functions
   curl -X POST "https://your-project.supabase.co/functions/v1/cleanup-expired-registrations" \
     -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"

   curl -X POST "https://your-project.supabase.co/functions/v1/cleanup-audit-logs" \
     -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"

   curl -X POST "https://your-project.supabase.co/functions/v1/cleanup-sessions" \
     -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
   ```

## Troubleshooting

### Common Issues

#### 1. "Invalid Refresh Token" Error

**Cause:** Session expired or invalid
**Solution:** Clear browser storage and re-login

#### 2. "User Already Exists" Error

**Cause:** Duplicate registration attempt
**Solution:** Check for pending registrations, redirect to verify-email

#### 3. "Rate Limit Exceeded" Error

**Cause:** Too many requests in short time
**Solution:** Wait for rate limit window to reset

#### 4. Redis Connection Error

**Cause:** Redis service unavailable
**Solution:** Check Redis configuration and connectivity

#### 5. Email Not Sending

**Cause:** Email service configuration issue
**Solution:** Check Resend API key and configuration

#### 6. Duplicate Email Sends

**Cause:** Auto-send logic triggered multiple times
**Solution:** Check sessionStorage flags and auto-send state

### Debugging

#### Check Logs

```bash
# Vercel logs
vercel logs

# Supabase logs
supabase functions logs cleanup-expired-registrations
```

#### Database Queries

```sql
-- Check pending registrations
SELECT email, created_at, expires_at,
  CASE
    WHEN expires_at < NOW() THEN 'EXPIRED'
    ELSE 'VALID'
  END as status
FROM pending_registrations
ORDER BY created_at DESC;

-- Check user profiles
SELECT up.*, o.name as org_name
FROM user_profiles up
LEFT JOIN organizations o ON up.organization_id = o.id
ORDER BY up.created_at DESC;
```

#### Redis Inspection

```bash
# Check Redis keys
redis-cli KEYS "*"

# Check specific patterns
redis-cli KEYS "*password_reset*"
redis-cli KEYS "*rate_limit*"
redis-cli KEYS "*paymatch-auto-sent*"

# Check TTL
redis-cli TTL "password_reset:TOKEN_HASH"
```

### Performance Monitoring

#### Key Metrics

- **Registration Success Rate**: Should be > 95%
- **Login Success Rate**: Should be > 98%
- **Password Reset Success Rate**: Should be > 90%
- **Email Delivery Rate**: Should be > 99%
- **Rate Limit Hit Rate**: Should be < 5%
- **Auto-Send Accuracy**: Should be 100% (only from registration)

#### Monitoring Queries

```sql
-- Registration success rate
SELECT
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN success = true THEN 1 END) as successful,
  ROUND(COUNT(CASE WHEN success = true THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
FROM registration_attempts
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Pending registration cleanup
SELECT
  COUNT(*) as total_pending,
  COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expired
FROM pending_registrations;
```

## Security Considerations

### Best Practices

1. **Never Log Sensitive Data**: Passwords, tokens, and personal information
2. **Use HTTPS**: All communication must be encrypted
3. **Validate All Inputs**: Use Zod schemas for validation
4. **Rate Limit Everything**: Prevent abuse of all endpoints
5. **Monitor for Anomalies**: Set up alerts for unusual patterns
6. **Regular Security Audits**: Review code and dependencies regularly
7. **GDPR Compliance**: Follow data protection regulations

### Compliance

- **GDPR**: User data handling and deletion
- **Switzerland FADP**: Local data protection requirements with consent tracking
- **PCI DSS**: If handling payment data (future)
- **Audit Logging**: Comprehensive activity tracking for compliance
- **Consent Management**: Full consent lifecycle tracking with withdrawal capabilities

## Future Enhancements

### Planned Features

1. **Multi-Factor Authentication**: TOTP and SMS support
2. **Social Login**: Google, Apple, Microsoft integration
3. **Advanced Rate Limiting**: Device-based and behavioral limits
4. **Advanced Session Management**: Device tracking and remote logout
5. **Account Recovery**: Advanced recovery options
6. **Biometric Authentication**: Fingerprint and face recognition
7. **Advanced Audit Logging**: Real-time monitoring and alerting

### Scalability Considerations

1. **Redis Clustering**: For high-availability Redis
2. **Database Sharding**: For large user bases
3. **CDN Integration**: For global performance
4. **Microservices**: Split authentication into separate services

---

## Support

For technical support or questions about the authentication system:

1. **Check this documentation** for common issues
2. **Review logs** for error details
3. **Test with provided scripts** for debugging
4. **Contact the development team** for complex issues

---

_Last updated: October 2025_
_Version: 3.0.0_
