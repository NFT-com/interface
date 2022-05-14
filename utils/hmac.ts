import { getEnv, Secret } from 'utils/getEnv';

import crypto from 'crypto';

export function getHmac() {
  const hmac = crypto.createHmac('sha256', getEnv(Secret.NEXT_PUBLIC_CLIENT_SECRET) ?? '');
  return hmac;
}
