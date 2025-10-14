# PayMatch Authentication System

## Overview

PayMatch implements a modern, GDPR-compliant authentication system using Supabase Auth with a unified session management architecture. The system provides multiple authentication methods including password-based login, magic link authentication, and comprehensive session management with automatic refresh and error handling. Built with Next.js 15 App Router, it offers a seamless user experience with built-in email verification, password reset, and organization-based access control.

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

- **✅ Supabase Auth Integration**: Native authentication with multiple login methods
- **✅ Unified Session Management**: Client and server-side session handling with automatic refresh
- **✅ Magic Link Authentication**: Passwordless login with secure email verification
- **✅ Password-Based Login**: Traditional email/password authentication with Remember Me
- **✅ Built-in Password Reset**: Supabase native password reset flow with custom email templates
- **✅ Hybrid Rate Limiting**: Supabase Auth + Redis for app-level protection
- **✅ Comprehensive Audit Logging**: Full activity tracking for compliance and security
- **✅ Session Provider Pattern**: React Context-based session management
- **✅ Security Headers**: Production-ready security headers and middleware
- **✅ Password Policy**: 8+ chars with complexity requirements and real-time validation
- **✅ Internationalization**: Multi-language support (en-CH, de-CH)
- **✅ Client Information Extraction**: IP, User Agent, Browser Locale tracking
- **✅ Organization-Based Model**: Multi-user organizations with role-based access control
- **✅ Stripe Integration**: Subscription management and billing
- **✅ Email System**: Unified email preferences and unsubscribe with Resend integration
- **✅ Row Level Security**: Comprehensive database security with optimized RLS policies
- **✅ Type Safety**: Full TypeScript coverage with generated database types
- **✅ Form Validation**: Zod schemas for client and server-side validation

### 🎯 Key Innovations

1. **Unified Session Management**: Client and server-side session handling with consistent APIs
2. **Multiple Authentication Methods**: Password-based and magic link authentication in one system
3. **React Context Integration**: Seamless session state management across components
4. **Type-Safe Architecture**: Full TypeScript coverage with generated database types
5. **Hybrid Rate Limiting**: Supabase Auth for authentication, Redis for app features
6. **Comprehensive Compliance**: GDPR + Switzerland FADP compliance with audit logging
7. **Server Actions Pattern**: Modern Next.js 15 server actions instead of traditional API routes

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Redis Cache   │    │  Supabase Auth  │
│   (Vercel)      │    │   (Vercel)      │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auth Components│    │  App-Level      │    │  Auth Services  │
│  - Login        │    │  Rate Limiting  │    │  - JWT Tokens   │
│  - Register     │    │  - API Calls    │    │  - Magic Links  │
│  - Password     │    │  - File Uploads │    │  - Email Verify │
│    Reset        │    │  - Email Sending│    │  - Password     │
│  - Verify Email │    │  - Caching      │    │    Reset        │
│  - Dashboard    │    │  - Audit Logs   │    │  - Session Mgmt │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture

```
src/features/auth/
├── components/           # UI Components
│   ├── LoginForm.tsx              # Password-based login with Remember Me
│   ├── MagicLinkLoginForm.tsx     # Passwordless magic link login
│   ├── RegisterForm.tsx           # User registration with validation
│   ├── ForgotPasswordForm.tsx     # Password reset request
│   ├── ResetPasswordForm.tsx      # Password reset form
│   ├── VerifyEmailForm.tsx        # Email verification
│   ├── SessionProvider.tsx        # React Context session provider
│   └── index.ts                   # Component exports
├── hooks/               # Custom Hooks
│   └── use-session.ts             # Unified session management hook
├── server/
│   ├── actions/         # Server Actions (Next.js 15)
│   │   ├── auth.ts               # Core auth operations (logout)
│   │   ├── login.ts              # Login utilities and checks
│   │   ├── magic-link-login.ts   # Magic link authentication
│   │   ├── password-reset.ts     # Password reset flow
│   │   ├── registration.ts       # User registration
│   │   └── index.ts              # Action exports
│   ├── helpers/         # Server Helpers
│   │   ├── session.ts            # Server session management
│   │   └── index.ts              # Helper exports
│   ├── services/        # External Services
│   │   ├── audit-logging.ts      # Comprehensive audit logging
│   │   ├── cache.ts              # Redis caching service
│   │   ├── redis.ts              # Redis client and operations
│   │   ├── app-rate-limiting.ts  # App-level rate limiting
│   │   └── index.ts              # Service exports
│   └── utils/           # Server Utilities
│       ├── client-ip.ts          # Client IP extraction
│       └── user-operations.ts   # User data operations
├── schemas/             # Validation Schemas (Zod)
│   ├── login-schema.ts           # Login form validation
│   ├── register-schema.ts        # Registration form validation
│   ├── reset-password-schema.ts  # Password reset validation
│   └── index.ts                  # Schema exports
├── types/               # Type Definitions
│   └── session.ts                # Session and user types
├── helpers/             # Client Helpers
│   └── auth-helpers.ts           # Client-side auth utilities
└── index.ts             # Feature exports
```

