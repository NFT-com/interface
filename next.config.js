/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // This allows you to import SVG files as strings/urls
    // but doesn't work with typescript yet.
    config.module.rules.push({
      test: /\.svg$/i,
      type: 'asset',
      resourceQuery: /url/, // *.svg?url
    });
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    domains: ['cdn.nft.com', 'nft-llc.mypinata.cloud'],
  },
};

module.exports = nextConfig;
