/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
};

module.exports = nextConfig;
