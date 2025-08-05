'use client';

import { motion } from 'framer-motion';
import Head from 'next/head';
import HeroSection from '@/components/layout/HeroSection';
import FeaturesSection from '@/components/layout/FeaturesSection';
import CTASection from '@/components/layout/CTASection';
import Footer from '@/components/layout/Footer';
import WaitlistForm from '@/components/ui/WaitlistForm';
import SuccessMessage from '@/components/ui/SuccessMessage';
import { useLandingPage } from '@/hooks/useLandingPage';

/**
 * Landing Page A - Clean, professional design focused on automation benefits
 * Optimized with custom hook for better performance and code reuse
 */
export default function LandingPageA() {
  const {
    showWaitlistForm,
    showSuccessMessage,
    userEmail,
    handleSignupClick,
    handleWaitlistSubmit,
    setShowWaitlistForm,
    setShowSuccessMessage,
  } = useLandingPage({ variant: 'A' });

  const variant = 'A' as const;

  return (
    <>
      <Head>
        <title>Soku AI - Automate Your Entire Marketing Team | AI-Powered Advertising</title>
        <meta
          name="description"
          content="Soku AI automates your entire advertising workflow from creative generation to cross-platform optimization. Save time, reduce costs, and scale your marketing with AI."
        />
        <meta
          name="keywords"
          content="AI marketing, automated advertising, marketing automation, ad optimization, cross-platform campaigns"
        />
        <meta property="og:title" content="Soku AI - Automate Your Entire Marketing Team" />
        <meta
          property="og:description"
          content="The one-stop automated advertising agent that replaces your entire marketing team. Join the waitlist for early access."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Soku AI - Automate Your Entire Marketing Team" />
        <meta
          name="twitter:description"
          content="AI-powered marketing automation for SMBs. Join the waitlist for early access."
        />
        <link rel="canonical" href="https://soku-ai.com/landing-a" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <HeroSection variant={variant} onSignupClick={handleSignupClick} />

        {/* Features Section */}
        <FeaturesSection variant={variant} />

        {/* CTA Section */}
        <CTASection variant={variant} onSignupClick={handleSignupClick} />

        {/* Footer */}
        <Footer />

        {/* Waitlist Form Modal */}
        {showWaitlistForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowWaitlistForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <WaitlistForm variant={variant} onSubmit={handleWaitlistSubmit} />
            </motion.div>
          </motion.div>
        )}

        {/* Success Message Modal */}
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowSuccessMessage(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <SuccessMessage
                variant={variant}
                email={userEmail}
                onClose={() => setShowSuccessMessage(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