## Authentication Flows

### 1. User Registration Flow (Supabase Auth)

```mermaid
graph TD
    A[User Submits Registration] --> B{Check for Duplicate}
    B -->|Duplicate Found| C[Show Warning + Redirect to Login]
    B -->|No Duplicate| D[Create Supabase User<br/>email_confirm: false]
    D --> E[Supabase Sends Verification Email]
    E --> F[User Clicks Magic Link]
    F --> G[Supabase Verifies Email]
    G --> H[User Redirected to Dashboard]
    H --> I[Create Organization]
    I --> J[Complete Onboarding]
```

**Key Features:**

- **Supabase Native**: Uses Supabase Auth's built-in user creation
- **Magic Link Verification**: Secure email verification via Supabase
- **Automatic Email**: Supabase handles email sending with Resend SMTP
- **JWT Sessions**: Automatic session management with token refresh
- **Rate Limiting**: Supabase handles authentication rate limiting
- **No Custom Tokens**: No need for custom token management

### 2. User Login Flow (Multiple Methods)

```mermaid
graph TD
    A[User Chooses Login Method] --> B{Login Type}
    B -->|Password| C[Password Login Form]
    B -->|Magic Link| D[Magic Link Form]

    C --> E[Supabase Auth Login]
    E --> F{Login Successful?}
    F -->|No| G[Show Error Message]
    F -->|Yes| H[Check Email Verification]

    D --> I[Send Magic Link Email]
    I --> J[User Clicks Magic Link]
    J --> K[Verify Magic Link Token]
    K --> L{Verification Successful?}
    L -->|No| M[Show Error Message]
    L -->|Yes| H

    H --> N{Email Verified?}
    N -->|No| O[Redirect to Verify Email]
    N -->|Yes| P{User Has Organization?}
    P -->|No| Q[Redirect to Onboarding]
    P -->|Yes| R{Onboarding Complete?}
    R -->|No| S[Redirect to Onboarding]
    R -->|Yes| T[Redirect to Dashboard]
```

**Key Features:**

- **Multiple Login Methods**: Password-based and magic link authentication
- **Unified Session Management**: Consistent session handling across methods
- **Remember Me**: Persistent sessions for password-based login
- **JWT Sessions**: Automatic session management with refresh tokens
- **Email Verification Check**: Ensures user has verified their email
- **Organization Validation**: Ensures proper account setup
- **Onboarding Check**: Guides users through setup process

### 3. Password Reset Flow

```mermaid
graph TD
    A[User Requests Password Reset] --> B[Supabase Generate Magic Link]
    B --> C[Supabase Sends Reset Email]
    C --> D[User Clicks Magic Link]
    D --> E[Supabase Verifies Link]
    E --> F[User Redirected to Reset Page]
    F --> G[User Sets New Password]
    G --> H[Supabase Updates Password]
    H --> I[User Redirected to Dashboard]
```

**Key Features:**

- **Supabase Magic Links**: Uses Supabase's built-in password reset
- **Automatic Email**: Supabase handles email sending with Resend SMTP
- **Secure Verification**: Magic links are cryptographically secure
- **JWT Sessions**: User is authenticated after password reset
- **No Custom Tokens**: No need for custom token management

### 4. Email Verification Flow

```mermaid
graph TD
    A[User Clicks Magic Link] --> B[Supabase Verifies Link]
    B --> C{Verification Successful?}
    C -->|No| D[Show Error Message]
    C -->|Yes| E[User Redirected to Dashboard]
    E --> F{User Has Organization?}
    F -->|No| G[Redirect to Onboarding]
    F -->|Yes| H[Continue to Dashboard]
```

**Key Features:**

- **Supabase Magic Links**: Uses Supabase's built-in email verification
- **Automatic Verification**: No custom token management needed
- **JWT Sessions**: User is automatically authenticated after verification
- **Secure Process**: Magic links are cryptographically secure
- **No Manual Resend**: Supabase handles resend functionality

