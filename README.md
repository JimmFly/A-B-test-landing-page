# Soku AI Landing Pages

🚀 **Automated Advertising Agent Landing Pages with A/B Testing**

A modern, high-performance landing page system built for Soku AI - the one-stop automated advertising agent that automates your entire marketing team. Features comprehensive A/B testing capabilities, real-time analytics, and conversion tracking.

> **Note**: This project has been simplified by removing middleware and security configurations for easier setup and maintenance.

## ✨ Features

- 🎯 **Dual Landing Page Variants** - Professional vs. Urgency-driven approaches
- 📊 **Real-time A/B Testing** - Live conversion tracking and analytics dashboard
- ⚡ **High Performance** - Built with Next.js 14, optimized for speed
- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS and Framer Motion
- 📈 **Analytics Integration** - Comprehensive user behavior tracking
- 🔧 **Developer Experience** - TypeScript, oxlint, Prettier, and modern tooling

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Linting**: oxlint (replacing ESLint for better performance)
- **Formatting**: Prettier
- **Package Manager**: Yarn 4 (Berry) with PnP
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Testing**: Jest with Testing Library

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn 4 (automatically managed via packageManager field)

### Installation

```bash
# Clone the repository
git clone git@github.com:JimmFly/jimmy-yang-frontend-interview.git
cd soku-ai-landing-pages

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Available Scripts

```bash
# Development
yarn dev              # Start development server at http://localhost:3000
yarn build            # Build for production
yarn start            # Start production server

# Code Quality
yarn lint             # Run oxlint for code linting
yarn format           # Format code with Prettier
yarn type-check       # Run TypeScript type checking
yarn check-all        # Run all checks (lint + format + type-check)

# Testing
yarn test             # Run Jest tests
yarn test:watch       # Run tests in watch mode
```

## 📦 Package Management

This project uses **Yarn 4 (Berry)** with Plug'n'Play (PnP) for faster installs and better dependency management.

### Key Features:

- **Zero Installs**: Dependencies are stored in `.yarn/cache`
- **PnP Mode**: No `node_modules` folder, faster resolution
- **Workspace Support**: Ready for monorepo setup
- **Better Security**: Stricter dependency resolution

### Yarn 4 Commands:

```bash
# Add a dependency
yarn add package-name

# Add a dev dependency
yarn add -D package-name

# Remove a dependency
yarn remove package-name

# Update dependencies
yarn up

# Check for outdated packages
yarn outdated

# Run scripts
yarn dev
yarn build
yarn test
```

## 🧪 A/B Testing System

The project features a comprehensive A/B testing system with two distinct landing page variants:

### Landing Page Variants

- **🏢 Variant A** (`/landing-a`) - **Professional & Automation-Focused**
  - Clean, corporate design
  - Emphasizes automation and efficiency
  - Trust-building elements and testimonials
  - Detailed feature explanations

- **⚡ Variant B** (`/landing-b`) - **Aggressive & Urgency-Driven**
  - Bold, high-contrast design
  - Urgency-focused messaging
  - Limited-time offers and scarcity tactics
  - Action-oriented CTAs

### Analytics Dashboard

- **📊 Real-time Metrics**: Visit `/analytics` to view live A/B test results
- **📈 Conversion Tracking**: Monitor signup rates and user engagement
- **🎯 Performance Comparison**: Side-by-side variant performance analysis
- **📱 Device Analytics**: Desktop vs. mobile conversion insights

## 🏗️ Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── analytics/         # 📊 A/B test analytics dashboard
│   │   └── page.tsx       # Analytics page with real-time metrics
│   ├── api/              # 🔌 API routes
│   │   └── analytics/    # Analytics API endpoints
│   ├── landing-a/        # 🏢 Professional landing page variant
│   │   └── page.tsx      # Variant A implementation
│   ├── landing-b/        # ⚡ Urgency-driven landing page variant
│   │   └── page.tsx      # Variant B implementation
│   ├── globals.css       # Global styles and Tailwind imports
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page (redirects to variants)
├── components/           # 🧩 Reusable React components
│   ├── layout/          # Layout-specific components
│   │   ├── CTASection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── HeroSection.tsx
│   └── ui/              # UI components and primitives
├── hooks/               # 🎣 Custom React hooks
│   └── useLandingPage.ts # Landing page logic and analytics
├── lib/                 # 📚 Utility libraries and configurations
├── types/               # 📝 TypeScript type definitions
├── utils/               # 🛠️ Helper functions and utilities
├── .yarn/               # 📦 Yarn 4 cache and configuration
├── .yarnrc.yml         # Yarn configuration
├── oxlintrc.json       # oxlint configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── yarn.lock           # Dependency lock file
```

