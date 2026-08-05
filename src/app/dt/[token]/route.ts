import { notFound } from 'next/navigation';
import { consumeDownloadToken, cleanupExpiredTokens } from '@/server/download-tokens';
import { getSlot } from '@/server/slot-registry';
import { effectivePublicDownload, readSlotBytes, readSlotStatus } from '@/server/files';
import { recordSlotDownload } from '@/server/slot-stats';
import { readClientIp } from '@/server/admin/security';
import { checkCooldown, recordDownload } from '@/server/download-cooldown';
import { fetchRemoteSlot, REMOTE_TIMEOUT_MS } from '@/server/remote-fetch';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ token: string }> };

export async function GET(request: NextRequest, ctx: Ctx): Promise<Response> {
  const { token } = await ctx.params;

  // Opportunistically clean up expired tokens (fire-and-forget)
  cleanupExpiredTokens().catch(() => undefined);

  // Consume the one-time token and get the associated slot slug
  const slug = await consumeDownloadToken(token);
  if (!slug) {
    return new Response('Invalid or expired download link.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

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

  // Handle redirect slots
  if (slot.kind === 'redirect') {
    return serveNewTabRedirect(slot.slug, slot.title, slot.remoteUrl, ip);
  }

  // Handle proxy slots
  if (slot.kind === 'proxy') {
    return serveProxy(request, slot.slug, slot.remoteUrl, slot.publicFilename, slot.publicMimeType, slot.maxBytes, ip);
  }

  // Handle local file slots
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

async function serveNewTabRedirect(slug: string, title: string, remoteUrl: string, ip: string): Promise<Response> {
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-bg: #ffffff;
      --color-fg: #0d253d;
      --color-fg-muted: #64748d;
      --color-border: #e3e8ee;
      --color-accent: #533afd;
      --color-accent-deep: #4434d4;
      --color-accent-press: #2e2b8c;
      --color-zest-50: #eef0ff;
      --shadow-lg: 0 24px 60px rgba(0,55,112,0.12), 0 6px 18px rgba(0,55,112,0.06);
      --radius: 12px;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --color-bg: #0b1020;
        --color-fg: #eef1fb;
        --color-fg-muted: #8a93b4;
        --color-border: rgba(255,255,255,0.10);
        --color-accent: #6f63ff;
        --color-accent-deep: #9a90ff;
        --color-accent-press: #5a4ef0;
        --color-zest-50: rgba(111,99,255,0.16);
        --shadow-lg: 0 24px 60px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.4);
      }
    }
    :root[data-theme="dark"] {
      --color-bg: #0b1020;
      --color-fg: #eef1fb;
      --color-fg-muted: #8a93b4;
      --color-border: rgba(255,255,255,0.10);
      --color-accent: #6f63ff;
      --color-accent-deep: #9a90ff;
      --color-accent-press: #5a4ef0;
      --color-zest-50: rgba(111,99,255,0.16);
      --shadow-lg: 0 24px 60px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.4);
    }
    :root[data-theme="light"] {
      --color-bg: #ffffff;
      --color-fg: #0d253d;
      --color-fg-muted: #64748d;
      --color-border: #e3e8ee;
      --color-accent: #533afd;
      --color-accent-deep: #4434d4;
      --color-accent-press: #2e2b8c;
      --color-zest-50: #eef0ff;
      --shadow-lg: 0 24px 60px rgba(0,55,112,0.12), 0 6px 18px rgba(0,55,112,0.06);
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html {
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-feature-settings: "ss01";
      font-weight: 300;
      background: var(--color-bg);
      color: var(--color-fg);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .logo {
      position: absolute;
      top: 2rem;
      left: 2rem;
      font-size: 1.375rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: var(--color-fg);
      text-decoration: none;
      transition: opacity 0.18s ease;
    }
    .logo:hover {
      opacity: 0.7;
    }
    .container {
      max-width: 32rem;
      width: 100%;
      text-align: center;
    }
    .label {
      font-size: 0.7rem;
      font-weight: 400;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-accent-deep);
      margin-bottom: 1.25rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 300;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
      text-wrap: balance;
    }
    p {
      font-size: 1rem;
      font-weight: 300;
      line-height: 1.6;
      color: var(--color-fg-muted);
      margin-bottom: 2.5rem;
      max-width: 28rem;
      margin-left: auto;
      margin-right: auto;
    }
    p strong {
      font-weight: 400;
      color: var(--color-fg);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 9999px;
      background: var(--color-accent);
      padding: 0.7rem 1.4rem;
      font-weight: 400;
      font-size: 1rem;
      line-height: 1;
      color: #ffffff;
      text-decoration: none;
      transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
      box-shadow: 0 1px 2px rgba(46,43,140,0.25);
      cursor: pointer;
    }
    .btn:hover {
      background: var(--color-accent-deep);
      transform: translateY(-1px);
    }
    .btn:active {
      background: var(--color-accent-press);
      transform: translateY(0);
    }
    .card {
      margin-top: 3rem;
      padding: 1.5rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-bg);
    }
    .status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      font-weight: 300;
      color: var(--color-fg-muted);
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid var(--color-zest-50);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 640px) {
      .logo {
        top: 1.5rem;
        left: 1.5rem;
        font-size: 1.125rem;
      }
      h1 {
        font-size: 2rem;
      }
      .card {
        margin-top: 2rem;
        padding: 1.25rem;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <a href="https://growthvirex.com" class="logo">GrowthVireX</a>
  <div class="container">
    <div class="label">Secure delivery</div>
    <h1>Your download is ready.</h1>
    <p>Click the button below to download <strong>${title}</strong>.</p>
    <a href="${remoteUrl}" class="btn" target="_blank" rel="noopener noreferrer">Open download</a>
    <div class="card">
      <div class="status">
        <div class="spinner"></div>
        <span>Ready to download</span>
      </div>
    </div>
  </div>
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
  if (Number.isFinite(declaredSize) && declaredSize <= maxBytes) {
    headers['Content-Length'] = String(declaredSize);
  }

  return new Response(capStream(upstream.body, maxBytes), { status: 200, headers });
}

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
