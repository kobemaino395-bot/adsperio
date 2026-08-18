export type ServiceFigure = { value: string; label: string; note?: string };
export type ServiceMethod = { n: string; title: string; desc: string };
export type ServiceDeliverable = { label: string; cadence: string };

export type ServiceSlug = 'paid-search' | 'paid-social' | 'measurement' | 'creative';

export type Service = {
  slug: ServiceSlug;
  navTitle: string;
  navDesc: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  hero: {
    eyebrow: string;
    title: string;
    lede: string;
  };
  /** What is actually included. Plain list, no adjectives. */
  scope: string[];
  /** What this is not. Saying it out loud is the whole point. */
  notScope: string[];
  figures: ServiceFigure[];
  method: ServiceMethod[];
  deliverables: ServiceDeliverable[];
  cta: { title: string; body: string; label: string };
};

export const services: Service[] = [
  {
    slug: 'paid-search',
    navTitle: 'Paid Search',
    navDesc: 'Google, Microsoft, shopping feeds',
    metaTitle: 'Paid Search Management',
    metaDescription:
      'Google and Microsoft Ads accounts rebuilt around margin. Feed work, brand-term incrementality testing, and a weekly written read of what changed and why.',
    keywords: [
      'paid search agency',
      'Google Ads management',
      'Performance Max',
      'shopping feed optimisation',
      'brand term incrementality',
      'Microsoft Ads',
    ],
    hero: {
      eyebrow: 'Service 01',
      title: 'Buying intent without overpaying for it.',
      lede: 'Search is the one channel where the customer tells you what they want. It is also the easiest place to spend a fortune on people who were going to buy from you anyway. Most of our first-quarter work is telling those two groups apart.',
    },
    scope: [
      'Account rebuild — campaign, ad group and match-type structure organised around contribution margin rather than click volume.',
      'Shopping and Performance Max: feed titles, attributes, product segmentation, and the exclusions that stop PMax quietly eating your brand traffic.',
      'Brand-term holdout tests, so you find out what you would have earned without bidding on your own name.',
      'Search term and negative keyword review on a fixed weekly cadence, with the exports attached.',
      'Bid strategy and target management tied to margin, not to revenue.',
      'Offer and landing page tests aimed at the queries that actually convert.',
    ],
    notScope: [
      'SEO. We do not sell it. If organic is the better home for your next dollar we will say so, and we will not be able to invoice you for it.',
      'A dashboard login instead of an answer. You get the raw exports and a written read from the person who ran the account.',
      'Ownership of your accounts. They stay in your billing, in your name, from day one. If you leave, nothing has to be migrated.',
    ],
    figures: [
      { value: '18%', label: 'Median wasted spend identified', note: 'In the opening audit' },
      { value: '−27%', label: 'Median cost per acquisition', note: 'First two quarters' },
      { value: '11 days', label: 'Median time to first restructure', note: 'From kickoff' },
      { value: '43', label: 'Brand holdout tests run', note: 'Since 2019' },
    ],
    method: [
      {
        n: '01',
        title: 'Read the account',
        desc: 'Two weeks with your history, search terms, feed and — this is the part most agencies skip — your actual margin by product or plan. You get a ranked list of what is broken and roughly what each item costs you per month.',
      },
      {
        n: '02',
        title: 'Rebuild the structure',
        desc: 'Campaigns get reorganised around what you earn, not what you sell most of. This usually gets worse before it gets better; smart bidding needs about three weeks to re-learn, and we tell you that before we start rather than after.',
      },
      {
        n: '03',
        title: 'Test the assumptions',
        desc: 'Brand holdouts, geo splits, and offer tests. The goal is to find the spend that is doing nothing, which is rarely where anyone expects it to be.',
      },
      {
        n: '04',
        title: 'Hold the line',
        desc: 'Weekly hygiene, monthly reconciliation against your finance numbers, and a standing agreement about the conditions under which we shut something off.',
      },
    ],
    deliverables: [
      { label: 'Search term and negative review', cadence: 'Weekly' },
      { label: 'Written performance read', cadence: 'Weekly' },
      { label: 'Spend reconciled against booked revenue', cadence: 'Monthly' },
      { label: 'Budget and strategy call', cadence: 'Monthly' },
      { label: 'Holdout or geo incrementality test', cadence: 'Quarterly' },
      { label: 'Raw data export, no aggregation', cadence: 'On request' },
    ],
    cta: {
      title: 'Send us the account.',
      body: 'Read-only access to your Google Ads is enough. We come back with the wasted spend, in writing, with the search terms attached.',
      label: 'Request a search audit',
    },
  },

  {
    slug: 'paid-social',
    navTitle: 'Paid Social',
    navDesc: 'Meta, TikTok, LinkedIn, YouTube',
    metaTitle: 'Paid Social Advertising',
    metaDescription:
      'Meta, TikTok, LinkedIn and YouTube buying built around creative volume and honest attribution. Run by the people who read the account, not by an account manager relaying notes.',
    keywords: [
      'paid social agency',
      'Meta ads management',
      'TikTok ads',
      'LinkedIn ads',
      'creative testing',
      'incrementality',
    ],
    hero: {
      eyebrow: 'Service 02',
      title: 'Feeds do not reward polish.',
      lede: 'Social buying stopped being a targeting problem some time around 2021. The algorithm will find the buyers. What it cannot do is invent something worth showing them, or tell you honestly whether it deserves credit for the sale.',
    },
    scope: [
      'Meta, TikTok, LinkedIn and YouTube buying, with the account structure kept deliberately simple so the learning phase actually completes.',
      'Creative volume as a first-class input — typically 20 to 60 new assets a month, briefed against named hypotheses rather than a content calendar.',
      'Server-side conversion tracking, deduplicated against the pixel, so iOS and cookie loss stop quietly deflating your reported numbers.',
      'Retargeting sized to the audience you actually have, which for most brands is smaller than the agency before us claimed.',
      'Weekly pause-and-watch tests on campaigns we suspect are taking credit rather than creating demand.',
      'Audience and offer work for accounts that are scaling past the point where broad targeting alone holds up.',
    ],
    notScope: [
      'Follower counts, engagement rates, or reach. We do not report on them and will not optimise toward them.',
      'Organic social management. Different job, different team, and we would be mediocre at it.',
      'Spending your budget on a channel that is not working to protect the retainer. We have recommended clients cut social entirely. Twice it cost us the account.',
    ],
    figures: [
      { value: '31', label: 'Median new assets per month', note: 'Per active account' },
      { value: '2.7pt', label: 'Median reported-vs-real gap', note: 'Platform ROAS overstatement' },
      { value: '−34%', label: 'Median cost per acquisition', note: 'First two quarters' },
      { value: '1 in 9', label: 'Creative concepts that beat control', note: 'Trailing 12 months' },
    ],
    method: [
      {
        n: '01',
        title: 'Fix the measurement first',
        desc: 'Before we change a single campaign we make sure the numbers coming out are trustworthy. Buying against a broken indigo is how accounts get scaled in the wrong direction with great confidence.',
      },
      {
        n: '02',
        title: 'Simplify the account',
        desc: 'Most inherited accounts have too many campaigns, each too small to exit learning. Consolidation looks like doing less. It is usually the change that moves the most money.',
      },
      {
        n: '03',
        title: 'Raise creative volume',
        desc: 'One concept in nine beats the control. That ratio is stubborn, so the only lever is more shots on goal — briefed properly, tested cleanly, and killed without ceremony.',
      },
      {
        n: '04',
        title: 'Check for incrementality',
        desc: 'Retargeting and branded audiences flatter themselves. We run pause tests to see whether revenue actually moves when a campaign stops. Sometimes it does not, and that is the most valuable thing we will tell you all quarter.',
      },
    ],
    deliverables: [
      { label: 'Creative batch, briefed and shipped', cadence: 'Fortnightly' },
      { label: 'Written performance read', cadence: 'Weekly' },
      { label: 'Creative test results, win and loss', cadence: 'Fortnightly' },
      { label: 'Spend reconciled against booked revenue', cadence: 'Monthly' },
      { label: 'Pause or holdout test', cadence: 'Monthly' },
      { label: 'Budget and strategy call', cadence: 'Monthly' },
    ],
    cta: {
      title: 'We will find the gap.',
      body: 'Give us read access to the ad account and one month of your revenue data. We will show you where the platform number and the real number stop agreeing.',
      label: 'Request a social audit',
    },
  },

  {
    slug: 'measurement',
    navTitle: 'Measurement',
    navDesc: 'Tracking, attribution, incrementality',
    metaTitle: 'Marketing Measurement & Incrementality',
    metaDescription:
      'Server-side tracking, reconciliation against booked revenue, and incrementality testing. The work that tells you which half of your advertising is wasted.',
    keywords: [
      'marketing measurement',
      'incrementality testing',
      'server-side tracking',
      'marketing attribution',
      'geo holdout test',
      'media mix modelling',
    ],
    hero: {
      eyebrow: 'Service 03',
      title: 'The number the platform reports is not the number.',
      lede: 'Every ad platform grades its own homework, and every one of them marks generously. Across the accounts we have taken over, platform-reported return has overstated reality by a median of 2.7x. This service exists to close that gap, whether or not the answer flatters us.',
    },
    scope: [
      'Server-side conversion tracking, built and maintained, deduplicated against client-side events.',
      'Monthly reconciliation: platform-reported revenue against what actually landed in your accounting system, with the variance explained line by line.',
      'Geo holdout and pause tests designed so the result is readable — correctly powered, correctly sized, run long enough to mean something.',
      'Attribution that reflects your real sales cycle rather than a 7-day click window chosen by someone else.',
      'A standing set of kill criteria: written conditions, agreed in advance, under which each campaign gets switched off.',
      'Lightweight media mix modelling for accounts spending enough for it to be worth the effort. Under roughly $150K a month, it is not.',
    ],
    notScope: [
      'A promise that everything will look better afterwards. It frequently looks worse, because the earlier number was wrong.',
      'A proprietary black-box score. Every calculation we run is one you can reproduce yourself, and we will show you how.',
      'Replacing your finance team. Their number is the one we reconcile toward; we are not asking anyone to trust ours instead.',
    ],
    figures: [
      { value: '2.7x', label: 'Median platform overstatement', note: 'At account takeover' },
      { value: '1.9pt', label: 'Median variance after 90 days', note: 'Platform vs. reconciled' },
      { value: '116', label: 'Incrementality tests run', note: 'Since 2019' },
      { value: '1 in 4', label: 'Tests where the channel was not incremental', note: 'And we said so' },
    ],
    method: [
      {
        n: '01',
        title: 'Establish the true baseline',
        desc: 'We start from your bank and your billing system, not from the ad platform. Everything else is measured against that. It is a dull fortnight and it is the only part that is non-negotiable.',
      },
      {
        n: '02',
        title: 'Rebuild the indigo',
        desc: 'Server-side events, deduplication, consent handling, and the offline conversions that most accounts never send back. This is where the reported numbers usually start moving.',
      },
      {
        n: '03',
        title: 'Test what claims credit',
        desc: 'Branded search, retargeting, and anything with suspiciously high reported return get a holdout. We size the test properly first — an underpowered test is worse than no test, because people act on it.',
      },
      {
        n: '04',
        title: 'Write down the rules',
        desc: 'Kill criteria, agreed in advance and in writing. It is much easier to shut a campaign off when the condition was set before anyone was emotionally attached to it.',
      },
    ],
    deliverables: [
      { label: 'Reconciliation: platform vs. booked revenue', cadence: 'Monthly' },
      { label: 'Variance explained, line by line', cadence: 'Monthly' },
      { label: 'Tracking health check', cadence: 'Fortnightly' },
      { label: 'Incrementality test design and readout', cadence: 'Quarterly' },
      { label: 'Kill criteria review', cadence: 'Quarterly' },
      { label: 'Model refresh, where spend justifies it', cadence: 'Half-yearly' },
    ],
    cta: {
      title: 'Find out what the gap is.',
      body: 'One month of platform exports and the matching revenue figure from your finance system. That is all we need to tell you how far apart they are.',
      label: 'Request a reconciliation',
    },
  },

  {
    slug: 'creative',
    navTitle: 'Creative',
    navDesc: 'Direct response production and testing',
    metaTitle: 'Direct Response Creative',
    metaDescription:
      'Direct response advertising built for volume and tested honestly. Static, video and UGC production briefed against named hypotheses, not a content calendar.',
    keywords: [
      'direct response creative',
      'ad creative agency',
      'UGC production',
      'creative testing',
      'performance creative',
      'video ads',
    ],
    hero: {
      eyebrow: 'Service 04',
      title: 'Enough ads to actually learn something.',
      lede: 'Roughly one concept in nine beats the thing it was trying to replace. That ratio has barely moved in six years, which means the only reliable route to better advertising is more attempts, tested properly and retired without sentiment.',
    },
    scope: [
      'Static, video and creator-led production, priced per batch rather than per revision round.',
      'Every asset briefed against a written hypothesis — what we think will work, and what result would prove us wrong.',
      'Structured testing: one variable at a time where it matters, and honest reporting when a test was too noisy to call.',
      'Creator sourcing, briefing and licensing, including the usage rights people forget to buy until the ad is working.',
      'Ad-level copy: hooks, captions and the first three seconds, which is where most of the outcome is decided.',
      'A shared library of what has already been tested, so nobody re-runs a losing concept in eighteen months.',
    ],
    notScope: [
      'Brand identity, positioning workshops, or a rebrand. Good work in that field exists; this is not it.',
      'Awards. We have never entered one and do not intend to.',
      'Unlimited revisions. Batches are fixed. Notes are welcome, but the eleventh round of changes to a losing ad is not a good use of your money.',
    ],
    figures: [
      { value: '1 in 9', label: 'Concepts that beat control', note: 'Trailing 12 months' },
      { value: '4.5 days', label: 'Median brief to live', note: 'Static and UGC' },
      { value: '2,140', label: 'Assets shipped', note: 'Trailing 12 months' },
      { value: '38%', label: 'Winners that came from a creator', note: 'Not from studio work' },
    ],
    method: [
      {
        n: '01',
        title: 'Mine what already worked',
        desc: 'Before writing anything we read your reviews, support tickets and sales calls. The best-performing line we shipped last year was lifted verbatim from a one-star review that had a point.',
      },
      {
        n: '02',
        title: 'Write the hypothesis down',
        desc: 'Each concept states what it is testing and what would falsify it. It sounds bureaucratic. It is what stops a team quietly declaring victory after the fact.',
      },
      {
        n: '03',
        title: 'Ship in batches',
        desc: 'Volume is the lever. Batches go out on a fixed cadence so the account always has something new entering rotation before fatigue sets in.',
      },
      {
        n: '04',
        title: 'Retire without sentiment',
        desc: 'Losers get cut on the agreed threshold, including the ones the founder liked. Winners get variants until the variants stop winning.',
      },
    ],
    deliverables: [
      { label: 'Creative batch, briefed and delivered', cadence: 'Fortnightly' },
      { label: 'Test results, wins and losses both', cadence: 'Fortnightly' },
      { label: 'Hook and concept backlog review', cadence: 'Monthly' },
      { label: 'Creator sourcing and licensing', cadence: 'Ongoing' },
      { label: 'Tested-concept library update', cadence: 'Ongoing' },
      { label: 'Source files and full usage rights', cadence: 'On delivery' },
    ],
    cta: {
      title: 'Show us your top five ads.',
      body: 'We will tell you what they have in common, what has probably fatigued, and the three concepts we would test against them first.',
      label: 'Request a creative review',
    },
  },
];

export const getServiceBySlug = (slug: string) => services.find((s) => s.slug === slug);
