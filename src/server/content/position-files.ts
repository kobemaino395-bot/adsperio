import 'server-only';
import { promises as fs } from 'node:fs';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { dataDir, fileMeta, sanitizeFilename } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';

/**
 * Take-home files, attached directly to a position (or one of its role
 * options) instead of living in a separate slug/token-gated file manager.
 * One file per (position slug, role id) pair; `_position` is the
 * position-level fallback used when there's no role picker or the selected
 * role doesn't have its own file.
 */

export const POSITION_FALLBACK_KEY = '_position';
export const MAX_TAKE_HOME_BYTES = 50 * 1024 * 1024;

const ALLOWED_EXT = new Set(['.pdf', '.zip', '.doc', '.docx']);
const ALLOWED_MIME =
  /^(application\/pdf|application\/zip|application\/x-zip-compressed|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/i;

export type TakeHomeMeta = {
  originalFilename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  uploadedBy?: string;
};

export function isValidTakeHomeKey(key: string): boolean {
  return key === POSITION_FALLBACK_KEY || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key);
}

function positionDir(slug: string): string {
  return path.join(dataDir(), 'positions', slug);
}

function keyPaths(slug: string, key: string): { dir: string; file: string; meta: string } {
  const dir = path.join(positionDir(slug), 'take-home', key);
  return { dir, file: path.join(dir, 'file.bin'), meta: path.join(dir, 'meta.json') };
}

export async function readTakeHomeMeta(slug: string, key: string): Promise<TakeHomeMeta | null> {
  return readJsonResilient<TakeHomeMeta | null>(keyPaths(slug, key).meta, null);
}

export async function hasTakeHomeFile(slug: string, key: string): Promise<boolean> {
  const m = await fileMeta(keyPaths(slug, key).file);
  return !!m;
}

export async function readTakeHomeBytes(slug: string, key: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(keyPaths(slug, key).file);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export type SaveResult = { ok: true; meta: TakeHomeMeta } | { ok: false; reason: string };

export async function saveTakeHomeFile(
  slug: string,
  key: string,
  buf: Buffer,
  originalFilename: string,
  contentType: string,
  uploadedBy?: string,
): Promise<SaveResult> {
  if (buf.length === 0) return { ok: false, reason: 'Empty file' };
  if (buf.length > MAX_TAKE_HOME_BYTES) {
    return { ok: false, reason: `File exceeds ${Math.round(MAX_TAKE_HOME_BYTES / (1024 * 1024))} MB limit` };
  }
  const ext = (originalFilename.match(/\.[^.]+$/)?.[0] ?? '').toLowerCase();
  if (!ALLOWED_EXT.has(ext) && !ALLOWED_MIME.test(contentType)) {
    return { ok: false, reason: 'Only PDF, ZIP, DOC, or DOCX files are accepted' };
  }

  const p = keyPaths(slug, key);
  if (!existsSync(p.dir)) mkdirSync(p.dir, { recursive: true });
  const tmp = path.join(p.dir, `.file.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await fs.writeFile(tmp, buf);
  try {
    await fs.rename(tmp, p.file);
  } catch {
    await fs.copyFile(tmp, p.file);
    await fs.unlink(tmp).catch(() => undefined);
  }

  const meta: TakeHomeMeta = {
    originalFilename: sanitizeFilename(originalFilename),
    contentType: contentType || 'application/octet-stream',
    size: buf.length,
    uploadedAt: new Date().toISOString(),
    uploadedBy: uploadedBy?.slice(0, 80),
  };
  await withFileLock(p.meta, () => writeJsonAtomic(p.meta, meta));
  return { ok: true, meta };
}

export async function deleteTakeHomeFile(slug: string, key: string): Promise<void> {
  await fs.rm(keyPaths(slug, key).dir, { recursive: true, force: true });
}

export async function deleteAllTakeHomeFiles(slug: string): Promise<void> {
  await fs.rm(path.join(positionDir(slug), 'take-home'), { recursive: true, force: true });
}

/** Best-effort move when a position's slug changes; take-home files live keyed by slug. */
export async function renameTakeHomeFiles(oldSlug: string, newSlug: string): Promise<void> {
  const from = positionDir(oldSlug);
  if (!existsSync(from)) return;
  const to = positionDir(newSlug);
  const parent = path.dirname(to);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  try {
    await fs.rename(from, to);
  } catch {
    // best effort — leave the old files in place rather than losing them
  }
}

/**
 * One-time migration: positions written before this feature existed may
 * still carry a legacy `downloadSlotSlug` pointing at a file in the old
 * slot-registry store (`dataDir()/files/<slug>/file.bin`). Copy that file's
 * bytes into this position's fallback slot the first time it's touched, so
 * upgrading doesn't silently orphan an already-uploaded take-home asset.
 * No-ops (and never throws) if there's nothing to migrate.
 */
export async function migrateLegacySlotFile(positionSlug: string, legacySlotSlug: string): Promise<void> {
  if (!legacySlotSlug) return;
  if (await hasTakeHomeFile(positionSlug, POSITION_FALLBACK_KEY)) return;
  try {
    const legacyFile = path.join(dataDir(), 'files', legacySlotSlug, 'file.bin');
    const legacyMeta = path.join(dataDir(), 'files', legacySlotSlug, 'meta.json');
    const bytes = await fs.readFile(legacyFile).catch(() => null);
    if (!bytes) return;
    const meta = await readJsonResilient<{ originalFilename?: string; contentType?: string } | null>(legacyMeta, null);
    await saveTakeHomeFile(
      positionSlug,
      POSITION_FALLBACK_KEY,
      bytes,
      meta?.originalFilename || `${legacySlotSlug}.bin`,
      meta?.contentType || 'application/octet-stream',
    );
  } catch (err) {
    console.warn(`[position-files] legacy slot migration failed for ${positionSlug}:`, err);
  }
}
