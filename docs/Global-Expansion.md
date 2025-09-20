# Global Expansion Strategy & Supabase-Based Architecture

This document outlines PayMatch's global expansion strategy using **Supabase as the central management system** for country configuration, feature toggling, and multi-region support.

## Overview

PayMatch uses a **database-driven approach** where all country management, feature toggling, and regional configuration is handled through Supabase. This eliminates the need for code deployments when enabling/disabling countries and provides real-time configuration updates.

---

## 1. Supabase-Based Country Management

### 1.1 Database Schema

**Core Countries Table:**

```sql
-- Main countries configuration
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(2) UNIQUE NOT NULL, -- ISO 3166-1 alpha-2
  name VARCHAR(100) NOT NULL,
  currency_code VARCHAR(3) NOT NULL, -- ISO 4217
  language_codes TEXT[] NOT NULL, -- ['en', 'de', 'fr']
  is_active BOOLEAN DEFAULT false,
  tax_config JSONB, -- Country-specific tax rules
  compliance_config JSONB, -- Invoicing standards
  stripe_tax_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Country features (managed via Supabase)
CREATE TABLE country_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  feature_name VARCHAR(50) NOT NULL, -- 'qr_bill', 'iso_20022', 'ebics'
  is_enabled BOOLEAN DEFAULT false,
  config JSONB, -- Feature-specific configuration
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin country management audit trail
CREATE TABLE country_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  enabled_by UUID REFERENCES auth.users(id),
  enabled_at TIMESTAMP DEFAULT NOW(),
  disabled_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  notes TEXT
);

-- User roles for admin access
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'admin', 'user', 'support'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
```

### 1.2 Row Level Security Policies

**Admin Access Control:**

```sql
-- Only admins can manage countries
CREATE POLICY "Admin can manage countries" ON countries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Users can read active countries
CREATE POLICY "Users can read active countries" ON countries
  FOR SELECT USING (is_active = true);

-- Admin can manage country features
CREATE POLICY "Admin can manage country features" ON country_features
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Users can read enabled features
CREATE POLICY "Users can read enabled features" ON country_features
  FOR SELECT USING (
    is_enabled = true AND
    EXISTS (
      SELECT 1 FROM countries
      WHERE id = country_id AND is_active = true
    )
  );
```

### 1.3 Supabase Functions for Country Management

**Enable Country Function:**

