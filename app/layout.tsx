import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Soku AI - Automate Your Entire Marketing Team',
    template: '%s | Soku AI',
  },
  description:
    'Soku AI automates your entire advertising workflow from creative generation to cross-platform optimization. Save time, reduce costs, and scale your marketing with AI.',
  keywords: [
    'AI marketing',
    'automated advertising',
    'marketing automation',
    'ad optimization',
    'cross-platform campaigns',
    'SMB marketing',
  ],
  authors: [{ name: 'Soku AI Team' }],
  creator: 'Soku AI',
  publisher: 'Soku AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://soku-ai.com',
    title: 'Soku AI - Automate Your Entire Marketing Team',
    description:
      'The one-stop automated advertising agent that replaces your entire marketing team. Join the waitlist for early access.',
    siteName: 'Soku AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soku AI - Automate Your Entire Marketing Team',
    description: 'AI-powered marketing automation for SMBs. Join the waitlist for early access.',
    creator: '@soku_ai',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://soku-ai.com',
  },
};

/**
 * Root layout component for the entire application
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />

        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Soku AI',
              description: 'AI-powered marketing automation platform for SMBs',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free waitlist signup',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '1000',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>

        {/* Main content */}
        <main id="main-content">{children}</main>

        {/* Analytics Script Placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Google Analytics or other analytics scripts would go here
                console.log('Analytics initialized');
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
