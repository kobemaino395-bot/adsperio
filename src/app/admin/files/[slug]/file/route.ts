import { readSessionFromCookies } from '@/server/admin/auth';
import { adminRedirect, applyAdminHeaders } from '@/server/admin/security';
import { getFileSlot } from '@/content/files';
import { readSlotBytes, readSlotStatus } from '@/server/files';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: Ctx): Promise<Response> {
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  const { slug } = await ctx.params;
  const slot = getFileSlot(slug);
  if (!slot) {
    const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8' });
    applyAdminHeaders(headers);
    return new Response('Unknown slot.', { status: 404, headers });
  }

  const status = await readSlotStatus(slot);
  if (!status.hasFile) {
    const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8' });
    applyAdminHeaders(headers);
    return new Response('No file uploaded.', { status: 404, headers });
  }
  const data = await readSlotBytes(slot);
  if (!data) {
    const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8' });
    applyAdminHeaders(headers);
    return new Response('Not found.', { status: 404, headers });
  }

  const filename = status.meta?.originalFilename ?? slot.publicFilename;
  const contentType = status.meta?.contentType ?? slot.publicMimeType;

  const headers = new Headers({
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': String(status.size),
  });
  applyAdminHeaders(headers);
  return new Response(new Uint8Array(data), { status: 200, headers });
}
