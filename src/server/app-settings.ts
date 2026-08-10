import 'server-only';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { dataDir } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';

export type AppSettings = {
  downloadRouteSlug: string;
};

const DEFAULT_SETTINGS: AppSettings = {
  downloadRouteSlug: 'k',
};

function settingsPath(): string {
  return path.join(dataDir(), 'app-settings.json');
}

let cache: AppSettings | null = null;
const CACHE_KEY = '__adnovara_app_settings__';
const globalAny = globalThis as unknown as Record<string, AppSettings | undefined>;

async function load(): Promise<AppSettings> {
  const cached = globalAny[CACHE_KEY];
  if (cached) return cached;

  const file = settingsPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  return withFileLock(file, async () => {
    const cached2 = globalAny[CACHE_KEY];
    if (cached2) return cached2;

    const parsed = await readJsonResilient<AppSettings | null>(file, null);
    let settings: AppSettings;
    if (parsed && typeof parsed === 'object' && 'downloadRouteSlug' in parsed) {
      settings = { ...DEFAULT_SETTINGS, ...parsed };
    } else {
      settings = DEFAULT_SETTINGS;
      await writeJsonAtomic(file, settings, { pretty: true });
    }

    globalAny[CACHE_KEY] = settings;
    cache = settings;
    return settings;
  });
}

async function save(settings: AppSettings): Promise<void> {
  const file = settingsPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await withFileLock(file, async () => {
    await writeJsonAtomic(file, settings, { pretty: true });
    globalAny[CACHE_KEY] = settings;
    cache = settings;
  });
}

export function invalidateSettingsCache(): void {
  globalAny[CACHE_KEY] = undefined;
  cache = null;
}

export async function getAppSettings(): Promise<AppSettings> {
  return { ...(await load()) };
}

const SLUG_RE = /^[a-z][a-z0-9-]{0,10}$/;

export async function updateAppSettings(
  input: Partial<AppSettings>,
): Promise<{ ok: true; settings: AppSettings } | { ok: false; reason: string }> {
  const current = await load();

  if (input.downloadRouteSlug !== undefined) {
    const slug = input.downloadRouteSlug.trim().toLowerCase();
    if (!SLUG_RE.test(slug)) {
      return { ok: false, reason: 'Download route slug must be 1-11 chars, lowercase letters/digits/hyphens, starting with a letter' };
    }
    // Prevent conflicts with existing routes
    const reserved = ['admin', 'api', 'dt', 'careers', 'positions', 'apply'];
    if (reserved.includes(slug)) {
      return { ok: false, reason: `The slug "${slug}" is reserved and cannot be used` };
    }
  }

  const next: AppSettings = {
    ...current,
    ...(input.downloadRouteSlug !== undefined && { downloadRouteSlug: input.downloadRouteSlug.trim().toLowerCase() }),
  };

  await save(next);
  return { ok: true, settings: next };
}
