import 'server-only';
import { promises as fs } from 'node:fs';
import { existsSync, mkdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { dataDir, fileMeta, sanitizeFilename } from '@/server/storage';
import type { FileSlot } from '@/content/files';

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

export function slotPaths(slot: FileSlot): SlotPaths {
  const dir = path.join(filesRoot(), slot.slug);
  return {
    dir,
    file: path.join(dir, 'file.bin'),
    backup: path.join(dir, 'file.bin.bak'),
    meta: path.join(dir, 'meta.json'),
  };
}

export function ensureSlotDir(slot: FileSlot): void {
  const p = slotPaths(slot);
  if (!existsSync(p.dir)) mkdirSync(p.dir, { recursive: true });
}

let migratedTakeHome = false;
async function maybeMigrateTakeHome(slot: FileSlot): Promise<void> {
  if (migratedTakeHome || slot.slug !== 'take-home') return;
  migratedTakeHome = true;

  const legacyFile = path.join(dataDir(), 'downloads', 'take-home');
  const legacyBackup = path.join(dataDir(), 'downloads', 'take-home.bak');
  const legacyMeta = path.join(dataDir(), 'downloads', 'take-home.meta.json');

  const p = slotPaths(slot);
  ensureSlotDir(slot);

  try {
    if (existsSync(legacyFile) && !existsSync(p.file)) await fs.rename(legacyFile, p.file);
  } catch {}
  try {
    if (existsSync(legacyBackup) && !existsSync(p.backup)) await fs.rename(legacyBackup, p.backup);
  } catch {}
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

export async function readSlotMeta(slot: FileSlot): Promise<SlotMeta | null> {
  await maybeMigrateTakeHome(slot);
  const p = slotPaths(slot);
  try {
    const raw = await fs.readFile(p.meta, 'utf8');
    return JSON.parse(raw) as SlotMeta;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export async function writeSlotMeta(slot: FileSlot, meta: SlotMeta): Promise<void> {
  ensureSlotDir(slot);
  const p = slotPaths(slot);
  await fs.writeFile(p.meta, JSON.stringify(meta), 'utf8');
}

export async function readSlotStatus(slot: FileSlot): Promise<SlotStatus> {
  await maybeMigrateTakeHome(slot);
  const p = slotPaths(slot);
  const [fm, bm, meta] = await Promise.all([
    fileMeta(p.file),
    fileMeta(p.backup),
    readSlotMeta(slot),
  ]);
  return {
    slug: slot.slug,
    hasFile: !!fm,
    size: fm?.size ?? 0,
    mtimeMs: fm?.mtimeMs ?? 0,
    backupSize: bm?.size ?? 0,
    meta,
  };
}

export type ReplaceResult =
  | { ok: true; size: number; backupPath: string }
  | { ok: false; reason: string };

export async function replaceSlotFile(
  slot: FileSlot,
  buf: Buffer,
  originalFilename: string,
  contentType: string,
): Promise<ReplaceResult> {
  if (buf.length === 0) return { ok: false, reason: 'Empty file' };
  if (buf.length > slot.maxBytes) {
    return { ok: false, reason: `File exceeds ${Math.round(slot.maxBytes / (1024 * 1024))} MB limit` };
  }
  const headHex = buf.subarray(0, 8).toString('hex').toLowerCase();
  const magicOk = slot.magicBytes.some((m) => headHex.startsWith(m.toLowerCase()));
  if (!magicOk) {
    return { ok: false, reason: 'File header did not match an accepted format' };
  }

  await maybeMigrateTakeHome(slot);
  ensureSlotDir(slot);
  const p = slotPaths(slot);
  const tmp = path.join(os.tmpdir(), `adn-slot-${randomBytes(8).toString('hex')}.bin`);
  await fs.writeFile(tmp, buf);

  const existing = await fileMeta(p.file);
  if (existing) {
    try {
      await fs.rename(p.file, p.backup);
    } catch {
      await fs.copyFile(p.file, p.backup);
    }
  }
  try {
    await fs.rename(tmp, p.file);
  } catch {
    await fs.copyFile(tmp, p.file);
    await fs.unlink(tmp).catch(() => undefined);
  }

  const meta: SlotMeta = {
    originalFilename: sanitizeFilename(originalFilename),
    contentType: contentType || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    size: buf.length,
  };
  await writeSlotMeta(slot, meta);

  return { ok: true, size: buf.length, backupPath: p.backup };
}

export async function readSlotBytes(slot: FileSlot): Promise<Buffer | null> {
  await maybeMigrateTakeHome(slot);
  const p = slotPaths(slot);
  try {
    return await fs.readFile(p.file);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}
