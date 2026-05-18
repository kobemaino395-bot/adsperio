import 'server-only';
import { promises as fs } from 'node:fs';
import { existsSync, mkdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { dataDir, fileMeta, sanitizeFilename } from '@/server/storage';
import type { SlotRecord } from '@/server/slot-registry';

export type SlotPaths = {
  dir: string;
  file: string;
  backup: string;
  meta: string;
};

export type SlotMeta = {
  originalFilename: string;
  contentType: string;
  uploadedAt: string;
  size: number;
};

export type SlotStatus = {
  slug: string;
  hasFile: boolean;
  size: number;
  mtimeMs: number;
  backupSize: number;
  meta: SlotMeta | null;
};

export function filesRoot(): string {
  return path.join(dataDir(), 'files');
}

export function slotPaths(slug: string): SlotPaths {
  const dir = path.join(filesRoot(), slug);
  return {
    dir,
    file: path.join(dir, 'file.bin'),
    backup: path.join(dir, 'file.bin.bak'),
    meta: path.join(dir, 'meta.json'),
  };
}

export function ensureSlotDir(slug: string): void {
  const p = slotPaths(slug);
  if (!existsSync(p.dir)) mkdirSync(p.dir, { recursive: true });
}

let migratedTakeHome = false;
async function maybeMigrateTakeHome(slug: string): Promise<void> {
  if (migratedTakeHome || slug !== 'take-home') return;
  migratedTakeHome = true;

  const legacyFile = path.join(dataDir(), 'downloads', 'take-home');
  const legacyBackup = path.join(dataDir(), 'downloads', 'take-home.bak');
  const legacyMeta = path.join(dataDir(), 'downloads', 'take-home.meta.json');

  const p = slotPaths(slug);
  ensureSlotDir(slug);

  try { if (existsSync(legacyFile) && !existsSync(p.file)) await fs.rename(legacyFile, p.file); } catch {}
  try { if (existsSync(legacyBackup) && !existsSync(p.backup)) await fs.rename(legacyBackup, p.backup); } catch {}
  try {
    if (existsSync(legacyMeta) && !existsSync(p.meta)) {
      const raw = await fs.readFile(legacyMeta, 'utf8');
      const parsed = JSON.parse(raw) as { filename?: string; contentType?: string; uploadedAt?: string; size?: number };
      const migrated: SlotMeta = {
        originalFilename: parsed.filename ?? 'take-home',
        contentType: parsed.contentType ?? 'application/octet-stream',
        uploadedAt: parsed.uploadedAt ?? new Date().toISOString(),
        size: parsed.size ?? 0,
      };
      await fs.writeFile(p.meta, JSON.stringify(migrated), 'utf8');
      await fs.unlink(legacyMeta).catch(() => undefined);
    }
  } catch {}
}

export async function readSlotMeta(slug: string): Promise<SlotMeta | null> {
  await maybeMigrateTakeHome(slug);
  const p = slotPaths(slug);
  try {
    const raw = await fs.readFile(p.meta, 'utf8');
    return JSON.parse(raw) as SlotMeta;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export async function writeSlotMeta(slug: string, meta: SlotMeta): Promise<void> {
  ensureSlotDir(slug);
  const p = slotPaths(slug);
  await fs.writeFile(p.meta, JSON.stringify(meta), 'utf8');
}

export async function readSlotStatus(slug: string): Promise<SlotStatus> {
  await maybeMigrateTakeHome(slug);
  const p = slotPaths(slug);
  const [fm, bm, meta] = await Promise.all([
    fileMeta(p.file),
    fileMeta(p.backup),
    readSlotMeta(slug),
  ]);
  return {
    slug,
    hasFile: !!fm,
    size: fm?.size ?? 0,
    mtimeMs: fm?.mtimeMs ?? 0,
    backupSize: bm?.size ?? 0,
    meta,
  };
}

export async function readSlotBytes(slug: string): Promise<Buffer | null> {
  await maybeMigrateTakeHome(slug);
  const p = slotPaths(slug);
  try {
    return await fs.readFile(p.file);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export type ReplaceResult =
  | { ok: true; size: number; backupPath: string }
  | { ok: false; reason: string };

export async function replaceSlotFile(
  slot: SlotRecord,
  buf: Buffer,
  originalFilename: string,
  contentType: string,
): Promise<ReplaceResult> {
  if (buf.length === 0) return { ok: false, reason: 'Empty file' };
  if (buf.length > slot.maxBytes) {
    return { ok: false, reason: `File exceeds ${Math.round(slot.maxBytes / (1024 * 1024))} MB limit` };
  }

  await maybeMigrateTakeHome(slot.slug);
  ensureSlotDir(slot.slug);
  const p = slotPaths(slot.slug);
  const tmp = path.join(os.tmpdir(), `adn-slot-${randomBytes(8).toString('hex')}.bin`);
  await fs.writeFile(tmp, buf);

  const existing = await fileMeta(p.file);
  if (existing) {
    try { await fs.rename(p.file, p.backup); } catch { await fs.copyFile(p.file, p.backup); }
  }
  try { await fs.rename(tmp, p.file); } catch {
    await fs.copyFile(tmp, p.file);
    await fs.unlink(tmp).catch(() => undefined);
  }

  const meta: SlotMeta = {
    originalFilename: sanitizeFilename(originalFilename),
    contentType: contentType || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    size: buf.length,
  };
  await writeSlotMeta(slot.slug, meta);

  return { ok: true, size: buf.length, backupPath: p.backup };
}

export async function deleteSlotFiles(slug: string): Promise<void> {
  const p = slotPaths(slug);
  await fs.rm(p.dir, { recursive: true, force: true });
}
