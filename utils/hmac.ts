import { getEnv, Secret } from 'utils/getEnv';

import crypto from 'crypto';

export function getHmac() {
  const hmac = crypto.createHmac('sha256', getEnv(Secret.REACT_APP_CLIENT_SECRET) ?? '');
  return hmac;
}
