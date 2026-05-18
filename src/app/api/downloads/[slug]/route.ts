import { notFound } from 'next/navigation';
import { getSlot } from '@/server/slot-registry';
import { effectivePublicDownload, readSlotBytes, readSlotStatus } from '@/server/files';
import { bumpStat } from '@/server/storage';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: Ctx): Promise<Response> {
  const { slug } = await ctx.params;
  const slot = await getSlot(slug);
  if (!slot) notFound();

  const status = await readSlotStatus(slot.slug);
  if (!status.hasFile) {
    return new Response('File not available.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const data = await readSlotBytes(slot.slug);
  if (!data) return new Response('Not found.', { status: 404 });

  await bumpStat(`files.${slug}.downloads`).catch(() => undefined);

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
