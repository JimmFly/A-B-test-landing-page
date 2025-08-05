'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SuccessMessageProps } from '@/types';

// Static content configuration to avoid recreation on each render
const SUCCESS_CONTENT = {
  A: {
    title: '🎉 Welcome to the Future!',
    message: "Thank you for joining our waitlist. We'll notify you as soon as Soku AI is ready.",
    nextSteps: [
      'Check your email for confirmation',
      'Follow us on social media for updates',
      'Refer friends to move up in the queue',
    ],
    bgClass: 'bg-gradient-to-br from-green-50 to-blue-50',
    iconBg: 'bg-green-500',
  },
  B: {
    title: "🚀 You're In! Welcome to the VIP List",
    message:
      "Congratulations! You've secured your spot and will be among the first to access Soku AI.",
    nextSteps: [
      '📧 Confirmation email sent to your inbox',
      '🎁 Exclusive bonuses coming your way',
      '⚡ Early access notifications enabled',
    ],
    bgClass: 'bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50',
    iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
  },
} as const;

/**
 * Success message component shown after successful waitlist signup
 * Optimized with React.memo to prevent unnecessary re-renders
 */
function SuccessMessage({ variant, email, onClose }: SuccessMessageProps) {
  const variantContent = useMemo(() => SUCCESS_CONTENT[variant], [variant]);

  // Memoize animation configurations
  const containerAnimation = useMemo(
    () => ({
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, type: 'spring', bounce: 0.3 },
    }),
    []
  );

  const iconAnimation = useMemo(
    () => ({
      initial: { scale: 0 },
      animate: { scale: 1 },
      transition: { duration: 0.5, delay: 0.2, type: 'spring', bounce: 0.5 },
    }),
    []
  );

  return (
    <motion.div
      {...containerAnimation}
      className={`${variantContent.bgClass} p-8 rounded-3xl shadow-2xl border-2 border-white/50 text-center max-w-md mx-auto`}
    >
      {/* Success Icon */}
      <motion.div
        {...iconAnimation}
        className={`${variantContent.iconBg} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
      >
        {variantContent.title}
      </motion.h3>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-gray-700 mb-6 leading-relaxed"
      >
        {variantContent.message}
      </motion.p>

      {/* Email Confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/30"
      >
        <div className="text-sm text-gray-600 mb-1">Confirmation sent to:</div>
        <div className="font-semibold text-gray-900">{email}</div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-left"
      >
        <h4 className="font-semibold text-gray-900 mb-3 text-center">
          {variant === 'A' ? "What's Next?" : '🎯 What Happens Next?'}
        </h4>
        <ul className="space-y-2">
          {variantContent.nextSteps.map((step, index) => (
            <motion.li
              key={step} // Use step text as key for better performance
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              className="flex items-center space-x-3 text-gray-700"
            >
              <div
                className={`w-2 h-2 rounded-full ${variant === 'A' ? 'bg-green-500' : 'bg-purple-500'}`}
              />
              <span className="text-sm">{step}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Social Share */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-6 pt-6 border-t border-white/30"
      >
        <p className="text-xs text-gray-600 mb-3">
          {variant === 'A'
            ? 'Help us spread the word!'
            : '🔥 Share with friends and earn bonus perks!'}
        </p>
        <div className="flex justify-center space-x-3">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Share on Twitter
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Share on LinkedIn
          </button>
        </div>
      </motion.div>

      {/* Close Button */}
      {onClose && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-6"
        >
          <button
            onClick={onClose}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Continue
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(SuccessMessage);
