import { NextRequest, NextResponse } from 'next/server';
import { createDownloadToken } from '@/server/download-tokens';
import { getSlot } from '@/server/slot-registry';

export const dynamic = 'force-dynamic';

/**
 * POST /api/download-token
 * Generate a one-time download token for a given slot.
 *
 * Body: { slug: string }
 * Returns: { token: string, url: string }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const slug = body.slug;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid slug' },
        { status: 400 }
      );
    }

    const slot = await getSlot(slug);
    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    const token = await createDownloadToken(slug);
    const url = `/dt/${token}`;

    return NextResponse.json({ token, url });
  } catch (err) {
    console.error('[download-token] Error generating token:', err);
    return NextResponse.json(
      { error: 'Failed to generate download token' },
      { status: 500 }
    );
  }
}
