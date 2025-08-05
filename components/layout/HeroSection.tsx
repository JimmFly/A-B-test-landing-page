'use client';

import { memo, useMemo } from 'react';
import { HeroSectionProps } from '@/types';
import { motion } from 'framer-motion';

// Static content configuration to avoid recreation on each render
const HERO_CONTENT = {
  A: {
    headline: 'Automate Your Entire Marketing Team',
    subheadline:
      'Soku AI handles everything from creative generation to cross-platform deployment and optimization—without manual effort.',
    cta: 'Get Early Access',
    features: [
      '🎯 End-to-End Automation',
      '📊 Cross-Platform Optimization',
      '💰 Lower Costs & Better Performance',
      '🚀 Rapid Channel Expansion',
    ],
    bgGradient: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
    textColor: 'text-gray-900',
    ctaStyle: 'btn-primary text-xl px-8 py-4',
  },
  B: {
    headline: '🤖 The AI That Replaces Your Entire Marketing Department',
    subheadline:
      'Stop paying agencies $10K+/month. Soku AI automates creative generation, multi-channel campaigns, and real-time optimization for a fraction of the cost.',
    cta: '🚀 Join 5,000+ Marketers',
    features: [
      '💸 Save $120K+/year vs agencies',
      '⚡ 10x faster campaign deployment',
      '📈 AI-driven performance optimization',
      '🎨 Unlimited creative variations',
    ],
    bgGradient: 'bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100',
    textColor: 'text-gray-900',
    ctaStyle: 'btn-secondary text-xl px-8 py-4 shadow-2xl',
  },
} as const;

/**
 * Hero section component with variant-specific content and styling
 * Optimized with React.memo to prevent unnecessary re-renders
 */
function HeroSection({ variant, onSignupClick }: HeroSectionProps) {
  const variantContent = useMemo(() => HERO_CONTENT[variant], [variant]);

  // Memoize animation configurations to prevent recreation
  const contentAnimation = useMemo(
    () => ({
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
    }),
    []
  );

  const visualAnimation = useMemo(
    () => ({
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, delay: 0.3 },
    }),
    []
  );

  return (
    <section
      className={`${variantContent.bgGradient} section-padding min-h-screen flex items-center`}
    >
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div {...contentAnimation} className="space-y-8">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${variantContent.textColor}`}
            >
              {variant === 'A' ? (
                <>
                  Automate Your Entire <span className="gradient-text">Marketing Team</span>
                </>
              ) : (
                variantContent.headline
              )}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              {variantContent.subheadline}
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variantContent.features.map((feature, index) => (
                <motion.div
                  key={feature} // Use feature text as key for better performance
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                >
                  <span className="text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <button onClick={onSignupClick} className={variantContent.ctaStyle}>
                {variantContent.cta}
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="flex items-center space-x-4 text-sm text-gray-500"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>
                {variant === 'A'
                  ? 'Trusted by 1,000+ SMBs worldwide'
                  : '5,000+ marketers already joined • ⭐⭐⭐⭐⭐ 4.9/5 rating'}
              </span>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div {...visualAnimation} className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Mock Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Soku AI Dashboard</h3>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">$2.4K</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-600">4.2%</div>
                    <div className="text-sm text-gray-600">CVR</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-600">Campaigns</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Campaign Performance</span>
                    <span className="text-xs text-green-600">+24% ↗</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce-slow flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(HeroSection);
