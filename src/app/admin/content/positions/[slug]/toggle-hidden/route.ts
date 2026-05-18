import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { togglePositionHidden } from '@/server/content/positions';

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
    return adminRedirect('/admin/content/positions?error=' + encodeURIComponent('Invalid form data'));
  }
  if (!verifySessionCsrf(session, String(form.get('_csrf') ?? ''))) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `position.toggle ${slug}: csrf` });
    return adminRedirect('/admin/content/positions?error=' + encodeURIComponent('CSRF check failed'));
  }

  const result = await togglePositionHidden(slug);
  if (!result.ok) {
    return adminRedirect('/admin/content/positions?error=' + encodeURIComponent(result.reason));
  }
  audit({ kind: 'admin.access', username: session.username, ip, path: `position.toggle:${slug}->${result.position.hidden ? 'hidden' : 'visible'}` });
  return adminRedirect('/admin/content/positions?toggled=' + encodeURIComponent(slug));
}
