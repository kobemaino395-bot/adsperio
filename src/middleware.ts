import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip static files, API routes, and known routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dt/') ||
    pathname.startsWith('/careers') ||
    pathname.startsWith('/positions') ||
    pathname.startsWith('/apply') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check if this is a potential dynamic download route: /[slug]/[fileSlug]
  const match = pathname.match(/^\/([a-z][a-z0-9-]{0,10})\/([a-z][a-z0-9-]{1,40})\/?$/);
  if (!match) {
    return NextResponse.next();
  }

  const [, routeSlug, fileSlug] = match;

  // Don't handle /k/ here - let the static route handle it
  // We'll handle dynamic routes that aren't /k/
  if (routeSlug === 'k') {
    return NextResponse.next();
  }

  // Load settings to check if this is the configured download route
  try {
    // Import dynamically to avoid issues with server-only code
    const { getAppSettings } = await import('@/server/app-settings');
    const settings = await getAppSettings();

    if (routeSlug === settings.downloadRouteSlug) {
      // Rewrite to the /k/ route handler
      const url = request.nextUrl.clone();
      url.pathname = `/k/${fileSlug}`;
      return NextResponse.rewrite(url);
    }
  } catch (error) {
    console.error('[middleware] Failed to load app settings:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
