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
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'Referrer-Policy',
        value: 'no-referrer'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Permissions-Policy',
        value: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains'
      }
    ];
    return [
      {
        source: '/',
        headers: securityHeaders
      },
      {
        source: '/:path',
        headers: securityHeaders
      },
      {
        source: '/app/:path',
        headers: securityHeaders
      },
      {
        source: '/articles/:path',
        headers: securityHeaders
      }
    ];
  },
  images: {
    domains: ['cdn.nft.com', 'nft-llc.mypinata.cloud', 'cdn.nft.com/_ipx', 'images.ctfassets.net'],
  },
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
