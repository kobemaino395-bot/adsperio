import 'server-only';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { dataDir } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';
import {
  deleteAllTakeHomeFiles,
  isValidTakeHomeKey,
  migrateLegacySlotFile,
  POSITION_FALLBACK_KEY,
  renameTakeHomeFiles,
} from '@/server/content/position-files';

export const HERO_TINTS = ['accent', 'ink', 'sky', 'rose', 'lime'] as const;
export type HeroTint = (typeof HERO_TINTS)[number];

export type StatCard = { key: string; value: string };
export type Benefit = { key: string; value: string; sub: string };

/** One selectable job on a shared application page. A position with role
 *  options renders a role picker instead of a single apply button — the
 *  visitor chooses which one they're applying for and the form forwards it.
 *  `testFileName` is the sanitized filename of the take-home uploaded for
 *  this role (empty = none; falls back to the position-level file). */
export type RoleOption = {
  id: string;
  label: string;
  blurb: string;
  minSalary: number;
  maxSalary: number;
  testFileName: string;
  testDescription: string;
};

export type Position = {
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  tagline: string;
  heroTint: HeroTint;
  statCards: StatCard[];
  applySubtitle: string;
  applyBlurb: string;
  roleOptions: RoleOption[];
  /** Position-level take-home, used when there's no role picker or the
   *  selected role doesn't have its own file. */
  testFileName: string;
  testDescription: string;
  downloadTitle: string;
  downloadBlurb: string;
  showDownload: boolean;
  aboutHeading: string;
  aboutParagraphs: string[];
  responsibilitiesHeading: string;
  responsibilities: string[];
  mustHaveHeading: string;
  mustHave: string[];
  niceToHaveHeading: string;
  niceToHave: string[];
  processHeading: string;
  processSteps: string[];
  processStepsNoDownload: string[];
  benefitsHeading: string;
  benefitsBlurb: string;
  benefits: Benefit[];
  equalOpportunity: string;
  seoTitle: string;
  seoDescription: string;
  jobPostingDescription: string;
  datePosted: string;
  validThrough: string;
  salaryMin: number;
  salaryMax: number;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
};

export const SLUG_RE = /^[a-z][a-z0-9-]{1,60}$/;
export const ROLE_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function positionsPath(): string {
  return path.join(dataDir(), 'content', 'positions.json');
}

