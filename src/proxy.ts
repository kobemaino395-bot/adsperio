import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SECURITY_HEADERS } from '@/server/admin/security';

const PREAUTH_CSRF_COOKIE = 'adn_admin_pcsrf';
const PREAUTH_CSRF_RE = /^[a-f0-9]{64}$/i;

function newCsrfToken(): string {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
}

function requestIsHttps(req: NextRequest): boolean {
  const xfp = req.headers.get('x-forwarded-proto');
  if (xfp) return xfp.toLowerCase().split(',')[0]?.trim() === 'https';
  return req.nextUrl.protocol === 'https:';
}

function adminCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "object-src 'none'",
  ].join('; ');
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-adn-pathname', pathname);

  // Handle dynamic download routes before admin checks
  if (!pathname.startsWith('/admin')) {
    // Check if this is a potential dynamic download route: /[slug]/[fileSlug]
    const match = pathname.match(/^\/([a-z][a-z0-9-]{0,10})\/([a-z][a-z0-9-]{1,40})\/?$/);
    if (match) {
      const [, routeSlug, fileSlug] = match;

      // Skip if it's the static /k/ route or other known routes
      const knownRoutes = ['k', 'dt', 'api', 'careers', 'positions', 'apply'];
      if (!knownRoutes.includes(routeSlug)) {
        try {
          // Import dynamically to avoid issues with server-only code
          const { getAppSettings } = await import('@/server/app-settings');
          const settings = await getAppSettings();

          if (routeSlug === settings.downloadRouteSlug) {
            // Rewrite to the /k/ route handler
            const url = request.nextUrl.clone();
            url.pathname = `/k/${fileSlug}`;
            return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
          }
        } catch (error) {
          console.error('[proxy] Failed to load app settings:', error);
        }
      }
    }

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

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  requestHeaders.set('x-nonce', nonce);

  let pcsrfToSet: string | null = null;
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    const existing = request.cookies.get(PREAUTH_CSRF_COOKIE)?.value;
    const token = existing && PREAUTH_CSRF_RE.test(existing) ? existing : newCsrfToken();
    if (token !== existing) pcsrfToSet = token;
    requestHeaders.set('x-adn-pcsrf', token);
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  for (const [k, v] of Object.entries(ADMIN_SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  res.headers.set('Content-Security-Policy', adminCsp(nonce));

  if (pcsrfToSet) {
    res.cookies.set({
      name: PREAUTH_CSRF_COOKIE,
      value: pcsrfToSet,
      httpOnly: true,
      secure: requestIsHttps(request),
      sameSite: 'strict',
      path: '/admin',
      maxAge: 60 * 30,
    });
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)'],
};
