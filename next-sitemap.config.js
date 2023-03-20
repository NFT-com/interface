/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.nft.com',
  generateRobotsTxt: true,
  sitemapSize: 5000, // Will support 250M urls 50K files w/5K urls
  changefreq: 'daily', // Default
  exclude: ['/server-sitemap-index.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.nft.com/server-sitemap-index.xml',
    ],
    policies: [
      {
        userAgent: '*',
        disallow: ['/*'],
        allow: ['/$', '/articles', '/articles/*', '/*.xml'],
      }
    ]
  },
};
