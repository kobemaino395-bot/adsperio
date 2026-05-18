import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { getSlot } from '@/server/slot-registry';
import { replaceSlotFile } from '@/server/files';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

function backTo(slug: string, qs: string): string {
  return `/admin/files?slug=${encodeURIComponent(slug)}&${qs}`;
}

export async function POST(request: NextRequest, ctx: Ctx): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  const { slug } = await ctx.params;
  const slot = await getSlot(slug);
  if (!slot) {
    return adminRedirect('/admin/files?error=' + encodeURIComponent(`Unknown slot: ${slug}`));
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `${slug}: form parse failed` });
    return adminRedirect(backTo(slug, 'error=' + encodeURIComponent('Invalid form data')));
  }

  const submittedCsrf = String(form.get('_csrf') ?? '');
  if (!verifySessionCsrf(session, submittedCsrf)) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `${slug}: csrf` });
    return adminRedirect(backTo(slug, 'error=' + encodeURIComponent('CSRF check failed')));
  }

  const entries = form.getAll('file');
  if (entries.length !== 1) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `${slug}: expected exactly one file` });
    return adminRedirect(backTo(slug, 'error=' + encodeURIComponent('Upload exactly one file')));
  }
  const file = entries[0];
  if (!(file instanceof File)) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `${slug}: not a file` });
    return adminRedirect(backTo(slug, 'error=' + encodeURIComponent('Invalid file')));
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const result = await replaceSlotFile(slot, buf, file.name, file.type);
  if (!result.ok) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `${slug}: ${result.reason}` });
    return adminRedirect(backTo(slug, 'error=' + encodeURIComponent(result.reason)));
  }

  audit({
    kind: 'upload.replace',
    username: session.username,
    ip,
    bytes: result.size,
    backupPath: result.backupPath,
  });
  return adminRedirect(backTo(slug, 'ok=1'));
}
