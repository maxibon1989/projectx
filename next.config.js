/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel handles deployment - no need for static export
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
