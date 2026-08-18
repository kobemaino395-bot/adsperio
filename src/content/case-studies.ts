import type { ServiceSlug } from './services';

export type CaseMetric = { value: string; label: string };
export type CaseFact = { k: string; v: string };
export type CaseSection = { heading: string; body: string[] };

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  services: ServiceSlug[];
  /** One line for cards and listings. */
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  hero: { eyebrow: string; title: string; summary: string };
  /** The single number the study is about. */
  headline: CaseMetric;
  metrics: CaseMetric[];
  /** Ledger block — engagement facts, stated plainly. */
  facts: CaseFact[];
  sections: CaseSection[];
  /** What we got wrong. Every study has one; a case study without one is
   *  marketing, not a record. */
  costUs: string;
  testimonial?: { quote: string; author: string; role: string };
  publishedAt: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'harlow-supply',
    client: 'Harlow Supply',
    industry: 'Home goods · DTC',
    services: ['paid-social', 'creative', 'measurement'],
    tagline: 'We cut their ad spend by 22%. Revenue did not move.',
    metaTitle: 'Harlow Supply — 22% less spend, flat revenue',
    metaDescription:
      'A holdout test showed a third of Harlow Supply’s paid social was not incremental. We cut it. Revenue held, and contribution margin rose 9 points.',
    keywords: ['incrementality case study', 'paid social', 'DTC advertising', 'retargeting holdout'],
    hero: {
      eyebrow: 'Case 01 · Home goods',
      title: 'We cut their spend by 22%. Revenue did not move.',
      summary:
        'Harlow was spending $196K a month across Meta and TikTok at a reported 5.4x return. The reported number was wrong, and the way we proved it was by turning campaigns off and watching what happened.',
    },
    headline: { value: '−22%', label: 'Monthly ad spend' },
    metrics: [
      { value: '+0.4%', label: 'Revenue change' },
      { value: '+9.1pt', label: 'Contribution margin' },
      { value: '5.4x → 2.1x', label: 'Reported vs. reconciled' },
      { value: '6 wks', label: 'Time to the answer' },
    ],
    facts: [
      { k: 'Engagement', v: 'Ongoing since March 2024' },
      { k: 'Media under management', v: '$153K / month' },
      { k: 'Channels', v: 'Meta, TikTok' },
      { k: 'Team', v: 'One buyer, one creative lead, one analyst' },
    ],
    sections: [
      {
        heading: 'What we found',
        body: [
          'Harlow came to us wanting to scale. Their reported blended return was 5.4x, which would have made scaling the obvious move. The finance team, though, could not find that money. Revenue had been roughly flat for five months while spend had climbed 40%.',
          'That gap is the most common thing we see. It is almost always concentrated in two places: branded search and short-window retargeting, both of which are extremely good at taking credit for purchases that were already going to happen.',
        ],
      },
      {
        heading: 'What we did',
        body: [
          'We ran a geo holdout across 22 matched markets for six weeks. Retargeting and branded campaigns went dark in half of them. We sized the test first — a six-week window was the minimum that would let us detect a 10% effect at their volume, and we told Harlow up front that a shorter test would produce a number nobody should act on.',
          'The held-out markets did not decline. Retargeting was recouping demand that existed anyway. Broad prospecting, which had the least impressive reported return in the account, turned out to be the only thing reliably creating new customers.',
          'So we cut $43K a month of spend and moved a third of what remained into prospecting and creative production.',
        ],
      },
      {
        heading: 'Where it landed',
        body: [
          'Twelve months on, spend is 22% below where it started and revenue is within half a point of flat. Because the removed spend was almost pure cost, contribution margin rose just over nine points.',
          'This is a harder result to sell than a growth chart. It is also the one we are most confident in, because it came from an experiment rather than an attribution model.',
        ],
      },
    ],
    costUs:
      'Our fee is a percentage of managed spend. Cutting their spend cut our own revenue from this account by about 18%, and we did not have a good answer ready when their founder pointed that out. We have since moved new contracts to a flat monthly fee for exactly this reason.',
    testimonial: {
      quote:
        'They talked us out of spending more money. I have worked with nine agencies and that had never once happened.',
      author: 'Dana Whitfield',
      role: 'Founder, Harlow Supply',
    },
    publishedAt: '2026-03-04',
  },

  {
    slug: 'northbeam-freight',
    client: 'Northbeam Freight',
    industry: 'Logistics software · B2B',
    services: ['paid-search', 'measurement'],
    tagline: 'Half the leads, and twice the closed revenue.',
    metaTitle: 'Northbeam Freight — half the leads, twice the revenue',
    metaDescription:
      'Northbeam’s paid search was optimised toward form fills nobody could close. Feeding closed-won data back into bidding halved lead volume and doubled revenue.',
    keywords: ['B2B paid search', 'offline conversion tracking', 'lead quality', 'Google Ads B2B'],
    hero: {
      eyebrow: 'Case 02 · B2B software',
      title: 'Half the leads. Twice the closed revenue.',
      summary:
        'Northbeam’s search account was doing exactly what it had been told to do: produce cheap form fills. Nobody had told it which of those form fills the sales team could actually close.',
    },
    headline: { value: '2.1x', label: 'Closed-won revenue' },
    metrics: [
      { value: '−48%', label: 'Lead volume' },
      { value: '+164%', label: 'Lead-to-close rate' },
      { value: '−39%', label: 'Cost per closed deal' },
      { value: '14 wks', label: 'To steady state' },
    ],
    facts: [
      { k: 'Engagement', v: 'Ongoing since August 2024' },
      { k: 'Media under management', v: '$71K / month' },
      { k: 'Channels', v: 'Google, Microsoft' },
      { k: 'Sales cycle', v: '61 days median' },
    ],
    sections: [
      {
        heading: 'What we found',
        body: [
          'Cost per lead was $38 and the marketing team was reporting it proudly. The problem was on the other side of the handoff: sales was closing 1.4% of those leads, and a large share of them were owner-operators with a single truck looking at software priced for fleets of forty.',
          'The account was bidding toward a conversion event that had almost no relationship to revenue. It had been doing so for two years, very efficiently.',
        ],
      },
      {
        heading: 'What we did',
        body: [
          'We piped closed-won deals and deal values back into Google from their CRM as offline conversions, then moved bidding onto that indigo instead of form fills. We also cut a broad match campaign that was catching a lot of unrelated freight queries.',
          'Lead volume dropped almost immediately, which is uncomfortable for everyone involved. We agreed in advance with their CRO that lead count would fall by at least a third and that nobody would panic about it before week ten. Writing that down beforehand is what made the change survivable.',
        ],
      },
      {
        heading: 'Where it landed',
        body: [
          'By week fourteen the account had settled. Half the leads, a lead-to-close rate 164% higher, and closed-won revenue slightly more than doubled against the same budget.',
          'The sales team stopped complaining about lead quality, which their CRO describes as the actual deliverable.',
        ],
      },
    ],
    costUs:
      'We under-estimated the CRM work. The offline conversion pipe was quoted at two weeks and took seven, because deal stages had been renamed twice and the historical data could not be mapped cleanly. We ate the overrun, and we now scope a discovery week before quoting this kind of integration.',
    testimonial: {
      quote:
        'The first six weeks were genuinely unpleasant. They had warned us it would be, in writing, which is the only reason we held our nerve.',
      author: 'Priya Raghunathan',
      role: 'Chief Revenue Officer, Northbeam Freight',
    },
    publishedAt: '2026-01-21',
  },

  {
    slug: 'verity-labs',
    client: 'Verity Labs',
    industry: 'Supplements · DTC',
    services: ['creative', 'paid-social'],
    tagline: 'Nine months of testing to find four ads that mattered.',
    metaTitle: 'Verity Labs — 412 concepts, 4 that mattered',
    metaDescription:
      'Verity Labs had a creative bottleneck, not a media one. 412 tested concepts later, four assets carry most of the account.',
    keywords: ['creative testing', 'UGC advertising', 'supplements marketing', 'DTC creative'],
    hero: {
      eyebrow: 'Case 03 · Supplements',
      title: '412 concepts. Four that mattered.',
      summary:
        'Verity had a good product, a competent media buyer and a creative pipeline producing six assets a month. The account was not media-constrained. It was starved of things to test.',
    },
    headline: { value: '412', label: 'Concepts tested in 9 months' },
    metrics: [
      { value: '4', label: 'Assets carrying 61% of spend' },
      { value: '−29%', label: 'Cost per acquisition' },
      { value: '+2.4x', label: 'Monthly spend absorbed' },
      { value: '11%', label: 'Concepts that beat control' },
    ],
    facts: [
      { k: 'Engagement', v: 'Ongoing since November 2024' },
      { k: 'Media under management', v: '$214K / month' },
      { k: 'Output', v: '40–55 assets per month' },
      { k: 'Creators', v: '31 under licence' },
    ],
    sections: [
      {
        heading: 'What we found',
        body: [
          'Every scaling problem at Verity traced back to the same constraint. Six new assets a month meant roughly one test a week, which meant that finding a winner at an 11% hit rate took two months of calendar time. The account could not absorb more budget because it ran out of things to say long before it ran out of audience.',
        ],
      },
      {
        heading: 'What we did',
        body: [
          'We took production to 40–55 assets a month, sourced through a rotating roster of creators rather than a studio. Each concept shipped with a written hypothesis and a stated threshold for being killed.',
          'The most useful input turned out to be their support inbox. Three of the four assets that now carry the account came from complaints — specifically, from customers explaining what they had wrongly assumed the product did before buying it.',
        ],
      },
      {
        heading: 'Where it landed',
        body: [
          'Of 412 tested concepts, 46 beat control and four of those are still running a year later, carrying 61% of spend between them. Cost per acquisition is down 29% while monthly budget has grown 2.4x.',
          'The uncomfortable arithmetic: 366 concepts lost. That is the cost of the four that did not.',
        ],
      },
    ],
    costUs:
      'We spent about $60K of Verity’s production budget in the first quarter on high-production studio video because it was what the brand team wanted. Almost none of it worked. We should have argued harder, earlier, and we now cap studio spend at 20% of a first-quarter production budget until there is evidence either way.',
    publishedAt: '2025-11-12',
  },

  {
    slug: 'orpheus-audio',
    client: 'Orpheus Audio',
    industry: 'Consumer electronics',
    services: ['paid-social', 'creative', 'paid-search'],
    tagline: 'A launch that sold out, and the inventory maths behind it.',
    metaTitle: 'Orpheus Audio — a launch sized to its inventory',
    metaDescription:
      'Orpheus had 4,100 units and one shot. We planned the launch backwards from stock rather than forwards from budget.',
    keywords: ['product launch advertising', 'consumer electronics marketing', 'launch strategy'],
    hero: {
      eyebrow: 'Case 04 · Consumer electronics',
      title: '4,100 units. One shot at the quarter.',
      summary:
        'Most launch plans start with a budget and hope demand shows up. Orpheus had a hard inventory ceiling and a twelve-week production lead time, so we planned the whole thing backwards from the stock.',
    },
    headline: { value: '38 days', label: 'To sell through' },
    metrics: [
      { value: '4,100', label: 'Units, all sold' },
      { value: '$71', label: 'Cost per unit acquired' },
      { value: '2.9x', label: 'Launch-window return' },
      { value: '18%', label: 'Waitlist conversion' },
    ],
    facts: [
      { k: 'Engagement', v: 'Project — 14 weeks' },
      { k: 'Launch budget', v: '$291K' },
      { k: 'Channels', v: 'Meta, TikTok, YouTube, Google' },
      { k: 'Constraint', v: '4,100 units, no restock for 12 weeks' },
    ],
    sections: [
      {
        heading: 'What we found',
        body: [
          'The brief was to generate as much launch demand as possible. That is the wrong objective when stock is fixed: demand you cannot fill is a refund queue and a pile of disappointed people who will not come back.',
          'We reframed it. The job was to sell 4,100 units at the lowest acquisition cost, and to keep enough demand warm to matter when the restock landed twelve weeks later.',
        ],
      },
      {
        heading: 'What we did',
        body: [
          'Eight weeks of waitlist building before launch, deliberately under-spent, at a cost per signup of $2.40. On launch day we opened to the waitlist only, which sold 1,600 units in 40 hours with almost no media cost attached.',
          'Paid then ran against the remaining 2,500 units with a daily pacing model tied to units left rather than to budget. When sell-through ran ahead, we throttled. Twice we paused entirely for a day.',
        ],
      },
      {
        heading: 'Where it landed',
        body: [
          'Sold through in 38 days at $71 per unit acquired. The waitlist that had not converted became the restock audience and 18% of them bought in the second window.',
          'The number Orpheus cares about is that they took no stockout backorders, which had cost them badly on the previous generation.',
        ],
      },
    ],
    costUs:
      'We throttled too aggressively in week three. Sell-through was tracking ahead so we pulled spend for 48 hours, and the algorithm lost its learning; the recovery cost roughly four days of efficiency. A gentler pacing curve would have been cheaper than the pause.',
    testimonial: {
      quote:
        'They spent less than we authorised and told us why. That is not the usual direction of that conversation.',
      author: 'Tomas Egede',
      role: 'VP Commercial, Orpheus Audio',
    },
    publishedAt: '2025-09-30',
  },

  {
    slug: 'castellan-legal',
    client: 'Castellan Legal',
    industry: 'Legal services · 19 offices',
    services: ['paid-search', 'measurement'],
    tagline: 'Nineteen offices bidding against each other. We stopped that first.',
    metaTitle: 'Castellan Legal — 19 offices, one account',
    metaDescription:
      'Castellan’s offices each ran their own Google Ads account and competed in the same auctions. Consolidation cut cost per matter 44%.',
    keywords: ['legal marketing', 'multi-location paid search', 'Google Ads consolidation'],
    hero: {
      eyebrow: 'Case 05 · Legal services',
      title: 'Nineteen offices, bidding against each other.',
      summary:
        'Castellan’s offices each ran their own agency, their own Google Ads account, and their own budget. In four metros they were the top two bidders in the same auction, paying each other’s premium.',
    },
    headline: { value: '−44%', label: 'Cost per signed matter' },
    metrics: [
      { value: '19 → 1', label: 'Ad accounts' },
      { value: '+27%', label: 'Signed matters' },
      { value: '−31%', label: 'Blended cost per click' },
      { value: '4 metros', label: 'Where they self-competed' },
    ],
    facts: [
      { k: 'Engagement', v: 'Ongoing since June 2023' },
      { k: 'Media under management', v: '$118K / month' },
      { k: 'Offices', v: '19 across 11 states' },
      { k: 'Practice areas', v: '6' },
    ],
    sections: [
      {
        heading: 'What we found',
        body: [
          'Nobody had done the obvious audit, because no single person had access to all nineteen accounts. Once we did, four metros showed Castellan occupying two of the top three positions on the same high-value queries. They were bidding their own cost per click up, then paying a premium to win against themselves.',
        ],
      },
      {
        heading: 'What we did',
        body: [
          'Consolidation into one account with geo-partitioned campaigns, which is technically simple and politically hard. Each office had a partner who considered their budget theirs. We spent more time on that than on the account work, and the thing that resolved it was a per-office ledger showing exactly what each location spent and signed, published internally every month.',
          'Then the ordinary work: negative keyword hygiene across practice areas, call tracking tied to matters signed rather than calls received, and bidding moved onto signed-matter value.',
        ],
      },
      {
        heading: 'Where it landed',
        body: [
          'Blended cost per click fell 31% almost immediately once they stopped competing with themselves. Cost per signed matter is down 44% and signed matters are up 27% on a budget that has barely changed.',
        ],
      },
    ],
    costUs:
      'The rollout took eleven months instead of the four we projected, entirely because we treated it as a technical migration when it was an internal politics problem. We should have asked for a named executive sponsor on day one. We now make that a condition of multi-location work.',
    testimonial: {
      quote:
        'The monthly ledger did more for internal alignment than two years of partner meetings. Nobody argues with their own numbers in a shared column.',
      author: 'Marguerite Osei',
      role: 'Chief Operating Officer, Castellan Legal',
    },
    publishedAt: '2025-07-16',
  },
];

export const getCaseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
