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
- **Requirements**: Minimum 6 characters with complexity validation
- **No Plain Text**: Passwords never stored in plain text
- **Secure Collection**: Passwords collected only during verification

### 3. Token Management

- **Redis Storage**: All tokens stored in Redis with automatic TTL
- **URL-Safe Tokens**: Base64url encoded tokens for better URL compatibility
- **Unique Tokens**: Cryptographically secure random tokens
- **Expiration**: Tokens expire after 1 hour (configurable)
- **Cleanup**: Automatic cleanup of expired tokens

### 4. Rate Limiting

- **Per-User Limits**: Rate limiting applied per email address
- **Multiple Endpoints**: Registration, login, password reset all rate limited
- **Redis-Based**: Distributed rate limiting using Redis
- **Configurable**: Limits can be adjusted in `redis-config.ts`
- **Fail-Open**: System continues working even if Redis is unavailable

### 5. Input Validation

- **Zod Schemas**: All inputs validated with Zod schemas
- **Type Safety**: Full TypeScript coverage
- **Sanitization**: Input sanitization and validation
- **Error Messages**: User-friendly error messages

### 6. Error Handling

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
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  verification_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  user_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Features:**

- **No Password Storage**: Passwords not stored (GDPR compliant)
- **Metadata Storage**: Referral source, browser locale in user_metadata
- **Automatic Cleanup**: Expired records cleaned up every 6 hours
- **Unique Constraints**: Prevents duplicate registrations

#### `organizations`

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_profiles`

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `email_preferences`

```sql
CREATE TABLE email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  newsletter BOOLEAN DEFAULT TRUE,
  marketing BOOLEAN DEFAULT FALSE,
  transactional BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `newsletter_subscribers`

```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE NULL,
  source VARCHAR(100) DEFAULT 'website'
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

### Key Patterns

#### Rate Limiting

```
rate_limit:EMAIL_VERIFICATION:user@example.com
rate_limit:PASSWORD_RESET:user@example.com
rate_limit:REGISTRATION:user@example.com
```

#### Token Storage

```
password_reset:TOKEN_HASH
```

#### Auto-Send State

```
paymatch-auto-sent-user@example.com
```

### Configuration

```typescript
// redis-config.ts
export const REDIS_CONFIG = {
  url: process.env.REDIS_URL!,
  password: process.env.REDIS_PASSWORD,
  keyPrefixes: {
    RATE_LIMIT: 'rate_limit',
    PASSWORD_RESET: 'password_reset',
    AUTO_SEND: 'paymatch-auto-sent',
  },
  rateLimits: {
    EMAIL_VERIFICATION: { maxAttempts: 5, windowMs: 3600000 }, // 5 per hour
    PASSWORD_RESET: { maxAttempts: 3, windowMs: 3600000 }, // 3 per hour
    REGISTRATION: { maxAttempts: 10, windowMs: 3600000 }, // 10 per hour
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

#### POST `/api/auth/register`

Register a new user with deferred account creation.

**Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "referralSource": "google",
  "browserLocale": "en-CH"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account and set your password."
}
```

#### POST `/api/auth/login`

Authenticate an existing user.

**Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "user": { "id": "uuid", "email": "john@example.com" },
  "redirect": "/dashboard"
}
```

#### POST `/api/auth/forgot-password`

Request password reset for any user type.

**Request:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "If an account with that email exists, we've sent a password reset link."
}
```

### Page Routes

#### `/register`

Registration page with duplicate prevention and no password collection.

#### `/login`

Login page with smart redirects for pending users.

#### `/verify-email`

Email verification page with smart auto-send logic and resend functionality.

#### `/forgot-password`

Password reset request page with smart routing for pending users.

#### `/reset-password?token=TOKEN`

Password reset form for existing users only.

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

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
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
   ```

3. **Apply Database Migrations**

   ```bash
   supabase db push
   ```

4. **Verify Deployment**
   ```bash
   # Test cleanup function
   curl -X POST "https://your-project.supabase.co/functions/v1/cleanup-expired-registrations" \
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
- **Swiss Data Protection**: Local data protection requirements
- **PCI DSS**: If handling payment data (future)

## Future Enhancements

### Planned Features

1. **Multi-Factor Authentication**: TOTP and SMS support
2. **Social Login**: Google, Apple, Microsoft integration
3. **Advanced Rate Limiting**: IP-based and device-based limits
4. **Audit Logging**: Comprehensive activity tracking
5. **Account Recovery**: Advanced recovery options
6. **Session Management**: Advanced session controls
7. **Biometric Authentication**: Fingerprint and face recognition

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

_Last updated: January 2025_
_Version: 2.0.0_
