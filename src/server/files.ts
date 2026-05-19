import 'server-only';
import { promises as fs } from 'node:fs';
import { existsSync, mkdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { dataDir, fileMeta, sanitizeFilename } from '@/server/storage';
import type { SlotRecord } from '@/server/slot-registry';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';

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
  uploadedBy?: string;
};

const ZIP_MAGIC = [
  [0x50, 0x4b, 0x03, 0x04],
  [0x50, 0x4b, 0x05, 0x06],
  [0x50, 0x4b, 0x07, 0x08],
];

export function looksLikeZip(buf: Buffer): boolean {
  if (buf.length < 4) return false;
  return ZIP_MAGIC.some((sig) => sig.every((b, i) => buf[i] === b));
}

export function shouldEnforceZip(filename: string, contentType: string): boolean {
  if (/\.zip$/i.test(filename)) return true;
  if (/zip/i.test(contentType)) return true;
  return false;
}

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
      const parsed = await readJsonResilient<{ filename?: string; contentType?: string; uploadedAt?: string; size?: number } | null>(legacyMeta, null);
      const migrated: SlotMeta = {
        originalFilename: parsed?.filename ?? 'take-home',
        contentType: parsed?.contentType ?? 'application/octet-stream',
        uploadedAt: parsed?.uploadedAt ?? new Date().toISOString(),
        size: parsed?.size ?? 0,
      };
      await writeJsonAtomic(p.meta, migrated);
      await fs.unlink(legacyMeta).catch(() => undefined);
    }
  } catch {}
}

export async function readSlotMeta(slug: string): Promise<SlotMeta | null> {
  await maybeMigrateTakeHome(slug);
  const p = slotPaths(slug);
  return readJsonResilient<SlotMeta | null>(p.meta, null);
}

export async function writeSlotMeta(slug: string, meta: SlotMeta): Promise<void> {
  ensureSlotDir(slug);
  const p = slotPaths(slug);
  await withFileLock(p.meta, () => writeJsonAtomic(p.meta, meta));
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
  uploadedBy?: string,
): Promise<ReplaceResult> {
  if (buf.length === 0) return { ok: false, reason: 'Empty file' };
  if (buf.length > slot.maxBytes) {
    return { ok: false, reason: `File exceeds ${Math.round(slot.maxBytes / (1024 * 1024))} MB limit` };
  }
  const slotExpectsZip = /zip/i.test(slot.publicMimeType) || /\.zip$/i.test(slot.publicFilename);
  if (slotExpectsZip || shouldEnforceZip(originalFilename, contentType)) {
    if (!looksLikeZip(buf)) {
      return { ok: false, reason: 'File is not a valid ZIP archive (magic bytes check failed)' };
    }
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
    uploadedBy: uploadedBy?.slice(0, 80),
  };
  await writeSlotMeta(slot.slug, meta);

  return { ok: true, size: buf.length, backupPath: p.backup };
}

export async function deleteSlotFiles(slug: string): Promise<void> {
  const p = slotPaths(slug);
  await fs.rm(p.dir, { recursive: true, force: true });
}

/**
 * Resolve the filename + Content-Type to serve publicly for a slot.
 *
 * Rule: the uploaded file's extension and MIME type always win.
 * - slot.publicFilename is a brand-name override: we strip its
 *   extension and append the upload's actual extension
 * - slot.publicMimeType is an explicit MIME override (rarely needed);
 *   blank means use the upload's recorded contentType
 */
export function effectivePublicDownload(
  slot: { slug: string; publicFilename: string; publicMimeType: string },
  meta: SlotMeta | null,
): { filename: string; contentType: string } {
  const uploaded = meta?.originalFilename ?? '';
  const uploadedType = meta?.contentType || 'application/octet-stream';
  const extMatch = uploaded.match(/\.[^.]+$/);
  const uploadedExt = extMatch ? extMatch[0].toLowerCase() : '';

  let filename: string;
  if (slot.publicFilename.trim()) {
    const brand = slot.publicFilename.replace(/\.[^.]+$/, '');
    filename = brand + uploadedExt;
  } else {
    filename = uploaded || `${slot.slug}.bin`;
  }
  const contentType = slot.publicMimeType.trim() || uploadedType;
  return { filename, contentType };
}
