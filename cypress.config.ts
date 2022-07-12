/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '1gkqo9',
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    env: {
      NEXT_PUBLIC_HOMEPAGE_V2_ENABLED: false
    },
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      url: '/api/__coverage__',
    },
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
    retries: 1
  },
});