### 5. Unified Session Management

```mermaid
graph TD
    A[Session Initialization] --> B{Client or Server?}
    B -->|Client| C[useSession Hook]
    B -->|Server| D[getServerSession Helper]

    C --> E[React Context Provider]
    E --> F[Session State Management]
    F --> G[Automatic Refresh]
    G --> H[Auth State Changes]

    D --> I[Server Session Validation]
    I --> J[Extended User Data]
    J --> K[Organization Check]
    K --> L[Onboarding Check]

    H --> M[Session Update]
    M --> N[Component Re-render]

    L --> O[Redirect Logic]
    O --> P[Page Navigation]
```

**Key Features:**

- **Unified API**: Consistent session management across client and server
- **React Context**: Seamless state management across components
- **Automatic Refresh**: Session tokens refreshed automatically
- **Extended User Data**: Profile and organization data included
- **Validation Options**: Configurable session requirements
- **Error Handling**: Comprehensive error states and recovery
- **Type Safety**: Full TypeScript coverage with generated types

## Security Features

### 1. GDPR Compliance

- **Supabase Auth Compliance**: Supabase handles GDPR compliance for authentication
- **Data Minimization**: Only essential data stored in user metadata
- **Automatic Cleanup**: Supabase handles data retention policies
- **User Control**: Users can control their data through Supabase Auth

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

### 3. Session Management

- **JWT Tokens**: Supabase handles JWT token generation and validation
- **Automatic Refresh**: Tokens are automatically refreshed before expiry
- **Secure Storage**: Tokens stored securely in HTTP-only cookies
- **Session Timeout**: Configurable session timeout in Supabase config
- **No Custom Tokens**: No need for custom token management

### 4. Rate Limiting

- **Supabase Auth Rate Limiting**: Built-in rate limiting for authentication operations
- **Redis-Based App Limits**: Custom rate limiting for app-level features
- **Hybrid Approach**: Supabase handles auth, Redis handles app features
- **IP-Based Limits** (Redis):
  - API Calls: 100 requests per minute
  - File Uploads: 10 requests per hour
  - Email Sending: 20 requests per minute
- **Configurable**: Limits can be adjusted in Supabase config and Redis config
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

#### `auth.users` (Supabase Auth)

```sql
-- Managed by Supabase Auth
-- Contains user authentication data
-- Includes email, password hash, email verification status
-- User metadata stored in user_metadata JSONB field
```

**Key Features:**

- **Supabase Managed**: Fully managed by Supabase Auth
- **JWT Tokens**: Automatic JWT token generation and validation
- **Email Verification**: Built-in email verification with magic links
- **Password Security**: Automatic password hashing and validation
- **User Metadata**: Custom data stored in user_metadata field

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

The system uses **Supabase Auth for authentication rate limiting** and **Redis for app-level features**:

- **Supabase Auth**: Handles all authentication rate limiting automatically
- **Redis**: Used for caching, API rate limiting, and app-level features only

### Key Patterns

#### App-Level Rate Limiting (Redis)

```
rl:API_CALLS:user_123
rl:FILE_UPLOADS:user_123
rl:EMAIL_SENDING:user_123
rl:NEWSLETTER_SUBSCRIPTION:user@example.com
rl:SUPPORT_TICKETS:user_123
rl:IP_GENERAL:192.168.1.1
```

#### Caching (Redis)

```
user:user_123:profile_data
org:org_456:organization_data
dash:user_123:dashboard_data
cache:api_response:endpoint_params
```

### Configuration

```typescript
// Optimized Redis configuration
const REDIS_CONFIG = {
  RATE_LIMITS: {
    API_CALLS: { limit: 1000, windowMs: 60000 },
    FILE_UPLOADS: { limit: 20, windowMs: 3600000 },
    EMAIL_SENDING: { limit: 50, windowMs: 60000 },
    // ... other app-level limits
  },
  CACHE: {
    USER_PROFILE_TTL: 7200, // 2 hours
    ORGANIZATION_TTL: 3600, // 1 hour
    API_RESPONSE_TTL: 120, // 2 minutes
    // ... other cache TTLs
  },
  CONNECTION: {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
    // ... optimized connection settings
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

### Server Actions (Next.js 15 App Router)

The system uses **Server Actions** instead of traditional API endpoints for better security, performance, and type safety.

#### Core Authentication Actions

##### `logout()` Server Action

Logout the current user and clear all sessions.

**Response:**

```typescript
{
  success: boolean;
  message: string;
}
```

##### `checkUserPendingRegistration(email: string)` Server Action

Check if user has pending registration.

**Request:**

```typescript
{
  email: 'john@example.com';
}
```

**Response:**

```typescript
{
  hasPendingRegistration: boolean;
  error?: string;
}
```

##### `checkUserExistsInAuth(email: string)` Server Action

Check if user exists in Supabase Auth.

**Request:**

```typescript
{
  email: 'john@example.com';
}
```

**Response:**

```typescript
{
  exists: boolean;
  error?: string;
}
```

#### Registration Actions

##### `registerUser(data: RegisterUserData)` Server Action

Register a new user with Supabase Auth.

**Request:**

```typescript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "SecurePass123!",
  referralSource: "google",
  browserLocale: "en-CH",
  clientIP: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

