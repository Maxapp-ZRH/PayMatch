# PayMatch

**Simple Invoicing for Swiss SMEs**  
_Create. Send. Get Paid. The Swiss way._

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?style=flat-square&logo=stripe)](https://stripe.com/)

---

## 🎯 Overview

PayMatch is a **cloud-based invoicing platform** built specifically for the Swiss market, enabling small businesses to create compliant QR-bill invoices, automatically reconcile payments, and manage their invoicing workflow without the complexity of traditional ERP systems.

### Key Features

- 🧾 **Swiss QR-Bill Compliance** - Generate compliant invoices with QR-bill integration
- 💳 **Stripe Integration** - Seamless payment processing with multi-currency support (CHF, EUR)
- 🔄 **Automatic Reconciliation** - Import ISO 20022 CAMT.053 files for payment matching
- 🌍 **Multi-Language Support** - German, French, Italian, and English
- 📱 **Modern UI** - Built with Next.js 15 and Shadcn/ui components
- 🔒 **Secure & Compliant** - Built-in security with Supabase Auth and RLS policies

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Supabase account
- Stripe account
- Resend account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/paymatch.git
   cd paymatch
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Resend
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

4. **Set up Supabase**

   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Start local Supabase
   supabase start

   # Apply migrations
   supabase db reset
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible components
- **Zustand** - Lightweight state management
- **Zod** - Schema validation

### Backend & Database

- **Supabase** - PostgreSQL database with real-time features
- **Supabase Auth** - Authentication and user management
- **Row Level Security (RLS)** - Database-level security policies
- **Edge Functions** - Serverless functions for complex operations

### Payments & Invoicing

- **Stripe Invoicing** - Complete invoice lifecycle management
- **Stripe Payments** - Multi-currency payment processing
- **Stripe Tax** - Automatic tax calculations
- **Swiss QR-Bill** - Compliance with Swiss invoicing standards

### Email & Communication

- **Resend** - Transactional email service
- **React Email** - Email template system

### Development & Deployment

- **Vercel** - Frontend hosting and deployment
- **GitHub Actions** - CI/CD pipeline
- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks for quality assurance

---

## 📁 Project Structure

```
paymatch/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication routes
│   │   ├── (dashboard)/    # Main application
│   │   ├── api/            # API routes
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Shadcn/ui components
│   │   └── forms/         # Form components
│   ├── features/          # Feature-based modules
│   │   ├── auth/          # Authentication
│   │   ├── invoices/      # Invoice management
│   │   ├── clients/       # Client management
│   │   └── payments/      # Payment processing
│   ├── lib/               # Utility functions
│   │   ├── supabase/      # Supabase client
│   │   ├── stripe/        # Stripe integration
│   │   └── utils.ts       # Common utilities
│   ├── schemas/           # Zod validation schemas
│   ├── types/             # TypeScript type definitions
│   └── hooks/             # Custom React hooks
├── supabase/
│   ├── migrations/        # Database migrations
│   ├── functions/         # Edge Functions
│   └── config.toml        # Supabase configuration
├── docs/                  # Documentation
│   ├── PRD.md            # Product Requirements
└── .github/workflows/     # GitHub Actions
```

---

## 🎨 Design System

PayMatch uses a modern design system built on:

- **Shadcn/ui** - High-quality, accessible components
- **Tailwind CSS 4** - Utility-first styling with custom theme
- **Geist Fonts** - Modern typography
- **Dark Mode** - Built-in dark/light theme support
- **Responsive Design** - Mobile-first approach

### Color Palette

- **Primary**: Neutral grays with accent colors
- **Semantic**: Success, warning, error, and info colors
- **Charts**: 5-color palette for data visualization

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking

# Database
npm run db:reset     # Reset local database
npm run db:types     # Generate TypeScript types
npm run db:push      # Push migrations to remote
```

### Database Management

```bash
# Start local Supabase
supabase start

# Create new migration
supabase migration new add_users_table

# Apply migrations
supabase db reset

# Generate types
supabase gen types typescript --local > src/types/database.ts
```

---

## 🌍 Global Expansion

PayMatch is designed for easy global expansion with:

- **Country Toggle System** - Enable/disable countries via admin dashboard
- **Feature Configuration** - Country-specific features and compliance
- **Multi-Currency Support** - CHF, EUR with easy expansion
- **Localization** - Multi-language support per country
- **Tax Compliance** - Country-specific tax calculations

### Supported Regions (Planned)

- **Phase 1**: Switzerland, Germany, Austria, France, Italy
- **Phase 2**: Nordic countries (Netherlands, Belgium, Denmark, Sweden, Norway)
- **Phase 3**: Southern Europe (Spain, Portugal, Greece)
- **Phase 4**: Eastern Europe (Poland, Czech Republic, Hungary)

---

## 💰 Business Model

### Pricing Tiers

- **Freemium**: 5 invoices/month, 3 clients/month
- **Freelancer/Small Business**: CHF 5/month (CHF 48/year)
- **Enterprise**: CHF 50/month (CHF 480/year)

### Features by Tier

| Feature                | Freemium | Freelancer | Enterprise |
| ---------------------- | -------- | ---------- | ---------- |
| Invoices/month         | 5        | Unlimited  | Unlimited  |
| Clients                | 3        | Unlimited  | Unlimited  |
| QR-bill generation     | ✅       | ✅         | ✅         |
| Payment reconciliation | ❌       | ✅         | ✅         |
| Multi-user             | ❌       | ❌         | ✅         |
| Priority support       | ❌       | ❌         | ✅         |
| Custom branding        | ❌       | ❌         | ✅         |

---

## 🔒 Security & Compliance

- **Data Protection**: GDPR and Swiss data protection compliance
- **Authentication**: Secure user authentication with Supabase Auth
- **Authorization**: Row Level Security (RLS) for data access control
- **Payment Security**: PCI-compliant payment processing via Stripe
- **Data Residency**: EU/Swiss data storage options

---

## 🚀 Deployment

### Production Deployment

1. **Set up production environment variables**
2. **Deploy to Vercel**: `vercel --prod`
3. **Configure Supabase**: Link production project
4. **Set up Stripe**: Configure webhooks and production keys
5. **Configure Resend**: Set up production email domain

### Environment Setup

- **Development**: Local Supabase + Stripe test mode
- **Staging**: Vercel preview + Supabase staging
- **Production**: Vercel production + Supabase production

---

## 📊 Monitoring & Analytics

- **Application Monitoring**: Vercel Analytics
- **Database Monitoring**: Supabase Dashboard
- **Payment Monitoring**: Stripe Dashboard
- **Email Monitoring**: Resend Dashboard
- **Error Tracking**: Built-in error boundaries and logging

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Follow conventional commit messages
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/paymatch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/paymatch/discussions)

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Supabase Team** - Excellent backend-as-a-service
- **Stripe Team** - Powerful payment processing
- **Shadcn/ui** - Beautiful component library
- **Vercel** - Seamless deployment platform

---

**Built with ❤️ for Swiss SMEs**
