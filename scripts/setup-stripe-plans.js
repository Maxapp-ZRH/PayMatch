#!/usr/bin/env node

/**
 * Stripe Plans Setup Script
 *
 * This script creates Stripe products and prices based on the plans configuration.
 * It reads the pricing from plans.ts and creates corresponding Stripe products and prices.
 * The generated price IDs are then added to .env.local and .env.example files.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
});

// Plan configurations from plans.ts
const PLANS = {
  freelancer: {
    name: 'Freelancer',
    description: 'Perfect for freelancers and small businesses',
    pricing: { monthly: 500, annual: 4800 }, // 5 CHF monthly, 48 CHF annual
  },
  business: {
    name: 'Business',
    description: 'Perfect for growing businesses with teams',
    pricing: { monthly: 5000, annual: 48000 }, // 50 CHF monthly, 480 CHF annual
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Advanced features for large organizations',
    pricing: { monthly: 15000, annual: 144000 }, // 150 CHF monthly, 1440 CHF annual
  },
};

// Environment variable mappings
const ENV_VARS = {
  freelancer: {
    monthly: 'STRIPE_FREELANCER_MONTHLY_PRICE_ID',
    annual: 'STRIPE_FREELANCER_ANNUAL_PRICE_ID',
  },
  business: {
    monthly: 'STRIPE_BUSINESS_MONTHLY_PRICE_ID',
    annual: 'STRIPE_BUSINESS_ANNUAL_PRICE_ID',
  },
  enterprise: {
    monthly: 'STRIPE_ENTERPRISE_MONTHLY_PRICE_ID',
    annual: 'STRIPE_ENTERPRISE_ANNUAL_PRICE_ID',
  },
};

async function createStripeProduct(planKey, planConfig) {
  console.log(`\n📦 Creating product for ${planConfig.name}...`);

  try {
    const product = await stripe.products.create({
      name: `PayMatch ${planConfig.name}`,
      description: planConfig.description,
      metadata: {
        plan_key: planKey,
        paymatch_plan: 'true',
      },
    });

    console.log(`✅ Product created: ${product.id}`);
    return product;
  } catch (error) {
    console.error(
      `❌ Error creating product for ${planConfig.name}:`,
      error.message
    );
    throw error;
  }
}

async function createStripePrice(productId, planKey, planConfig, billingCycle) {
  const amount = planConfig.pricing[billingCycle];
  const interval = billingCycle === 'monthly' ? 'month' : 'year';

  console.log(
    `💰 Creating ${billingCycle} price for ${planConfig.name} (${amount} cents CHF)...`
  );

  try {
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: amount,
      currency: 'chf',
      recurring: {
        interval: interval,
      },
      metadata: {
        plan_key: planKey,
        billing_cycle: billingCycle,
        paymatch_plan: 'true',
      },
    });

    console.log(`✅ Price created: ${price.id}`);
    return price;
  } catch (error) {
    console.error(
      `❌ Error creating ${billingCycle} price for ${planConfig.name}:`,
      error.message
    );
    throw error;
  }
}

async function setupStripePlans() {
  console.log('🚀 Setting up Stripe plans and products...\n');

  const priceIds = {};

  try {
    for (const [planKey, planConfig] of Object.entries(PLANS)) {
      // Create product
      const product = await createStripeProduct(planKey, planConfig);

      // Create monthly price
      const monthlyPrice = await createStripePrice(
        product.id,
        planKey,
        planConfig,
        'monthly'
      );
      priceIds[ENV_VARS[planKey].monthly] = monthlyPrice.id;

      // Create annual price
      const annualPrice = await createStripePrice(
        product.id,
        planKey,
        planConfig,
        'annual'
      );
      priceIds[ENV_VARS[planKey].annual] = annualPrice.id;
    }

    console.log('\n🎉 All Stripe plans created successfully!');
    console.log('\n📋 Generated Price IDs:');
    Object.entries(priceIds).forEach(([key, value]) => {
      console.log(`  ${key}=${value}`);
    });

    return priceIds;
  } catch (error) {
    console.error('\n❌ Error setting up Stripe plans:', error.message);
    process.exit(1);
  }
}

function updateEnvFile(filePath, priceIds) {
  console.log(`\n📝 Updating ${filePath}...`);

  try {
    let envContent = '';

    // Read existing file if it exists
    if (fs.existsSync(filePath)) {
      envContent = fs.readFileSync(filePath, 'utf8');
    }

    // Add or update Stripe price ID variables
    const lines = envContent.split('\n');
    const updatedLines = [];
    const addedVars = new Set();

    // Process existing lines
    for (const line of lines) {
      let shouldSkip = false;

      // Check if this line contains a Stripe price ID variable
      for (const [envVar] of Object.entries(priceIds)) {
        if (line.startsWith(`${envVar}=`)) {
          // Update existing variable
          updatedLines.push(`${envVar}=${priceIds[envVar]}`);
          addedVars.add(envVar);
          shouldSkip = true;
          break;
        }
      }

      if (!shouldSkip) {
        updatedLines.push(line);
      }
    }

    // Add new variables that weren't found
    for (const [envVar, value] of Object.entries(priceIds)) {
      if (!addedVars.has(envVar)) {
        updatedLines.push(`${envVar}=${value}`);
      }
    }

    // Write updated content
    const updatedContent = updatedLines.join('\n');
    fs.writeFileSync(filePath, updatedContent);

    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

async function main() {
  // Check if Stripe secret key is provided
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
    console.log('Please add your Stripe secret key to .env.local:');
    console.log('STRIPE_SECRET_KEY=sk_test_...');
    process.exit(1);
  }

  // Check if we're in test mode
  const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
  console.log(`🔧 Running in ${isTestMode ? 'TEST' : 'LIVE'} mode`);

  if (!isTestMode) {
    console.log('⚠️  WARNING: You are using a LIVE Stripe key!');

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
      rl.question(
        'Are you sure you want to create LIVE products? (yes/no): ',
        resolve
      );
    });

    rl.close();

    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Aborted by user');
      process.exit(0);
    }
  }

  try {
    // Create Stripe plans
    const priceIds = await setupStripePlans();

    // Update environment files
    const projectRoot = path.join(__dirname, '..');
    updateEnvFile(path.join(projectRoot, '.env.local'), priceIds);
    updateEnvFile(path.join(projectRoot, '.env.production'), priceIds);

    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Next steps:');
    console.log(
      '1. Verify the price IDs in your .env.local and .env.production files'
    );
    console.log('2. Test the plan selection in your application');
    console.log('3. Set up webhook endpoints in Stripe dashboard');
    console.log('4. Add webhook secret to your .env.local:');
    console.log('   STRIPE_WEBHOOK_SECRET=whsec_...');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { setupStripePlans, updateEnvFile };
