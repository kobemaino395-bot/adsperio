import 'server-only';
import { promises as fs } from 'node:fs';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

export function dataDir(): string {
  const env = process.env.ADNOVARA_DATA_DIR;
  if (env && env.trim()) return path.resolve(env);
  return path.resolve(process.cwd(), 'data');
}

export function downloadsDir(): string {
  return path.join(dataDir(), 'downloads');
}

export function takeHomePath(): string {
  return path.join(downloadsDir(), 'take-home');
}

export function sanitizeFilename(name: string): string {
  const base = name.replace(/.*[\\/]/, '');
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '');
  return cleaned.slice(0, 120) || 'take-home';
}

export function applicationsLogPath(): string {
  return path.join(dataDir(), 'applications.jsonl');
}

export function applicationsUploadsDir(): string {
  return path.join(dataDir(), 'uploads');
}

export function statsFilePath(): string {
  return path.join(dataDir(), 'stats.json');
}

export function ensureDataDirs(): void {
  for (const d of [dataDir(), downloadsDir(), applicationsUploadsDir()]) {
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
  }
}

export async function appendJsonLine(file: string, obj: unknown): Promise<void> {
  ensureDataDirs();
  const line = JSON.stringify(obj) + '\n';
  await fs.appendFile(file, line, 'utf8');
}

export async function readJsonLines<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, 'utf8');
    return raw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => JSON.parse(l) as T);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

export async function fileMeta(p: string): Promise<{ size: number; mtimeMs: number } | null> {
  try {
    const s = await fs.stat(p);
    return { size: s.size, mtimeMs: s.mtimeMs };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export async function readStats(): Promise<Record<string, number>> {
  try {
    const raw = await fs.readFile(statsFilePath(), 'utf8');
    return JSON.parse(raw) as Record<string, number>;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw err;
  }
}

export async function bumpStat(key: string, by = 1): Promise<void> {
  ensureDataDirs();
  const current = await readStats();
  current[key] = (current[key] ?? 0) + by;
  await fs.writeFile(statsFilePath(), JSON.stringify(current), 'utf8');
}
