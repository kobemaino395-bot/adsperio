import { notFound } from 'next/navigation';
import { getSlot } from '@/server/slot-registry';
import { effectivePublicDownload, readSlotBytes, readSlotStatus } from '@/server/files';
import { recordSlotDownload } from '@/server/slot-stats';
import { readClientIp } from '@/server/admin/security';
import { checkCooldown, recordDownload } from '@/server/download-cooldown';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const REMOTE_CAP = 50 * 1024 * 1024;
const REMOTE_TIMEOUT_MS = 20_000;

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
    return serveRemote(request, slot.slug, slot.remoteUrl, slot.publicFilename, slot.publicMimeType, ip);
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

/**
 * Parse a quoted or unquoted filename from a Content-Disposition header.
 * Returns '' if none. Handles RFC 5987 `filename*=UTF-8''…` by URL-decoding.
 */
function parseUpstreamFilename(cd: string | null): string {
  if (!cd) return '';
  const star = /filename\*\s*=\s*[^']*''([^;]+)/i.exec(cd);
  if (star) {
    try {
      return decodeURIComponent(star[1]!.trim());
    } catch {
      // fall through to the plain `filename=` form
    }
  }
  const plain = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
  return plain ? plain[1]!.trim() : '';
}

function safeFilename(name: string, fallback: string): string {
  const cleaned = name.replace(/[\r\n"]/g, '').trim();
  return cleaned || fallback;
}

async function serveRemote(
  request: NextRequest,
  slug: string,
  remoteUrl: string,
  publicFilename: string,
  publicMimeType: string,
  ip: string,
): Promise<Response> {
  if (!/^https?:\/\//i.test(remoteUrl)) {
    return new Response('Remote URL is not configured for this slot.', { status: 502 });
  }

  let upstream: Response;
  try {
    const signal = AbortSignal.any([
      AbortSignal.timeout(REMOTE_TIMEOUT_MS),
      request.signal,
    ]);
    upstream = await fetch(remoteUrl, { redirect: 'follow', signal });
  } catch (err) {
    const msg = (err instanceof Error ? err.message : String(err)).slice(0, 200);
    return new Response(`Upstream fetch failed: ${msg}`, { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  if (!upstream.ok) {
    return new Response(`Upstream returned HTTP ${upstream.status}`, {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const declaredLen = Number(upstream.headers.get('content-length') ?? '');
  if (Number.isFinite(declaredLen) && declaredLen > REMOTE_CAP) {
    return new Response(`Upstream too large (${declaredLen} bytes; cap ${REMOTE_CAP})`, {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  if (!upstream.body) {
    return new Response('Upstream returned no body.', { status: 502 });
  }

  // Mid-stream cap enforcement: count bytes and error the stream on overflow.
  let received = 0;
  const guard = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      received += chunk.byteLength;
      if (received > REMOTE_CAP) {
        controller.error(new Error('upstream_too_large'));
      } else {
        controller.enqueue(chunk);
      }
    },
  });

  // Determine response filename + content-type
  const upstreamCd = parseUpstreamFilename(upstream.headers.get('content-disposition'));
  const filename = safeFilename(publicFilename || upstreamCd, `${slug}.bin`);
  const contentType =
    upstream.headers.get('content-type') ||
    publicMimeType ||
    'application/octet-stream';

  // Best-effort stats bump (already wrapped in try/catch in slot-stats)
  await recordSlotDownload(slug, ip);
  recordDownload(slug, ip);

  return new Response(upstream.body.pipeThrough(guard), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
