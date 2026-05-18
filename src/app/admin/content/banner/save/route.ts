import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { writeBanner } from '@/server/content/banner';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminRedirect('/admin/content/banner?error=' + encodeURIComponent('Invalid form data'));
  }

  if (!verifySessionCsrf(session, String(form.get('_csrf') ?? ''))) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'banner.save: csrf' });
    return adminRedirect('/admin/content/banner?error=' + encodeURIComponent('CSRF check failed'));
  }

  const ctaUrl = String(form.get('ctaUrl') ?? '').trim();
  if (ctaUrl && !(ctaUrl.startsWith('/') || /^https?:\/\//i.test(ctaUrl))) {
    return adminRedirect('/admin/content/banner?error=' + encodeURIComponent('CTA URL must start with / or http(s)://'));
  }

  await writeBanner({
    enabled: form.get('enabled') === 'on',
    badge: String(form.get('badge') ?? ''),
    message: String(form.get('message') ?? ''),
    ctaText: String(form.get('ctaText') ?? ''),
    ctaUrl,
  });

  audit({ kind: 'admin.access', username: session.username, ip, path: 'banner.save' });
  return adminRedirect('/admin/content/banner?ok=1');
}
