/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  silent: true,
};

const moduleExports = {
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
    domains: ['cdn.nft.com', 'nft-llc.mypinata.cloud', 'cdn.nft.com/_ipx'],
  },
  async headers() {
    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'report-sample' 'self' https://cdn.segment.com/analytics.js/v1/ey8FEiTC7Von8zKLqIe1ju6rGLzeG4A5/analytics.min.js https://connect.facebook.net/en_US/fbevents.js https://edge.fullstory.com/s/fs.js https://s3-us-west-2.amazonaws.com/jsstore/a/5N0HR7E/ge.js https://static.hotjar.com/c/hotjar-2821621.js https://www.google-analytics.com/analytics.js https://www.googletagmanager.com/gtm.js;
      object-src 'none';
      style-src 'report-sample' 'self' https://fonts.googleapis.com https://cdn.nft.com;
      font-src 'self' https://fonts.gstatic.com https://nftcom-prod-assets.s3.amazonaws.com;
      connect-src 'self' https://api.coingecko.com https://eth-mainnet.alchemyapi.io https://prod-api.nft.com https://staging-ap.nft.com https://dev-api.nft.com https://api.etherscan.io https://mainnet.infura.io;
      worker-src 'none';
      report-uri 'none';
      media-src *;
      manifest-src 'self';
      img-src 'self' *;
      frame-src 'self';
    `;
    return [
      {
        source: '/:path',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ];
  }
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
