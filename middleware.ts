import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to handle A/B testing consistency and prevent data contamination
 * when users visit both landing page variants
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Only apply to landing page routes
  if (path === '/landing-a' || path === '/landing-b') {
    // Extract the requested variant from the URL
    const requestedVariant = path === '/landing-a' ? 'A' : 'B';

    // Check for direct access parameter (for admin/testing purposes)
    const isDirectAccess = url.searchParams.has('direct_access');
    if (isDirectAccess) {
      // Allow direct access but mark this session as a test session
      // by setting a special cookie that will be used by analytics to exclude this data
      const response = NextResponse.next();
      response.cookies.set('test_session', 'true', {
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return response;
    }

    // Get the user's currently assigned variant from cookies
    const variantCookie = request.cookies.get('ab_test_variant');
    const currentVariant = variantCookie?.value as 'A' | 'B' | undefined;

    // If user has a variant and it doesn't match the requested one
    if (currentVariant && currentVariant !== requestedVariant) {
      // Redirect to their assigned variant to maintain data consistency
      const correctPath = `/landing-${currentVariant.toLowerCase()}`;

      // Only redirect if they're trying to access the wrong variant
      if (path !== correctPath) {
        url.pathname = correctPath;
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run only on landing page routes
export const config = {
  matcher: ['/landing-a', '/landing-b'],
};
