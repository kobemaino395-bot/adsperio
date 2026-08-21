import 'server-only';
import { applicationsLogPath, readJsonLines } from '@/server/storage';

export type SheetData = {
  headers: string[];
  rows: string[][];
  source: 'sheet' | 'jsonl';
  fetchedAt: number;
  error?: string;
};

type CacheEntry = { value: SheetData; expiresAt: number };
const CACHE_KEY = '__adnovara_sheet_cache__';
const CACHE_TTL_MS = 60 * 1000;
const globalAny = globalThis as unknown as Record<string, CacheEntry | undefined>;

export async function getSheetData(force = false): Promise<SheetData> {
  if (!force) {
    const cached = globalAny[CACHE_KEY];
    if (cached && cached.expiresAt > Date.now()) return cached.value;
  }
  const value = await fetchSheetData();
  globalAny[CACHE_KEY] = { value, expiresAt: Date.now() + CACHE_TTL_MS };
  return value;
}

async function fetchSheetData(): Promise<SheetData> {
  const url = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  const secret = process.env.GOOGLE_SHEETS_READ_SECRET;
  if (!url || !secret) return fallbackToJsonl('Sheet webhook not configured');

  try {
    const sep = url.includes('?') ? '&' : '?';
    const res = await fetch(`${url}${sep}secret=${encodeURIComponent(secret)}`, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
    });
    if (!res.ok) return fallbackToJsonl(`Sheet returned HTTP ${res.status}`);
    const body = (await res.json()) as { headers?: unknown; rows?: unknown };
    const headers = Array.isArray(body.headers) ? body.headers.map((h) => String(h)) : [];
    const rows = Array.isArray(body.rows)
      ? body.rows.map((r) => (Array.isArray(r) ? r.map((v) => String(v ?? '')) : []))
      : [];
    return { headers, rows, source: 'sheet', fetchedAt: Date.now() };
  } catch (err) {
    return fallbackToJsonl(err instanceof Error ? err.message : String(err));
  }
}

async function fallbackToJsonl(error: string): Promise<SheetData> {
  const records = await readJsonLines<Record<string, unknown>>(applicationsLogPath());
  const headers = [
    'submittedAt', 'id', 'fullName', 'email', 'country', 'phone',
    'portfolioUrl', 'currentCompany', 'yearsExperience', 'expectedSalary',
    'noticePeriod', 'coverNote', 'clientIp', 'forwarded', 'role', 'roleLabel', 'positionSlug',
  ];
  const rows = records.map((r) => headers.map((h) => String(r[h] ?? '')));
  return { headers, rows, source: 'jsonl', fetchedAt: Date.now(), error };
}

export function invalidateSheetCache(): void {
  globalAny[CACHE_KEY] = undefined;
}
