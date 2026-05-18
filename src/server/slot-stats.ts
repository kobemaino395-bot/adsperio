import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ensureSlotDir, slotPaths } from '@/server/files';
import { readStats } from '@/server/storage';

export type SlotStats = {
  downloads: number;
  lastDownloadedAt: string | null;
  lastDownloadIp: string | null;
};

function statsPath(slug: string): string {
  return path.join(slotPaths(slug).dir, 'stats.json');
}

const EMPTY: SlotStats = { downloads: 0, lastDownloadedAt: null, lastDownloadIp: null };

async function migrateFromGlobalIfNeeded(slug: string): Promise<SlotStats> {
  const global = await readStats().catch(() => ({} as Record<string, number>));
  const fromFiles = Number(global[`files.${slug}.downloads`] ?? 0);
  const fromLegacy = slug === 'take-home' ? Number(global['takehome.downloads'] ?? 0) : 0;
  const seed = Math.max(0, fromFiles, fromLegacy);
  return { ...EMPTY, downloads: seed };
}

export async function readSlotStats(slug: string): Promise<SlotStats> {
  const file = statsPath(slug);
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw) as Partial<SlotStats>;
    return {
      downloads: Number(parsed.downloads ?? 0),
      lastDownloadedAt: parsed.lastDownloadedAt ?? null,
      lastDownloadIp: parsed.lastDownloadIp ?? null,
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      const seeded = await migrateFromGlobalIfNeeded(slug);
      if (seeded.downloads > 0) {
        ensureSlotDir(slug);
        await fs.writeFile(file, JSON.stringify(seeded), 'utf8').catch(() => undefined);
      }
      return seeded;
    }
    throw err;
  }
}

export async function recordSlotDownload(slug: string, ip: string): Promise<void> {
  try {
    const current = await readSlotStats(slug);
    const next: SlotStats = {
      downloads: current.downloads + 1,
      lastDownloadedAt: new Date().toISOString(),
      lastDownloadIp: ip || null,
    };
    ensureSlotDir(slug);
    await fs.writeFile(statsPath(slug), JSON.stringify(next), 'utf8');
  } catch {
    // Stats are best-effort; never fail a download because of stats.
  }
}
