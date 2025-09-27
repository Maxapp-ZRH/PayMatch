#!/usr/bin/env tsx

import puppeteer, { Page } from 'puppeteer';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.join(process.cwd(), '.paymatch', 'screenshots');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Ensure directories exist
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function captureOGImage() {
  console.log('🚀 Starting PayMatch OG image capture...');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();

    // Set viewport for OG image dimensions (1200x630)
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2, // Higher DPI for crisp images
    });

    // Set user agent for consistent rendering
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    console.log('📱 Navigating to localhost:3000...');

    // Navigate to your local development server
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle0', // Wait for all network requests to finish
      timeout: 30000,
    });

    // Wait for the hero section to be fully loaded
    console.log('⏳ Waiting for hero section to load...');
    await page
      .waitForSelector('[data-testid="hero"]', { timeout: 10000 })
      .catch(() => {
        console.log(
          '⚠️  Hero selector not found, proceeding with full page...'
        );
      });

    // Wait a bit more for any animations or lazy loading
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Hide banners and overlays before taking screenshot
    console.log('🚫 Hiding banners and overlays...');
    await page.evaluate(() => {
      // Hide PWA banners (InstallBanner and UpdateNotification)
      const pwaBanners = document.querySelectorAll(
        '[class*="pwa"], [class*="install"], [class*="banner"], [class*="update"]'
      );
      pwaBanners.forEach((banner) => {
        if (banner instanceof HTMLElement) {
          banner.style.display = 'none';
        }
      });

      // Hide cookie banners
      const cookieBanners = document.querySelectorAll(
        '[class*="cookie"], [class*="consent"], [class*="gdpr"]'
      );
      cookieBanners.forEach((banner) => {
        if (banner instanceof HTMLElement) {
          banner.style.display = 'none';
        }
      });

      // Hide notification banners
      const notificationBanners = document.querySelectorAll(
        '[class*="notification"], [class*="alert"], [class*="toast"]'
      );
      notificationBanners.forEach((banner) => {
        if (banner instanceof HTMLElement) {
          banner.style.display = 'none';
        }
      });

      // Hide scroll-to-top button
      const scrollButtons = document.querySelectorAll(
        '[class*="scroll"], [class*="top"]'
      );
      scrollButtons.forEach((button) => {
        if (button instanceof HTMLElement) {
          button.style.display = 'none';
        }
      });

      // Hide any fixed positioned overlays
      const fixedOverlays = document.querySelectorAll(
        '[style*="position: fixed"], [style*="position:fixed"]'
      );
      fixedOverlays.forEach((overlay) => {
        if (overlay instanceof HTMLElement) {
          // Only hide if it's not the main content
          if (
            !overlay.closest('main') &&
            !overlay.closest('[data-testid="hero"]')
          ) {
            overlay.style.display = 'none';
          }
        }
      });

      // Hide any elements with z-index >= 40 (PWA banners)
      const highZIndexElements = document.querySelectorAll('*');
      highZIndexElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          const zIndex = window.getComputedStyle(element).zIndex;
          if (zIndex && parseInt(zIndex) >= 40) {
            // Only hide if it's not the main content
            if (
              !element.closest('main') &&
              !element.closest('[data-testid="hero"]')
            ) {
              element.style.display = 'none';
            }
          }
        }
      });
    });

    // Wait a moment for the hiding to take effect
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Take screenshot of the full viewport (1200x630)
    console.log('📸 Capturing screenshot...');
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false, // Only capture viewport
      omitBackground: false,
    });

    // Save to .paymatch/screenshots
    const screenshotPath = path.join(SCREENSHOT_DIR, 'og-image-raw.png');
    fs.writeFileSync(screenshotPath, screenshot);
    console.log(`✅ Raw screenshot saved to: ${screenshotPath}`);

    // Copy to public directory as og-image.png
    const publicPath = path.join(PUBLIC_DIR, 'og-image.png');
    fs.copyFileSync(screenshotPath, publicPath);
    console.log(`✅ OG image copied to: ${publicPath}`);

    // Generate additional sizes if needed
    await generateAdditionalSizes(page);

    console.log('🎉 OG image capture completed successfully!');
    console.log(`📁 Files created:`);
    console.log(`   - ${screenshotPath}`);
    console.log(`   - ${publicPath}`);
  } catch (error) {
    console.error('❌ Error capturing OG image:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

async function generateAdditionalSizes(page: Page) {
  console.log('📐 Generating additional sizes...');

  // Generate Twitter card size (1200x600)
  await page.setViewport({ width: 1200, height: 600, deviceScaleFactor: 2 });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Hide banners for Twitter card
  await page.evaluate(() => {
    const banners = document.querySelectorAll(
      '[class*="pwa"], [class*="install"], [class*="banner"], [class*="update"], [class*="cookie"], [class*="consent"], [class*="notification"], [class*="scroll"], [class*="top"]'
    );
    banners.forEach((banner) => {
      if (banner instanceof HTMLElement) {
        banner.style.display = 'none';
      }
    });

    // Hide elements with z-index >= 40
    const highZElements = document.querySelectorAll('*');
    highZElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const zIndex = window.getComputedStyle(element).zIndex;
        if (zIndex && parseInt(zIndex) >= 40) {
          if (
            !element.closest('main') &&
            !element.closest('[data-testid="hero"]')
          ) {
            element.style.display = 'none';
          }
        }
      }
    });
  });

  const twitterScreenshot = await page.screenshot({
    type: 'png',
    fullPage: false,
  });

  const twitterPath = path.join(SCREENSHOT_DIR, 'twitter-image.png');
  fs.writeFileSync(twitterPath, twitterScreenshot);
  console.log(`✅ Twitter image saved to: ${twitterPath}`);

  // Generate mobile preview (390x844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Hide banners for mobile preview
  await page.evaluate(() => {
    const banners = document.querySelectorAll(
      '[class*="pwa"], [class*="install"], [class*="banner"], [class*="update"], [class*="cookie"], [class*="consent"], [class*="notification"], [class*="scroll"], [class*="top"]'
    );
    banners.forEach((banner) => {
      if (banner instanceof HTMLElement) {
        banner.style.display = 'none';
      }
    });

    // Hide elements with z-index >= 40
    const highZElements = document.querySelectorAll('*');
    highZElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const zIndex = window.getComputedStyle(element).zIndex;
        if (zIndex && parseInt(zIndex) >= 40) {
          if (
            !element.closest('main') &&
            !element.closest('[data-testid="hero"]')
          ) {
            element.style.display = 'none';
          }
        }
      }
    });
  });

  const mobileScreenshot = await page.screenshot({
    type: 'png',
    fullPage: false,
  });

  const mobilePath = path.join(SCREENSHOT_DIR, 'mobile-preview.png');
  fs.writeFileSync(mobilePath, mobileScreenshot);
  console.log(`✅ Mobile preview saved to: ${mobilePath}`);
}

// Run the capture function
captureOGImage().catch(console.error);
