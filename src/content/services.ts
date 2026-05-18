export type ServiceStat = { value: string; label: string };
export type ServiceMethod = { n: string; title: string; desc: string };

export type Service = {
  slug: 'seo' | 'ppc' | 'social-advertising' | 'web';
  navTitle: string;
  navDesc: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaLabel: string;
  };
  stats: { sectionTitle: string; items: ServiceStat[] };
  methodology: { sectionTitle: string; items: ServiceMethod[] };
  finalCta: { title: string; subtitle: string; ctaLabel: string };
};

export const services: Service[] = [
  {
    slug: 'seo',
    navTitle: 'SEO Services',
    navDesc: 'Organic growth & search visibility',
    metaTitle: 'SEO Services — Organic Growth That Compounds',
    metaDescription:
      'Turn organic search into your most predictable revenue channel. Technical SEO, content strategy, digital PR, and attribution — built for scale.',
    keywords: ['SEO services', 'technical SEO', 'organic search', 'content strategy', 'digital PR', 'link building'],
    hero: {
      eyebrow: 'Search Engine Optimization',
      title: 'Organic search,',
      titleAccent: 'engineered to compound.',
      subtitle:
        'Scalable, data-driven SEO engines for ambitious brands. We rank you where it matters — and tie every click to revenue.',
      ctaLabel: 'Get a free SEO audit',
    },
    stats: {
      sectionTitle: 'Organic impact.',
      items: [
        { value: '340%',  label: 'Avg. organic traffic lift' },
        { value: 'No. 1', label: 'Rankings secured' },
        { value: '3x',    label: 'Conversion rate uplift' },
        { value: '100%',  label: 'White-hat techniques' },
      ],
    },
    methodology: {
      sectionTitle: 'Our SEO methodology',
      items: [
        { n: '01', title: 'Technical SEO Framework',      desc: 'Flawless foundations: crawlability, indexation, site architecture, and Core Web Vitals tuned so nothing holds your rankings back.' },
        { n: '02', title: 'Content Strategy & Architecture', desc: 'Keyword research mapped to buyer intent. Authoritative topic clusters that capture high-value traffic and guide users to convert.' },
        { n: '03', title: 'Digital PR & Authority Building', desc: 'Targeted digital PR and strategic link acquisition. Placements on high-tier publications that build the trust signals algorithms demand.' },
        { n: '04', title: 'Data & Attribution Modeling',   desc: 'Custom dashboards integrating GA4, Search Console, and your CRM — so you prove the exact ROI of every organic session.' },
      ],
    },
    finalCta: {
      title: 'Stop losing customers to your competitors.',
      subtitle: 'Discover the exact technical errors and content gaps holding your site back. Speak with our lead strategists today.',
      ctaLabel: 'Request your technical audit',
    },
  },
  {
    slug: 'ppc',
    navTitle: 'PPC Services',
    navDesc: 'Paid search & performance ads',
    metaTitle: 'PPC Services — Paid Search That Turns Spend Into Profit',
    metaDescription:
      'High-performance paid media campaigns across Google, Bing, and premium networks. Lower CPAs, higher ROAS, full transparency.',
    keywords: ['PPC services', 'Google Ads management', 'paid search', 'ROAS optimization', 'performance marketing'],
    hero: {
      eyebrow: 'Pay-Per-Click Advertising',
      title: 'Ad spend in,',
      titleAccent: 'predictable profit out.',
      subtitle:
        'We engineer paid media campaigns across Google, Bing, and premium networks — tuned for efficiency, scaled for growth.',
      ctaLabel: 'Get a free account audit',
    },
    stats: {
      sectionTitle: 'Paid media impact.',
      items: [
        { value: '450%',  label: 'Average ROAS' },
        { value: '-32%',  label: 'Cost per acquisition' },
        { value: '$15M+', label: 'Ad spend managed' },
        { value: '24/7',  label: 'Bid optimization' },
      ],
    },
    methodology: {
      sectionTitle: 'Our paid media methodology',
      items: [
        { n: '01', title: 'Deep Account Audits',     desc: 'We dissect historical data to find wasted spend and missed opportunities — impression share, quality scores, competitor bidding.' },
        { n: '02', title: 'Intent-Driven Strategy',  desc: 'Granular campaign architectures aligned to buyer-cycle stages. You bid aggressively where it counts: high-intent, ready-to-convert.' },
        { n: '03', title: 'Creative & Copy Testing', desc: 'Systematic A/B testing of headlines, copy, and landing experiences — compounding CTR and conversion gains month over month.' },
        { n: '04', title: 'Algorithmic Bidding',     desc: 'Human strategy plus machine-learning scripts adjust bids by device, location, daypart, and audience signal for maximum capital efficiency.' },
      ],
    },
    finalCta: {
      title: 'Stop wasting money on bad clicks.',
      subtitle: 'Our certified specialists will review your ad accounts and show you exactly where you\'re losing money — within 48 hours.',
      ctaLabel: 'Request your PPC audit',
    },
  },
  {
    slug: 'social-advertising',
    navTitle: 'Social Advertising',
    navDesc: 'Paid social across all platforms',
    metaTitle: 'Paid Social Advertising — Scale Across Meta, LinkedIn, TikTok',
    metaDescription:
      'High-converting paid social campaigns across Meta, LinkedIn, TikTok, and X. Full-funnel architecture, scroll-stopping creative, aggressive testing.',
    keywords: ['paid social advertising', 'Meta ads', 'LinkedIn ads', 'TikTok ads', 'social media marketing'],
    hero: {
      eyebrow: 'Paid Social Media',
      title: 'Scale your brand,',
      titleAccent: 'profitably.',
      subtitle:
        'High-converting campaigns across Meta, LinkedIn, TikTok, and X — engineered to acquire customers, not just impressions.',
      ctaLabel: 'Audit my social ads',
    },
    stats: {
      sectionTitle: 'Scale with precision.',
      items: [
        { value: '3.8x',  label: 'Average blended ROAS' },
        { value: '-42%',  label: 'Customer acquisition cost' },
        { value: '50M+',  label: 'Targeted impressions' },
        { value: '250+',  label: 'Creatives tested / mo' },
      ],
    },
    methodology: {
      sectionTitle: 'Our paid social methodology',
      items: [
        { n: '01', title: 'Audience Intelligence',   desc: 'First-party data powers predictive audiences and lookalike models — so budget only reaches users with the highest propensity to buy.' },
        { n: '02', title: 'Scroll-Stopping Creative', desc: 'Creative is the new targeting. Our in-house team ships direct-response video, UGC-style content, and statics built for the modern feed.' },
        { n: '03', title: 'Full-Funnel Architecture', desc: 'Multi-stage funnels guide prospects from cold awareness through consideration into high-intent retargeting — and conversion.' },
        { n: '04', title: 'Rapid Testing & Scaling',  desc: 'Agile test framework isolating hooks, headlines, and CTAs. We identify winners fast and pour budget into what works.' },
      ],
    },
    finalCta: {
      title: 'Unlock your true growth potential.',
      subtitle: 'Ad fatigue? Rising CPAs? Let our experts analyze your account and build a roadmap back to profitability.',
      ctaLabel: 'Schedule a strategy session',
    },
  },
  {
    slug: 'web',
    navTitle: 'Web Services',
    navDesc: 'CRO, landing pages & web builds',
    metaTitle: 'Web Development & CRO — Sites Built to Convert',
    metaDescription:
      'Lightning-fast, conversion-optimized websites. UX design, full-stack builds, CRO, and performance engineering — the foundation of your growth engine.',
    keywords: ['web development', 'conversion rate optimization', 'CRO', 'landing page design', 'Next.js development'],
    hero: {
      eyebrow: 'High-Performance Web',
      title: 'Websites that',
      titleAccent: 'actually sell.',
      subtitle:
        'Lightning-fast, conversion-optimized builds that serve as the foundation for your scalable growth engine.',
      ctaLabel: 'Request a technical audit',
    },
    stats: {
      sectionTitle: 'Built for conversion.',
      items: [
        { value: '< 1s',  label: 'Average load time' },
        { value: '+45%',  label: 'Conversion rate uplift' },
        { value: '100',   label: 'Lighthouse score' },
        { value: '99.9%', label: 'Uptime guaranteed' },
      ],
    },
    methodology: {
      sectionTitle: 'Our development methodology',
      items: [
        { n: '01', title: 'UX/UI Design & Prototyping',  desc: 'User-centric interfaces rooted in behavioral psychology. Mapped journeys and high-fidelity prototypes that guide users to convert.' },
        { n: '02', title: 'Full-Stack Architecture',     desc: 'Scalable platforms on React, Next.js, and headless CMS. Clean, modular code that integrates seamlessly with your marketing stack.' },
        { n: '03', title: 'Conversion Rate Optimization', desc: 'Rigorous A/B and multivariate testing, heat-mapping, and friction analysis — systematically lifting the percentage of visitors who act.' },
        { n: '04', title: 'Performance & Security',      desc: 'Core Web Vitals obsession. Advanced caching, edge routing, and hardened security — so your site is both blazing-fast and bulletproof.' },
      ],
    },
    finalCta: {
      title: 'Upgrade your digital storefront.',
      subtitle: 'Is your current website leaking revenue? Our engineering team will surface the bottlenecks holding you back.',
      ctaLabel: 'Speak to an engineer',
    },
  },
];

export const getServiceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);