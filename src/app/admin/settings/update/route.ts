import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { updateDownloadRouteSlug } from '@/server/app-settings';

export const dynamic = 'force-dynamic';

function backTo(qs: string): string {
  return `/admin/settings?${qs}`;
}

export async function POST(request: NextRequest): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminRedirect(backTo('error=' + encodeURIComponent('Invalid form data')));
  }

  const submittedCsrf = String(form.get('_csrf') ?? '');
  if (!verifySessionCsrf(session, submittedCsrf)) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'settings-update: csrf' });
    return adminRedirect(backTo('error=' + encodeURIComponent('CSRF check failed')));
  }

  const result = await updateDownloadRouteSlug(String(form.get('downloadRouteSlug') ?? ''));
  if (!result.ok) {
    return adminRedirect(backTo('error=' + encodeURIComponent(result.reason)));
  }

  audit({
    kind: 'admin.access',
    username: session.username,
    ip,
    path: `settings.downloadRoute:${result.settings.downloadRouteSlug}`,
  });
  return adminRedirect(backTo('updated=' + encodeURIComponent(result.settings.downloadRouteSlug)));
}
