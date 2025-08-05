const { generateCSPHeader, SECURITY_HEADERS } = require('./lib/security-config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: SECURITY_HEADERS['X-Content-Type-Options'],
          },
          {
            key: 'X-Frame-Options',
            value: SECURITY_HEADERS['X-Frame-Options'],
          },
          {
            key: 'X-XSS-Protection',
            value: SECURITY_HEADERS['X-XSS-Protection'],
          },
          {
            key: 'Content-Security-Policy',
            value: generateCSPHeader(),
          },
          {
            key: 'Referrer-Policy',
            value: SECURITY_HEADERS['Referrer-Policy'],
          },
          {
            key: 'Permissions-Policy',
            value: SECURITY_HEADERS['Permissions-Policy'],
          },
          {
            key: 'Strict-Transport-Security',
            value: SECURITY_HEADERS['Strict-Transport-Security'],
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
