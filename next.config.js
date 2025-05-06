/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude settings pages from the build
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  experimental: {
    // This will exclude the settings directory from the build
    outputFileTracingExcludes: {
      "*": ["./app/settings/**/*", "./components/settings-layout.tsx", "./components/supabase-config.tsx"],
    },
  },
  // Redirect any attempts to access settings pages
  async redirects() {
    return [
      {
        source: "/settings",
        destination: "/",
        permanent: false,
      },
      {
        source: "/settings/:path*",
        destination: "/",
        permanent: false,
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
