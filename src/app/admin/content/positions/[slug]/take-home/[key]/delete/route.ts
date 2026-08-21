import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { deleteTakeHomeFile, isValidTakeHomeKey } from '@/server/content/position-files';
import { setPositionTakeHomeFilename } from '@/server/content/positions';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string; key: string }> };

export async function POST(request: NextRequest, ctx: Ctx): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  const { slug, key } = await ctx.params;
  const back = `/admin/content/positions/${slug}`;

  if (!isValidTakeHomeKey(key)) return adminRedirect(back + '?error=' + encodeURIComponent('Invalid file key'));

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminRedirect(back + '?error=' + encodeURIComponent('Invalid form data'));
  }
  if (!verifySessionCsrf(session, String(form.get('_csrf') ?? ''))) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `position.take-home.delete ${slug}/${key}: csrf` });
    return adminRedirect(back + '?error=' + encodeURIComponent('CSRF check failed'));
  }

  await deleteTakeHomeFile(slug, key);
  const saved = await setPositionTakeHomeFilename(slug, key, '');
  if (!saved.ok) {
    return adminRedirect(back + '?error=' + encodeURIComponent(saved.reason));
  }

  audit({ kind: 'admin.access', username: session.username, ip, path: `position.take-home.delete:${slug}/${key}` });
  return adminRedirect(back + '?ok=1');
}
