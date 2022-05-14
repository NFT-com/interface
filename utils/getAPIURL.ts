import { getEnv, Secret } from 'utils/getEnv';

export function getAPIURL() {
  switch (getEnv(Secret.NEXT_PUBLIC_ENV)) {
  case 'DEBUG':
    return getEnv(Secret.NEXT_PUBLIC_DEBUG_URL);
  case 'SANDBOX':
    return getEnv(Secret.NEXT_PUBLIC_SANDBOX_URL);
  case 'STAGING':
    return getEnv(Secret.NEXT_PUBLIC_STAGING_URL);
  case 'PRODUCTION':
  default:
    return getEnv(Secret.NEXT_PUBLIC_PRODUCTION_URL);
  }
}