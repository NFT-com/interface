/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.nft.com',
  generateRobotsTxt: true,
  exclude: [

  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/*'],
        allow: ['/$', '/articles', '/articles/*', '/sitemap.xml'],
      }
    ]
  },
};