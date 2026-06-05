import 'server-only';
import path from 'node:path';
import { ensureSlotDir, slotPaths } from '@/server/files';
import { readStats } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';

export type SlotStats = {
  downloads: number;
  lastDownloadedAt: string | null;
  lastDownloadIp: string | null;
  /** Every unique IP that has been counted toward `downloads`. */
  downloadedIps: string[];
};

function statsPath(slug: string): string {
  return path.join(slotPaths(slug).dir, 'stats.json');
}

const EMPTY: SlotStats = { downloads: 0, lastDownloadedAt: null, lastDownloadIp: null, downloadedIps: [] };

function normalize(parsed: Partial<SlotStats> | null): SlotStats {
  if (!parsed) return { ...EMPTY };
  return {
    downloads: Number.isFinite(parsed.downloads) ? Math.max(0, Math.floor(Number(parsed.downloads))) : 0,
    lastDownloadedAt: typeof parsed.lastDownloadedAt === 'string' ? parsed.lastDownloadedAt : null,
    lastDownloadIp: typeof parsed.lastDownloadIp === 'string' ? parsed.lastDownloadIp : null,
    downloadedIps: Array.isArray(parsed.downloadedIps)
      ? parsed.downloadedIps.filter((v): v is string => typeof v === 'string')
      : [],
  };
}

async function migrateFromGlobalIfNeeded(slug: string): Promise<SlotStats> {
  const global = await readStats().catch(() => ({} as Record<string, number>));
  const fromFiles = Number(global[`files.${slug}.downloads`] ?? 0);
  const fromLegacy = slug === 'take-home' ? Number(global['takehome.downloads'] ?? 0) : 0;
  const seed = Math.max(0, fromFiles, fromLegacy);
  return { ...EMPTY, downloads: seed };
}

async function readRawOrMigrate(slug: string): Promise<{ value: SlotStats; existedOnDisk: boolean }> {
  const file = statsPath(slug);
  // Sentinel approach: use a missing-marker by passing null fallback and
  // distinguishing missing-file from corrupt-file at this layer.
  const SENTINEL = Symbol('missing-or-corrupt');
  const parsed = await readJsonResilient<Partial<SlotStats> | typeof SENTINEL>(file, SENTINEL as never);
  if (parsed === (SENTINEL as never)) {
    // ENOENT or corrupt. Try migrating from global stats; otherwise empty.
    const seeded = await migrateFromGlobalIfNeeded(slug);
    return { value: seeded, existedOnDisk: false };
  }
  return { value: normalize(parsed as Partial<SlotStats>), existedOnDisk: true };
}

export async function readSlotStats(slug: string): Promise<SlotStats> {
  const file = statsPath(slug);
  return withFileLock(file, async () => {
    const { value, existedOnDisk } = await readRawOrMigrate(slug);
    // First-touch seed: persist the migrated value so subsequent reads
    // don't re-derive it. Only write if it carries useful state.
    if (!existedOnDisk && value.downloads > 0) {
      ensureSlotDir(slug);
      await writeJsonAtomic(file, value).catch(() => undefined);
    }
    return value;
  });
}

export async function recordSlotDownload(slug: string, ip: string): Promise<void> {
  const file = statsPath(slug);
  try {
    await withFileLock(file, async () => {
      const { value } = await readRawOrMigrate(slug);

      const normalizedIp = ip || null;
      const alreadyCounted =
        normalizedIp !== null &&
        normalizedIp !== 'unknown' &&
        value.downloadedIps.includes(normalizedIp);

      const next: SlotStats = {
        // Only increment the counter for IPs we haven't seen before.
        downloads: alreadyCounted ? value.downloads : value.downloads + 1,
        lastDownloadedAt: new Date().toISOString(),
        lastDownloadIp: normalizedIp,
        downloadedIps: alreadyCounted
          ? value.downloadedIps
          : normalizedIp && normalizedIp !== 'unknown'
            ? [...value.downloadedIps, normalizedIp]
            : value.downloadedIps,
      };

      ensureSlotDir(slug);
      await writeJsonAtomic(file, next);
    });
  } catch (err) {
    // Stats are best-effort; never fail a download because of stats.
    console.warn(`[slot-stats] recordSlotDownload(${slug}) failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}