**Response:**

```typescript
{
  success: boolean;
  message: string;
  error?: string;
  userId?: string;
}
```

#### Magic Link Authentication

##### `sendMagicLinkLogin(email: string, request?: Request)` Server Action

Send magic link for passwordless login.

**Request:**

```typescript
{
  email: 'john@example.com';
}
```

**Response:**

```typescript
{
  success: boolean;
  message: string;
  error?: string;
}
```

##### `verifyMagicLink(token_hash: string, type: string, request?: Request)` Server Action

Verify magic link and create session.

**Request:**

```typescript
{
  token_hash: "magic_link_token_hash",
  type: "magiclink"
}
```

**Response:**

```typescript
{
  success: boolean;
  message: string;
  error?: string;
}
```

#### Password Reset Actions

##### `sendPasswordResetEmail(email: string, request?: Request, clientIP?: string, userAgent?: string)` Server Action

Send password reset email using Supabase magic links.

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
  success: boolean;
  message: string;
  error?: string;
  userId?: string;
}
```

#### Session Management

##### `getServerSession(options?: SessionValidationOptions)` Server Helper

Get server session with extended user data.

**Options:**

```typescript
{
  requireEmailVerification?: boolean;
  requireOnboarding?: boolean;
  requireOrganization?: boolean;
  redirectTo?: string;
}
```

**Response:**

```typescript
{
  user: ExtendedUser | null;
  session: Session | null;
  error: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  hasCompletedOnboarding: boolean;
  hasOrganization: boolean;
  organization?: Organization | null;
  organizationMembership?: OrganizationUser | null;
}
```

##### `requireServerSession(options?: SessionValidationOptions)` Server Helper

Require authenticated session with automatic redirects.

**Options:** Same as `getServerSession`

**Response:** Same as `getServerSession` (never returns null due to redirects)

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
# Test normal registration (Server Action)
# Note: Server Actions are called directly from components, not via HTTP

# Test duplicate registration
# This will be handled by the registerUser server action
```

#### Login Flow

```bash
# Test password-based login
# This is handled by the LoginForm component using Supabase client

# Test magic link login
# This is handled by the MagicLinkLoginForm component
```

#### Password Reset Flow

```bash
# Test password reset
# This is handled by the ForgotPasswordForm component
```

#### Session Management Testing

```typescript
// Test client-side session management
import { useSession } from '@/features/auth/hooks/use-session';

function TestComponent() {
  const { user, isAuthenticated, loading, error } = useSession({
    requireEmailVerification: true,
    requireOnboarding: true,
    requireOrganization: true,
  });

  // Test session state
  console.log('User:', user);
  console.log('Authenticated:', isAuthenticated);
  console.log('Loading:', loading);
  console.log('Error:', error);
}
```

```typescript
// Test server-side session management
import { getServerSession } from '@/features/auth/server/helpers/session';

export async function TestPage() {
  const session = await getServerSession({
    requireEmailVerification: true,
    requireOnboarding: true,
    requireOrganization: true,
  });

  // Test session state
  console.log('User:', session.user);
  console.log('Authenticated:', session.isAuthenticated);
  console.log('Error:', session.error);
}
```

### Automated Testing

#### Component Testing

```typescript
// Test LoginForm component
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/features/auth/components/LoginForm';

test('LoginForm renders and handles submission', async () => {
  render(<LoginForm />);

  // Test form elements
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();

  // Test form submission
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'Test123!' }
  });

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => {
    // Assert expected behavior
  });
});
```

