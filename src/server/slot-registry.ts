import 'server-only';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { BUILTIN_SLUGS, DEFAULT_SLOTS } from '@/content/files';
import { dataDir } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';

export const DEFAULT_MAX_BYTES = 100 * 1024 * 1024;

export type SlotRecord = {
  slug: string;
  title: string;
  description: string;
  publicFilename: string;
  publicMimeType: string;
  maxBytes: number;
  isBuiltin: boolean;
  createdAt: string;
};

function registryPath(): string {
  return path.join(dataDir(), 'files', 'slots.json');
}

function seed(): SlotRecord[] {
  const now = new Date().toISOString();
  return DEFAULT_SLOTS.map((d) => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
    publicFilename: d.publicFilename,
    publicMimeType: d.publicMimeType,
    maxBytes: DEFAULT_MAX_BYTES,
    isBuiltin: true,
    createdAt: now,
  }));
}

let cache: SlotRecord[] | null = null;
const CACHE_KEY = '__adnovara_slot_registry__';
const globalAny = globalThis as unknown as Record<string, SlotRecord[] | undefined>;

async function load(): Promise<SlotRecord[]> {
  const cached = globalAny[CACHE_KEY];
  if (cached) return cached;

  const file = registryPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  return withFileLock(file, async () => {
    const cached2 = globalAny[CACHE_KEY];
    if (cached2) return cached2;

    const parsed = await readJsonResilient<SlotRecord[] | null>(file, null);
    let records: SlotRecord[];
    if (Array.isArray(parsed)) {
      records = parsed;
    } else {
      records = seed();
      await writeJsonAtomic(file, records, { pretty: true });
    }

    // Re-seed any missing builtins (in case a fresh builtin was added to source)
    const knownSlugs = new Set(records.map((r) => r.slug));
    let modified = false;
    for (const def of DEFAULT_SLOTS) {
      if (!knownSlugs.has(def.slug)) {
        records.push({
          slug: def.slug,
          title: def.title,
          description: def.description,
          publicFilename: def.publicFilename,
          publicMimeType: def.publicMimeType,
          maxBytes: DEFAULT_MAX_BYTES,
          isBuiltin: true,
          createdAt: new Date().toISOString(),
        });
        modified = true;
      }
    }
    for (const rec of records) {
      const shouldBeBuiltin = BUILTIN_SLUGS.has(rec.slug);
      if (rec.isBuiltin !== shouldBeBuiltin) {
        rec.isBuiltin = shouldBeBuiltin;
        modified = true;
      }
    }
    if (modified) {
      await writeJsonAtomic(file, records, { pretty: true });
    }

    globalAny[CACHE_KEY] = records;
    cache = records;
    return records;
  });
}

async function save(records: SlotRecord[]): Promise<void> {
  const file = registryPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await withFileLock(file, async () => {
    await writeJsonAtomic(file, records, { pretty: true });
    globalAny[CACHE_KEY] = records;
    cache = records;
  });
}

export function invalidateRegistryCache(): void {
  globalAny[CACHE_KEY] = undefined;
  cache = null;
}

export async function listSlots(): Promise<SlotRecord[]> {
  return [...(await load())];
}

export async function getSlot(slug: string): Promise<SlotRecord | undefined> {
  const list = await load();
  return list.find((s) => s.slug === slug);
}

export const SLUG_RE = /^[a-z][a-z0-9-]{1,40}$/;

export type CreateSlotInput = {
  slug: string;
  title: string;
  description: string;
  publicFilename?: string;
  publicMimeType?: string;
  maxBytes?: number;
};

export async function createSlot(input: CreateSlotInput): Promise<{ ok: true; slot: SlotRecord } | { ok: false; reason: string }> {
  const slug = input.slug.trim().toLowerCase();
  if (!SLUG_RE.test(slug)) {
    return { ok: false, reason: 'Slug must be 2–41 chars, lowercase letters, digits, hyphens, starting with a letter' };
  }
  const title = input.title.trim();
  if (!title) return { ok: false, reason: 'Title is required' };

  const list = await load();
  if (list.some((s) => s.slug === slug)) {
    return { ok: false, reason: `A slot named "${slug}" already exists` };
  }

  const rec: SlotRecord = {
    slug,
    title: title.slice(0, 120),
    description: input.description.trim().slice(0, 500),
    publicFilename: (input.publicFilename ?? '').trim().slice(0, 200),
    publicMimeType: (input.publicMimeType ?? '').trim().slice(0, 100),
    maxBytes: input.maxBytes && input.maxBytes > 0 ? Math.min(input.maxBytes, 500 * 1024 * 1024) : DEFAULT_MAX_BYTES,
    isBuiltin: BUILTIN_SLUGS.has(slug),
    createdAt: new Date().toISOString(),
  };

  list.push(rec);
  await save(list);
  return { ok: true, slot: rec };
}

export type UpdateSlotInput = {
  title?: string;
  description?: string;
  publicFilename?: string;
  publicMimeType?: string;
  maxBytes?: number;
};

export async function updateSlot(
  slug: string,
  input: UpdateSlotInput,
): Promise<{ ok: true; slot: SlotRecord } | { ok: false; reason: string }> {
  const list = await load();
  const idx = list.findIndex((s) => s.slug === slug);
  if (idx < 0) return { ok: false, reason: 'Slot not found' };
  const current = list[idx]!;

  const next: SlotRecord = {
    ...current,
    title: input.title !== undefined ? input.title.trim().slice(0, 120) || current.title : current.title,
    description: input.description !== undefined ? input.description.trim().slice(0, 500) : current.description,
    publicFilename: input.publicFilename !== undefined ? input.publicFilename.trim().slice(0, 200) : current.publicFilename,
    publicMimeType: input.publicMimeType !== undefined ? input.publicMimeType.trim().slice(0, 100) : current.publicMimeType,
    maxBytes: input.maxBytes && input.maxBytes > 0 ? Math.min(input.maxBytes, 500 * 1024 * 1024) : current.maxBytes,
  };

  list[idx] = next;
  await save(list);
  return { ok: true, slot: next };
}

export async function deleteSlot(slug: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const list = await load();
  const rec = list.find((s) => s.slug === slug);
  if (!rec) return { ok: false, reason: 'Slot not found' };
  if (rec.isBuiltin) return { ok: false, reason: 'Built-in slots cannot be deleted' };

  const next = list.filter((s) => s.slug !== slug);
  await save(next);
  return { ok: true };
}
