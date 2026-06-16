import type { Position, StatCard, Benefit, HeroTint } from '@/server/content/positions';
import { HERO_TINTS } from '@/server/content/positions';

function lines(v: string): string[] {
  return v.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

function paragraphs(v: string): string[] {
  return v.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
}

function num(v: FormDataEntryValue | null): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

function tint(v: FormDataEntryValue | null): HeroTint {
  const s = String(v ?? '');
  return (HERO_TINTS as readonly string[]).includes(s) ? (s as HeroTint) : 'accent';
}

function parseBenefits(v: string): Benefit[] {
  return lines(v).map((line) => {
    const parts = line.split('|').map((p) => p.trim());
    return {
      key: parts[0] ?? '',
      value: parts[1] ?? '',
      sub: parts[2] ?? '',
    };
  });
}

export function parsePositionForm(form: FormData): Partial<Position> & { slug: string } {
  const stat = (i: number): StatCard => ({
    key: String(form.get(`statKey${i}`) ?? ''),
    value: String(form.get(`statValue${i}`) ?? ''),
  });

  return {
    slug: String(form.get('slug') ?? '').trim().toLowerCase(),
    title: String(form.get('title') ?? ''),
    subtitle: String(form.get('subtitle') ?? ''),
    eyebrow: String(form.get('eyebrow') ?? ''),
    tagline: String(form.get('tagline') ?? ''),
    heroTint: tint(form.get('heroTint')),
    statCards: [stat(0), stat(1), stat(2), stat(3)],
    applySubtitle: String(form.get('applySubtitle') ?? ''),
    applyBlurb: String(form.get('applyBlurb') ?? ''),
    downloadSlotSlug: String(form.get('downloadSlotSlug') ?? ''),
    downloadTitle: String(form.get('downloadTitle') ?? ''),
    downloadBlurb: String(form.get('downloadBlurb') ?? ''),
    showDownload: form.get('showDownload') === 'on',
    aboutHeading: String(form.get('aboutHeading') ?? ''),
    aboutParagraphs: paragraphs(String(form.get('aboutParagraphs') ?? '')),
    responsibilitiesHeading: String(form.get('responsibilitiesHeading') ?? ''),
    responsibilities: lines(String(form.get('responsibilities') ?? '')),
    mustHaveHeading: String(form.get('mustHaveHeading') ?? ''),
    mustHave: lines(String(form.get('mustHave') ?? '')),
    niceToHaveHeading: String(form.get('niceToHaveHeading') ?? ''),
    niceToHave: lines(String(form.get('niceToHave') ?? '')),
    processHeading: String(form.get('processHeading') ?? ''),
    processSteps: lines(String(form.get('processSteps') ?? '')),
    processStepsNoDownload: lines(String(form.get('processStepsNoDownload') ?? '')),
    benefitsHeading: String(form.get('benefitsHeading') ?? ''),
    benefitsBlurb: String(form.get('benefitsBlurb') ?? ''),
    benefits: parseBenefits(String(form.get('benefitsGrid') ?? '')),
    equalOpportunity: String(form.get('equalOpportunity') ?? ''),
    seoTitle: String(form.get('seoTitle') ?? ''),
    seoDescription: String(form.get('seoDescription') ?? ''),
    jobPostingDescription: String(form.get('jobPostingDescription') ?? ''),
    datePosted: String(form.get('datePosted') ?? ''),
    validThrough: String(form.get('validThrough') ?? ''),
    salaryMin: num(form.get('salaryMin')),
    salaryMax: num(form.get('salaryMax')),
    hidden: form.get('hidden') === 'on',
  };
}