## 🔧 Configuration

### Yarn 4 Configuration (`.yarnrc.yml`)

- **nodeLinker**: `pnp` - Use Plug'n'Play for faster installs
- **pnpMode**: `loose` - Better compatibility with legacy packages
- **enableGlobalCache**: `true` - Share cache across projects
- **packageManager**: Automatically managed via package.json

### oxlint Configuration (`oxlintrc.json`)

Replaced ESLint with oxlint for significantly better performance:

- **10-100x faster** than ESLint
- **Zero configuration** required for most use cases
- **TypeScript support** out of the box
- **React hooks** and **Next.js** rules included

### Environment Variables

Create a `.env.local` file for local development:

```bash
# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true

# Development Settings
NEXT_PUBLIC_DEV_MODE=true

# API Configuration (if needed)
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📊 Analytics & Tracking

Comprehensive analytics system for monitoring A/B test performance:

- **📈 Page Views**: Track visits to each landing page variant
- **👤 User Interactions**: Monitor button clicks, form submissions, and scroll behavior
- **🎯 A/B Test Assignment**: Automatic variant assignment and tracking
- **💰 Conversion Tracking**: Measure signup rates and conversion funnels
- **⏱️ Real-time Dashboard**: Live metrics at `/analytics`
- **📱 Device Analytics**: Performance breakdown by device type

## 🚀 Deployment

### Production Build

```bash
# Run all quality checks
yarn check-all

# Build the application
yarn build

# Start production server
yarn start
```

### Deployment Platforms

This project is optimized for deployment on:

- **Vercel** (Recommended) - Zero configuration deployment
- **Netlify** - Static site hosting with serverless functions
- **Docker** - Containerized deployment

## 🤝 Contributing

### Development Workflow

1. **Setup**: `yarn install`
2. **Branch**: Create a feature branch from `main`
3. **Develop**: Make your changes with `yarn dev`
4. **Quality**: Run `yarn check-all` before committing
5. **Test**: Ensure all tests pass with `yarn test`
6. **Build**: Verify production build with `yarn build`
7. **PR**: Submit a pull request with clear description

### Code Standards

- **TypeScript**: Strict type checking enabled
- **oxlint**: Fast linting with zero configuration
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Use semantic commit messages

## 🔗 Useful Links

- **🏠 Landing Page A**: [http://localhost:3000/landing-a](http://localhost:3000/landing-a)
- **⚡ Landing Page B**: [http://localhost:3000/landing-b](http://localhost:3000/landing-b)
- **📊 Analytics Dashboard**: [http://localhost:3000/analytics](http://localhost:3000/analytics)
- **📚 Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **🎨 Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **🧶 Yarn 4 Documentation**: [https://yarnpkg.com/](https://yarnpkg.com/)

## 🏆 Performance Features

- ⚡ **oxlint**: 10-100x faster than ESLint
- 🚀 **Next.js 14**: Latest App Router with optimizations
- 📦 **Yarn PnP**: Zero-install, faster dependency resolution
- 🎯 **TypeScript**: Full type safety and IntelliSense
- 🎨 **Tailwind CSS**: Utility-first, optimized CSS
- 🎬 **Framer Motion**: Smooth, performant animations

## 📝 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for Soku AI** - Automating your entire marketing team with AI-powered advertising agents.
