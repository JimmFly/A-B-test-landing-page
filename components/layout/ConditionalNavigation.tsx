'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

/**
 * Conditional navigation component that only shows on specific pages
 */
export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Show navigation on dashboard, analytics, and events pages
  const showNavigation =
    pathname === '/dashboard' || pathname === '/analytics' || pathname === '/events';

  if (!showNavigation) {
    return null;
  }

  return <Navigation />;
}
