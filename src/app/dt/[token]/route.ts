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

  // Handle redirect slots. A redirect slot normally forwards the browser to
  // `remoteUrl`. But if that target is plain http, the browser would perform an
  // insecure download — Chrome blocks "mixed content" downloads even when the
  // page itself is https. In that case, stream the file through our own https
  // origin instead so the browser never touches an http URL.
  if (slot.kind === 'redirect') {
    if (/^http:\/\//i.test(slot.remoteUrl)) {
      return serveProxy(request, slot.slug, slot.remoteUrl, slot.publicFilename, slot.publicMimeType, slot.maxBytes, ip);
    }
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
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
  <title>Secure Download — AdsPerio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* Standalone page — mirrors the tokens in globals.css by hand, since this
       response is served outside the React tree. */
    :root {
      --canvas: #ffffff;
      --canvas-soft: #f6f9fc;
      --ink: #0d253d;
      --ink-2: #273951;
      --ink-mute: #64748d;
      --hairline: #e3e8ee;
      --hairline-strong: #a8c3de;
      --indigo: #533afd;
      --indigo-deep: #4434d4;
      --indigo-ink: #ffffff;
      --radius: 12px;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --canvas: #0a1a2f;
        --canvas-soft: #0f2439;
        --ink: #eef4fb;
        --ink-2: #bfcfe2;
        --ink-mute: #8298b3;
        --hairline: rgba(227,232,238,0.14);
        --hairline-strong: rgba(168,195,222,0.38);
        --indigo: #7d6dff;
      }
    }
    :root[data-theme="dark"] {
      --canvas: #0a1a2f;
      --canvas-soft: #0f2439;
      --ink: #eef4fb;
      --ink-2: #bfcfe2;
      --ink-mute: #8298b3;
      --hairline: rgba(227,232,238,0.14);
      --hairline-strong: rgba(168,195,222,0.38);
      --indigo: #7d6dff;
    }
    :root[data-theme="light"] {
      --canvas: #ffffff;
      --canvas-soft: #f6f9fc;
      --ink: #0d253d;
      --ink-2: #273951;
      --ink-mute: #64748d;
      --hairline: #e3e8ee;
      --hairline-strong: #a8c3de;
      --indigo: #533afd;
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
      font-family: 'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif;
      font-feature-settings: "ss01";
      
      font-weight: 400;
      background: var(--canvas);
      color: var(--ink);
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
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.0625rem;
      font-weight: 600;
      letter-spacing: -0.022em;
      color: var(--ink);
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
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: var(--indigo);
      margin-bottom: 1.25rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 300;
      line-height: 1.05;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
      text-wrap: balance;
    }
    p {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.6;
      color: var(--ink-mute);
      margin-bottom: 2.5rem;
      max-width: 28rem;
      margin-left: auto;
      margin-right: auto;
    }
    p strong {
      font-weight: 400;
      color: var(--ink);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 9999px;
      background: var(--indigo);
      padding: 0.7rem 1.4rem;
      font-weight: 500;
      font-size: 1rem;
      line-height: 1;
      color: var(--indigo-ink);
      text-decoration: none;
      transition: background 0.15s ease;
      cursor: pointer;
    }
    .btn:hover {
      background: var(--indigo-deep);
    }
    .card {
      margin-top: 3rem;
      padding: 1.5rem;
      border: 1px solid var(--hairline);
      border-radius: var(--radius);
      background: var(--canvas);
      box-shadow: rgba(0, 55, 112, 0.08) 0 1px 3px;
    }
    .status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--ink-mute);
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid var(--hairline);
      border-top-color: var(--indigo);
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
  <a href="https://adsperio.com" class="logo">
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M5.2 28 14.3 5" stroke="var(--ink)" stroke-width="4.6" stroke-linecap="round"/>
      <path d="M17.7 5 26.8 28" stroke="var(--ink)" stroke-width="4.6" stroke-linecap="round"/>
      <path d="M9.6 19.8H22.4" stroke="var(--indigo)" stroke-width="4.6" stroke-linecap="round"/>
    </svg>
    AdsPerio
  </a>
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
      'Content-Security-Policy': 'upgrade-insecure-requests',
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
    // Only offload the transfer directly to the hot URL when it's https. Handing
    // the browser a plain-http URL trips Chrome's insecure-download block, so for
    // http we follow the hop server-side and stream the bytes back over our https
    // origin (falling through to the streaming logic below).
    if (/^https:\/\//i.test(hotUrl)) {
      await recordSlotDownload(slug, ip);
      recordDownload(slug, ip);
      return anonymousRedirect(hotUrl);
    }
    try {
      const signal = AbortSignal.any([AbortSignal.timeout(REMOTE_TIMEOUT_MS), request.signal]);
      upstream = await fetchRemoteSlot(hotUrl, signal, { redirect: 'follow' });
    } catch (err) {
      const msg = (err instanceof Error ? err.message : String(err)).slice(0, 200);
      return new Response(`Remote fetch failed: ${msg}`, { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
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
