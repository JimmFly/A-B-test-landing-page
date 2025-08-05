/**
 * Enhanced input validation utilities for security
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>"'&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entities[match] || match;
    });
}

/**
 * Validate email with enhanced security checks
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const sanitizedEmail = sanitizeString(email);
  
  // Check length limits
  if (sanitizedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  if (sanitizedEmail.length < 3) {
    return { isValid: false, error: 'Email address is too short' };
  }

  // Enhanced email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./, // consecutive dots
    /^\.|\.$/, // starts or ends with dot
    /@\.|@$/, // @ followed by dot or @ at end
    /\s/, // whitespace
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitizedEmail)) {
      return { isValid: false, error: 'Email format is invalid' };
    }
  }

  return { isValid: true };
}

/**
 * Validate variant parameter
 */
export function validateVariant(variant: unknown): { isValid: boolean; error?: string } {
  if (!variant || typeof variant !== 'string') {
    return { isValid: false, error: 'Variant is required' };
  }

  const sanitizedVariant = sanitizeString(variant);
  
  if (sanitizedVariant !== 'A' && sanitizedVariant !== 'B') {
    return { isValid: false, error: 'Invalid variant. Must be A or B' };
  }

  return { isValid: true };
}

/**
 * Validate user agent string
 */
export function validateUserAgent(userAgent: unknown): { isValid: boolean; sanitized: string } {
  if (!userAgent || typeof userAgent !== 'string') {
    return { isValid: true, sanitized: '' };
  }

  const sanitized = sanitizeString(userAgent);
  
  // Limit length to prevent abuse
  if (sanitized.length > 500) {
    return { isValid: true, sanitized: sanitized.substring(0, 500) };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate referrer URL
 */
export function validateReferrer(referrer: unknown): { isValid: boolean; sanitized: string } {
  if (!referrer || typeof referrer !== 'string') {
    return { isValid: true, sanitized: '' };
  }

  const sanitized = sanitizeString(referrer);
  
  // Limit length to prevent abuse
  if (sanitized.length > 2048) {
    return { isValid: true, sanitized: sanitized.substring(0, 2048) };
  }

  // Basic URL validation (optional)
  try {
    new URL(sanitized);
    return { isValid: true, sanitized };
  } catch {
    // If not a valid URL, still return sanitized string
    return { isValid: true, sanitized };
  }
}

/**
 * Validate JSON payload size
 */
export function validatePayloadSize(payload: unknown, maxSizeKB: number = 10): boolean {
  try {
    const jsonString = JSON.stringify(payload);
    const sizeKB = new Blob([jsonString]).size / 1024;
    return sizeKB <= maxSizeKB;
  } catch {
    return false;
  }
}

/**
 * Rate limiting validation
 */
export function validateRateLimit(headers: Headers): { isRateLimited: boolean; retryAfter?: number } {
  const rateLimitRemaining = headers.get('X-RateLimit-Remaining');
  const retryAfter = headers.get('Retry-After');
  
  if (rateLimitRemaining === '0' || retryAfter) {
    return {
      isRateLimited: true,
      retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
    };
  }
  
  return { isRateLimited: false };
}