import codeCoverageTask from '@cypress/code-coverage/task';
import setupSynpressNodeEvents from '@synthetixio/synpress/plugins/index';
import { defineConfig } from 'cypress';

export default defineConfig({
  userAgent: 'synpress',
  chromeWebSecurity: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  projectId: '1gkqo9',
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      url: '/api/__coverage__',
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);

      return setupSynpressNodeEvents(on, config);
    },
    retries: 1
  },
});

