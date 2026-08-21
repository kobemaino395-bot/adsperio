import type { NextRequest } from 'next/server';
import { readTakeHomeBytes, readTakeHomeMeta } from '@/server/content/position-files';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, ctx: Ctx): Promise<Response> {
  const { slug } = await ctx.params;

  const [meta, bytes] = await Promise.all([readTakeHomeMeta(slug), readTakeHomeBytes(slug)]);
  if (!meta || !bytes) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      'Content-Type': meta.contentType || 'application/octet-stream',
      'Content-Length': String(bytes.length),
      'Content-Disposition': `attachment; filename="${meta.originalFilename.replace(/"/g, '')}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
