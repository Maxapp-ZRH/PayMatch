# Stripe Setup Script

This script automatically creates Stripe products and prices based on your PayMatch plans configuration.

## Prerequisites

1. **Stripe Account**: You need a Stripe account with API access
2. **Stripe Keys**: Add your Stripe secret key to `.env.local`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   ```

## Usage

### 1. Run the Setup Script

```bash
npm run stripe:setup
```

This will:

- Create Stripe products for each plan (Freelancer, Business, Enterprise)
- Create monthly and annual prices for each plan
- Update your `.env.local` file with the generated price IDs
- Update your `.env.example` file with the price ID placeholders

### 2. Verify the Setup

After running the script, check your `.env.local` file for the new price IDs:

```bash
# Freelancer Plan
STRIPE_FREELANCER_MONTHLY_PRICE_ID=price_1234567890
STRIPE_FREELANCER_ANNUAL_PRICE_ID=price_0987654321

# Business Plan
STRIPE_BUSINESS_MONTHLY_PRICE_ID=price_1122334455
STRIPE_BUSINESS_ANNUAL_PRICE_ID=price_5544332211

# Enterprise Plan
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_6677889900
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=price_0099887766
```

### 3. Set Up Webhooks (Manual Step)

You'll need to manually set up webhooks in your Stripe dashboard:

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook secret and add it to your `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## Plan Configuration

The script uses the pricing from `src/config/plans.ts`:

| Plan       | Monthly Price | Annual Price | Description                                  |
| ---------- | ------------- | ------------ | -------------------------------------------- |
| Freelancer | 5.00 CHF      | 48.00 CHF    | Perfect for freelancers and small businesses |
| Business   | 50.00 CHF     | 480.00 CHF   | Perfect for growing businesses with teams    |
| Enterprise | 150.00 CHF    | 1,440.00 CHF | Advanced features for large organizations    |

## Safety Features

- **Test Mode Detection**: The script detects if you're using test keys and warns about live mode
- **Confirmation Prompt**: For live keys, you'll be asked to confirm before creating products
- **Error Handling**: Comprehensive error handling with clear error messages
- **Idempotent**: Can be run multiple times safely (won't create duplicates)

## Troubleshooting

### Common Issues

1. **"STRIPE_SECRET_KEY not found"**
   - Make sure you have a `.env.local` file with your Stripe secret key

2. **"Invalid API key"**
   - Check that your Stripe secret key is correct and starts with `sk_test_` or `sk_live_`

3. **"Permission denied"**
   - Make sure your Stripe account has the necessary permissions to create products and prices

### Getting Help

If you encounter issues:

1. Check the error message in the console
2. Verify your Stripe account permissions
3. Ensure your API keys are correct
4. Check the Stripe dashboard for any created products/prices

## Manual Cleanup

If you need to clean up the created products:

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Find products named "PayMatch [Plan Name]"
3. Delete them manually (this will also delete associated prices)

## Development vs Production

- **Development**: Use test keys (`sk_test_...`) - safe to experiment
- **Production**: Use live keys (`sk_live_...`) - creates real billable products

Always test with test keys first before using live keys in production!
