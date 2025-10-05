# Invited User Flow - Future Implementation Guide

## Overview

This document outlines the planned implementation for handling invited users in PayMatch. The current system is designed to support two distinct user flows:

1. **Organization Owners** - Full onboarding process
2. **Invited Users** - Simplified profile setup

## Current Architecture

### Single Source of Truth

- **Onboarding Status**: `organizations.onboarding_completed` (boolean)
- **User Roles**: `organization_users.role` ('owner', 'admin', 'accountant', 'staff')
- **Membership Status**: `organization_users.status` ('active', 'pending', 'suspended')

### Database Schema

```sql
-- Organizations table (single source of truth for onboarding)
organizations (
  id UUID PRIMARY KEY,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  -- ... other fields
)

-- Organization membership with roles
organization_users (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('owner', 'admin', 'accountant', 'staff')),
  status TEXT CHECK (status IN ('active', 'pending', 'suspended')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ
)
```

## User Flow Types

### 1. Organization Owner Flow (Current Implementation)

**Who**: Users who create their own organization
**Onboarding**: Full multi-step process
**Database State**: `onboarding_completed = false` initially

```typescript
// Current middleware logic
const { data: orgMembership } = await supabase
  .from('organization_users')
  .select(
    `
    org_id,
    organizations!inner(onboarding_completed)
  `
  )
  .eq('user_id', user.id)
  .eq('status', 'active')
  .single();

// If onboarding not completed, redirect to /onboarding
if (!org?.onboarding_completed) {
  return NextResponse.redirect(new URL('/onboarding', request.url));
}
```

**Onboarding Steps**:

1. Plan Selection (Free, Freelancer, Business, Enterprise)
2. Company Details (Name, Address, IBAN, VAT Number)
3. Settings (Language, Currency, Payment Terms)
4. Success/Completion

### 2. Invited User Flow (Future Implementation)

**Who**: Users invited by organization owners
**Onboarding**: Simplified profile setup only
**Database State**: `onboarding_completed = true` by default

```typescript
// Future middleware logic with role-based routing
const { data: orgMembership } = await supabase
  .from('organization_users')
  .select(
    `
    org_id,
    role,
    organizations!inner(onboarding_completed)
  `
  )
  .eq('user_id', user.id)
  .eq('status', 'active')
  .single();

const org = orgMembership?.organizations as
  | { onboarding_completed: boolean }
  | undefined;
const userRole = orgMembership?.role;

// Role-based onboarding logic
if (userRole === 'owner' && !org?.onboarding_completed) {
  // Organization owners go through full onboarding
  return NextResponse.redirect(new URL('/onboarding', request.url));
} else if (userRole !== 'owner' && !org?.onboarding_completed) {
  // Invited users go through simplified profile setup
  return NextResponse.redirect(new URL('/profile-setup', request.url));
}
```

**Profile Setup Steps** (for invited users):

1. Basic Profile (Name, Avatar, Contact Info)
2. Preferences (Language, Timezone, Notifications)
3. Welcome/Completion

## Implementation Plan

### Phase 1: Database Updates

```sql
-- Migration: Add role-based onboarding logic
-- File: supabase/migrations/YYYYMMDD_add_role_based_onboarding.sql

-- Update organization creation trigger to handle invited users
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
  user_name TEXT;
  user_language TEXT;
  is_invited_user BOOLEAN := FALSE;
BEGIN
  -- Check if this is an invited user (has pending invitation)
  IF EXISTS (
    SELECT 1 FROM public.organization_users
    WHERE user_id = NEW.id
    AND status = 'pending'
  ) THEN
    is_invited_user := TRUE;

    -- Update existing invitation to active
    UPDATE public.organization_users
    SET
      status = 'active',
      accepted_at = NOW(),
      updated_at = NOW()
    WHERE user_id = NEW.id AND status = 'pending';

    -- Set onboarding as completed for invited users
    UPDATE public.organizations
    SET onboarding_completed = TRUE
    WHERE id = (
      SELECT org_id FROM public.organization_users
      WHERE user_id = NEW.id AND status = 'active'
    );
  ELSE
    -- Regular user flow (organization owner)
    -- ... existing logic for creating organization
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Phase 2: Middleware Updates

```typescript
// src/middleware.ts - Enhanced with role-based logic
if (isProtectedRoute) {
  // ... existing auth checks ...

  // Check onboarding status with role consideration
  const { data: orgMembership, error: orgError } = await supabase
    .from('organization_users')
    .select(
      `
      org_id,
      role,
      organizations!inner(onboarding_completed)
    `
    )
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  const org = orgMembership?.organizations as
    | { onboarding_completed: boolean }
    | undefined;
  const userRole = orgMembership?.role;

  if (orgError || !org) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Role-based onboarding routing
  if (userRole === 'owner' && !org?.onboarding_completed) {
    // Organization owners need full onboarding
    return NextResponse.redirect(new URL('/onboarding', request.url));
  } else if (userRole !== 'owner' && !org?.onboarding_completed) {
    // Invited users need profile setup
    return NextResponse.redirect(new URL('/profile-setup', request.url));
  }
}
```

### Phase 3: New Profile Setup Route

```typescript
// src/app/[locale]/(onboarding)/profile-setup/page.tsx
export default async function ProfileSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's organization and role
  const { data: orgMembership } = await supabase
    .from('organization_users')
    .select(`
      org_id,
      role,
      organizations!inner(id, name, onboarding_completed)
    `)
    .eq('user_id', user!.id)
    .eq('status', 'active')
    .single();

  const org = orgMembership?.organizations;
  const userRole = orgMembership?.role;

  // Only invited users (non-owners) should access this page
  if (userRole === 'owner') {
    redirect('/onboarding');
  }

  // If organization onboarding is complete, redirect to dashboard
  if (org?.onboarding_completed) {
    redirect('/dashboard');
  }

  return (
    <AuthLayout
      title="Welcome to the Team!"
      subtitle={`Complete your profile to join ${org?.name}`}
    >
      <ProfileSetupWizard orgId={org!.id} userRole={userRole!} />
    </AuthLayout>
  );
}
```

### Phase 4: Profile Setup Wizard

```typescript
// src/features/onboarding/components/ProfileSetupWizard.tsx
interface ProfileSetupWizardProps {
  orgId: string;
  userRole: 'admin' | 'accountant' | 'staff';
}

