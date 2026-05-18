import { notFound } from 'next/navigation';
import { getFileSlot } from '@/content/files';
import { readSlotBytes, readSlotStatus } from '@/server/files';
import { bumpStat } from '@/server/storage';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: Ctx): Promise<Response> {
  const { slug } = await ctx.params;
  const slot = getFileSlot(slug);
  if (!slot) notFound();

  const status = await readSlotStatus(slot);
  if (!status.hasFile) {
    return new Response('File not available.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const data = await readSlotBytes(slot);
  if (!data) return new Response('Not found.', { status: 404 });

  await bumpStat(`files.${slug}.downloads`).catch(() => undefined);

  return new Response(new Uint8Array(data), {
    status: 200,
    headers: {
      'Content-Type': slot.publicMimeType,
      'Content-Disposition': `attachment; filename="${slot.publicFilename}"`,
      'Content-Length': String(status.size),
      'Cache-Control': 'no-store',
    },
  });
}
