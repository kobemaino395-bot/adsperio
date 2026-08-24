import 'server-only';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { dataDir } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';
import {
  deleteTakeHomeFile,
  migrateLegacySlotFile,
  renameTakeHomeFiles,
} from '@/server/content/position-files';

export const HERO_TINTS = ['accent', 'ink', 'sky', 'rose', 'lime'] as const;
export type HeroTint = (typeof HERO_TINTS)[number];

export type StatCard = { key: string; value: string };
export type Benefit = { key: string; value: string; sub: string };

/** One selectable job on a shared application page. A position with role
 *  options renders a role picker instead of a single apply button — the
 *  visitor chooses which one they're applying for and the form forwards it.
 *  All roles on a position share the same take-home file (if any) — there's
 *  no per-role file. */
export type RoleOption = {
  id: string;
  label: string;
  blurb: string;
  minSalary: number;
  maxSalary: number;
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
  /** The position's one take-home file, shared across all its roles. */
  testFileName: string;
  testDescription: string;
  downloadTitle: string;
  downloadBlurb: string;
  showDownload: boolean;
  /** Google Form URL for a more detailed application form. */
  googleFormUrl: string;
  googleFormTitle: string;
  googleFormBlurb: string;
  showGoogleForm: boolean;
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
      slug: 'apply',
      title: 'Apply to AdsPerio',
      subtitle: '',
      eyebrow: 'Careers · Now hiring',
      tagline:
        "We're hiring across paid media — Senior Media Buyer, Google Ads, Meta Ads, PPC, and Performance Marketing. Remote-first, full-time. One application form covers every open role.",
      heroTint: 'accent',
      statCards: [
        { key: 'Team', value: 'Paid Media' },
        { key: 'Level', value: 'Mid to Senior' },
        { key: 'Location', value: 'Remote' },
        { key: 'Type', value: 'Full-time' },
      ],
      applySubtitle: 'Pick your role',
      applyBlurb:
        "Choose the role you're applying for, attach your CV, and tell us why. Every open role goes through this one form — we review every submission and reply within 5 business days, either way.",
      roleOptions: [
        {
          id: 'senior-media-buyer',
          label: 'Senior Media Buyer',
          blurb: 'Own multi-channel spend at $250k+/month and hold it to measured incremental revenue, not blended ROAS.',
          minSalary: 95000,
          maxSalary: 130000,
        },
        {
          id: 'google-ads-specialist',
          label: 'Google Ads Specialist',
          blurb: 'Search, Shopping and Performance Max — including the parts of PMax the platform will not show you.',
          minSalary: 75000,
          maxSalary: 105000,
        },
        {
          id: 'meta-ads-specialist',
          label: 'Meta Ads Specialist',
          blurb: 'Run Meta buying end to end, with the Conversions API and deduplication handled server-side rather than guessed at.',
          minSalary: 85000,
          maxSalary: 110000,
        },
        {
          id: 'ppc-specialist',
          label: 'PPC Specialist',
          blurb: 'Keyword-level economics across search engines: query mining, negatives, bid logic, and tracking that survives audit.',
          minSalary: 70000,
          maxSalary: 95000,
        },
        {
          id: 'performance-marketing-manager',
          label: 'Performance Marketing Manager',
          blurb: 'Own the channel mix and the budget case. Defend both to a CFO with the test design attached.',
          minSalary: 105000,
          maxSalary: 140000,
        },
      ],
      testFileName: '',
      testDescription: '',
      downloadTitle: 'Technical Assessment',
      downloadBlurb:
        'Download the take-home for your role and complete it within 2 days. PDF, DOCX, or ZIP accepted.',
      showDownload: false,
      googleFormUrl: '',
      googleFormTitle: 'Apply via Google Form',
      googleFormBlurb: 'Share more about your experience and expertise with our detailed Google Form. Preferred for applicants who want to provide comprehensive information about their background. You only need to submit one application.',
      showGoogleForm: false,
      aboutHeading: 'About these roles',
      aboutParagraphs: [
        'AdsPerio manages paid media for ambitious brands across EdTech, FinTech, DTC, and healthcare. We are hiring across every channel — search, social, and the people who own the mix and the budget case — because they share one bar: you own the spend, and you are measured on incremental revenue, not on the number the platform reports.',
        'This is a strong fit if you have spent years inside ad platforms, have quietly stopped believing the attribution column, and want to work somewhere that treats that scepticism as the whole point.',
      ],
      responsibilitiesHeading: 'What every one of these roles does',
      responsibilities: [
        'Own day-to-day buying on your channel for a portfolio of client accounts — structure, testing, reporting.',
        'Hold yourself to measured incremental revenue, not to the number the platform reports.',
        'Write the weekly account read a client actually reads — plain language, specific, admits when something did not work.',
        'Run geo holdouts and incrementality tests on your own spend, and report the results even when they are unflattering.',
        'Flag when the honest answer is to spend less, kill a channel, or tell a client no.',
      ],
      mustHaveHeading: 'What we look for in every role',
      mustHave: [
        'Direct ownership of the accounts or work product you are hired for — not a coordinator seat.',
        'Comfortable being measured on outcomes you cannot fully control, and saying so plainly when a result was mixed.',
        'Clean, plain written English. Most of this job is documenting what you found.',
        '4+ hours of overlap with the US business day.',
      ],
      niceToHaveHeading: 'Nice to have',
      niceToHave: [
        'Agency experience managing multiple client accounts at once.',
        'You have killed something that looked profitable because the incremental read said otherwise.',
        'Comfortable in a BI tool or SQL, not just platform dashboards.',
      ],
      processHeading: 'Process',
      processSteps: [
        'Pick your role above and download the take-home brief for it.',
        'Complete it within 2 days and submit the form with your CV.',
        '30-minute call with the team.',
        'Offer.',
      ],
      processStepsNoDownload: [
        'Pick your role above and submit the form with your CV.',
        '30-minute call with the team.',
        'Offer.',
      ],
      benefitsHeading: 'What you get',
      benefitsBlurb: 'Same terms for everyone at the same level, published up front.',
      benefits: [
        { key: 'Competitive salary', value: 'By role and experience, reviewed annually.', sub: '' },
        { key: 'Remote-first', value: 'Work from anywhere. We run async by default with quarterly in-person offsites.', sub: '' },
        { key: 'Learning budget', value: '$2,500/year for courses, certifications, conferences, and books.', sub: '' },
        { key: 'Real equity', value: 'Meaningful agency equity for all full-time team members after year one.', sub: '' },
        { key: 'Ownership & trust', value: 'You own your work. No micromanagement, just clear goals and support.', sub: '' },
      ],
      equalOpportunity:
        'AdsPerio is an equal opportunity employer. We hire based on craft and ownership and do not discriminate on the basis of race, religion, national origin, gender, sexual orientation, age, or disability.',
      seoTitle: 'Paid media jobs — Senior Media Buyer, Google Ads, Meta Ads, PPC, Performance Marketing | AdsPerio',
      seoDescription:
        'AdsPerio is hiring across paid media: Senior Media Buyer, Google Ads Specialist, Meta Ads Specialist, PPC Specialist, and Performance Marketing Manager. Remote-first, one application form.',
      jobPostingDescription:
        'Own paid media for ambitious brands across EdTech, FinTech, DTC, and healthcare at AdsPerio. Remote-first, full-time.',
      datePosted: now.slice(0, 10),
      validThrough: '',
      salaryMin: 70000,
      salaryMax: 140000,
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
    googleFormUrl: typeof raw.googleFormUrl === 'string' ? raw.googleFormUrl : '',
    googleFormTitle: typeof raw.googleFormTitle === 'string' ? raw.googleFormTitle : '',
    googleFormBlurb: typeof raw.googleFormBlurb === 'string' ? raw.googleFormBlurb : '',
    showGoogleForm: typeof raw.showGoogleForm === 'boolean' ? raw.showGoogleForm : false,
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
    googleFormUrl: '',
    googleFormTitle: '',
    googleFormBlurb: '',
    showGoogleForm: false,
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
    googleFormUrl: str(input.googleFormUrl, 2000),
    googleFormTitle: str(input.googleFormTitle, 200),
    googleFormBlurb: str(input.googleFormBlurb, 1000),
    showGoogleForm: !!input.showGoogleForm,
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
  // Don't let a plain content save wipe the take-home file — input.testFileName
  // is only ever set by the small upload/delete routes, which patch through
  // this same function.
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
  await deleteTakeHomeFile(slug);
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
  // The take-home file isn't duplicated on disk, so a copy starts without one.
  const next: Position = {
    ...src,
    slug: candidate,
    title: `${src.title} (copy)`,
    testFileName: '',
    hidden: true,
    createdAt: now,
    updatedAt: now,
  };
  list.push(next);
  await save(list);
  return { ok: true, position: next };
}

/** Sets (or clears, when filename is '') the position's take-home filename.
 *  Used by the small upload/delete routes after they've written or removed
 *  the underlying file. */
export async function setPositionTakeHomeFilename(
  slug: string,
  filename: string,
): Promise<SavePositionResult> {
  const list = await load();
  const idx = list.findIndex((p) => p.slug === slug);
  if (idx < 0) return { ok: false, reason: 'Position not found' };
  const current = list[idx]!;

  const next: Position = { ...current, testFileName: filename, updatedAt: new Date().toISOString() };

  list[idx] = next;
  await save(list);
  return { ok: true, position: next };
}
