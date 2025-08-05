'use client';

import { memo, useMemo, useCallback } from 'react';
import { CTASectionProps } from '@/types';
import { motion } from 'framer-motion';

// Static content configuration
const CTA_CONTENT = {
  A: {
    title: 'Ready to Automate Your Marketing?',
    subtitle:
      'Join the waitlist and be among the first to experience the future of automated advertising.',
    cta: 'Get Early Access',
    benefits: [
      'Early access to all features',
      'Priority customer support',
      'Exclusive onboarding session',
      'Special launch pricing',
    ],
    bgClass: 'bg-gradient-to-r from-primary-600 to-primary-700',
    textClass: 'text-white',
    ctaClass: 'bg-white text-primary-600 hover:bg-gray-100',
  },
  B: {
    title: '🚨 Limited Time: Skip the $10K Agency Fees Forever',
    subtitle:
      'Join 5,000+ smart marketers who already secured their spot. Early access closes soon!',
    cta: '🔥 Claim My Spot Now',
    benefits: [
      '🎁 50% OFF lifetime pricing',
      '⚡ Skip the 6-month waitlist',
      '🏆 VIP onboarding & training',
      '💎 Exclusive beta features access',
    ],
    bgClass: 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600',
    textClass: 'text-white',
    ctaClass: 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold shadow-2xl',
  },
};

/**
 * Call-to-action section component with variant-specific messaging
 */
function CTASection({ variant, onSignupClick }: CTASectionProps) {
  // Memoize variant content
  const variantContent = useMemo(() => CTA_CONTENT[variant], [variant]);

  // Memoize click handler
  const handleSignupClick = useCallback(() => {
    onSignupClick();
  }, [onSignupClick]);

  // Memoize animation configurations
  const mainAnimation = useMemo(
    () => ({
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      viewport: { once: true },
    }),
    []
  );

  const benefitsAnimation = useMemo(
    () => ({
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.2 },
      viewport: { once: true },
    }),
    []
  );

  const ctaAnimation = useMemo(
    () => ({
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.4 },
      viewport: { once: true },
    }),
    []
  );

  const socialProofAnimation = useMemo(
    () => ({
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration: 0.6, delay: 0.6 },
      viewport: { once: true },
    }),
    []
  );

  const trustAnimation = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.8 },
      viewport: { once: true },
    }),
    []
  );

  // Memoize trust indicators
  const trustIndicators = useMemo(() => ['TechCorp', 'StartupXYZ', 'GrowthCo', 'ScaleLabs'], []);

  // Memoize avatar placeholders
  const avatarPlaceholders = useMemo(
    () => [1, 2, 3, 4, 5].map(i => String.fromCharCode(64 + i)),
    []
  );

  return (
    <section className={`section-padding ${variantContent.bgClass} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-max relative">
        <div className="text-center">
          {/* Main Content */}
          <motion.div {...mainAnimation} className="mb-12">
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold ${variantContent.textClass} mb-6`}
            >
              {variantContent.title}
            </h2>
            <p
              className={`text-xl ${variantContent.textClass} opacity-90 max-w-3xl mx-auto leading-relaxed`}
            >
              {variantContent.subtitle}
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            {...benefitsAnimation}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {variantContent.benefits.map((benefit, index) => (
              <motion.div
                key={`${variant}-benefit-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className={`${variantContent.textClass} font-semibold text-center`}>
                  {benefit}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div {...ctaAnimation} className="mb-8">
            <button
              onClick={handleSignupClick}
              className={`
                ${variantContent.ctaClass}
                text-xl px-12 py-4 rounded-xl font-semibold
                transition-all duration-200 transform hover:scale-105
                focus:outline-none focus:ring-4 focus:ring-white/30
                ${variant === 'B' ? 'animate-pulse' : ''}
              `}
            >
              {variantContent.cta}
            </button>
          </motion.div>

          {/* Urgency/Social Proof */}
          <motion.div
            {...socialProofAnimation}
            className={`${variantContent.textClass} opacity-80`}
          >
            {variant === 'A' ? (
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex -space-x-2">
                  {avatarPlaceholders.map((letter, i) => (
                    <div
                      key={`avatar-${i}`}
                      className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <span>1,000+ companies already signed up</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg font-bold">⏰ Only 48 hours left at this price!</div>
                <div className="text-sm opacity-75">
                  🔥 847 spots claimed today • 🚀 Join before it&apos;s too late
                </div>
              </div>
            )}
          </motion.div>

          {/* Trust Indicators */}
          {variant === 'A' && (
            <motion.div {...trustAnimation} className="mt-12 pt-8 border-t border-white/20">
              <div className="text-white/80 text-sm mb-4">Trusted by leading companies</div>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                {trustIndicators.map((company, _index) => (
                  <div key={`trust-${company}`} className="text-white/60 font-semibold">
                    {company}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(CTASection);