function seed(): Position[] {
  const now = new Date().toISOString();
  return [
    {
      slug: 'meta-ads-specialist',
      title: 'Meta Ads Specialist',
      subtitle: '',
      eyebrow: 'Careers · Open role',
      tagline:
        "We're looking for a Meta Ads specialist to own paid social strategy across Facebook, Instagram, and Messenger for a portfolio of high-growth clients. High ownership, fully remote.",
      heroTint: 'accent',
      statCards: [
        { key: 'Team', value: 'Paid Media' },
        { key: 'Level', value: 'Mid-level' },
        { key: 'Location', value: 'Remote' },
        { key: 'Type', value: 'Full-time' },
      ],
      applySubtitle: 'Apply for this role',
      applyBlurb:
        'Submissions go straight to the hiring team. We review every one and reply within 5 business days.',
      roleOptions: [],
      testFileName: '',
      testDescription: '',
      downloadTitle: 'Technical Assessment',
      downloadBlurb:
        'Download the strategic assignment and complete it within 2 days. PDF, DOCX, or ZIP accepted.',
      showDownload: false,
      aboutHeading: 'About the role',
      aboutParagraphs: [
        "AdsPerio manages paid media for ambitious brands across EdTech, FinTech, DTC, and healthcare. We're growing fast and need a Meta Ads Specialist who can take full ownership of client accounts — from strategy to reporting — and drive the kind of results that make clients stay for years.",
        "This is not a coordinator role. You'll be the lead strategist on your accounts, working closely with our SEO, creative, and web teams to build compounding growth systems — not one-off campaigns.",
      ],
      responsibilitiesHeading: "What you'll do",
      responsibilities: [
        'Own end-to-end paid media strategy and execution across Google Ads, Meta Ads, and LinkedIn Campaign Manager.',
        'Manage and optimise monthly ad budgets ranging from $30K to $300K+ per client.',
        'Build and maintain campaign structures: Search, Shopping, Performance Max, Advantage+, and Demand Gen.',
        'Lead creative briefing with the design team — define hooks, formats, and testing hypotheses.',
        'Run a rigorous A/B testing programme across audiences, creative, and landing pages.',
        'Deliver weekly performance reports with clear narrative, insight, and action plans for clients.',
        'Monitor CPAs, ROAS, LTV:CAC, and blended efficiency across the full funnel.',
        'Stay current on platform changes, beta features, and algorithm updates — and act on them first.',
        'Contribute to new business pitches with paid media strategy and audits.',
        'Collaborate with SEO and web teams to align landing pages, messaging, and attribution.',
      ],
      mustHaveHeading: "What we're looking for",
      mustHave: [
        '3+ years managing paid media campaigns with direct ownership of large budgets ($50K+/month).',
        'Proven track record of hitting or exceeding ROAS and CPA targets — with numbers to back it.',
        'Deep expertise in Google Ads (Search, Shopping, PMax) and Meta Ads Manager (prospecting + retargeting).',
        'Strong grasp of attribution models, incrementality testing, and multi-touch reporting.',
        'Comfortable in GA4, Google Tag Manager, and third-party analytics dashboards.',
        'Experience briefing creative and interpreting performance data to inform the next test.',
        'Excellent written communication — you can explain complex data clearly to non-technical clients.',
        'Self-directed and comfortable in a high-ownership, async-first environment.',
      ],
      niceToHaveHeading: 'Nice to have',
      niceToHave: [
        'Experience with LinkedIn Ads, TikTok Ads, or programmatic platforms.',
        'Familiarity with Google Merchant Centre and feed optimisation.',
        'Hands-on experience with marketing automation or CRM integrations (HubSpot, Klaviyo).',
        'Previous agency experience managing multiple client accounts simultaneously.',
      ],
      processHeading: 'Process',
      processSteps: [
        'Download the Technical Assessment from the panel above.',
        'Complete it within 2 days.',
        'Submit the form with your CV.',
        '30-minute call with the team.',
        'Offer.',
      ],
      processStepsNoDownload: [
        'Submit the form with your CV.',
        '30-minute call with the team.',
        'Offer.',
      ],
      benefitsHeading: 'What you get',
      benefitsBlurb: '',
      benefits: [
        { key: 'Competitive salary', value: '~$40K / year depending on experience, reviewed annually.', sub: '' },
        { key: 'Remote-first', value: 'Work from anywhere. We run async by default with quarterly in-person offsites.', sub: '' },
        { key: 'Learning budget', value: '$2,500/year for courses, certifications, conferences, and books.', sub: '' },
        { key: 'Real equity', value: 'Meaningful agency equity for all full-time team members after year one.', sub: '' },
        { key: 'Ownership & trust', value: 'You own your accounts. No micromanagement, just clear goals and support.', sub: '' },
        { key: 'High-impact clients', value: 'Work with ambitious brands across EdTech, FinTech, DTC, and healthcare.', sub: '' },
      ],
      equalOpportunity:
        'AdsPerio is an equal opportunity employer. We hire based on craft and ownership and do not discriminate on the basis of race, religion, national origin, gender, sexual orientation, age, or disability.',
      seoTitle: 'Meta Ads Specialist — Open Role at AdsPerio',
      seoDescription:
        'We are hiring a Meta Ads Specialist to own paid social strategy across Facebook, Instagram, and Messenger. Remote-first, performance-driven, high-ownership role.',
      jobPostingDescription:
        "AdsPerio manages paid media for ambitious brands across EdTech, FinTech, DTC, and healthcare. We're hiring a Meta Ads Specialist to own paid social strategy across Facebook, Instagram, and Messenger for a portfolio of high-growth clients.",
      datePosted: now.slice(0, 10),
      validThrough: '',
      salaryMin: 38000,
      salaryMax: 42000,
      hidden: false,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

const CACHE_KEY = '__adnovara_positions_cache__';
const globalAny = globalThis as unknown as Record<string, Position[] | undefined>;

/** Fills in fields that didn't exist in records written before this feature
 *  shipped, and best-effort migrates a legacy slot-linked take-home file
 *  into the new per-position store. Safe to run on already-migrated data. */
async function migrateRecord(raw: Position & { downloadSlotSlug?: string }): Promise<Position> {
  const roleOptions = Array.isArray(raw.roleOptions)
    ? raw.roleOptions.map((r) => ({
        id: String(r.id ?? ''),
        label: String(r.label ?? ''),
        blurb: String(r.blurb ?? ''),
        minSalary: Number.isFinite(Number(r.minSalary)) ? Number(r.minSalary) : 0,
        maxSalary: Number.isFinite(Number(r.maxSalary)) ? Number(r.maxSalary) : 0,
        testFileName: String(r.testFileName ?? ''),
        testDescription: String(r.testDescription ?? ''),
      }))
    : [];

  const legacySlot = typeof raw.downloadSlotSlug === 'string' ? raw.downloadSlotSlug : '';
  if (legacySlot) await migrateLegacySlotFile(raw.slug, legacySlot);

  const { downloadSlotSlug: _legacy, ...rest } = raw;
  void _legacy;
  return {
    ...rest,
    roleOptions,
    testFileName: typeof raw.testFileName === 'string' ? raw.testFileName : '',
    testDescription: typeof raw.testDescription === 'string' ? raw.testDescription : '',
  };
}

async function load(): Promise<Position[]> {
  const cached = globalAny[CACHE_KEY];
  if (cached) return cached;

  const file = positionsPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  return withFileLock(file, async () => {
    const cached2 = globalAny[CACHE_KEY];
    if (cached2) return cached2;
    const parsed = await readJsonResilient<Position[] | null>(file, null);
    let records: Position[];
    if (Array.isArray(parsed)) {
      records = await Promise.all(parsed.map(migrateRecord));
      await writeJsonAtomic(file, records, { pretty: true });
    } else {
      records = seed();
      await writeJsonAtomic(file, records, { pretty: true });
    }
    globalAny[CACHE_KEY] = records;
    return records;
  });
}

async function save(records: Position[]): Promise<void> {
  const file = positionsPath();
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await withFileLock(file, async () => {
    await writeJsonAtomic(file, records, { pretty: true });
    globalAny[CACHE_KEY] = records;
  });
}

export function invalidatePositionsCache(): void {
  globalAny[CACHE_KEY] = undefined;
}

export async function listPositions(opts: { visibleOnly?: boolean } = {}): Promise<Position[]> {
  const list = await load();
  return opts.visibleOnly ? list.filter((p) => !p.hidden) : [...list];
}

export async function getPosition(slug: string): Promise<Position | undefined> {
  const list = await load();
  return list.find((p) => p.slug === slug);
}

function emptyPosition(slug: string): Position {
  const now = new Date().toISOString();
  return {
    slug,
    title: '',
    subtitle: '',
    eyebrow: 'Careers · Open role',
    tagline: '',
    heroTint: 'accent',
    statCards: [
      { key: 'Team', value: '' },
      { key: 'Level', value: '' },
      { key: 'Location', value: 'Remote' },
      { key: 'Type', value: 'Full-time' },
    ],
    applySubtitle: 'Apply for this role',
    applyBlurb: '',
    roleOptions: [],
    testFileName: '',
    testDescription: '',
    downloadTitle: '',
    downloadBlurb: '',
    showDownload: false,
    aboutHeading: 'About the role',
    aboutParagraphs: [''],
    responsibilitiesHeading: "What you'll do",
    responsibilities: [],
    mustHaveHeading: "What we're looking for",
    mustHave: [],
    niceToHaveHeading: 'Nice to have',
    niceToHave: [],
    processHeading: 'Process',
    processSteps: [],
    processStepsNoDownload: [],
    benefitsHeading: 'What you get',
    benefitsBlurb: '',
    benefits: [],
    equalOpportunity: '',
    seoTitle: '',
    seoDescription: '',
    jobPostingDescription: '',
    datePosted: now.slice(0, 10),
    validThrough: '',
    salaryMin: 0,
    salaryMax: 0,
    hidden: true,
    createdAt: now,
    updatedAt: now,
  };
}

export type SavePositionResult =
  | { ok: true; position: Position }
  | { ok: false; reason: string };

function normalizeTint(v: unknown): HeroTint {
  return HERO_TINTS.includes(v as HeroTint) ? (v as HeroTint) : 'accent';
}

function strList(v: unknown, maxItems = 50, maxLen = 1000): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter((x) => x.length > 0)
    .slice(0, maxItems)
    .map((x) => x.slice(0, maxLen));
}

function statCards(v: unknown): StatCard[] {
  if (!Array.isArray(v)) return [];
  const out: StatCard[] = [];
  for (const item of v.slice(0, 4)) {
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      out.push({
        key: String(o.key ?? '').trim().slice(0, 60),
        value: String(o.value ?? '').trim().slice(0, 120),
      });
    }
  }
  while (out.length < 4) out.push({ key: '', value: '' });
  return out;
}

function benefits(v: unknown): Benefit[] {
  if (!Array.isArray(v)) return [];
  const out: Benefit[] = [];
  for (const item of v.slice(0, 24)) {
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      const key = String(o.key ?? '').trim().slice(0, 80);
      const value = String(o.value ?? '').trim().slice(0, 400);
      const sub = String(o.sub ?? '').trim().slice(0, 200);
      if (key || value) out.push({ key, value, sub });
    }
  }
  return out;
}

