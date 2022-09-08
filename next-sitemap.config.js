/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://nft.com',
  generateRobotsTxt: true,
  exclude: [

  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/*'],
        allow: ['/articles', '/articles/what-is-an-nft'],
      }
    ]
  },
};