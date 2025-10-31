/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['lsotuhnblpkhvpyadnje.supabase.co'],
  },
};

module.exports = nextConfig;
