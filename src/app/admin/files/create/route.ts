import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { createSlot } from '@/server/slot-registry';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminRedirect('/admin/files?error=' + encodeURIComponent('Invalid form data'));
  }

  const submittedCsrf = String(form.get('_csrf') ?? '');
  if (!verifySessionCsrf(session, submittedCsrf)) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'create-slot: csrf' });
    return adminRedirect('/admin/files?error=' + encodeURIComponent('CSRF check failed'));
  }

  const result = await createSlot({
    slug: String(form.get('slug') ?? ''),
    title: String(form.get('title') ?? ''),
    description: String(form.get('description') ?? ''),
    publicFilename: String(form.get('publicFilename') ?? ''),
    publicMimeType: String(form.get('publicMimeType') ?? ''),
  });

  if (!result.ok) {
    return adminRedirect('/admin/content/files?error=' + encodeURIComponent(result.reason));
  }

  audit({ kind: 'admin.access', username: session.username, ip, path: `slot.create:${result.slot.slug}` });
  return adminRedirect('/admin/content/files?created=' + encodeURIComponent(result.slot.slug));
}
