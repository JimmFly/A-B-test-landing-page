/**
 * Security configuration for the application
 * Centralized security settings and constants
 */

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  WAITLIST: {
    MAX_REQUESTS: 5,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  ANALYTICS: {
    MAX_REQUESTS: 20,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  GENERAL: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
} as const;

/**
 * Content Security Policy configuration
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for development
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind CSS
    'https://fonts.googleapis.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
  ],
  'connect-src': [
    "'self'",
    'https://www.google-analytics.com',
  ],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
} as const;

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
} as const;

/**
 * Cookie security configuration
 */
export const COOKIE_CONFIG = {
  SECURE: process.env.NODE_ENV === 'production',
  SAME_SITE: 'strict' as const,
  HTTP_ONLY: true,
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  PATH: '/',
} as const;

/**
 * Input validation limits
 */
export const VALIDATION_LIMITS = {
  EMAIL: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 254,
  },
  USER_AGENT: {
    MAX_LENGTH: 500,
  },
  REFERRER: {
    MAX_LENGTH: 2048,
  },
  PAYLOAD: {
    MAX_SIZE_KB: 10,
  },
  STRING: {
    MAX_LENGTH: 1000,
  },
} as const;

/**
 * Allowed origins for CORS (if needed)
 */
export const ALLOWED_ORIGINS = [
  'https://soku-ai.com',
  'https://www.soku-ai.com',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
] as const;

/**
 * Security patterns for validation
 */
export const SECURITY_PATTERNS = {
  // Suspicious email patterns
  SUSPICIOUS_EMAIL: [
    /\.\./, // consecutive dots
    /^\.|\.$/, // starts or ends with dot
    /@\.|@$/, // @ followed by dot or @ at end
    /\s/, // whitespace
  ],
  
  // XSS patterns to block
  XSS_PATTERNS: [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // event handlers
    /<\s*\w+[^>]*on\w+/gi,
  ],
  
  // SQL injection patterns
  SQL_INJECTION: [
    /('|(--)|(;)|(\||\|)|(\*|\*))/gi,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)/gi,
  ],
} as const;

/**
 * Environment-specific security settings
 */
export const ENVIRONMENT_CONFIG = {
  DEVELOPMENT: {
    ENABLE_LOGGING: true,
    STRICT_CSP: false,
    RATE_LIMIT_ENABLED: false,
  },
  PRODUCTION: {
    ENABLE_LOGGING: false,
    STRICT_CSP: true,
    RATE_LIMIT_ENABLED: true,
  },
} as const;

/**
 * Get current environment configuration
 */
export function getEnvironmentConfig() {
  return process.env.NODE_ENV === 'production' 
    ? ENVIRONMENT_CONFIG.PRODUCTION 
    : ENVIRONMENT_CONFIG.DEVELOPMENT;
}

/**
 * Generate CSP header value
 */
export function generateCSPHeader(): string {
  const directives = Object.entries(CSP_CONFIG)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
  
  return directives;
}

/**
 * Security utility functions
 */
export const SecurityUtils = {
  /**
   * Check if a string contains suspicious patterns
   */
  containsSuspiciousPatterns(input: string): boolean {
    const allPatterns = [
      ...SECURITY_PATTERNS.XSS_PATTERNS,
      ...SECURITY_PATTERNS.SQL_INJECTION,
    ];
    
    return allPatterns.some(pattern => pattern.test(input));
  },
  
  /**
   * Generate a secure random string
   */
  generateSecureId(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  },
  
  /**
   * Validate origin against allowed origins
   */
  isAllowedOrigin(origin: string): boolean {
    return ALLOWED_ORIGINS.includes(origin as any);
  },
} as const;