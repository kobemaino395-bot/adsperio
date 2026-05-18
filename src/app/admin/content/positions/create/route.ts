import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { createPosition } from '@/server/content/positions';
import { parsePositionForm } from '../form-parser';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminRedirect('/admin/content/positions/new?error=' + encodeURIComponent('Invalid form data'));
  }
  if (!verifySessionCsrf(session, String(form.get('_csrf') ?? ''))) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'position.create: csrf' });
    return adminRedirect('/admin/content/positions/new?error=' + encodeURIComponent('CSRF check failed'));
  }

  const input = parsePositionForm(form);
  const result = await createPosition(input.slug, input);
  if (!result.ok) {
    return adminRedirect('/admin/content/positions/new?error=' + encodeURIComponent(result.reason));
  }
  audit({ kind: 'admin.access', username: session.username, ip, path: `position.create:${result.position.slug}` });
  return adminRedirect('/admin/content/positions?created=' + encodeURIComponent(result.position.slug));
}
