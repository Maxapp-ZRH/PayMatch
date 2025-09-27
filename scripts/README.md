# PayMatch Screenshot Scripts

This directory contains scripts for automatically generating social media images and screenshots of the PayMatch application.

## Capture Script

The `capture.ts` script uses Puppeteer to automatically screenshot the PayMatch homepage and generate social media images.

### Features

- **OG Image Generation**: Creates 1200x630px images for Facebook, LinkedIn, Twitter
- **Multiple Sizes**: Generates different dimensions for various platforms
- **High DPI**: 2x device scale factor for crisp, retina-quality images
- **Auto-copy**: Automatically copies the main image to `/public/og-image.png`

### Usage

1. **Install dependencies** (if not already installed):

   ```bash
   npm install
   ```

2. **Start your development server**:

   ```bash
   npm run dev
   ```

3. **Run the capture script**:
   ```bash
   npm run capture:og
   ```

### Generated Files

The script creates files in `.paymatch/screenshots/`:

- `og-image-raw.png` - Raw 1200x630px screenshot
- `twitter-image.png` - 1200x600px Twitter card image
- `mobile-preview.png` - 390x844px mobile preview

And copies the main image to:

- `public/og-image.png` - Main OG image for social sharing

### Configuration

The script is configured to:

- Screenshot `http://localhost:3000`
- Wait for the hero section to load (`data-testid="hero"`)
- Use 2x device scale factor for high-quality images
- Generate multiple sizes for different platforms

### Customization

You can modify the script to:

- Change the URL to screenshot
- Adjust viewport dimensions
- Add more image sizes
- Modify the wait conditions
- Change the output directory

### Troubleshooting

**Script fails to connect:**

- Make sure your dev server is running on `localhost:3000`
- Check that the port is not blocked

**Hero section not found:**

- The script looks for `data-testid="hero"` on the page
- Make sure the Hero component has this attribute

**Images are blurry:**

- The script uses 2x device scale factor
- Check that your CSS renders properly at high DPI

**Timeout errors:**

- Increase the timeout values in the script
- Check that your page loads quickly enough

### Dependencies

- `puppeteer` - Headless Chrome automation
- `tsx` - TypeScript execution
- `fs` - File system operations
- `path` - Path utilities

### Integration

The generated `og-image.png` is automatically used by:

- Open Graph meta tags in `layout.tsx`
- Twitter Card meta tags
- Social media sharing previews
- PWA manifest (if configured)

This ensures your social media previews always show the current state of your homepage!
