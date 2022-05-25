import crypto from 'crypto';

export function getHmac() {
  const hmac = crypto.createHmac('sha256', process.env.NEXT_PUBLIC_CLIENT_SECRET ?? '');
  return hmac;
}