export function ProfileSetupWizard({
  orgId,
  userRole,
}: ProfileSetupWizardProps) {
  const steps = [
    {
      id: 1,
      component: BasicProfileStep,
      title: 'Basic Information',
      slug: 'basic-info',
    },
    {
      id: 2,
      component: PreferencesStep,
      title: 'Preferences',
      slug: 'preferences',
    },
    {
      id: 3,
      component: WelcomeStep,
      title: 'Welcome',
      slug: 'welcome',
    },
  ];

  // ... wizard implementation
}
```

## Invitation System

### Invitation Flow

1. **Organization Owner** invites user via email
2. **Invitation Record** created in `organization_users` with `status = 'pending'`
3. **User Receives Email** with invitation link
4. **User Clicks Link** → Redirected to registration/signup
5. **User Completes Registration** → Email verification triggers organization membership activation
6. **User Logs In** → Redirected to profile setup (not full onboarding)

### Database Schema for Invitations

```sql
-- organization_users table already supports invitations
organization_users (
  -- ... existing fields ...
  invited_by UUID REFERENCES auth.users(id),  -- Who sent the invitation
  invited_at TIMESTAMPTZ,                     -- When invitation was sent
  accepted_at TIMESTAMPTZ,                    -- When invitation was accepted
  status TEXT DEFAULT 'pending'               -- 'pending', 'active', 'suspended'
)
```

### Invitation API Endpoints

```typescript
// src/app/api/invitations/route.ts
export async function POST(request: Request) {
  const { email, role, orgId } = await request.json();

  // Create invitation record
  const { data, error } = await supabase.from('organization_users').insert({
    org_id: orgId,
    user_id: null, // Will be filled when user accepts
    role,
    status: 'pending',
    invited_by: currentUser.id,
    invited_at: new Date().toISOString(),
  });

  // Send invitation email
  await sendInvitationEmail(email, orgId, role);

  return Response.json({ success: true });
}
```

## Benefits of This Architecture

### 1. **Single Source of Truth**

- `organizations.onboarding_completed` tracks organization-level onboarding
- Role-based logic determines user experience
- No duplicate or conflicting onboarding states

### 2. **Scalable User Management**

- Easy to add new roles (`'viewer'`, `'billing_admin'`, etc.)
- Role-based permissions and feature access
- Flexible invitation system

### 3. **Consistent User Experience**

- Organization owners get full setup experience
- Invited users get streamlined onboarding
- Clear separation of concerns

### 4. **Future-Proof Design**

- Easy to add organization-level features
- Support for multi-organization users
- Role-based access control ready

## Migration Strategy

### Step 1: Database Preparation

```sql
-- Ensure all existing users are marked as owners (if any exist)
UPDATE public.organization_users
SET role = 'owner'
WHERE role IS NULL OR role = '';

-- Set onboarding_completed based on current state
UPDATE public.organizations
SET onboarding_completed = TRUE
WHERE id IN (
  SELECT org_id FROM public.organization_users
  WHERE role = 'owner' AND status = 'active'
);
```

### Step 2: Implementation Order

1. **Phase 1**: Add role-based middleware logic
2. **Phase 2**: Implement profile setup wizard
3. **Phase 3**: Add invitation system
4. **Phase 4**: Full role-based feature access

### Step 3: Testing Strategy

- Test organization owner flow (full onboarding)
- Test invitation flow with new users
- Verify role-based redirects work correctly
- Test profile setup wizard for invited users

## Conclusion

The current PayMatch architecture is perfectly positioned to support invited users with minimal changes. The single source of truth for onboarding status and role-based user management provides a solid foundation for scaling the user experience.

The key insight is that **organization-level onboarding** (plan selection, company details) is separate from **user-level profile setup**, allowing for different experiences based on user roles while maintaining a consistent and reliable system.