```typescript
// Test MagicLinkLoginForm component
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MagicLinkLoginForm } from '@/features/auth/components/MagicLinkLoginForm';

test('MagicLinkLoginForm renders and handles submission', async () => {
  render(<MagicLinkLoginForm />);

  // Test form elements
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /send magic link/i })).toBeInTheDocument();

  // Test form submission
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });

  fireEvent.click(screen.getByRole('button', { name: /send magic link/i }));

  await waitFor(() => {
    // Assert expected behavior
  });
});
```

#### Server Action Testing

```typescript
// Test server actions
import { registerUser } from '@/features/auth/server/actions/registration';
import { sendMagicLinkLogin } from '@/features/auth/server/actions/magic-link-login';

test('registerUser creates user successfully', async () => {
  const result = await registerUser({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'Test123!',
    referralSource: 'test',
    browserLocale: 'en-CH',
    clientIP: '127.0.0.1',
    userAgent: 'test-agent',
  });

  expect(result.success).toBe(true);
  expect(result.message).toContain('successful');
});

test('sendMagicLinkLogin sends email successfully', async () => {
  const result = await sendMagicLinkLogin('test@example.com');

  expect(result.success).toBe(true);
  expect(result.message).toContain('magic link');
});
```

#### Session Management Testing

```typescript
// Test useSession hook
import { renderHook, act } from '@testing-library/react';
import { useSession } from '@/features/auth/hooks/use-session';

test('useSession manages session state correctly', async () => {
  const { result } = renderHook(() =>
    useSession({
      requireEmailVerification: true,
      requireOnboarding: true,
      requireOrganization: true,
    })
  );

  // Test initial state
  expect(result.current.loading).toBe(true);
  expect(result.current.isAuthenticated).toBe(false);

  // Test session update
  await act(async () => {
    // Simulate session change
  });

  // Assert expected state changes
});
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
   supabase functions deploy cleanup-audit-logs
   ```

3. **Apply Database Migrations**

   ```bash
   supabase db push
   ```

4. **Verify Deployment**

   ```bash
   # Test cleanup function
   curl -X POST "https://your-project.supabase.co/functions/v1/cleanup-audit-logs" \
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
supabase functions logs cleanup-audit-logs
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

## Usage Examples

### Client-Side Session Management

#### Basic Session Usage

```typescript
import { useSession } from '@/features/auth/hooks/use-session';

function Dashboard() {
  const { user, isAuthenticated, loading, error } = useSession();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
      <p>Organization: {user?.organization?.name}</p>
    </div>
  );
}
```

#### Session with Requirements

```typescript
import { useSession } from '@/features/auth/hooks/use-session';

function ProtectedPage() {
  const {
    user,
    isAuthenticated,
    isEmailVerified,
    hasCompletedOnboarding,
    hasOrganization,
    loading,
    error
  } = useSession({
    requireEmailVerification: true,
    requireOnboarding: true,
    requireOrganization: true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  if (!isEmailVerified) return <div>Please verify your email</div>;
  if (!hasCompletedOnboarding) return <div>Please complete onboarding</div>;
  if (!hasOrganization) return <div>Please join an organization</div>;

  return <div>Protected content</div>;
}
```

#### Session Provider Pattern

```typescript
import { SessionProvider } from '@/features/auth/components/SessionProvider';

function App() {
  return (
    <SessionProvider
      requireEmailVerification={true}
      requireOnboarding={true}
      requireOrganization={true}
    >
      <Dashboard />
    </SessionProvider>
  );
}
```

### Server-Side Session Management

#### Page Component with Session

```typescript
import { getServerSession } from '@/features/auth/server/helpers/session';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession({
    requireEmailVerification: true,
    requireOnboarding: true,
    requireOrganization: true
  });

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  if (!session.isEmailVerified) {
    redirect('/verify-email');
  }

  if (!session.hasCompletedOnboarding) {
    redirect('/onboarding');
  }

  if (!session.hasOrganization) {
    redirect('/onboarding');
  }

  return (
    <div>
      <h1>Welcome, {session.user?.email}!</h1>
      <p>Organization: {session.organization?.name}</p>
    </div>
  );
}
```

#### API Route with Session

```typescript
import { getServerSession } from '@/features/auth/server/helpers/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await getServerSession({
    requireEmailVerification: true,
    requireOrganization: true,
  });

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!session.isEmailVerified) {
    return NextResponse.json(
      { error: 'Email verification required' },
      { status: 403 }
    );
  }

  if (!session.hasOrganization) {
    return NextResponse.json(
      { error: 'Organization required' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    user: session.user,
    organization: session.organization,
  });
}
```

### Authentication Forms

#### Login Form Usage

```typescript
import { LoginForm } from '@/features/auth/components/LoginForm';

function LoginPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <LoginForm
        redirectTo="/dashboard"
        showVerifiedMessage={true}
        initialEmail="user@example.com"
        successMessage="Welcome back!"
      />
    </div>
  );
}
```

#### Magic Link Login

```typescript
import { MagicLinkLoginForm } from '@/features/auth/components/MagicLinkLoginForm';

function MagicLinkPage() {
  return (
    <div>
      <h1>Sign In with Magic Link</h1>
      <MagicLinkLoginForm
        redirectTo="/dashboard"
        initialEmail="user@example.com"
      />
    </div>
  );
}
```

#### Registration Form

```typescript
import { RegisterForm } from '@/features/auth/components/RegisterForm';

function RegisterPage() {
  return (
    <div>
      <h1>Create Account</h1>
      <RegisterForm
        redirectTo="/verify-email"
        showVerifiedMessage={false}
      />
    </div>
  );
}
```

### Server Actions Usage

#### Registration

```typescript
import { registerUser } from '@/features/auth/server/actions/registration';

export async function handleRegistration(formData: FormData) {
  const result = await registerUser({
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    referralSource: formData.get('referralSource') as string,
    browserLocale: 'en-CH',
    clientIP: '127.0.0.1',
    userAgent: 'Mozilla/5.0...',
  });

  if (result.success) {
    redirect('/verify-email');
  } else {
    // Handle error
    console.error(result.error);
  }
}
```

#### Magic Link Login

```typescript
import { sendMagicLinkLogin } from '@/features/auth/server/actions/magic-link-login';

export async function handleMagicLinkLogin(formData: FormData) {
  const email = formData.get('email') as string;

  const result = await sendMagicLinkLogin(email);

  if (result.success) {
    // Show success message
    console.log('Magic link sent!');
  } else {
    // Handle error
    console.error(result.error);
  }
}
```

#### Password Reset

```typescript
import { sendPasswordResetEmail } from '@/features/auth/server/actions/password-reset';

export async function handlePasswordReset(formData: FormData) {
  const email = formData.get('email') as string;

  const result = await sendPasswordResetEmail(
    email,
    undefined, // request
    '127.0.0.1', // clientIP
    'Mozilla/5.0...' // userAgent
  );

  if (result.success) {
    // Show success message
    console.log('Password reset email sent!');
  } else {
    // Handle error
    console.error(result.error);
  }
}
```

### Form Validation

#### Client-Side Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/login-schema';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: LoginFormData) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        {...register('password')}
        type="password"
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Sign In</button>
    </form>
  );
}
```

#### Server-Side Validation

```typescript
import { z } from 'zod';

const serverLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  userExists: z.boolean().optional(),
  hasPendingRegistration: z.boolean().optional(),
  isEmailConfirmed: z.boolean().optional(),
});

export async function validateLoginData(data: unknown) {
  try {
    const validatedData = serverLoginSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

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

## Summary

The PayMatch authentication system has been completely refactored to provide a modern, unified, and type-safe authentication experience. The new architecture offers:

### Key Improvements

1. **Unified Session Management**: Consistent APIs for client and server-side session handling
2. **Multiple Authentication Methods**: Password-based and magic link authentication in one system
3. **Type Safety**: Full TypeScript coverage with generated database types
4. **Modern Architecture**: Next.js 15 App Router with Server Actions instead of API routes
5. **React Context Integration**: Seamless session state management across components
6. **Comprehensive Validation**: Zod schemas for both client and server-side validation
7. **Enhanced Security**: Optimized RLS policies and comprehensive audit logging

### Architecture Highlights

- **Feature-First Organization**: Clean separation of concerns with modular components
- **Server Actions Pattern**: Modern Next.js 15 approach for better security and performance
- **Unified Session API**: Consistent session management across client and server
- **Type-Safe Database Integration**: Generated types from Supabase schema
- **Comprehensive Error Handling**: User-friendly error messages and recovery

### Developer Experience

- **Intuitive APIs**: Easy-to-use hooks and server helpers
- **Comprehensive Documentation**: Detailed examples and usage patterns
- **Type Safety**: Full TypeScript coverage with IntelliSense support
- **Testing Support**: Built-in testing utilities and examples
- **Modern Patterns**: React Context, Server Actions, and Zod validation

The authentication system is now production-ready with enterprise-grade security, comprehensive compliance features, and an excellent developer experience.

---

_Last updated: October 2025_
_Version: 4.0.0 - Unified Auth System_
