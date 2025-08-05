'use client';

import { useState, useCallback, memo, useMemo } from 'react';
import { WaitlistFormProps } from '@/types';
import { isValidEmail } from '@/utils';

// Static form styles configuration to avoid recreation on each render
const FORM_STYLES = {
  A: {
    container: 'bg-white p-8 rounded-2xl shadow-xl border border-gray-100',
    input:
      'w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors',
    button: 'btn-primary w-full text-lg font-semibold',
    title: 'text-2xl font-bold text-gray-900 mb-6 text-center',
    description: 'text-gray-600 mb-6 text-center',
  },
  B: {
    container:
      'bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-3xl shadow-2xl border-2 border-primary-200',
    input:
      'w-full px-5 py-4 border-2 border-primary-300 rounded-xl focus:border-secondary-500 focus:outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm',
    button: 'btn-secondary w-full text-lg font-bold shadow-lg',
    title: 'text-3xl font-extrabold gradient-text mb-6 text-center',
    description: 'text-gray-700 mb-6 text-center font-medium',
  },
} as const;

/**
 * Waitlist signup form component with variant-specific styling
 * Optimized with React.memo and useCallback for better performance
 */
function WaitlistForm({ variant, onSubmit, isLoading = false }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission with memoization
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      // Validate email
      if (!email.trim()) {
        setError('Please enter your email address to join the waitlist.');
        return;
      }

      if (!isValidEmail(email)) {
        setError('Please enter a valid email address (e.g., name@example.com).');
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(email);
        setEmail(''); // Clear form on success
      } catch (err) {
        // Display the specific error message from the API or a friendly fallback
        const errorMessage =
          err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, onSubmit]
  );

  /**
   * Handle email input change with memoization
   */
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const isDisabled = useMemo(() => isLoading || isSubmitting, [isLoading, isSubmitting]);
  const styles = useMemo(() => FORM_STYLES[variant], [variant]);

  // Memoize variant-specific content
  const content = useMemo(
    () => ({
      title: variant === 'A' ? 'Join the Waitlist' : '🚀 Get Early Access',
      description:
        variant === 'A'
          ? 'Be the first to know when Soku AI launches and get exclusive early access.'
          : 'Join thousands of marketers already waiting for the future of automated advertising!',
      buttonText: variant === 'A' ? 'Join Waitlist' : '🎯 Secure My Spot',
      privacyText:
        variant === 'A'
          ? 'We respect your privacy. No spam, ever.'
          : '✨ No spam, just exclusive updates and early access perks!',
    }),
    [variant]
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{content.title}</h3>
      <p className={styles.description}>{content.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email address"
            className={styles.input}
            disabled={isDisabled}
            required
          />
          {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`${styles.button} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Joining...
            </span>
          ) : (
            content.buttonText
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">{content.privacyText}</p>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(WaitlistForm);
