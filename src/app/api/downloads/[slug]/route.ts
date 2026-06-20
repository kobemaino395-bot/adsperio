import { notFound } from 'next/navigation';
import { getSlot } from '@/server/slot-registry';
import { effectivePublicDownload, readSlotBytes, readSlotStatus } from '@/server/files';
import { recordSlotDownload } from '@/server/slot-stats';
import { readClientIp } from '@/server/admin/security';
import { checkCooldown, recordDownload } from '@/server/download-cooldown';
import { resolveRedirect, REMOTE_TIMEOUT_MS } from '@/server/remote-fetch';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, ctx: Ctx): Promise<Response> {
  const { slug } = await ctx.params;
  const slot = await getSlot(slug);
  if (!slot) notFound();

  const ip = readClientIp(request.headers);
  const cooldown = checkCooldown(slot.slug, ip);
  if (!cooldown.ok) {
    return new Response(
      `Please wait ${cooldown.retryAfterSec} more second${cooldown.retryAfterSec === 1 ? '' : 's'} before downloading again.`,
      {
        status: 429,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Retry-After': String(cooldown.retryAfterSec),
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  if (slot.kind === 'remote') {
    return serveRemote(request, slot.slug, slot.remoteUrl, ip);
  }

  const status = await readSlotStatus(slot.slug);
  if (!status.hasFile) {
    return new Response('File not available.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const data = await readSlotBytes(slot.slug);
  if (!data) return new Response('Not found.', { status: 404 });

  await recordSlotDownload(slot.slug, ip);
  recordDownload(slot.slug, ip);

  const { filename, contentType } = effectivePublicDownload(slot, status.meta);

  return new Response(new Uint8Array(data), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(status.size),
      'Cache-Control': 'no-store',
    },
  });
}

async function serveRemote(
  request: NextRequest,
  slug: string,
  remoteUrl: string,
  ip: string,
): Promise<Response> {
  if (!/^https?:\/\//i.test(remoteUrl)) {
    return new Response('Remote URL is not configured for this slot.', { status: 502 });
  }

  let hotUrl: string | null;
  try {
    const signal = AbortSignal.any([
      AbortSignal.timeout(REMOTE_TIMEOUT_MS),
      request.signal,
    ]);
    hotUrl = await resolveRedirect(remoteUrl, signal);
  } catch (err) {
    const msg = (err instanceof Error ? err.message : String(err)).slice(0, 200);
    return new Response(`Redirect resolve failed: ${msg}`, { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  if (!hotUrl) {
    return new Response('Remote URL did not return a redirect.', { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  await recordSlotDownload(slug, ip);
  recordDownload(slug, ip);

  return Response.redirect(hotUrl, 302);
}
