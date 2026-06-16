import 'server-only';
import { randomBytes } from 'node:crypto';
import { appendJsonLine, applicationsLogPath, bumpStat } from '@/server/storage';

export type IncomingFile = {
  field: 'cv' | 'testAnswer';
  filename: string;
  contentType: string;
  base64: string;
  size: number;
};

export type IncomingApplication = {
  fullName: string;
  email: string;
  country: string;
  phone: string;
  portfolioUrl: string;
  currentCompany: string;
  yearsExperience: number;
  expectedSalary: string;
  noticePeriod: string;
  coverNote: string;
  consent: true;
  files: IncomingFile[];
};

export type ApplicationRecord = IncomingApplication & {
  id: string;
  submittedAt: string;
  clientIp: string;
  userAgent: string;
  forwarded: boolean;
  forwardError?: string;
};

const URL_RE = /^https?:\/\/[^\s]+$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_STR = 500;
const MAX_NOTE = 2000;
const PER_FILE_MAX = 8 * 1024 * 1024;
const ALLOWED_FILES: Record<IncomingFile['field'], { required: boolean; mimes: RegExp }> = {
  cv: { required: true, mimes: /^(application\/pdf|application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document))$/ },
  testAnswer: { required: false, mimes: /^application\/pdf$/ },
};

function s(v: unknown, max = MAX_STR): string {
  if (typeof v !== 'string') return '';
  const t = v.trim();
  return t.length > max ? t.slice(0, max) : t;
}

export function validateIncoming(body: unknown): { ok: true; value: IncomingApplication } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid body' };
  const b = body as Record<string, unknown>;

  if (typeof b.honeypot === 'string' && b.honeypot.trim() !== '') {
    return { ok: false, error: 'Rejected' };
  }
  const startedAt = Number(b.startedAt);
  if (Number.isFinite(startedAt) && Date.now() - startedAt < 5000) {
    return { ok: false, error: 'Form submitted too quickly' };
  }

  const fullName = s(b.fullName, 120);
  const email = s(b.email, 200);
  const country = s(b.country, 80);
  const phone = s(b.phone, 40);
  const portfolioUrl = s(b.portfolioUrl, 300);
  const currentCompany = s(b.currentCompany, 120);
  const yearsExperience = Number(b.yearsExperience);
  const expectedSalary = s(b.expectedSalary, 60);
  const noticePeriod = s(b.noticePeriod, 80);
  const coverNote = s(b.coverNote, MAX_NOTE);
  const consent = b.consent === true;

  if (fullName.length < 2) return { ok: false, error: 'Full name is required' };
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Valid email is required' };
  if (country.length < 2) return { ok: false, error: 'Country is required' };
  if (portfolioUrl.length > 0 && !URL_RE.test(portfolioUrl)) {
    return { ok: false, error: 'Portfolio URL must start with http(s)://' };
  }
  if (!Number.isFinite(yearsExperience) || yearsExperience < 0 || yearsExperience > 60) {
    return { ok: false, error: 'Years of experience must be a number between 0 and 60' };
  }
  if (expectedSalary.length < 1) return { ok: false, error: 'Expected salary is required' };
  if (noticePeriod.length < 1) return { ok: false, error: 'Notice period is required' };
  if (!consent) return { ok: false, error: 'GDPR consent is required' };

  const rawFiles = Array.isArray(b.files) ? b.files : [];
  const files: IncomingFile[] = [];
  const seen = new Set<IncomingFile['field']>();
  for (const item of rawFiles) {
    if (!item || typeof item !== 'object') continue;
    const f = item as Record<string, unknown>;
    const field = f.field as IncomingFile['field'];
    if (field !== 'cv' && field !== 'testAnswer') continue;
    if (seen.has(field)) return { ok: false, error: `Duplicate file field: ${field}` };

    const filename = s(f.filename, 200);
    const contentType = s(f.contentType, 120);
    const base64 = typeof f.base64 === 'string' ? f.base64 : '';
    if (!filename || !contentType || !base64) continue;

    const spec = ALLOWED_FILES[field];
    if (!spec.mimes.test(contentType)) {
      return { ok: false, error: `Unsupported file type for ${field}` };
    }
    const size = Math.floor((base64.length * 3) / 4);
    if (size > PER_FILE_MAX) {
      return { ok: false, error: `${field} exceeds 8 MB limit` };
    }
    files.push({ field, filename, contentType, base64, size });
    seen.add(field);
  }

  if (ALLOWED_FILES.cv.required && !seen.has('cv')) {
    return { ok: false, error: 'CV file is required' };
  }
  if (ALLOWED_FILES.testAnswer.required && !seen.has('testAnswer')) {
    return { ok: false, error: 'Take-home test answer is required' };
  }

  return {
    ok: true,
    value: {
      fullName, email, country, phone, portfolioUrl, currentCompany,
      yearsExperience, expectedSalary, noticePeriod, coverNote, consent: true, files,
    },
  };
}

export async function recordApplication(
  app: IncomingApplication,
  meta: { clientIp: string; userAgent: string },
): Promise<ApplicationRecord> {
  const record: ApplicationRecord = {
    ...app,
    id: randomBytes(8).toString('hex'),
    submittedAt: new Date().toISOString(),
    clientIp: meta.clientIp,
    userAgent: meta.userAgent.slice(0, 300),
    forwarded: false,
  };

  const fileSummaries = record.files.map((f) => ({
    field: f.field, filename: f.filename, contentType: f.contentType, size: f.size,
  }));
  const auditEntry = { ...record, files: fileSummaries };
  await appendJsonLine(applicationsLogPath(), auditEntry);

  const forward = await forwardToAppsScript(record);
  if (forward.ok) {
    record.forwarded = true;
  } else {
    record.forwardError = forward.error;
  }

  await bumpStat('applications.total');
  if (!forward.ok) await bumpStat('applications.forward_failed');

  return record;
}

async function forwardToAppsScript(record: ApplicationRecord): Promise<{ ok: true } | { ok: false; error: string }> {
  const url = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!url) return { ok: false, error: 'GOOGLE_SHEETS_WEBAPP_URL not configured' };
  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if ((res.status >= 200 && res.status < 400) || res.status === 0) return { ok: true };
    return { ok: false, error: `Apps Script returned HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
