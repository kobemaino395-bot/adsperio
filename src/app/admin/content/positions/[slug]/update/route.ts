import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { updatePosition } from '@/server/content/positions';
import { parsePositionForm } from '../../form-parser';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, ctx: Ctx): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  const { slug } = await ctx.params;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminRedirect(`/admin/content/positions/${slug}?error=` + encodeURIComponent('Invalid form data'));
  }
  if (!verifySessionCsrf(session, String(form.get('_csrf') ?? ''))) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `position.update ${slug}: csrf` });
    return adminRedirect(`/admin/content/positions/${slug}?error=` + encodeURIComponent('CSRF check failed'));
  }

  const input = parsePositionForm(form);
  const result = await updatePosition(slug, input);
  if (!result.ok) {
    return adminRedirect(`/admin/content/positions/${slug}?error=` + encodeURIComponent(result.reason));
  }
  audit({ kind: 'admin.access', username: session.username, ip, path: `position.update:${slug}` });
  // Slug may have changed
  return adminRedirect(`/admin/content/positions/${result.position.slug}?ok=1`);
}
