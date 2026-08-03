import { notFound } from 'next/navigation';
import { getSlot } from '@/server/slot-registry';
import { effectivePublicDownload, readSlotBytes, readSlotStatus } from '@/server/files';
import { recordSlotDownload } from '@/server/slot-stats';
import { readClientIp } from '@/server/admin/security';
import { checkCooldown, recordDownload } from '@/server/download-cooldown';
import { fetchRemoteSlot, REMOTE_TIMEOUT_MS } from '@/server/remote-fetch';
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

  // Option 3 — anonymous redirect: forward the visitor straight to the external
  // URL without leaking that we referred them.
  if (slot.kind === 'redirect') {
    return serveNewTabRedirect(slot.slug, slot.remoteUrl, ip);
  }

  // Option 2 — proxy: the server downloads the external URL and streams the
  // bytes back, so the visitor only ever talks to us.
  if (slot.kind === 'proxy') {
    return serveProxy(request, slot.slug, slot.remoteUrl, slot.publicFilename, slot.publicMimeType, slot.maxBytes, ip);
  }

  // Option 1 — local file on server disk.
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

/** A 302 that hides us from the destination: no Referer, no indexing, no caching. */
function anonymousRedirect(location: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}

async function serveNewTabRedirect(slug: string, remoteUrl: string, ip: string): Promise<Response> {
  if (!/^https?:\/\//i.test(remoteUrl)) {
    return new Response('Redirect URL is not configured for this slot.', { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  await recordSlotDownload(slug, ip);
  recordDownload(slug, ip);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">
  <meta name="robots" content="noindex, nofollow">
  <title>Secure Download — GrowthVireX</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0d253d 0%, #1c1e54 100%);
      color: #0d253d;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .logo {
      position: absolute;
      top: 2rem;
      left: 2rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      letter-spacing: -0.02em;
    }
    .container {
      background: white;
      border-radius: 16px;
      padding: 3rem 2rem;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    .icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #533afd 0%, #665efd 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .icon svg {
      width: 32px;
      height: 32px;
      stroke: white;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 600;
      color: #0d253d;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }
    p {
      color: #64748d;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 14px 32px;
      background: linear-gradient(135deg, #533afd 0%, #665efd 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(83, 58, 253, 0.3);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(83, 58, 253, 0.4);
    }
    .btn:active {
      transform: translateY(0);
    }
    .security-note {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
      font-size: 0.85rem;
      color: #94a3b8;
    }
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 640px) {
      .logo {
        top: 1rem;
        left: 1rem;
        font-size: 1.25rem;
      }
      .container {
        padding: 2rem 1.5rem;
      }
      h1 {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="logo">GrowthVireX</div>
  <div class="container">
    <div class="icon">
      <svg viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </div>
    <h1>Preparing Your Download</h1>
    <p>Your file is being securely retrieved. A new window will open shortly with your download.</p>
    <a href="${remoteUrl}" class="btn" target="_blank" rel="noopener noreferrer">
      <span class="spinner"></span>
      Click Here if Nothing Happens
    </a>
    <div class="security-note">
      🔒 Secure download via GrowthVireX encrypted delivery
    </div>
  </div>
  <script>
    (function() {
      // Auto-open download in new tab
      window.addEventListener('load', function() {
        setTimeout(function() {
          window.open('${remoteUrl}', '_blank', 'noopener,noreferrer');
        }, 800);
      });
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

async function serveRedirect(slug: string, remoteUrl: string, ip: string): Promise<Response> {
  if (!/^https?:\/\//i.test(remoteUrl)) {
    return new Response('Redirect URL is not configured for this slot.', { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  await recordSlotDownload(slug, ip);
  recordDownload(slug, ip);
  return anonymousRedirect(remoteUrl);
}

async function serveProxy(
  request: NextRequest,
  slug: string,
  remoteUrl: string,
  publicFilename: string,
  publicMimeType: string,
  maxBytes: number,
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
    upstream = await fetchRemoteSlot(remoteUrl, signal, { redirect: 'follow' });
  } catch (err) {
    const msg = (err instanceof Error ? err.message : String(err)).slice(0, 200);
    return new Response(`Remote fetch failed: ${msg}`, { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  // The Tor path does a single hop without following redirects. If an onion
  // host fronts the file behind a 3xx, fall back to an anonymous redirect to
  // the resolved location rather than failing.
  if (upstream.status >= 300 && upstream.status < 400) {
    const hotUrl = upstream.headers.get('location');
    if (!hotUrl) return new Response('Remote redirect missing Location.', { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    await recordSlotDownload(slug, ip);
    recordDownload(slug, ip);
    return anonymousRedirect(hotUrl);
  }

  if (!upstream.ok) {
    return new Response(`Remote returned HTTP ${upstream.status}`, { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  if (!upstream.body) {
    return new Response('Remote returned no body.', { status: 502 });
  }

  // Reject oversized files up front when the upstream advertises a length.
  const contentLength = upstream.headers.get('content-length');
  const declaredSize = contentLength ? Number(contentLength) : NaN;
  if (Number.isFinite(declaredSize) && declaredSize > maxBytes) {
    return new Response(
      `Remote file is ${Math.round(declaredSize / (1024 * 1024))} MB, over the ${Math.round(maxBytes / (1024 * 1024))} MB limit.`,
      { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }

  const cdHeader = upstream.headers.get('content-disposition') ?? '';
  const cdFilename = /filename\s*=\s*"?([^";]+)"?/i.exec(cdHeader)?.[1]?.trim() ?? '';
  const filename = (publicFilename || cdFilename || `${slug}.bin`).replace(/[\r\n"]/g, '').trim() || `${slug}.bin`;
  const contentType = publicMimeType || upstream.headers.get('content-type') || 'application/octet-stream';

  await recordSlotDownload(slug, ip);
  recordDownload(slug, ip);

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
  };
  // Only advertise a length we've verified fits; the cap below still guards the
  // body in case the header lies or is absent.
  if (Number.isFinite(declaredSize) && declaredSize <= maxBytes) {
    headers['Content-Length'] = String(declaredSize);
  }

  return new Response(capStream(upstream.body, maxBytes), { status: 200, headers });
}

/**
 * Passes a stream through unchanged but aborts it if the cumulative byte count
 * exceeds `maxBytes` — a hard cap on what a proxied download can cost us even
 * when the upstream sends no (or a lying) Content-Length.
 */
function capStream(body: ReadableStream<Uint8Array>, maxBytes: number): ReadableStream<Uint8Array> {
  let seen = 0;
  const cap = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      seen += chunk.byteLength;
      if (seen > maxBytes) {
        controller.error(new Error(`Remote file exceeded the ${Math.round(maxBytes / (1024 * 1024))} MB limit`));
        return;
      }
      controller.enqueue(chunk);
    },
  });
  return body.pipeThrough(cap);
}
