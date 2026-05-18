import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SECURITY_HEADERS } from '@/server/admin/security';

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-adn-pathname', pathname);

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH) {
    const res = new NextResponse('Admin disabled.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
    for (const [k, v] of Object.entries(ADMIN_SECURITY_HEADERS)) {
      res.headers.set(k, v);
    }
    return res;
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  for (const [k, v] of Object.entries(ADMIN_SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)'],
};
