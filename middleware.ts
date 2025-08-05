/**
 * Security middleware for Next.js
 * Handles request-level security checks and headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { SECURITY_HEADERS, SecurityUtils } from './lib/security-config';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // CORS handling for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const preflightResponse = new NextResponse(null, { status: 200 });
      
      if (origin && SecurityUtils.isAllowedOrigin(origin)) {
        preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
      }
      
      preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      preflightResponse.headers.set('Access-Control-Max-Age', '86400');
      
      return preflightResponse;
    }
    
    // Set CORS headers for actual requests
    if (origin && SecurityUtils.isAllowedOrigin(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Block requests with suspicious patterns in URL
  const url = request.url.toLowerCase();
  const suspiciousPatterns = [
    'script',
    'javascript:',
    '<script',
    'eval(',
    'expression(',
    'vbscript:',
    'onload=',
    'onerror=',
  ];
  
  if (suspiciousPatterns.some(pattern => url.includes(pattern))) {
    return new NextResponse('Blocked', { status: 403 });
  }

  // Rate limiting headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-RateLimit-Policy', 'Enabled');
  }

  // Add cache control headers for static assets
  if (pathname.startsWith('/_next/static/') || pathname.includes('.')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Security headers for HTML pages
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};