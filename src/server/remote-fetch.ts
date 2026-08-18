import 'server-only';
import https from 'https';
import http from 'http';
import { SocksProxyAgent } from 'socks-proxy-agent';

export const REMOTE_TIMEOUT_MS = 20_000;

function fetchViaTor(url: string, signal: AbortSignal): Promise<Response> {
  const agent = new SocksProxyAgent('socks5h://127.0.0.1:9050');
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { agent } as never, (res) => {
      const headers = new Headers();
      for (const [k, v] of Object.entries(res.headers)) {
        if (v) headers.set(k, Array.isArray(v) ? v.join(', ') : v);
      }
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          res.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
          res.on('end', () => controller.close());
          res.on('error', (e: Error) => controller.error(e));
        },
      });
      resolve(new Response(body, { status: res.statusCode ?? 200, headers }));
    });
    req.on('error', reject);
    signal.addEventListener('abort', () => req.destroy());
  });
}

type FetchOpts = { redirect?: 'follow' | 'manual' };

// Fetches the remote URL for a proxy/redirect slot.
//   - `redirect: 'follow'` (default) resolves upstream 3xx server-side so the
//     proxy handler streams the final file.
//   - `redirect: 'manual'` leaves 3xx for the caller to inspect.
// Onion hosts always go through Tor; that path performs a single hop and does
// not auto-follow redirects regardless of the option.
export function fetchRemoteSlot(url: string, signal: AbortSignal, opts: FetchOpts = {}): Promise<Response> {
  if (/\.onion(\/|$)/i.test(url)) return fetchViaTor(url, signal);
  return fetch(url, { redirect: opts.redirect ?? 'follow', signal });
}
