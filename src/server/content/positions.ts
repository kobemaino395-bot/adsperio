import 'server-only';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { dataDir } from '@/server/storage';
import { readJsonResilient, withFileLock, writeJsonAtomic } from '@/server/json-store';

export const HERO_TINTS = ['accent', 'ink', 'sky', 'rose', 'lime'] as const;
export type HeroTint = (typeof HERO_TINTS)[number];

export type StatCard = { key: string; value: string };
export type Benefit = { key: string; value: string; sub: string };

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
  downloadSlotSlug: string;
  downloadTitle: string;
  downloadBlurb: string;
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

function positionsPath(): string {
  return path.join(dataDir(), 'content', 'positions.json');
}

function seed(): Position[] {
  const now = new Date().toISOString();
  return [
    {
      slug: 'ads-manager',
      title: 'Ads Manager',
      subtitle: '',
      eyebrow: 'Careers · Open role',
      tagline:
        "We're looking for a senior paid media specialist to own multi-channel ad strategy for a portfolio of high-growth clients. High ownership, competitive pay, fully remote.",
      heroTint: 'accent',
      statCards: [
        { key: 'Team', value: 'Paid Media' },
        { key: 'Level', value: 'Senior / Lead' },
        { key: 'Location', value: 'Remote' },
        { key: 'Type', value: 'Full-time' },
      ],
      applySubtitle: 'Apply for this role',
      applyBlurb:
        'Submissions go straight to the hiring team. We review every one and reply within 5 business days.',
      downloadSlotSlug: 'take-home',
      downloadTitle: 'Technical Assessment',
      downloadBlurb:
        'Download the strategic assignment, complete it within 2 days, and upload your answer with the form. PDF, DOCX, or ZIP accepted.',
      aboutHeading: 'About the role',
      aboutParagraphs: [
        "GrowthVireX manages paid media for ambitious brands across EdTech, FinTech, DTC, and healthcare. We're growing fast and need a senior Ads Manager who can take full ownership of client accounts — from strategy to reporting — and drive the kind of results that make clients stay for years.",
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
        'Submit the form with your CV and completed assessment.',
        '30-minute call with the team.',
        'Offer.',
      ],
      benefitsHeading: 'What you get',
      benefitsBlurb: '',
      benefits: [
        { key: 'Competitive salary', value: '$75K – $110K depending on experience, reviewed annually.', sub: '' },
        { key: 'Remote-first', value: 'Work from anywhere. We run async by default with quarterly in-person offsites.', sub: '' },
        { key: 'Learning budget', value: '$2,500/year for courses, certifications, conferences, and books.', sub: '' },
        { key: 'Real equity', value: 'Meaningful agency equity for all full-time team members after year one.', sub: '' },
        { key: 'Ownership & trust', value: 'You own your accounts. No micromanagement, just clear goals and support.', sub: '' },
        { key: 'High-impact clients', value: 'Work with ambitious brands across EdTech, FinTech, DTC, and healthcare.', sub: '' },
      ],
      equalOpportunity:
        'GrowthVireX is an equal opportunity employer. We hire based on craft and ownership and do not discriminate on the basis of race, religion, national origin, gender, sexual orientation, age, or disability.',
      seoTitle: 'Ads Manager — Open Role at GrowthVireX',
      seoDescription:
        'We are hiring a senior Ads Manager to own paid media strategy across Google, Meta, and LinkedIn. Remote-first, performance-driven, high-ownership role.',
      jobPostingDescription:
        "GrowthVireX manages paid media for ambitious brands across EdTech, FinTech, DTC, and healthcare. We're hiring a senior Ads Manager to own multi-channel ad strategy across Google, Meta, and LinkedIn for a portfolio of high-growth clients.",
      datePosted: now.slice(0, 10),
      validThrough: '',
      salaryMin: 75000,
      salaryMax: 110000,
      hidden: false,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

const CACHE_KEY = '__adnovara_positions_cache__';
const globalAny = globalThis as unknown as Record<string, Position[] | undefined>;

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
      records = parsed;
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
    downloadSlotSlug: '',
    downloadTitle: '',
    downloadBlurb: '',
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
    downloadSlotSlug: str(input.downloadSlotSlug, 120),
    downloadTitle: str(input.downloadTitle, 200),
    downloadBlurb: str(input.downloadBlurb, 1000),
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

  // Slug is locked once a download slot is associated.
  // Treat empty/missing slug as "no change" so a disabled UI field doesn't
  // get interpreted as an attempted rename.
  let nextSlug = current.slug;
  const submitted = typeof input.slug === 'string' ? input.slug.trim().toLowerCase() : '';
  const requestedSlug = submitted || current.slug;
  if (requestedSlug !== current.slug) {
    if (current.downloadSlotSlug) {
      return { ok: false, reason: 'Slug is locked because a downloadable file is linked to this position' };
    }
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
  if (!merged.title) return { ok: false, reason: 'Title is required' };

  list[idx] = merged;
  await save(list);
  return { ok: true, position: merged };
}

export async function deletePosition(slug: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const list = await load();
  if (!list.some((p) => p.slug === slug)) return { ok: false, reason: 'Position not found' };
  const next = list.filter((p) => p.slug !== slug);
  await save(next);
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
  const next: Position = {
    ...src,
    slug: candidate,
    title: `${src.title} (copy)`,
    downloadSlotSlug: '',
    hidden: true,
    createdAt: now,
    updatedAt: now,
  };
  list.push(next);
  await save(list);
  return { ok: true, position: next };
}
