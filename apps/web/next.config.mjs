/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.replicate.delivery' },
      { protocol: 'https', hostname: '*.jumia.com.ng' },
      { protocol: 'https', hostname: '*.konga.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['@decora/ui', '@decora/design-tokens'],
  },
  transpilePackages: [
    '@decora/ui',
    '@decora/design-tokens',
    '@decora/api-client',
    '@decora/pricing',
    '@decora/prompts',
    '@decora/shared-types',
  ],
};

export default nextConfig;
