import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { deleteSlot } from '@/server/slot-registry';
import { deleteSlotFiles } from '@/server/files';

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
    return adminRedirect('/admin/files?error=' + encodeURIComponent('Invalid form data'));
  }

  const submittedCsrf = String(form.get('_csrf') ?? '');
  if (!verifySessionCsrf(session, submittedCsrf)) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `slot-delete: csrf` });
    return adminRedirect('/admin/files?error=' + encodeURIComponent('CSRF check failed'));
  }

  const result = await deleteSlot(slug);
  if (!result.ok) {
    return adminRedirect('/admin/files?error=' + encodeURIComponent(result.reason));
  }
  await deleteSlotFiles(slug).catch(() => undefined);

  audit({ kind: 'admin.access', username: session.username, ip, path: `slot.delete:${slug}` });
  return adminRedirect('/admin/files?deleted=' + encodeURIComponent(slug));
}
