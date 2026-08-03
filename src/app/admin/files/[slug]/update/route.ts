import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import { updateSlot } from '@/server/slot-registry';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

function backTo(slug: string, qs: string): string {
  return `/admin/content/files/${encodeURIComponent(slug)}?${qs}`;
}

export async function POST(request: NextRequest, ctx: Ctx): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  const { slug } = await ctx.params;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminRedirect(backTo(slug, 'error=' + encodeURIComponent('Invalid form data')));
  }

  const submittedCsrf = String(form.get('_csrf') ?? '');
  if (!verifySessionCsrf(session, submittedCsrf)) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `slot-update: csrf` });
    return adminRedirect(backTo(slug, 'error=' + encodeURIComponent('CSRF check failed')));
  }

  const kindRaw = form.get('kind');
  const result = await updateSlot(slug, {
    title: String(form.get('title') ?? ''),
    description: String(form.get('description') ?? ''),
    publicFilename: String(form.get('publicFilename') ?? ''),
    publicMimeType: String(form.get('publicMimeType') ?? ''),
    kind:
      kindRaw === 'proxy'
        ? 'proxy'
        : kindRaw === 'redirect'
          ? 'redirect'
          : kindRaw === 'local'
            ? 'local'
            : undefined,
    remoteUrl: form.get('remoteUrl') !== null ? String(form.get('remoteUrl') ?? '') : undefined,
  });

  if (!result.ok) {
    return adminRedirect(backTo(slug, 'error=' + encodeURIComponent(result.reason)));
  }

  const updated = result.slot;
  audit({ kind: 'admin.access', username: session.username, ip, path: `slot.update:${slug}` });
  return adminRedirect(backTo(slug, 'updated=' + encodeURIComponent(slug)));
}