/** Normalizes a submitted role-options list. `testFileName` is never taken
 *  from raw input here — callers (create/update) fill it in from the
 *  previously-saved role with the same id, since the file upload UI is a
 *  separate small form that operates on an already-saved position. */
function roleOptions(v: unknown): RoleOption[] {
  if (!Array.isArray(v)) return [];
  const out: RoleOption[] = [];
  const seen = new Set<string>();
  for (const item of v.slice(0, 20)) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const id = String(o.id ?? '').trim().toLowerCase().slice(0, 64);
    if (!ROLE_ID_RE.test(id) || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      label: String(o.label ?? '').trim().slice(0, 120),
      blurb: String(o.blurb ?? '').trim().slice(0, 400),
      minSalary: Number.isFinite(Number(o.minSalary)) ? Math.max(0, Math.floor(Number(o.minSalary))) : 0,
      maxSalary: Number.isFinite(Number(o.maxSalary)) ? Math.max(0, Math.floor(Number(o.maxSalary))) : 0,
      testFileName: '',
      testDescription: String(o.testDescription ?? '').trim().slice(0, 400),
    });
  }
  return out;
}

export function normalizePositionInput(slug: string, input: Partial<Position>): Position {
  const base = emptyPosition(slug);
  const num = (v: unknown): number => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  };
  const str = (v: unknown, max = 500): string =>
    typeof v === 'string' ? v.trim().slice(0, max) : '';

  return {
    ...base,
    slug,
    title: str(input.title, 200),
    subtitle: str(input.subtitle, 200),
    eyebrow: str(input.eyebrow, 120) || base.eyebrow,
    tagline: str(input.tagline, 1000),
    heroTint: normalizeTint(input.heroTint),
    statCards: statCards(input.statCards),
    applySubtitle: str(input.applySubtitle, 200) || base.applySubtitle,
    applyBlurb: str(input.applyBlurb, 1000),
    roleOptions: roleOptions(input.roleOptions),
    testFileName: str(input.testFileName, 200),
    testDescription: str(input.testDescription, 400),
    downloadTitle: str(input.downloadTitle, 200),
    downloadBlurb: str(input.downloadBlurb, 1000),
    showDownload: !!input.showDownload,
    aboutHeading: str(input.aboutHeading, 200) || base.aboutHeading,
    aboutParagraphs: strList(input.aboutParagraphs, 20, 4000),
    responsibilitiesHeading: str(input.responsibilitiesHeading, 200) || base.responsibilitiesHeading,
    responsibilities: strList(input.responsibilities, 50, 1000),
    mustHaveHeading: str(input.mustHaveHeading, 200) || base.mustHaveHeading,
    mustHave: strList(input.mustHave, 50, 1000),
    niceToHaveHeading: str(input.niceToHaveHeading, 200) || base.niceToHaveHeading,
    niceToHave: strList(input.niceToHave, 50, 1000),
    processHeading: str(input.processHeading, 200) || base.processHeading,
    processSteps: strList(input.processSteps, 20, 1000),
    processStepsNoDownload: strList(input.processStepsNoDownload, 20, 1000),
    benefitsHeading: str(input.benefitsHeading, 200) || base.benefitsHeading,
    benefitsBlurb: str(input.benefitsBlurb, 1000),
    benefits: benefits(input.benefits),
    equalOpportunity: str(input.equalOpportunity, 2000),
    seoTitle: str(input.seoTitle, 200),
    seoDescription: str(input.seoDescription, 400),
    jobPostingDescription: str(input.jobPostingDescription, 4000),
    datePosted: str(input.datePosted, 20),
    validThrough: str(input.validThrough, 20),
    salaryMin: num(input.salaryMin),
    salaryMax: num(input.salaryMax),
    hidden: !!input.hidden,
  };
}

