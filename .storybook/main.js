module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-next',
    '@storybook/addon-interactions'
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5'
  },
  webpackFinal: async config => {
    const imageRule = config.module.rules.find(rule => rule.test.test('.svg'))
    imageRule.exclude = /\.svg$/

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  }
}