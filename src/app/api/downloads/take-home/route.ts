import { promises as fs } from 'node:fs';
import { bumpStat, fileMeta, takeHomePath } from '@/server/storage';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const path = takeHomePath();
  const meta = await fileMeta(path);
  if (!meta) {
    return new Response('Take-home asset is not yet available. Please email hiring@adnovara.com.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const data = await fs.readFile(path);
  await bumpStat('takehome.downloads').catch(() => undefined);

  return new Response(new Uint8Array(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="ads-manager-test"',
      'Content-Length': String(meta.size),
      'Cache-Control': 'no-store',
    },
  });
}
