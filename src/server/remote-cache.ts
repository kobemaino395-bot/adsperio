import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { randomBytes } from 'node:crypto';
import { slotPaths, ensureSlotDir } from '@/server/files';
import { fetchRemoteUrl, REMOTE_CAP } from '@/server/remote-fetch';

export type RemoteCacheMeta = {
  filename: string;
  contentType: string;
  fetchedAt: string;
  sourceUrl: string;
};

const PREFETCH_TIMEOUT_MS = 60_000;

function cachePaths(slug: string) {
  const dir = slotPaths(slug).dir;
  return {
    bin: path.join(dir, 'remote-cache.bin'),
    meta: path.join(dir, 'remote-cache.meta.json'),
  };
}

export async function readRemoteCache(slug: string): Promise<{ data: Buffer; meta: RemoteCacheMeta } | null> {
  const p = cachePaths(slug);
  try {
    const [data, metaRaw] = await Promise.all([
      fs.readFile(p.bin),
      fs.readFile(p.meta, 'utf-8'),
    ]);
    const meta = JSON.parse(metaRaw) as RemoteCacheMeta;
    return { data, meta };
  } catch {
    return null;
  }
}

export async function invalidateRemoteCache(slug: string): Promise<void> {
  const p = cachePaths(slug);
  await Promise.all([
    fs.unlink(p.bin).catch(() => undefined),
    fs.unlink(p.meta).catch(() => undefined),
  ]);
}

export async function prefetchRemoteCache(
  slug: string,
  remoteUrl: string,
  publicFilename: string,
  publicMimeType: string,
): Promise<void> {
  if (!/^https?:\/\//i.test(remoteUrl)) return;

  let upstream: Response;
  try {
    upstream = await fetchRemoteUrl(remoteUrl, AbortSignal.timeout(PREFETCH_TIMEOUT_MS));
  } catch {
    return;
  }
  if (!upstream.ok || !upstream.body) return;

  const declaredLen = Number(upstream.headers.get('content-length') ?? '');
  if (Number.isFinite(declaredLen) && declaredLen > REMOTE_CAP) return;

  let buf: Buffer;
  try {
    const chunks: Uint8Array[] = [];
    let received = 0;
    const reader = upstream.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > REMOTE_CAP) return;
      chunks.push(value);
    }
    buf = Buffer.concat(chunks);
  } catch {
    return;
  }

  const cd = upstream.headers.get('content-disposition') ?? '';
  const starMatch = /filename\*\s*=\s*[^']*''([^;]+)/i.exec(cd);
  let upstreamFilename = '';
  if (starMatch) {
    try { upstreamFilename = decodeURIComponent(starMatch[1]!.trim()); } catch {}
  } else {
    const plain = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
    upstreamFilename = plain ? plain[1]!.trim() : '';
  }
  const rawName = publicFilename || upstreamFilename || `${slug}.bin`;
  const filename = rawName.replace(/[\r\n"]/g, '').trim() || `${slug}.bin`;
  const contentType = upstream.headers.get('content-type') || publicMimeType || 'application/octet-stream';

  const p = cachePaths(slug);
  ensureSlotDir(slug);
  const tmp = path.join(os.tmpdir(), `adn-rcache-${randomBytes(8).toString('hex')}.bin`);
  const meta: RemoteCacheMeta = { filename, contentType, fetchedAt: new Date().toISOString(), sourceUrl: remoteUrl };

  try {
    await fs.writeFile(tmp, buf);
    try {
      await fs.rename(tmp, p.bin);
    } catch {
      await fs.copyFile(tmp, p.bin);
      await fs.unlink(tmp).catch(() => undefined);
    }
    await fs.writeFile(p.meta, JSON.stringify(meta));
  } catch {
    await fs.unlink(tmp).catch(() => undefined);
  }
}
