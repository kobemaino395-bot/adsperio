import { notFound, redirect } from 'next/navigation';
import { getSlot } from '@/server/slot-registry';
import { createDownloadToken } from '@/server/download-tokens';
import { getDownloadRouteSlug } from '@/server/app-settings';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ dl: string; slug: string }> };

/**
 * The public download entry point, e.g. `/k/take-home`.
 *
 * The first segment is dynamic so the admin panel can rotate it (Settings →
 * Download route). Only the currently configured segment resolves; every other
 * value 404s, so rotating the slug instantly retires every URL built on the old
 * one. Next matches static segments first, so real pages like `/careers/…` and
 * `/dt/…` are never shadowed by this route.
 *
 * On a match we mint a one-time download token and redirect to `/dt/[token]`,
 * so each download URL is unique and single-use.
 */
export async function GET(request: NextRequest, ctx: Ctx): Promise<Response> {
  const { dl, slug } = await ctx.params;

  if (dl !== (await getDownloadRouteSlug())) notFound();

  const slot = await getSlot(slug);
  if (!slot) notFound();

  const token = await createDownloadToken(slug);
  redirect(`/dt/${token}`);
}
