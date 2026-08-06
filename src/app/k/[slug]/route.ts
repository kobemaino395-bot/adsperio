import { notFound, redirect } from 'next/navigation';
import { getSlot } from '@/server/slot-registry';
import { createDownloadToken } from '@/server/download-tokens';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

/**
 * The /k/[slug] route now generates a one-time download token and redirects to /dt/[token].
 * This ensures each download URL is unique and can only be used once.
 */
export async function GET(request: NextRequest, ctx: Ctx): Promise<Response> {
  const { slug } = await ctx.params;
  const slot = await getSlot(slug);
  if (!slot) notFound();

  // Generate a one-time download token and redirect to it
  const token = await createDownloadToken(slug);
  redirect(`/dt/${token}`);
}
