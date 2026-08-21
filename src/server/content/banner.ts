import 'server-only';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { dataDir } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';

export type BannerConfig = {
  enabled: boolean;
  badge: string;
  message: string;
  ctaText: string;
  ctaUrl: string;
};

const DEFAULT_BANNER: BannerConfig = {
  enabled: true,
  badge: "We're hiring",
  message: '',
  ctaText: 'See the role →',
  ctaUrl: '/careers/apply/',
};

function bannerPath(): string {
  return path.join(dataDir(), 'content', 'banner.json');
}

const CACHE_KEY = '__adnovara_banner_cache__';
const globalAny = globalThis as unknown as Record<string, BannerConfig | undefined>;

export async function readBanner(): Promise<BannerConfig> {
  const cached = globalAny[CACHE_KEY];
  if (cached) return cached;

  const file = bannerPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  return withFileLock(file, async () => {
    const cached2 = globalAny[CACHE_KEY];
    if (cached2) return cached2;
    const parsed = await readJsonResilient<Partial<BannerConfig> | null>(file, null);
    let cfg: BannerConfig;
    if (parsed) {
      cfg = {
        enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_BANNER.enabled,
        badge: typeof parsed.badge === 'string' ? parsed.badge : DEFAULT_BANNER.badge,
        message: typeof parsed.message === 'string' ? parsed.message : DEFAULT_BANNER.message,
        ctaText: typeof parsed.ctaText === 'string' ? parsed.ctaText : DEFAULT_BANNER.ctaText,
        ctaUrl: typeof parsed.ctaUrl === 'string' ? parsed.ctaUrl : DEFAULT_BANNER.ctaUrl,
      };
    } else {
      cfg = { ...DEFAULT_BANNER };
      await writeJsonAtomic(file, cfg, { pretty: true });
    }
    globalAny[CACHE_KEY] = cfg;
    return cfg;
  });
}

export async function writeBanner(next: BannerConfig): Promise<BannerConfig> {
  const file = bannerPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const sanitized: BannerConfig = {
    enabled: !!next.enabled,
    badge: String(next.badge ?? '').trim().slice(0, 80),
    message: String(next.message ?? '').trim().slice(0, 200),
    ctaText: String(next.ctaText ?? '').trim().slice(0, 80),
    ctaUrl: String(next.ctaUrl ?? '').trim().slice(0, 500),
  };
  await withFileLock(file, async () => {
    await writeJsonAtomic(file, sanitized, { pretty: true });
    globalAny[CACHE_KEY] = sanitized;
  });
  return sanitized;
}

export function invalidateBannerCache(): void {
  globalAny[CACHE_KEY] = undefined;
}
