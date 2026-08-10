import 'server-only';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { dataDir } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';

/**
 * Site-wide settings that the admin panel can change at runtime.
 *
 * Currently just the download route segment: downloads live at
 * `/<downloadRouteSlug>/<file-slug>`, served by `src/app/[dl]/[slug]/route.ts`.
 * That handler 404s any segment that isn't the configured one, so rotating the
 * slug immediately kills every URL built on the old one — which is the point.
 */
export type AppSettings = {
  downloadRouteSlug: string;
};

export const DEFAULT_DOWNLOAD_ROUTE_SLUG = 'k';

/**
 * Top-level route segments that already exist in `src/app`. A download slug
 * that collides with one of these would be shadowed by the static route (Next
 * matches static segments before dynamic ones), so downloads would silently
 * 404. Reject them at the source instead.
 */
export const RESERVED_ROUTE_SLUGS: readonly string[] = [
  'about',
  'admin',
  'api',
  'careers',
  'case-studies',
  'contact',
  'dt',
  'newsletter',
  'privacy',
  'services',
  'terms',
];

export const DOWNLOAD_ROUTE_SLUG_RE = /^[a-z][a-z0-9-]{0,31}$/;

function settingsPath(): string {
  return path.join(dataDir(), 'app-settings.json');
}

const CACHE_KEY = '__adnovara_app_settings__';
const globalAny = globalThis as unknown as Record<string, AppSettings | undefined>;

function normalize(raw: unknown): AppSettings {
  const slug =
    raw && typeof raw === 'object' && typeof (raw as AppSettings).downloadRouteSlug === 'string'
      ? (raw as AppSettings).downloadRouteSlug.trim().toLowerCase()
      : '';
  return {
    downloadRouteSlug: DOWNLOAD_ROUTE_SLUG_RE.test(slug) ? slug : DEFAULT_DOWNLOAD_ROUTE_SLUG,
  };
}

async function load(): Promise<AppSettings> {
  const cached = globalAny[CACHE_KEY];
  if (cached) return cached;

  const file = settingsPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  return withFileLock(file, async () => {
    const cached2 = globalAny[CACHE_KEY];
    if (cached2) return cached2;

    const parsed = await readJsonResilient<unknown>(file, null);
    const settings = normalize(parsed);
    if (parsed === null) {
      await writeJsonAtomic(file, settings, { pretty: true });
    }

    globalAny[CACHE_KEY] = settings;
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
  });
}

export async function getAppSettings(): Promise<AppSettings> {
  return { ...(await load()) };
}

/** The current download route segment, e.g. `k` for `/k/take-home`. */
export async function getDownloadRouteSlug(): Promise<string> {
  return (await load()).downloadRouteSlug;
}

/** Public path for a file slot under the currently configured route. */
export async function downloadPathFor(fileSlug: string): Promise<string> {
  return `/${await getDownloadRouteSlug()}/${fileSlug}`;
}

export function validateDownloadRouteSlug(input: string): { ok: true; value: string } | { ok: false; reason: string } {
  const slug = input.trim().toLowerCase();
  if (!slug) return { ok: false, reason: 'Download route cannot be empty' };
  if (!DOWNLOAD_ROUTE_SLUG_RE.test(slug)) {
    return {
      ok: false,
      reason: 'Download route must be 1–32 chars: lowercase letters, digits or hyphens, starting with a letter',
    };
  }
  if (RESERVED_ROUTE_SLUGS.includes(slug)) {
    return { ok: false, reason: `"${slug}" is an existing page route and cannot be used` };
  }
  return { ok: true, value: slug };
}

export async function updateDownloadRouteSlug(
  input: string,
): Promise<{ ok: true; settings: AppSettings } | { ok: false; reason: string }> {
  const validated = validateDownloadRouteSlug(input);
  if (!validated.ok) return validated;

  const current = await load();
  const next: AppSettings = { ...current, downloadRouteSlug: validated.value };
  await save(next);
  return { ok: true, settings: next };
}