/** Carries forward each role's uploaded take-home filename by matching role
 *  id, since the text-based role editor can't submit file data. A role id
 *  that no longer exists after the edit loses its file reference (the
 *  uploaded bytes stay on disk but become unreachable, matching how the old
 *  slot system also orphaned files on slug changes). */
function preserveRoleFiles(previous: RoleOption[], next: RoleOption[]): RoleOption[] {
  const byId = new Map(previous.map((r) => [r.id, r.testFileName]));
  return next.map((r) => ({ ...r, testFileName: byId.get(r.id) ?? '' }));
}

export async function createPosition(slug: string, input: Partial<Position>): Promise<SavePositionResult> {
  const cleanSlug = slug.trim().toLowerCase();
  if (!SLUG_RE.test(cleanSlug)) {
    return { ok: false, reason: 'Slug must be 2–61 chars, lowercase letters, digits, hyphens, starting with a letter' };
  }
  const list = await load();
  if (list.some((p) => p.slug === cleanSlug)) {
    return { ok: false, reason: `A position with slug "${cleanSlug}" already exists` };
  }
  const now = new Date().toISOString();
  const next = normalizePositionInput(cleanSlug, input);
  next.createdAt = now;
  next.updatedAt = now;
  if (!next.title) return { ok: false, reason: 'Title is required' };
  list.push(next);
  await save(list);
  return { ok: true, position: next };
}

