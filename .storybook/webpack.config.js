module.exports = {
    module: {
      rules: [
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: /svgr/, // only use svgr to load svg if path ends with *.svg?svgr
          use: ['@svgr/webpack'],
        },
      ],
    },
  }
