/**
 * Rate limiting implementation for API routes
 * Uses in-memory storage for simplicity (consider Redis for production)
 */

// Rate limit configuration
const RATE_LIMITS = {
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

// Environment configuration
function getEnvironmentConfig() {
  return {
    RATE_LIMIT_ENABLED: process.env.NODE_ENV === 'production'
  };
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private enabled: boolean;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.enabled = getEnvironmentConfig().RATE_LIMIT_ENABLED;
    
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if request should be rate limited
   */
  isRateLimited(identifier: string): boolean {
    // Skip rate limiting in development if disabled
    if (!this.enabled) {
      return false;
    }
    
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return false;
    }

    if (entry.count >= this.maxRequests) {
      return true;
    }

    // Increment count
    entry.count++;
    return false;
  }

  /**
   * Get remaining requests for identifier
   */
  getRemainingRequests(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Get reset time for identifier
   */
  getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return Date.now() + this.windowMs;
    }
    return entry.resetTime;
  }

  /**
   * Clean up expired entries (should be called periodically)
   */
  public cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.requests.entries());
    for (const [key, entry] of entries) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Pre-configured rate limiters for different endpoints
export const waitlistRateLimiter = new RateLimiter(
  RATE_LIMITS.WAITLIST.MAX_REQUESTS,
  RATE_LIMITS.WAITLIST.WINDOW_MS
);
export const analyticsRateLimiter = new RateLimiter(
  RATE_LIMITS.ANALYTICS.MAX_REQUESTS,
  RATE_LIMITS.ANALYTICS.WINDOW_MS
);

/**
 * Extract client IP from request
 */
export function getClientIP(request: Request): string {
  // Try to get real IP from headers (for production with proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // Fallback to a default identifier for development
  return 'unknown';
}

/**
 * Rate limit middleware for Next.js API routes
 */
export function withRateLimit(
  rateLimiter: RateLimiter,
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    const clientIP = getClientIP(request);
    
    if (rateLimiter.isRateLimited(clientIP)) {
      const resetTime = rateLimiter.getResetTime(clientIP);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': rateLimiter['maxRequests'].toString(),
            'X-RateLimit-Remaining': rateLimiter.getRemainingRequests(clientIP).toString(),
            'X-RateLimit-Reset': resetTime.toString(),
          },
        }
      );
    }
    
    const response = await handler(request);
    
    // Add rate limit headers to successful responses
    const remaining = rateLimiter.getRemainingRequests(clientIP);
    const resetTime = rateLimiter.getResetTime(clientIP);
    
    response.headers.set('X-RateLimit-Limit', rateLimiter['maxRequests'].toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toString());
    
    return response;
  };
}

// Cleanup expired entries every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    waitlistRateLimiter.cleanup();
    analyticsRateLimiter.cleanup();
  }, 5 * 60 * 1000);
}