export async function updatePosition(slug: string, input: Partial<Position>): Promise<SavePositionResult> {
  const list = await load();
  const idx = list.findIndex((p) => p.slug === slug);
  if (idx < 0) return { ok: false, reason: 'Position not found' };
  const current = list[idx]!;

  let nextSlug = current.slug;
  const submitted = typeof input.slug === 'string' ? input.slug.trim().toLowerCase() : '';
  const requestedSlug = submitted || current.slug;
  if (requestedSlug !== current.slug) {
    if (!SLUG_RE.test(requestedSlug)) {
      return { ok: false, reason: 'New slug is invalid' };
    }
    if (list.some((p) => p.slug === requestedSlug)) {
      return { ok: false, reason: `Slug "${requestedSlug}" is already in use` };
    }
    nextSlug = requestedSlug;
  }

  const merged = normalizePositionInput(nextSlug, { ...current, ...input });
  merged.createdAt = current.createdAt;
  merged.updatedAt = new Date().toISOString();
  // The role editor is text-only; keep whatever files were already uploaded
  // for roles that still exist, and don't let a plain content save wipe the
  // position-level file (input.testFileName is only ever set by the small
  // upload/delete routes, which patch through this same function).
  merged.roleOptions = preserveRoleFiles(current.roleOptions, merged.roleOptions);
  if (input.testFileName === undefined) merged.testFileName = current.testFileName;
  if (!merged.title) return { ok: false, reason: 'Title is required' };

  if (nextSlug !== current.slug) await renameTakeHomeFiles(current.slug, nextSlug);

  list[idx] = merged;
  await save(list);
  return { ok: true, position: merged };
}

