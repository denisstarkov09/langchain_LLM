/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   fontLoaders: [
  //     {
  //       loader: "@next/font/google",
  //     },
  //   ],
  // },
  swcMinify: true,
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
}

export default nextConfig
