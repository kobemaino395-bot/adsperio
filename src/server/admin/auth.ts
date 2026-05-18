import 'server-only';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'adn_admin_sid';
export const PREAUTH_CSRF_COOKIE = 'adn_admin_pcsrf';
export const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
export const LOGIN_RATE_WINDOW_MS = 1000 * 60 * 15;
export const LOGIN_RATE_MAX = 5;

const SCRYPT_KEYLEN = 64;

type Session = {
  id: string;
  username: string;
  csrf: string;
  createdAt: number;
  lastSeenAt: number;
};

type GlobalStore = {
  sessions: Map<string, Session>;
  loginAttempts: Map<string, number[]>;
};

const STORE_KEY = '__adnovara_admin_store__';
const globalAny = globalThis as unknown as Record<string, GlobalStore | undefined>;

function store(): GlobalStore {
  let s = globalAny[STORE_KEY];
  if (!s) {
    s = { sessions: new Map(), loginAttempts: new Map() };
    globalAny[STORE_KEY] = s;
  }
  return s;
}

export function parseScryptHash(stored: string): { salt: Buffer; hash: Buffer } | null {
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return null;
  try {
    const salt = Buffer.from(parts[1] ?? '', 'hex');
    const hash = Buffer.from(parts[2] ?? '', 'hex');
    if (salt.length !== 16 || hash.length !== SCRYPT_KEYLEN) return null;
    return { salt, hash };
  } catch {
    return null;
  }
}

export function verifyPassword(password: string, stored: string): boolean {
  const parsed = parseScryptHash(stored);
  const dummySalt = Buffer.alloc(16, 0);
  const dummyHash = Buffer.alloc(SCRYPT_KEYLEN, 0);

  if (!parsed) {
    scryptSync(password, dummySalt, SCRYPT_KEYLEN);
    timingSafeEqual(dummyHash, dummyHash);
    return false;
  }
  const candidate = scryptSync(password, parsed.salt, SCRYPT_KEYLEN);
  return timingSafeEqual(candidate, parsed.hash);
}

export function constantTimeEqualStrings(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

export function createSession(username: string): Session {
  const id = randomBytes(32).toString('hex');
  const csrf = randomBytes(32).toString('hex');
  const now = Date.now();
  const session: Session = { id, username, csrf, createdAt: now, lastSeenAt: now };
  store().sessions.set(id, session);
  return session;
}

export function destroySession(id: string): void {
  store().sessions.delete(id);
}

export function getSession(id: string | undefined): Session | null {
  if (!id) return null;
  const s = store().sessions.get(id);
  if (!s) return null;
  if (Date.now() - s.lastSeenAt > SESSION_TTL_MS) {
    store().sessions.delete(id);
    return null;
  }
  s.lastSeenAt = Date.now();
  return s;
}

const isProd = process.env.NODE_ENV === 'production';

export async function setSessionCookie(id: string): Promise<void> {
  const jar = await cookies();
  jar.set({
    name: SESSION_COOKIE,
    value: id,
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/admin',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/admin',
    maxAge: 0,
  });
}

export async function readSessionFromCookies(): Promise<Session | null> {
  const jar = await cookies();
  const c = jar.get(SESSION_COOKIE);
  return getSession(c?.value);
}

export function recordLoginAttempt(ip: string): { allowed: boolean; remaining: number } {
  const s = store();
  const now = Date.now();
  const bucket = (s.loginAttempts.get(ip) ?? []).filter((t) => now - t < LOGIN_RATE_WINDOW_MS);
  if (bucket.length >= LOGIN_RATE_MAX) {
    s.loginAttempts.set(ip, bucket);
    return { allowed: false, remaining: 0 };
  }
  bucket.push(now);
  s.loginAttempts.set(ip, bucket);
  return { allowed: true, remaining: LOGIN_RATE_MAX - bucket.length };
}

export function clearLoginAttempts(ip: string): void {
  store().loginAttempts.delete(ip);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH);
}

export async function verifyPreAuthCsrf(submitted: string): Promise<boolean> {
  const jar = await cookies();
  const cookie = jar.get(PREAUTH_CSRF_COOKIE)?.value ?? '';
  if (!cookie || !submitted) return false;
  return constantTimeEqualStrings(cookie, submitted);
}

export async function clearPreAuthCsrf(): Promise<void> {
  const jar = await cookies();
  jar.set({ name: PREAUTH_CSRF_COOKIE, value: '', path: '/admin', maxAge: 0 });
}

export function verifySessionCsrf(session: Session, submitted: string): boolean {
  if (!submitted) return false;
  return constantTimeEqualStrings(session.csrf, submitted);
}

export type { Session };
