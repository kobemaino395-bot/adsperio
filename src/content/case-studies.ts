export type CaseStudyMetric = { value: string; label: string };
export type CaseStudySection = { heading: string; body: string };

export type CaseStudy = {
  slug: 'aura-wellness' | 'edutech-academy' | 'finova' | 'lumiere-tech' | 'nexus-health';
  client: string;
  industry: string;
  services: string[];           // references service slugs
  tagline: string;              // short one-liner for cards
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    summary: string;
  };
  headline: CaseStudyMetric;    // the "big number" result
  metrics: CaseStudyMetric[];   // supporting results (3-4)
  challenge: CaseStudySection;
  approach: CaseStudySection;
  results: CaseStudySection;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  duration: string;             // e.g. "6 months"
  publishedAt: string;          // ISO date for JSON-LD
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'aura-wellness',
    client: 'Aura Wellness',
    industry: 'Health & Wellness / DTC',
    services: ['social-advertising', 'web'],
    tagline: 'Scaled a DTC wellness brand from six to seven figures in 8 months.',
    metaTitle: 'Aura Wellness — 612% Revenue Growth via Paid Social & CRO',
    metaDescription:
      'How Adnovara scaled Aura Wellness from $80K to $580K monthly revenue through Meta, TikTok, and conversion-optimized landing pages.',
    keywords: ['DTC marketing case study', 'Meta ads wellness brand', 'CRO case study', 'paid social scaling'],
    hero: {
      eyebrow: 'Case Study — Health & Wellness',
      title: 'From $80K to $580K/mo',
      titleAccent: 'in 8 months.',
      summary: 'Aura Wellness had a loyal customer base and a great product — but their paid social was plateauing and their site was leaking revenue. We rebuilt both.',
    },
    headline: { value: '612%', label: 'Revenue growth (8 months)' },
    metrics: [
      { value: '4.2x',  label: 'Blended ROAS' },
      { value: '-38%',  label: 'Customer acquisition cost' },
      { value: '+71%',  label: 'Landing page conversion' },
      { value: '22%',   label: 'Repeat purchase rate' },
    ],
    challenge: {
      heading: 'The challenge',
      body: 'Aura was spending $45K/month on Meta with diminishing returns — CPAs had climbed 60% in six months, creative was fatiguing, and the mobile landing page converted at under 1.2%. Every dollar of new ad spend was earning less than the last.',
    },
    approach: {
      heading: 'Our approach',
      body: 'We rebuilt the funnel end-to-end. New audience structure using first-party purchase data, a UGC-led creative testing program shipping 40+ new variants monthly, TikTok launched as a second channel, and a full landing-page rebuild focused on mobile-first scannability, social proof above the fold, and a streamlined three-step checkout.',
    },
    results: {
      heading: 'The results',
      body: 'Within 8 months, monthly revenue grew from $80K to $580K. CPA dropped 38% even as spend scaled 3.2x. The new landing page lifted conversion rate by 71%, and repeat purchase rate climbed from 14% to 22% thanks to better post-purchase flows.',
    },
    testimonial: {
      quote: 'Adnovara didn\'t just run our ads — they rebuilt how we think about growth. The landing page alone paid for the entire engagement in the first month.',
      author: 'Priya Mehta',
      role: 'Founder, Aura Wellness',
    },
    duration: '8 months',
    publishedAt: '2025-09-12',
  },
  {
    slug: 'edutech-academy',
    client: 'EduTech Academy',
    industry: 'EdTech / B2C SaaS',
    services: ['seo', 'ppc'],
    tagline: 'Built an organic acquisition engine that overtook paid as the #1 channel.',
    metaTitle: 'EduTech Academy — 420% Organic Traffic Growth Case Study',
    metaDescription:
      'How we turned organic search into EduTech Academy\'s largest acquisition channel through technical SEO, topical authority, and content strategy.',
    keywords: ['EdTech SEO case study', 'SaaS SEO', 'content strategy', 'organic growth'],
    hero: {
      eyebrow: 'Case Study — EdTech',
      title: 'Organic became the',
      titleAccent: '#1 channel.',
      summary: 'EduTech Academy was paying $380K/year for paid acquisition. Twelve months later, organic search drove more signups than all paid channels combined — at a fraction of the cost.',
    },
    headline: { value: '420%', label: 'Organic traffic growth' },
    metrics: [
      { value: '2,800+', label: 'Ranking keywords' },
      { value: '18',     label: 'Featured snippets won' },
      { value: '-54%',   label: 'Blended CAC' },
      { value: '3.1x',   label: 'Organic-driven signups' },
    ],
    challenge: {
      heading: 'The challenge',
      body: 'EduTech ranked for their brand name and little else. A competitor analysis showed they were missing on 1,400+ commercial-intent keywords their competitors dominated. Their site had 2,300 indexation issues and a Core Web Vitals score in the red.',
    },
    approach: {
      heading: 'Our approach',
      body: 'A 90-day technical remediation sprint fixed crawl budget, schema, and page speed. In parallel, we built six topic clusters around buyer-intent queries, shipped 140 long-form articles in nine months, and ran a targeted digital PR campaign that earned 62 backlinks from DR70+ publications.',
    },
    results: {
      heading: 'The results',
      body: 'Organic traffic grew 420% year-over-year. Organic-driven trial signups tripled, and blended CAC dropped 54% as the team reduced paid spend on keywords they now ranked for. Eighteen pages earned featured snippets, and organic surpassed paid as the leading acquisition channel in month 10.',
    },
    testimonial: {
      quote: 'We stopped thinking of SEO as a cost and started thinking of it as an asset. Every article we ship now compounds.',
      author: 'Marcus Chen',
      role: 'VP Growth, EduTech Academy',
    },
    duration: '12 months',
    publishedAt: '2025-07-08',
  },
  {
    slug: 'finova',
    client: 'Finova',
    industry: 'FinTech / B2B SaaS',
    services: ['ppc', 'web'],
    tagline: 'Cut enterprise CAC in half while tripling pipeline-qualified leads.',
    metaTitle: 'Finova — B2B SaaS Case Study: -50% CAC, 3x Pipeline',
    metaDescription:
      'Finova was burning $180K/month on paid with a broken attribution model. We rebuilt their PPC strategy and marketing site — halving CAC and tripling SQLs.',
    keywords: ['B2B SaaS PPC', 'FinTech marketing', 'enterprise lead generation', 'LinkedIn Ads case study'],
    hero: {
      eyebrow: 'Case Study — FinTech SaaS',
      title: 'Half the CAC.',
      titleAccent: 'Triple the pipeline.',
      summary: 'Finova had strong product-market fit but couldn\'t scale acquisition profitably. We rebuilt their paid media strategy, landing experience, and attribution — turning a leaky funnel into a growth engine.',
    },
    headline: { value: '-50%', label: 'Enterprise CAC' },
    metrics: [
      { value: '3.2x',   label: 'Sales-qualified leads' },
      { value: '$8.4M',  label: 'Pipeline generated' },
      { value: '+86%',   label: 'Demo conversion rate' },
      { value: '14%',    label: 'MQL→SQL rate' },
    ],
    challenge: {
      heading: 'The challenge',
      body: 'Finova was generating leads but not customers. 68% of MQLs never progressed, their demo page converted at 2.1%, and attribution was unreliable — the CMO couldn\'t prove which channels actually drove closed revenue.',
    },
    approach: {
      heading: 'Our approach',
      body: 'We segmented campaigns by ICP firmographics and ran account-based targeting on LinkedIn. Built a new demo request flow with progressive profiling and calendar-embedded booking. Implemented server-side tracking and CRM-integrated attribution so every touchpoint tied back to closed-won revenue.',
    },
    results: {
      heading: 'The results',
      body: 'Enterprise CAC dropped 50% in six months. SQLs tripled and MQL-to-SQL rate climbed from 4% to 14% as we filtered out poor-fit leads earlier. The rebuilt demo page converted at 3.9%, and total generated pipeline reached $8.4M in the first year.',
    },
    testimonial: {
      quote: 'For the first time, I can walk into a board meeting and tell a clean story from ad click to closed deal. That\'s the real ROI.',
      author: 'Sarah Okonkwo',
      role: 'CMO, Finova',
    },
    duration: '9 months',
    publishedAt: '2025-10-03',
  },
  {
    slug: 'lumiere-tech',
    client: 'Lumière Tech',
    industry: 'Consumer Electronics',
    services: ['social-advertising', 'seo'],
    tagline: 'Launched a new product line to a 2x sellout in 6 weeks.',
    metaTitle: 'Lumière Tech — Product Launch Case Study: 2x Sellout',
    metaDescription:
      'How Adnovara orchestrated a coordinated launch across paid social, SEO, and influencer seeding — selling out Lumière Tech\'s new product line in 6 weeks.',
    keywords: ['product launch marketing', 'consumer electronics launch', 'influencer marketing', 'launch strategy'],
    hero: {
      eyebrow: 'Case Study — Consumer Tech',
      title: 'Sold out in',
      titleAccent: '6 weeks.',
      summary: 'Lumière\'s flagship product had been leaked. The launch window was tight, inventory was finite, and the competition was fierce. We built a coordinated go-to-market that sold through inventory twice over.',
    },
    headline: { value: '2x', label: 'Inventory sold through' },
    metrics: [
      { value: '$2.1M', label: 'Launch-week revenue' },
      { value: '12M+',  label: 'Organic impressions' },
      { value: '48',    label: 'Creator partners' },
      { value: '6.8x',  label: 'Launch ROAS' },
    ],
    challenge: {
      heading: 'The challenge',
      body: 'Three competitors were launching similar products in the same quarter. Lumière needed to own the conversation before launch day, not after — with a fixed budget and six weeks of runway.',
    },
    approach: {
      heading: 'Our approach',
      body: 'We seeded 48 creator partners 3 weeks pre-launch with embargo release dates. Built SEO landing pages ranking for comparison and category queries before competitors existed on-SERP. On launch day, paid social kicked in with creator-shot UGC already proven to convert.',
    },
    results: {
      heading: 'The results',
      body: 'Lumière sold through their initial inventory in 11 days and a rushed second production run in another 31. Launch-week revenue hit $2.1M against a $280K ad spend — a 6.8x ROAS. Organic search now drives 34% of ongoing brand revenue.',
    },
    duration: '6 weeks',
    publishedAt: '2025-11-15',
  },
  {
    slug: 'nexus-health',
    client: 'Nexus Health',
    industry: 'Healthcare / Multi-location',
    services: ['seo', 'ppc', 'web'],
    tagline: 'Unified 34 clinic locations under one growth system.',
    metaTitle: 'Nexus Health — Multi-Location Healthcare Marketing Case Study',
    metaDescription:
      'Scaling patient acquisition across 34 clinic locations with local SEO, Google Ads, and a unified booking platform. A 240% appointment lift case study.',
    keywords: ['healthcare marketing', 'multi-location SEO', 'local SEO case study', 'patient acquisition'],
    hero: {
      eyebrow: 'Case Study — Healthcare',
      title: '34 clinics.',
      titleAccent: 'One growth system.',
      summary: 'Nexus Health ran marketing location-by-location — 34 strategies, 34 reports, 34 budgets. We unified it into a single system while preserving local relevance.',
    },
    headline: { value: '+240%', label: 'Monthly bookings' },
    metrics: [
      { value: '34',   label: 'Locations unified' },
      { value: '+165%', label: 'Local search visibility' },
      { value: '-41%', label: 'Cost per booking' },
      { value: '4.7★', label: 'Avg. Google rating' },
    ],
    challenge: {
      heading: 'The challenge',
      body: 'Every clinic ran its own Google Business Profile, landing page, and ad account — with wildly inconsistent brand and performance. Head office had no unified reporting, and fragmented data meant poor-performing locations went unnoticed for months.',
    },
    approach: {
      heading: 'Our approach',
      body: 'We consolidated into one ad account with location-level campaign splits, built a templated landing page system generating 34 geo-specific pages from one CMS, centralized GBP management, and rolled out a review generation program across every location.',
    },
    results: {
      heading: 'The results',
      body: 'Monthly bookings grew 240% network-wide within a year. Cost per booking dropped 41% thanks to better attribution and automated bid adjustments per location. Average Google rating climbed from 3.9 to 4.7 stars across the group.',
    },
    testimonial: {
      quote: 'We went from firefighting 34 different marketing problems to managing one growth system. Our clinic managers actually like looking at the reports now.',
      author: 'Dr. James Patel',
      role: 'Chief Growth Officer, Nexus Health',
    },
    duration: '14 months',
    publishedAt: '2025-05-20',
  },
];

export const getCaseStudyBySlug = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);