```sql
CREATE OR REPLACE FUNCTION enable_country(
  country_code VARCHAR(2),
  admin_user_id UUID DEFAULT auth.uid()
) RETURNS JSON AS $$
DECLARE
  country_record countries%ROWTYPE;
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = admin_user_id AND role = 'admin'
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized: Admin access required'
    );
  END IF;

  -- Enable country
  UPDATE countries
  SET is_active = true, updated_at = NOW()
  WHERE code = country_code
  RETURNING * INTO country_record;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Country not found'
    );
  END IF;

  -- Log the action
  INSERT INTO country_management (country_id, enabled_by, is_active)
  VALUES (country_record.id, admin_user_id, true);

  -- Return success response
  result := json_build_object(
    'success', true,
    'country', row_to_json(country_record),
    'message', 'Country enabled successfully'
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Disable Country Function:**

```sql
CREATE OR REPLACE FUNCTION disable_country(
  country_code VARCHAR(2),
  admin_user_id UUID DEFAULT auth.uid()
) RETURNS JSON AS $$
DECLARE
  country_record countries%ROWTYPE;
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = admin_user_id AND role = 'admin'
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized: Admin access required'
    );
  END IF;

  -- Disable country
  UPDATE countries
  SET is_active = false, updated_at = NOW()
  WHERE code = country_code
  RETURNING * INTO country_record;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Country not found'
    );
  END IF;

  -- Log the action
  UPDATE country_management
  SET disabled_at = NOW(), is_active = false
  WHERE country_id = country_record.id AND is_active = true;

  -- Return success response
  result := json_build_object(
    'success', true,
    'country', row_to_json(country_record),
    'message', 'Country disabled successfully'
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Get Country Features Function:**

```sql
CREATE OR REPLACE FUNCTION get_country_features(country_code VARCHAR(2))
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'country', row_to_json(c),
    'features', json_agg(
      json_build_object(
        'name', cf.feature_name,
        'enabled', cf.is_enabled,
        'config', cf.config
      )
    )
  )
  INTO result
  FROM countries c
  LEFT JOIN country_features cf ON c.id = cf.country_id
  WHERE c.code = country_code AND c.is_active = true
  GROUP BY c.id, c.code, c.name, c.currency_code, c.language_codes, c.tax_config, c.compliance_config;

  RETURN COALESCE(result, json_build_object('error', 'Country not found or inactive'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 2. Application Integration

### 2.1 Country Detection Service

**Client-Side Country Detection:**

```typescript
// lib/country/country-service.ts
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export class CountryService {
  private supabase = createSupabaseBrowserClient();

  async detectCountry(): Promise<string> {
    try {
      // Use IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_code;
    } catch (error) {
      console.error('Country detection failed:', error);
      return 'CH'; // Default to Switzerland
    }
  }

  async isCountrySupported(countryCode: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('countries')
      .select('is_active')
      .eq('code', countryCode)
      .single();

    if (error || !data) return false;
    return data.is_active;
  }

  async getCountryFeatures(countryCode: string) {
    const { data, error } = await this.supabase.rpc('get_country_features', {
      country_code: countryCode,
    });

    if (error) throw error;
    return data;
  }

  async getSupportedCountries() {
    const { data, error } = await this.supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  }
}
```

### 2.2 Feature Toggle Service

**Dynamic Feature Loading:**

```typescript
// lib/features/feature-service.ts
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export class FeatureService {
  private supabase = createSupabaseBrowserClient();

  async isFeatureEnabled(
    countryCode: string,
    featureName: string
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('country_features')
      .select('is_enabled')
      .eq('country_id', countryCode)
      .eq('feature_name', featureName)
      .single();

    if (error || !data) return false;
    return data.is_enabled;
  }

  async getCountryFeatures(countryCode: string) {
    const { data, error } = await this.supabase
      .from('country_features')
      .select('*')
      .eq('country_id', countryCode)
      .eq('is_enabled', true);

    if (error) throw error;
    return data;
  }

  // Feature-specific checks
  async canUseQRBill(countryCode: string): Promise<boolean> {
    return this.isFeatureEnabled(countryCode, 'qr_bill');
  }

  async canUseISO20022(countryCode: string): Promise<boolean> {
    return this.isFeatureEnabled(countryCode, 'iso_20022');
  }

  async canUseEBICS(countryCode: string): Promise<boolean> {
    return this.isFeatureEnabled(countryCode, 'ebics');
  }
}
```

### 2.3 Middleware Integration

**Next.js Middleware:**

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  // Get country from IP or user preference
  const countryCode = await detectCountryFromIP(request);

  // Check if country is supported
  const { data: country } = await supabase
    .from('countries')
    .select('is_active')
    .eq('code', countryCode)
    .single();

  if (!country?.is_active) {
    return NextResponse.redirect(new URL('/unsupported-region', request.url));
  }

  // Add country context to headers
  const response = NextResponse.next();
  response.headers.set('x-country', countryCode);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 3. Supabase Admin Interface

### 3.1 Country Management via Supabase Studio

**Direct Database Management:**

- **Countries Table:** Enable/disable countries with one click
- **Country Features:** Configure features per country
- **Real-time Updates:** Changes reflect immediately
- **Audit Trail:** Track all country management actions
- **Bulk Operations:** Enable/disable multiple countries

**Admin Workflow:**

1. **Access Supabase Studio** → Countries table
2. **Toggle `is_active`** column for desired country
3. **Configure features** in country_features table
4. **Update tax_config** and compliance_config as needed
5. **Changes are live** immediately across all instances

### 3.2 Custom Admin Dashboard (Optional)

**React Admin Interface:**

```typescript
// app/admin/countries/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function CountriesAdmin() {
  const [countries, setCountries] = useState([]);
  const supabase = createSupabaseBrowserClient();

  const toggleCountry = async (countryCode: string, isActive: boolean) => {
    const { data, error } = await supabase
      .rpc(isActive ? 'enable_country' : 'disable_country', {
        country_code: countryCode
      });

    if (error) {
      console.error('Error toggling country:', error);
      return;
    }

    // Refresh countries list
    fetchCountries();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Country Management</h1>
      <div className="grid gap-4">
        {countries.map((country) => (
          <div key={country.code} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{country.name}</h3>
                <p className="text-sm text-gray-600">
                  {country.currency_code} • {country.language_codes.join(', ')}
                </p>
              </div>
              <button
                onClick={() => toggleCountry(country.code, !country.is_active)}
                className={`px-4 py-2 rounded ${
                  country.is_active
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {country.is_active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. Country-Specific Configurations

### 4.1 Switzerland (CH)

```sql
-- Insert Switzerland configuration
INSERT INTO countries (code, name, currency_code, language_codes, is_active, tax_config, compliance_config)
VALUES (
  'CH',
  'Switzerland',
  'CHF',
  ARRAY['de', 'fr', 'it', 'en'],
  true,
  '{"standard_rate": 7.7, "reduced_rate": 2.5, "zero_rate": 0}'::jsonb,
  '{"invoice_format": "swiss_qr", "required_fields": ["qr_bill", "vat_number"], "legal_requirements": ["swiss_qr_standard"]}'::jsonb
);

-- Enable Swiss features
INSERT INTO country_features (country_id, feature_name, is_enabled, config)
SELECT id, 'qr_bill', true, '{"standard": "swiss_qr_bill"}'::jsonb
FROM countries WHERE code = 'CH';

INSERT INTO country_features (country_id, feature_name, is_enabled, config)
SELECT id, 'iso_20022', true, '{"camt053_support": true}'::jsonb
FROM countries WHERE code = 'CH';
```

### 4.2 Germany (DE)

```sql
-- Insert Germany configuration
INSERT INTO countries (code, name, currency_code, language_codes, is_active, tax_config, compliance_config)
VALUES (
  'DE',
  'Germany',
  'EUR',
  ARRAY['de'],
  true,
  '{"standard_rate": 19, "reduced_rate": 7, "zero_rate": 0}'::jsonb,
  '{"invoice_format": "eu_standard", "required_fields": ["vat_number", "invoice_number"], "legal_requirements": ["eu_invoice_directive"]}'::jsonb
);

-- Enable German features
INSERT INTO country_features (country_id, feature_name, is_enabled, config)
SELECT id, 'iso_20022', true, '{"camt053_support": true, "ebics_support": true}'::jsonb
FROM countries WHERE code = 'DE';

INSERT INTO country_features (country_id, feature_name, is_enabled, config)
SELECT id, 'ebics', true, '{"banking_standard": "ebics"}'::jsonb
FROM countries WHERE code = 'DE';
```

---

## 5. Real-Time Updates

### 5.1 Supabase Realtime Subscriptions

**Country Status Updates:**

```typescript
// lib/country/country-realtime.ts
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export class CountryRealtimeService {
  private supabase = createSupabaseBrowserClient();

  subscribeToCountryChanges(callback: (countries: any[]) => void) {
    return this.supabase
      .channel('countries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'countries',
        },
        async () => {
          // Fetch updated countries
          const { data } = await this.supabase
            .from('countries')
            .select('*')
            .eq('is_active', true);

          callback(data || []);
        }
      )
      .subscribe();
  }

  subscribeToFeatureChanges(callback: (features: any[]) => void) {
    return this.supabase
      .channel('features_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'country_features',
        },
        async () => {
          // Fetch updated features
          const { data } = await this.supabase
            .from('country_features')
            .select('*')
            .eq('is_enabled', true);

          callback(data || []);
        }
      )
      .subscribe();
  }
}
```

### 5.2 Application State Management

**Zustand Store for Countries:**

```typescript
// lib/stores/country-store.ts
import { create } from 'zustand';
import { CountryService } from '@/lib/country/country-service';

interface CountryState {
  currentCountry: string | null;
  supportedCountries: any[];
  countryFeatures: any[];
  isLoading: boolean;
  setCurrentCountry: (country: string) => void;
  loadSupportedCountries: () => Promise<void>;
  loadCountryFeatures: (countryCode: string) => Promise<void>;
}

export const useCountryStore = create<CountryState>((set, get) => ({
  currentCountry: null,
  supportedCountries: [],
  countryFeatures: [],
  isLoading: false,

  setCurrentCountry: (country) => set({ currentCountry: country }),

  loadSupportedCountries: async () => {
    set({ isLoading: true });
    try {
      const service = new CountryService();
      const countries = await service.getSupportedCountries();
      set({ supportedCountries: countries, isLoading: false });
    } catch (error) {
      console.error('Failed to load countries:', error);
      set({ isLoading: false });
    }
  },

  loadCountryFeatures: async (countryCode) => {
    set({ isLoading: true });
    try {
      const service = new CountryService();
      const features = await service.getCountryFeatures(countryCode);
      set({ countryFeatures: features, isLoading: false });
    } catch (error) {
      console.error('Failed to load features:', error);
      set({ isLoading: false });
    }
  },
}));
```

---

## 6. Benefits of Supabase-Based Approach

### 6.1 Operational Advantages

- **No Code Deployments:** Enable/disable countries without code changes
- **Real-Time Updates:** Changes reflect immediately across all instances
- **Centralized Management:** All configuration in one place
- **Audit Trail:** Complete history of country management actions
- **Role-Based Access:** Secure admin access control
- **Database Constraints:** Data integrity and validation

### 6.2 Development Benefits

- **Simplified Codebase:** No complex configuration files
- **Dynamic Features:** Features load based on database state
- **Easy Testing:** Mock database responses for testing
- **Scalable:** Add new countries without code changes
- **Maintainable:** Single source of truth for configuration

### 6.3 Business Benefits

- **Rapid Expansion:** Enable new markets instantly
- **A/B Testing:** Test features in specific countries
- **Compliance:** Easy to disable countries for regulatory reasons
- **Cost Effective:** No development overhead for country management
- **Flexible:** Easy to adjust features per country

---

## 7. Migration Strategy

### 7.1 From Code-Based to Database-Based

1. **Create Database Schema:** Set up countries and country_features tables
2. **Migrate Existing Config:** Move hardcoded configs to database
3. **Update Application Code:** Replace hardcoded checks with database queries
4. **Test Thoroughly:** Ensure all features work with database configuration
5. **Deploy:** Roll out database-based system

### 7.2 Rollback Plan

- **Database Backup:** Full backup before migration
- **Feature Flags:** Keep code-based fallbacks during transition
- **Monitoring:** Watch for issues during migration
- **Quick Rollback:** Ability to revert to code-based system if needed

---

This Supabase-based approach provides a robust, scalable, and maintainable solution for global expansion that eliminates the need for code deployments when managing country support and features.
