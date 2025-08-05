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
 * Landing Page B - Aggressive, conversion-focused design with urgency and social proof
 */
export default function LandingPageB() {
  const {
    showWaitlistForm,
    showSuccessMessage,
    userEmail,
    handleSignupClick,
    handleWaitlistSubmit,
    setShowWaitlistForm,
    setShowSuccessMessage,
  } = useLandingPage({ variant: 'B' });

  const variant = 'B';

  return (
    <>
      <Head>
        <title>🚨 Skip $10K Agency Fees Forever - Soku AI Replaces Your Marketing Team</title>
        <meta
          name="description"
          content="Stop paying agencies $10K+/month! Soku AI automates everything for 90% less cost. Join 5,000+ smart marketers. Limited time offer!"
        />
        <meta
          name="keywords"
          content="replace marketing agency, AI marketing automation, save marketing costs, automated advertising, marketing AI"
        />
        <meta property="og:title" content="🚨 Skip $10K Agency Fees Forever - Soku AI" />
        <meta
          property="og:description"
          content="The AI that replaces your entire marketing department. 90% cost savings vs agencies. Join 5,000+ marketers!"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="🚨 Skip $10K Agency Fees Forever - Soku AI" />
        <meta
          name="twitter:description"
          content="Replace your marketing team with AI. 90% cost savings. Limited time offer!"
        />
        <link rel="canonical" href="https://soku-ai.com/landing-b" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Urgency Banner */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10 animate-pulse"></div>
          <div className="relative z-10">
            <span className="font-bold text-sm md:text-base">
              🔥 LIMITED TIME: 50% OFF Early Access • Only 48 Hours Left! • 847 Spots Claimed Today
            </span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <HeroSection variant={variant} onSignupClick={handleSignupClick} />

        {/* Features Section */}
        <FeaturesSection variant={variant} />

        {/* Testimonials Section */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                🏆 What Early Users Are Saying
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of marketers already saving $120K+/year
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'CMO, TechStartup',
                  quote:
                    'Soku AI replaced our $15K/month agency. Same results, 90% less cost. This is the future!',
                  savings: '$180K/year saved',
                },
                {
                  name: 'Mike Rodriguez',
                  role: 'Founder, E-commerce',
                  quote:
                    'From 6 hours of campaign setup to 5 minutes. The ROI improvement is insane!',
                  savings: '10x faster execution',
                },
                {
                  name: 'Lisa Wang',
                  role: 'Marketing Director',
                  quote:
                    'Finally, marketing automation that actually works. Our conversion rates doubled!',
                  savings: '200% conversion boost',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                    💰 {testimonial.savings}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
            onClick={e => {
              if (e.target === e.currentTarget) {
                setShowWaitlistForm(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-md w-full"
            >
              <button
                onClick={() => setShowWaitlistForm(false)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <WaitlistForm variant={variant} onSubmit={handleWaitlistSubmit} />
            </motion.div>
          </motion.div>
        )}

        {/* Success Message Modal */}
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={e => {
              if (e.target === e.currentTarget) {
                setShowSuccessMessage(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <SuccessMessage
                variant={variant}
                email={userEmail}
                onClose={() => setShowSuccessMessage(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Floating CTA Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 3, type: 'spring', bounce: 0.5 }}
          onClick={handleSignupClick}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-secondary-500 to-primary-500 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-105 z-40 font-bold text-sm animate-pulse"
        >
          🚀 Claim Spot
        </motion.button>
      </div>
    </>
  );
}
