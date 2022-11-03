/* eslint-disable @next/next/no-server-import-in-page */
/* istanbul ignore file */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const Middleware = (req: NextRequest) => {
  if(req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase() || req.nextUrl.pathname.includes('/_next/static/chunks/pages') || req.nextUrl.pathname.startsWith('/_next'))
    return NextResponse.next();

  return NextResponse.redirect(new URL(req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()));
};

export default Middleware;