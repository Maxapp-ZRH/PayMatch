# Plan Management Guide

This guide explains how to manage plan features and limits using the centralized utility functions in `src/config/plans.ts`.

## 🎯 Overview

The plan management system is now fully centralized with comprehensive utility functions that make it easy to:

- Get plan information and pricing
- Check features and limits
- Compare plans
- Generate UI data
- Create recommendations

## 📁 File Structure

```
src/config/plans.ts          # Centralized plan configuration and utilities
src/examples/plan-management-examples.ts  # Usage examples
src/docs/plan-management-guide.md         # This guide
```

## 🔧 How to Change Plan Features and Limits

### Method 1: Update Plan Configuration (Recommended)

Edit the `PLANS` object in `src/config/plans.ts`:

```typescript
export const PLANS: Record<PlanName, PlanConfig> = {
  freelancer: {
    name: 'freelancer',
    displayName: 'Freelancer',
    featured: false,
    pricing: { monthly: 500, annual: 4800 }, // 5 CHF monthly, 48 CHF annual
    limits: {
      invoices: -1, // Change this: -1 = unlimited, 5 = 5 invoices
      clients: -1, // Change this: -1 = unlimited, 10 = 10 clients
      users: 1, // Change this: 1 = 1 user, 10 = 10 users
      storage: 1000, // Change this: 1000 = 1GB, 100 = 100MB
      customBranding: false, // Change this: true/false
      teamManagement: false, // Change this: true/false
      // ... other limits
    },
    // ... rest of config
  },
};
```

### Method 2: Update Feature Comparison

Edit the `FEATURE_COMPARISON` array in `src/config/plans.ts`:

```typescript
export const FEATURE_COMPARISON: FeatureComparisonRow[] = [
  {
    featureKey: 'invoices',
    icon: FileText,
    free: '5', // Change this
    freelancer: 'Unlimited', // Change this
    business: 'Unlimited', // Change this
    enterprise: 'Unlimited', // Change this
  },
  // ... other features
];
```

### Method 3: Update Translation Files

Edit the translation files in `src/i18n/messages/*/index.json`:

```json
{
  "pricing": {
    "plans": {
      "freelancer": {
        "description": "Perfect for freelancers and small businesses.",
        "features": [
          "Unlimited invoices",
          "Unlimited clients",
          "1 user",
          "1GB storage"
        ]
      }
    },
    "featureComparison": {
      "invoices": "Invoices",
      "clients": "Clients"
      // ... other feature names
    }
  }
}
```

## 🛠️ Utility Functions Reference

### Basic Plan Information

```typescript
// Get plan display name
const name = getPlanDisplayName('freelancer'); // "Freelancer"

// Get plan pricing in CHF
const monthlyPrice = getPlanPricingInCHF('freelancer', 'monthly'); // 5
const annualPrice = getPlanPricingInCHF('freelancer', 'annual'); // 48

// Get formatted plan limits
const limits = getFormattedPlanLimits('freelancer');
// { invoices: "Unlimited", clients: "Unlimited", users: "1", storage: "1000 MB", ... }

// Get translation keys
const descKey = getPlanDescriptionKey('freelancer'); // "plans.freelancer.description"
const featuresKey = getPlanFeaturesKey('freelancer'); // "plans.freelancer.features"
```

### Feature Management

```typescript
// Check if a plan has a specific feature
const hasFeature = planHasFeature('freelancer', 'qrBillInvoices'); // true

// Get feature display value
const value = getFeatureDisplayValue('invoices', 'freelancer'); // "Unlimited"

// Get all feature values for a plan
const features = getPlanFeatureValues('freelancer');
// { invoices: "Unlimited", clients: "Unlimited", users: "1", ... }
```

### Plan Comparison

```typescript
// Compare two plans
const comparison = comparePlans('free', 'freelancer');
console.log(comparison.pricing.difference); // Price difference
console.log(comparison.features.common); // Common features
console.log(comparison.features.unique.plan1); // Unique to first plan

// Find plans with specific features
const plansWithFeature = getPlansWithFeature('teamManagement'); // ['business', 'enterprise']

// Find plans with specific limits
const plansWithLimit = getPlansWithLimit('invoices', -1); // ['freelancer', 'business', 'enterprise']
```

### Comprehensive Data

```typescript
// Get plan summary
const summary = getPlanSummary('freelancer');
// { name: "freelancer", displayName: "Freelancer", monthlyPriceCHF: 5, ... }

// Get all plan summaries
const allSummaries = getAllPlanSummaries();

// Get plan comparison data for UI
const comparisonData = getPlanComparisonData();
// { plans: [...], features: [...] }
```

