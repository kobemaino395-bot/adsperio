import { NextResponse } from 'next/server';
import { cleanupExpiredTokens } from '@/server/download-tokens';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cleanup-tokens
 * Remove expired download tokens from the registry.
 * Can be called by a cron job or scheduled task.
 *
 * Returns: { removed: number }
 */
export async function GET(): Promise<NextResponse> {
  try {
    const removed = await cleanupExpiredTokens();
    return NextResponse.json({ removed });
  } catch (err) {
    console.error('[cleanup-tokens] Error cleaning up tokens:', err);
    return NextResponse.json(
      { error: 'Failed to cleanup tokens' },
      { status: 500 }
    );
  }
}
