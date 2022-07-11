/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  silent: true,
};

const moduleExports = {
  reactStrictMode: true,
  sentry: { hideSourceMaps: true },
  productionBrowserSourceMaps: false,
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
    domains: ['cdn.nft.com', 'nft-llc.mypinata.cloud', 'cdn.nft.com/_ipx', 'images.ctfassets.net'],
  },
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