## 🎨 UI Integration Examples

### Pricing Cards

```typescript
// In your component
import { getPlanSummary, getPlanPricingInCHF } from '@/config/plans';

const PricingCard = ({ planName }: { planName: PlanName }) => {
  const summary = getPlanSummary(planName);
  const monthlyPrice = getPlanPricingInCHF(planName, 'monthly');

  return (
    <div>
      <h3>{summary.displayName}</h3>
      <p>CHF {monthlyPrice}/month</p>
      <ul>
        {summary.keyFeatures.map(feature => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};
```

### Feature Comparison Table

```typescript
// In your component
import { getPlanComparisonData, getFeatureDisplayValue } from '@/config/plans';

const FeatureComparisonTable = () => {
  const data = getPlanComparisonData();

  return (
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          {data.plans.map(plan => (
            <th key={plan.name}>{plan.displayName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.features.map(feature => (
          <tr key={feature.key}>
            <td>{feature.key}</td>
            {data.plans.map(plan => (
              <td key={plan.name}>
                {getFeatureDisplayValue(feature.key, plan.name as PlanName)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### Plan Recommendation

```typescript
// In your component
import { recommendPlan, getPlanDisplayName } from '@/config/plans';

const PlanRecommendation = ({ userNeeds }: { userNeeds: UserNeeds }) => {
  const recommendedPlan = recommendPlan(
    userNeeds.requiredFeatures,
    userNeeds.maxBudget,
    userNeeds.minUsers
  );

  return (
    <div>
      {recommendedPlan ? (
        <p>We recommend: {getPlanDisplayName(recommendedPlan)}</p>
      ) : (
        <p>No suitable plan found</p>
      )}
    </div>
  );
};
```

## 🔄 What Influences Pricing Cards and Comparison Table

### Pricing Cards Text Sources:

1. **Plan Names**: `PLANS[planName].displayName`
2. **Plan Descriptions**: `t(PLANS[planName].descriptionKey)` (from translation files)
3. **Plan Features**: `t(PLANS[planName].featuresKey)` (from translation files)
4. **Pricing**: `PLANS[planName].pricing.monthly/annual` (in cents)

### Comparison Table Text Sources:

1. **Feature Names**: `t("featureComparison.{featureKey}")` (from translation files)
2. **Feature Values**: `FEATURE_COMPARISON[].{planName}` (from plans.ts)
3. **Value Translations**: `getFeatureValueTranslation()` function (in Pricing component)

## 🚀 Best Practices

### 1. Always Use Utility Functions

```typescript
// ✅ Good
const price = getPlanPricingInCHF('freelancer', 'monthly');

// ❌ Bad
const price = PLANS.freelancer.pricing.monthly / 100;
```

### 2. Use Type Safety

```typescript
// ✅ Good
import { type PlanName } from '@/config/plans';
const planName: PlanName = 'freelancer';

// ❌ Bad
const planName = 'freelancer'; // No type safety
```

### 3. Centralize Plan Logic

```typescript
// ✅ Good - Use utility functions
const hasFeature = planHasFeature(planName, 'teamManagement');

// ❌ Bad - Direct access
const hasFeature = PLANS[planName].limits.teamManagement;
```

### 4. Keep Translations Separate

```typescript
// ✅ Good - Use translation keys
const description = t(getPlanDescriptionKey(planName));

// ❌ Bad - Hardcoded text
const description = 'Perfect for freelancers';
```

## 🐛 Troubleshooting

### Common Issues:

1. **Plan not found**: Make sure the plan name exists in `PLAN_ORDER`
2. **Feature not found**: Check if the feature key exists in `FEATURE_COMPARISON`
3. **Translation missing**: Verify the translation key exists in the message files
4. **Type errors**: Use the proper `PlanName` type instead of strings

### Debugging:

```typescript
// Check if plan exists
console.log('Available plans:', PLAN_ORDER);

// Check if feature exists
console.log(
  'Available features:',
  FEATURE_COMPARISON.map((f) => f.featureKey)
);

// Check plan data
console.log('Plan data:', getPlanSummary('freelancer'));
```

## 📈 Future Enhancements

The system is designed to be easily extensible:

1. **Add new plans**: Add to `PLANS` object and `PLAN_ORDER` array
2. **Add new features**: Add to `FEATURE_COMPARISON` array
3. **Add new limits**: Add to `PlanLimits` interface
4. **Add new utilities**: Add functions to `plans.ts`

This centralized approach ensures consistency and makes it easy to manage your pricing and features across the entire application!
