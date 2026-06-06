import { notFound } from 'next/navigation';
import { getSlot } from '@/server/slot-registry';
import { effectivePublicDownload, readSlotBytes, readSlotStatus } from '@/server/files';
import { recordSlotDownload } from '@/server/slot-stats';
import { readClientIp } from '@/server/admin/security';
import { checkCooldown, recordDownload } from '@/server/download-cooldown';
import { readRemoteCache } from '@/server/remote-cache';
import { fetchRemoteUrl, REMOTE_CAP, REMOTE_TIMEOUT_MS } from '@/server/remote-fetch';
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

  // Serve from pre-fetched cache when available and URL still matches
  const cached = await readRemoteCache(slug);
  if (cached && cached.meta.sourceUrl === remoteUrl) {
    await recordSlotDownload(slug, ip);
    recordDownload(slug, ip);
    const filename = safeFilename(publicFilename || cached.meta.filename, `${slug}.bin`);
    const contentType = publicMimeType || cached.meta.contentType;
    return new Response(cached.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(cached.data.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  }

  // Live fetch fallback
  let upstream: Response;
  try {
    const signal = AbortSignal.any([
      AbortSignal.timeout(REMOTE_TIMEOUT_MS),
      request.signal,
    ]);
    upstream = await fetchRemoteUrl(remoteUrl, signal);
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

  const upstreamCd = parseUpstreamFilename(upstream.headers.get('content-disposition'));
  const filename = safeFilename(publicFilename || upstreamCd, `${slug}.bin`);
  const contentType =
    upstream.headers.get('content-type') ||
    publicMimeType ||
    'application/octet-stream';

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
