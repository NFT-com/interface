import { getEnv, Secret } from 'utils/env';

export function getAPIURL() {
  switch (getEnv(Secret.REACT_APP_ENV)) {
  case 'DEBUG':
    return getEnv(Secret.REACT_APP_DEBUG_URL);
  case 'SANDBOX':
    return getEnv(Secret.REACT_APP_SANDBOX_URL);
  case 'STAGING':
    return getEnv(Secret.REACT_APP_STAGING_URL);
  case 'PRODUCTION':
  default:
    return getEnv(Secret.REACT_APP_PRODUCTION_URL);
  }
}