/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  // scripts/deploy.js builds into this dir and swaps it into place after a
  // successful build, so the live .next is never touched mid-deploy.
  distDir: process.env.NEXT_DIST_DIR || '.next',
}
module.exports = nextConfig
