
const { withSentryConfig } = require('@sentry/nextjs');
const path = require('path');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const withTM = require('next-transpile-modules')([
  'react-dnd',
  'dnd-core',
  '@react-dnd/invariant',
  '@react-dnd/asap',
  '@react-dnd/shallowequal',
]);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const sentryWebpackPluginOptions = {
  silent: true,
};

/** @type {import('next').NextConfig} */
const nextConfig =
{
  reactStrictMode: true,
  compress: true,
  swcMinify: true, // Enables SWC rust compiler for minification
  experimental: {
    forceSwcTransforms: true,
    nextScriptWorkers: true,
  },
  sentry: { hideSourceMaps: true },
  productionBrowserSourceMaps: false,
  async headers() {
    const securityHeaders = [
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
    const manifestHeaders = [
      {
        key: 'Access-Control-Allow-Origin',
        value: '*'
      },
      {
        key: 'Access-Control-Allow-Methods',
        value: 'GET'
      },
      {
        key: 'Access-Control-Allow-Headers',
        value: 'X-Requested-With, content-type, Authorization'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
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
      },
      {
        source: '/manifest.json',
        headers: manifestHeaders
      },
      {
      // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/app/auctions',
        destination: '/app/collection/0x8fB5a7894AB461a59ACdfab8918335768e411414',
        permanent: true,
      },
      {
        source: '/app/sale',
        destination: '/app/collection/0x8fB5a7894AB461a59ACdfab8918335768e411414',
        permanent: true,
      }
    ];
  },
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

    config.plugins.push(new DuplicatePackageCheckerPlugin());
    // config.plugins.push(new SaveRemoteFilePlugin([{ url: 'https://connect.facebook.net/en_US/fbevents.js', filepath: 'public/js/fbevents.js', hash: false }]));
    [
      'axios',
      'bn.js',
      'buffer',
      'clsx',
      'color-name',
      'eth-rpc-errors',
      'pify',
      'preact',
      'qrcode',
      'react-is',
      'tslib',
      'typesense'
    ].map(i => config.resolve.alias[i] = path.resolve(
      __dirname,
      'node_modules',
      i
    ));

    return config;
  },

  images: {
    domains: [
      'cdn.nft.com',
      'nft-llc.mypinata.cloud',
      'cdn.nft.com/_ipx',
      'metadata.ens.domains',
      'images.ctfassets.net',
      'sandbox-nvf2t.netlify.app',
      'staging-raccoon.netlify.app',
      'www.nft.com',
      '5hi24d3w2gny6zrfhekqk6mv4e0cfois.lambda-url.us-east-1.on.aws', // image proxy layer 2
      'nftcom-dev-assets.s3.amazonaws.com',
      'img.cryptokitties.co'
    ],
  },
};

const moduleExports = withTM(nextConfig);

module.exports = withBundleAnalyzer(withSentryConfig(moduleExports, sentryWebpackPluginOptions));
