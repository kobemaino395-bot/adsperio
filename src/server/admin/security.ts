import 'server-only';

const ESC_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function esc(input: unknown): string {
  if (input === null || input === undefined) return '';
  const str = typeof input === 'string' ? input : String(input);
  return str.replace(/[&<>"']/g, (c) => ESC_MAP[c] ?? c);
}

export const ADMIN_CSP =
  "default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'";

export const ADMIN_SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': ADMIN_CSP,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export function applyAdminHeaders(headers: Headers): void {
  for (const [k, v] of Object.entries(ADMIN_SECURITY_HEADERS)) {
    headers.set(k, v);
  }
}

export function adminHtmlResponse(html: string, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  applyAdminHeaders(headers);
  return new Response(html, { ...init, headers });
}

export function adminRedirect(location: string, status: 302 | 303 = 303): Response {
  const headers = new Headers();
  headers.set('Location', location);
  applyAdminHeaders(headers);
  return new Response(null, { status, headers });
}

type AuditEvent =
  | { kind: 'login.success'; username: string; ip: string }
  | { kind: 'login.failure'; username: string; ip: string; reason: string }
  | { kind: 'login.ratelimit'; ip: string }
  | { kind: 'logout'; username: string; ip: string }
  | { kind: 'upload.replace'; username: string; ip: string; bytes: number; backupPath: string }
  | { kind: 'upload.reject'; username: string; ip: string; reason: string }
  | { kind: 'admin.access'; username: string; ip: string; path: string };

export function audit(event: AuditEvent): void {
  const ts = new Date().toISOString();
  console.log(`[audit] ${ts} ${JSON.stringify(event)}`);
}

export function readClientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
