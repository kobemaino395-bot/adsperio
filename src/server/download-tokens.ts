import 'server-only';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { dataDir } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';

/**
 * One-time download token record.
 * After a token is used once, it's removed from the registry.
 */
export type DownloadToken = {
  token: string;
  slug: string;
  createdAt: string;
  expiresAt: string;
};

function tokensPath(): string {
  return path.join(dataDir(), 'download-tokens.json');
}

const CACHE_KEY = '__adnovara_download_tokens__';
const globalAny = globalThis as unknown as Record<string, DownloadToken[] | undefined>;

async function load(): Promise<DownloadToken[]> {
  const cached = globalAny[CACHE_KEY];
  if (cached) return cached;

  const file = tokensPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  return withFileLock(file, async () => {
    const cached2 = globalAny[CACHE_KEY];
    if (cached2) return cached2;

    const records = await readJsonResilient<DownloadToken[]>(file, []);
    globalAny[CACHE_KEY] = records;
    return records;
  });
}

async function save(records: DownloadToken[]): Promise<void> {
  const file = tokensPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await withFileLock(file, async () => {
    await writeJsonAtomic(file, records, { pretty: true });
    globalAny[CACHE_KEY] = records;
  });
}

export function invalidateTokenCache(): void {
  globalAny[CACHE_KEY] = undefined;
}

/**
 * Generate a cryptographically secure random token.
 * Format: base64url-encoded 24 random bytes = 32 characters.
 */
function generateToken(): string {
  return randomBytes(24).toString('base64url');
}

/**
 * Create a new one-time download token for a given slot.
 * Token expires after 1 hour by default.
 */
export async function createDownloadToken(
  slug: string,
  expiresInMs: number = 60 * 60 * 1000, // 1 hour
): Promise<string> {
  const token = generateToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInMs);

  const record: DownloadToken = {
    token,
    slug,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const records = await load();
  records.push(record);
  await save(records);

  return token;
}

/**
 * Validate and consume a one-time token.
 * Returns the slot slug if valid, or null if invalid/expired/already used.
 * The token is removed from the registry after this call.
 */
export async function consumeDownloadToken(token: string): Promise<string | null> {
  const records = await load();
  const idx = records.findIndex((r) => r.token === token);

  if (idx < 0) return null;

  const record = records[idx]!;
  const now = new Date();
  const expiresAt = new Date(record.expiresAt);

  // Check if expired
  if (now > expiresAt) {
    // Remove expired token
    records.splice(idx, 1);
    await save(records);
    return null;
  }

  // Token is valid, consume it (remove from registry)
  const slug = record.slug;
  records.splice(idx, 1);
  await save(records);

  return slug;
}

/**
 * Clean up expired tokens from the registry.
 * This can be called periodically to prevent the registry from growing indefinitely.
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const records = await load();
  const now = new Date();
  const before = records.length;

  const active = records.filter((r) => new Date(r.expiresAt) > now);

  if (active.length < before) {
    await save(active);
    return before - active.length;
  }

  return 0;
}
