import { getSlot } from '@/server/slot-registry';
import { effectivePublicDownload, readSlotBytes, readSlotStatus } from '@/server/files';
import { bumpStat } from '@/server/storage';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const slot = await getSlot('take-home');
  if (!slot) {
    return new Response('Not configured.', { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const status = await readSlotStatus(slot.slug);
  if (!status.hasFile) {
    return new Response('Take-home asset is not yet available. Please email hiring@adnovara.com.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const data = await readSlotBytes(slot.slug);
  if (!data) return new Response('Take-home asset not found.', { status: 404 });
  await bumpStat('takehome.downloads').catch(() => undefined);

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