export async function deletePosition(slug: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const list = await load();
  if (!list.some((p) => p.slug === slug)) return { ok: false, reason: 'Position not found' };
  const next = list.filter((p) => p.slug !== slug);
  await save(next);
  await deleteAllTakeHomeFiles(slug);
  return { ok: true };
}

export async function togglePositionHidden(slug: string): Promise<SavePositionResult> {
  const list = await load();
  const idx = list.findIndex((p) => p.slug === slug);
  if (idx < 0) return { ok: false, reason: 'Position not found' };
  const current = list[idx]!;
  const next: Position = { ...current, hidden: !current.hidden, updatedAt: new Date().toISOString() };
  list[idx] = next;
  await save(list);
  return { ok: true, position: next };
}

export async function copyPosition(slug: string): Promise<SavePositionResult> {
  const list = await load();
  const src = list.find((p) => p.slug === slug);
  if (!src) return { ok: false, reason: 'Position not found' };

  let candidate = `${src.slug}-copy`;
  let n = 2;
  while (list.some((p) => p.slug === candidate)) {
    candidate = `${src.slug}-copy-${n++}`;
    if (n > 50) return { ok: false, reason: 'Too many copies' };
  }
  const now = new Date().toISOString();
  // Take-home files aren't duplicated on disk, so a copy starts without them.
  const next: Position = {
    ...src,
    slug: candidate,
    title: `${src.title} (copy)`,
    testFileName: '',
    roleOptions: src.roleOptions.map((r) => ({ ...r, testFileName: '' })),
    hidden: true,
    createdAt: now,
    updatedAt: now,
  };
  list.push(next);
  await save(list);
  return { ok: true, position: next };
}

/** Sets (or clears, when filename is '') the take-home filename recorded
 *  against a position or one of its roles. Used by the small upload/delete
 *  routes after they've written or removed the underlying file. */
export async function setPositionTakeHomeFilename(
  slug: string,
  key: string,
  filename: string,
): Promise<SavePositionResult> {
  if (!isValidTakeHomeKey(key)) return { ok: false, reason: 'Invalid file key' };
  const list = await load();
  const idx = list.findIndex((p) => p.slug === slug);
  if (idx < 0) return { ok: false, reason: 'Position not found' };
  const current = list[idx]!;

  const next: Position =
    key === POSITION_FALLBACK_KEY
      ? { ...current, testFileName: filename, updatedAt: new Date().toISOString() }
      : {
          ...current,
          roleOptions: current.roleOptions.map((r) => (r.id === key ? { ...r, testFileName: filename } : r)),
          updatedAt: new Date().toISOString(),
        };

  list[idx] = next;
  await save(list);
  return { ok: true, position: next };
}
