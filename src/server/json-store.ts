import 'server-only';
import { promises as fs } from 'node:fs';
import { existsSync, mkdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import path from 'node:path';

/**
 * Tiny utilities for safe per-file JSON storage:
 *
 *   - withFileLock(absPath, fn): serializes async read-modify-write sequences
 *     for the same file path within this process. Prevents two concurrent
 *     downloads from racing on stats.json and corrupting it.
 *
 *   - writeJsonAtomic(absPath, value): JSON.stringify + write to a sibling
 *     temp file, fs.rename() over the target. rename(2) on the same
 *     filesystem is atomic, so a reader either sees the old file or the new
 *     file — never a half-written one. We also fsync the temp file first so
 *     a crash between rename and fsync of the directory can't leave us with
 *     a zero-byte file on most filesystems.
 *
 *   - readJsonResilient(absPath, fallback): if the file is missing OR its
 *     contents are not parseable JSON, log a warning and return `fallback`
 *     instead of throwing. One corrupt counter file should never take down
 *     /admin.
 */

const locks = new Map<string, Promise<unknown>>();

export function withFileLock<T>(absPath: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(absPath) ?? Promise.resolve();
  const next = prev.catch(() => undefined).then(fn);
  locks.set(
    absPath,
    next.finally(() => {
      // Only clear if no other waiter chained on after us.
      if (locks.get(absPath) === next) locks.delete(absPath);
    }),
  );
  return next;
}

export async function writeJsonAtomic(absPath: string, value: unknown, opts: { pretty?: boolean } = {}): Promise<void> {
  const dir = path.dirname(absPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const json = opts.pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value);
  const tmp = path.join(dir, `.${path.basename(absPath)}.tmp-${randomBytes(8).toString('hex')}`);

  let handle: fs.FileHandle | undefined;
  try {
    handle = await fs.open(tmp, 'w');
    await handle.writeFile(json, 'utf8');
    await handle.sync();
  } finally {
    if (handle) await handle.close();
  }
  try {
    await renameWithRetry(tmp, absPath);
  } catch (err) {
    // Best effort cleanup if the rename failed
    await fs.unlink(tmp).catch(() => undefined);
    throw err;
  }
}

/**
 * fs.rename(2) is atomic on POSIX. On Windows it can spuriously fail with
 * EPERM/EBUSY if another process briefly has the destination open. Retry a
 * handful of times with tiny backoff. Harmless on Linux.
 */
async function renameWithRetry(from: string, to: string, attempts = 5): Promise<void> {
  for (let i = 0; i < attempts; i++) {
    try {
      await fs.rename(from, to);
      return;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (i === attempts - 1 || (code !== 'EPERM' && code !== 'EBUSY' && code !== 'EACCES')) throw err;
      await new Promise((r) => setTimeout(r, 10 * (i + 1)));
    }
  }
}

export async function readJsonResilient<T>(absPath: string, fallback: T): Promise<T> {
  let raw: string;
  try {
    raw = await fs.readFile(absPath, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return fallback;
    console.warn(`[json-store] read failed for ${absPath}: ${err instanceof Error ? err.message : String(err)}`);
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(
      `[json-store] parse failed for ${absPath} (${raw.length} bytes); falling back. Reason: ${err instanceof Error ? err.message : String(err)}`,
    );
    return fallback;
  }
}
