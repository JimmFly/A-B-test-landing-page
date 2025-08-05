'use client';

import { memo, useMemo } from 'react';
import { FeaturesSectionProps } from '@/types';
import { motion } from 'framer-motion';

// Static content configuration
const FEATURES_CONTENT = {
  A: {
    title: 'Everything You Need to Scale Your Marketing',
    subtitle:
      'From product intake to post-campaign insights, Soku AI handles your entire advertising workflow.',
    features: [
      {
        icon: '🎨',
        title: 'AI Creative Generation',
        description:
          'Automatically produce high-converting images and copy aligned with your brand voice.',
        highlight: 'Coming soon: Video creatives',
      },
      {
        icon: '🚀',
        title: 'Multi-Channel Deployment',
        description: 'Launch campaigns across Meta, Google Ads, TikTok, and more with one click.',
        highlight: 'Currently: Meta (Facebook/Instagram)',
      },
      {
        icon: '📊',
        title: 'Dynamic Optimization',
        description:
          'Automated budget allocation and bid adjustments based on real-time performance.',
        highlight: 'Scale winners, kill losers automatically',
      },
      {
        icon: '📈',
        title: 'Unified Analytics',
        description:
          'Single dashboard aggregates data across all platforms with actionable insights.',
        highlight: 'Post-mortem reports included',
      },
    ],
  },
  B: {
    title: '🔥 Why Agencies Charge $10K+ for What We Do Automatically',
    subtitle:
      'Stop overpaying for manual work. Our AI does everything your expensive agency does—but better, faster, and 24/7.',
    features: [
      {
        icon: '💰',
        title: 'Save $120K+/Year',
        description:
          'Replace your entire marketing team and agency fees with one intelligent agent.',
        highlight: '90% cost reduction vs traditional agencies',
      },
      {
        icon: '⚡',
        title: '10x Faster Execution',
        description:
          'What takes agencies weeks, we do in minutes. From brief to live campaigns instantly.',
        highlight: 'Launch campaigns in under 5 minutes',
      },
      {
        icon: '🎯',
        title: 'AI-Powered Targeting',
        description:
          'Advanced audience analysis and competitor research that outperforms human strategists.',
        highlight: 'Continuously learning and improving',
      },
      {
        icon: '📱',
        title: 'Omnichannel Domination',
        description:
          'Simultaneously optimize across all major platforms for maximum reach and ROI.',
        highlight: 'Meta, Google, TikTok, and more',
      },
    ],
  },
};

/**
 * Features section component with variant-specific content
 */
function FeaturesSection({ variant }: FeaturesSectionProps) {
  // Memoize variant content
  const variantContent = useMemo(() => FEATURES_CONTENT[variant], [variant]);

  // Memoize process steps
  const processSteps = useMemo(
    () => [
      {
        step: '1',
        title: variant === 'A' ? 'Upload Product Info' : '📝 Upload & Analyze',
        description:
          variant === 'A'
            ? 'Simply enter your product URL and set your budget preferences.'
            : 'Drop your product URL. Our AI analyzes competitors and finds winning strategies.',
      },
      {
        step: '2',
        title: variant === 'A' ? 'AI Creates & Launches' : '🎨 Generate & Deploy',
        description:
          variant === 'A'
            ? 'Soku AI generates creatives, builds campaigns, and launches across platforms.'
            : 'AI creates unlimited ad variations and launches across all major platforms instantly.',
      },
      {
        step: '3',
        title: variant === 'A' ? 'Monitor & Optimize' : '📈 Scale & Profit',
        description:
          variant === 'A'
            ? 'Real-time monitoring and automatic optimization for maximum ROI.'
            : 'Watch your campaigns optimize themselves while you focus on growing your business.',
      },
    ],
    [variant]
  );

  // Memoize animation configurations
  const headerAnimation = useMemo(
    () => ({
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      viewport: { once: true },
    }),
    []
  );

  const processAnimation = useMemo(
    () => ({
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.4 },
      viewport: { once: true },
    }),
    []
  );

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        {/* Header */}
        <motion.div {...headerAnimation} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {variantContent.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {variantContent.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {variantContent.features.map((feature, index) => (
            <motion.div
              key={`${variant}-feature-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`
                ${
                  variant === 'A'
                    ? 'bg-gray-50 hover:bg-gray-100'
                    : 'bg-gradient-to-br from-primary-50 to-secondary-50 hover:from-primary-100 hover:to-secondary-100'
                } 
                p-8 rounded-2xl transition-all duration-300 hover:shadow-lg border border-gray-100
              `}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
              <div
                className={`
                inline-block px-3 py-1 rounded-full text-sm font-medium
                ${
                  variant === 'A'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-secondary-100 text-secondary-700'
                }
              `}
              >
                {feature.highlight}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process Flow */}
        <motion.div {...processAnimation} className="mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            {variant === 'A' ? 'How It Works' : '🚀 From Zero to Hero in 3 Steps'}
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step, _index) => (
              <div key={`${variant}-step-${step.step}`} className="text-center">
                <div
                  className={`
                  w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white
                  ${
                    variant === 'A'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600'
                      : 'bg-gradient-to-r from-secondary-500 to-primary-500'
                  }
                `}
                >
                  {step.step}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(FeaturesSection);
