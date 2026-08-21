import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { saveTakeHomeFile } from '@/server/content/position-files';
import { setPositionTakeHomeFilename } from '@/server/content/positions';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, ctx: Ctx): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  const { slug } = await ctx.params;
  const back = `/admin/content/positions/${slug}`;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminRedirect(back + '?error=' + encodeURIComponent('Invalid form data'));
  }
  if (!verifySessionCsrf(session, String(form.get('_csrf') ?? ''))) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `position.take-home.upload ${slug}: csrf` });
    return adminRedirect(back + '?error=' + encodeURIComponent('CSRF check failed'));
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return adminRedirect(back + '?error=' + encodeURIComponent('No file selected'));
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const result = await saveTakeHomeFile(slug, buf, file.name, file.type, session.username);
  if (!result.ok) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `position.take-home.upload ${slug}: ${result.reason}` });
    return adminRedirect(back + '?error=' + encodeURIComponent(result.reason));
  }

  const saved = await setPositionTakeHomeFilename(slug, result.meta.originalFilename);
  if (!saved.ok) {
    return adminRedirect(back + '?error=' + encodeURIComponent(saved.reason));
  }

  audit({ kind: 'admin.access', username: session.username, ip, path: `position.take-home.upload:${slug}` });
  return adminRedirect(back + '?ok=1');
}
