# PayMatch PWA Setup

PayMatch is configured as a Progressive Web App (PWA) to provide a native app-like experience for Swiss invoicing and payment reconciliation.

## Features

### Core PWA Features

- **Installable**: Users can install PayMatch on their devices
- **Offline Support**: Works offline with cached content
- **Background Sync**: Syncs data when connection is restored
- **Push Notifications**: Real-time updates and reminders
- **App Shortcuts**: Quick access to common actions

### Offline Capabilities

- Create and edit invoices offline
- View dashboard and client data
- Access cached invoice templates
- Sync changes when back online

## Files Structure

```
public/
├── site.webmanifest          # PWA manifest
├── sw.js                     # Service worker
├── offline.html              # Offline fallback page
├── browserconfig.xml         # Windows tile configuration
└── icons/                    # App icons (to be created)

src/
├── hooks/
│   └── use-pwa.ts           # PWA state management hook
└── components/pwa/
    ├── InstallBanner.tsx    # Install prompt banner
    ├── UpdateNotification.tsx # Update notification
    └── StatusIndicator.tsx  # PWA status indicator
```

## Required Assets

### App Icons

Create the following icon sizes in `/public/icons/`:

- `icon-72x72.png` - 72x72px
- `icon-96x96.png` - 96x96px
- `icon-128x128.png` - 128x128px
- `icon-144x144.png` - 144x144px
- `icon-152x152.png` - 152x152px
- `icon-192x192.png` - 192x192px
- `icon-384x384.png` - 384x384px
- `icon-512x512.png` - 512x512px

### Shortcut Icons

- `shortcut-invoice.png` - 96x96px
- `shortcut-dashboard.png` - 96x96px
- `shortcut-reconcile.png` - 96x96px

### Screenshots

- `screenshots/desktop-invoice.png` - 1280x720px
- `screenshots/mobile-dashboard.png` - 390x844px

### Social Media Images

- `og-image.png` - 1200x630px
- `twitter-image.png` - 1200x630px

## Configuration

### Manifest Configuration

The `site.webmanifest` includes:

- App name and description
- Theme colors (PayMatch brand colors)
- Display mode (standalone)
- App shortcuts for quick actions
- Screenshots for app stores

### Service Worker

The `sw.js` provides:

- Static file caching
- API response caching
- Offline fallback
- Background sync
- Push notification handling

### PWA Hook

The `usePWA` hook manages:

- Installation state
- Online/offline status
- Service worker registration
- Update notifications

## Usage

### Install Banner

The install banner automatically appears when:

- The app is installable
- User hasn't dismissed it
- App isn't already installed

### Update Notifications

Users are notified when:

- A new version is available
- Service worker updates
- App needs to be refreshed

### Offline Mode

When offline, users can:

- Access cached pages
- Create new invoices
- View existing data
- Changes sync when online

## Testing

### Local Testing

1. Start the development server
2. Open Chrome DevTools
3. Go to Application > Service Workers
4. Check "Update on reload"
5. Test offline functionality

### PWA Audit

1. Open Chrome DevTools
2. Go to Lighthouse
3. Select "Progressive Web App"
4. Run audit
5. Address any issues

### Installation Testing

1. Visit the app in Chrome
2. Look for install banner
3. Click "Install" button
4. Verify app installs correctly
5. Test app shortcuts

## Deployment

### Vercel Configuration

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/site.webmanifest",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ]
}
```

### HTTPS Requirement

PWAs require HTTPS in production. Vercel provides this automatically.

## Browser Support

### Supported Browsers

- Chrome 68+
- Firefox 60+
- Safari 11.1+
- Edge 79+

### Feature Support

- **Install Prompt**: Chrome, Edge, Samsung Internet
- **Background Sync**: Chrome, Edge
- **Push Notifications**: Chrome, Firefox, Edge
- **App Shortcuts**: Chrome, Edge

## Performance

### Caching Strategy

- **Static Files**: Cached on install
- **API Responses**: Cached for 1 hour
- **Images**: Cached for 1 day
- **Offline Fallback**: Always available

### Bundle Size

- Service Worker: ~5KB
- PWA Components: ~3KB
- Total PWA Overhead: ~8KB

## Security

### Service Worker Security

- HTTPS only
- Same-origin requests only
- No sensitive data in cache
- Secure headers

### Data Protection

- No personal data in service worker
- Encrypted API requests
- Secure offline storage
- GDPR compliant

## Monitoring

### Analytics

Track PWA metrics:

- Installation rate
- Offline usage
- Update adoption
- Performance metrics

### Error Tracking

Monitor:

- Service worker errors
- Cache failures
- Offline functionality
- Update issues

## Troubleshooting

### Common Issues

1. **Install banner not showing**
   - Check HTTPS
   - Verify manifest
   - Clear browser data

2. **Offline not working**
   - Check service worker registration
   - Verify cache strategy
   - Test network conditions

3. **Updates not applying**
   - Check service worker version
   - Verify update logic
   - Clear cache

### Debug Tools

- Chrome DevTools > Application
- Service Worker logs
- Cache inspection
- Network throttling

## Future Enhancements

### Planned Features

- Background invoice generation
- Offline payment reconciliation
- Advanced push notifications
- App store optimization
- Enhanced offline capabilities

### Performance Improvements

- Lazy loading
- Code splitting
- Image optimization
- Bundle size reduction
