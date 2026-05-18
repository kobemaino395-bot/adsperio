export type NewsletterIssue = {
  slug: string;
  issueNo: number;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: 'Paid Social' | 'SEO' | 'Creative' | 'Analytics' | 'CRO';
  keywords: string[];
  body: Block[];
};

export type Block =
  | { type: 'p';      text: string }
  | { type: 'h2';     text: string }
  | { type: 'h3';     text: string }
  | { type: 'quote';  text: string; cite?: string }
  | { type: 'list';   items: string[] }
  | { type: 'callout'; text: string };

export const issues: NewsletterIssue[] = [
  {
    slug: 'linkedin-b2b-ads-burning-cash',
    issueNo: 142,
    title: 'Why your B2B LinkedIn ads are probably burning cash.',
    excerpt:
      'A look at the four patterns we keep running into when we audit B2B LinkedIn accounts. Your mileage may vary, but we see these a lot.',
    publishedAt: '2026-04-08',
    readTime: '7 min read',
    category: 'Paid Social',
    keywords: ['LinkedIn Ads', 'B2B marketing', 'paid social', 'CAC reduction'],
    body: [
      { type: 'p', text: 'A client last month showed us their LinkedIn spend: $58K a month, and they were ready to pull the plug on the channel. We\'ve seen versions of this conversation maybe forty times in the past year and a half. Usually the channel isn\'t actually broken. Usually the account is just being run the way you\'d run Meta, which does not work.' },
      { type: 'p', text: 'LinkedIn is expensive. That part is real. CPMs in the $30+ range are normal now, sometimes $50 for senior-level targeting. What that means is you have less margin for sloppy execution than on any other platform. Here\'s what we see go wrong, roughly in order of how often we see it.' },

      { type: 'h2', text: 'The audience is too small' },
      { type: 'p', text: 'This one is counterintuitive, and I remember being wrong about it for a long time myself. A 6,000-person audience of "perfect-fit" titles at 12 target accounts sounds like precision targeting. It\'s not. LinkedIn\'s algorithm needs a pool big enough to learn from, and when you hand it 6,000 people it just shows ads to whoever is easiest to reach — which tends to be people scrolling a lot, which tends to mean interns.' },
      { type: 'p', text: 'Our rule of thumb is 100K+ audience size for cold prospecting. You narrow through creative and offer, not through layered filters. If you have strict ICP constraints, you use an inclusion list at the company level and leave seniority/function broad.' },
      { type: 'callout', text: 'The exception is ABM plays where you\'re running to a named account list under 500 companies. That\'s a different motion entirely — treat those separately, don\'t mix them into your prospecting campaigns.' },

      { type: 'h2', text: 'The creative is a repurposed webinar' },
      { type: 'p', text: 'I can spot a repurposed YouTube clip on LinkedIn from four feet away. So can everyone else. 16:9, an intro card, corporate music — the feed trains people to scroll past that in about a second.' },
      { type: 'p', text: 'What works right now, in our testing: 9:16 or 1:1 video, shot vertically, captions baked in, someone (ideally a founder or subject-matter expert) talking to camera like it\'s a FaceTime call. Production value is actively bad for performance here. We have a client whose highest-performing ad in 2026 is their CEO filmed in what is clearly a hotel room in Berlin. It\'s been running for three months.' },

      { type: 'h2', text: 'The offer is a demo for cold traffic' },
      { type: 'p', text: 'You don\'t walk up to strangers at a conference and ask them to book a 45-minute call with your sales team. That\'s what "Book a demo" ads to cold traffic are.' },
      { type: 'p', text: 'Better sequencing, in general terms:' },
      { type: 'list', items: [
        'Cold — give something useful. A benchmark report, a teardown, a calculator. No gating, or gating just with an email.',
        'Warm (7–30 day retargeting) — a middle step. A webinar, a product tour, an assessment.',
        'Hot (people who\'ve engaged multiple times) — now you can ask for the demo.',
      ]},
      { type: 'p', text: 'You can compress this if you have strong brand recognition. Most B2B brands don\'t, and they try to compress it anyway.' },

      { type: 'h2', text: 'You\'re trusting LinkedIn\'s own attribution' },
      { type: 'p', text: 'LinkedIn is, understandably, generous to itself when crediting conversions. Every platform is. The in-platform dashboard will tell you a story that usually overstates real impact by a decent margin.' },
      { type: 'p', text: 'We don\'t have a magic fix for this. What we do: tag every lead in the CRM with first-touch and last-touch UTMs, look at multi-touch paths weekly, and run the occasional pause test on specific campaigns to see whether revenue actually drops when we turn them off. Sometimes it doesn\'t, which is its own useful information.' },

      { type: 'quote', text: 'Half the "high-ROAS" LinkedIn campaigns we\'ve pause-tested didn\'t meaningfully move pipeline when we turned them off. The other half turned out to be the most incremental spend in the account.', cite: 'Internal note from our paid media lead, Jan 2026' },

      { type: 'h2', text: 'So is LinkedIn worth it?' },
      { type: 'p', text: 'For most B2B with a $30K+ ACV, yes — if you run it like LinkedIn and not like Meta. For everything else, it\'s probably not your first channel. We\'ve told plenty of clients to turn it off entirely and put the budget into Google or content. That\'s fine too.' },
      { type: 'p', text: 'If you\'re in the middle of burning spend right now: start with the audience size. That one change alone usually pulls CPA down 20–30% inside two weeks, and it costs nothing.' },
    ],
  },

  {
    slug: 'technical-seo-enterprise-checklist',
    issueNo: 141,
    title: 'Our actual technical SEO audit checklist.',
    excerpt:
      'Most audit decks are theater. This is the shorter, grumpier list we actually run against enterprise sites — in priority order.',
    publishedAt: '2026-04-01',
    readTime: '9 min read',
    category: 'SEO',
    keywords: ['technical SEO', 'enterprise SEO', 'SEO audit', 'Core Web Vitals'],
    body: [
      { type: 'p', text: 'I have opinions about SEO audits. Specifically: most of them are too long, most of them aren\'t prioritized, and most of them include a huge pile of warnings from Screaming Frog that the client then spends six months trying to clear, none of which actually moves traffic.' },
      { type: 'p', text: 'This is roughly the list we run when we onboard a new enterprise client. It\'s in order of what tends to matter most. We don\'t always check every item — sometimes we\'re 3 bullets in and realize the problem is somewhere else entirely. But this is the default starting point.' },

      { type: 'h2', text: 'Can Google get to your pages?' },
      { type: 'p', text: 'Seems basic. Is not. Every couple of months we onboard someone whose robots.txt is silently blocking a high-value directory because someone added a rule in 2021 and nobody remembers why.' },
      { type: 'list', items: [
        'robots.txt reviewed line by line. If you don\'t know why a Disallow is there, delete it (after backing it up).',
        'XML sitemap exists, returns 200, and matches the URLs you actually want indexed. Sitemaps listing redirected or noindexed URLs are surprisingly common.',
        'Orphan pages — anything indexable but unlinked from the rest of the site. Usually old campaign pages or legacy blog posts.',
        'Click depth: your money pages should be reachable within 3 clicks of the homepage. Past that, Google deprioritizes them.',
      ]},

      { type: 'h2', text: 'Is it getting indexed, and are the right URLs being treated as canonical?' },
      { type: 'p', text: 'This is where most enterprise sites lose the plot. Faceted nav, session IDs, tracking parameters, internationalization — any one of these done wrong can bloat Google\'s crawl budget and leave your real pages under-crawled.' },
      { type: 'list', items: [
        'Canonical tags are self-referencing on the URL you want indexed. Not a redirect chain away.',
        'Faceted / filter URLs are canonicalized or noindexed — one of the two, consistently.',
        'GSC Pages report: indexed count vs sitemap count should be close. A big gap is a signal to dig.',
        'No accidental noindex on important pages. Check templates, not just samples. We\'ve seen a single misplaced noindex tag knock an entire category off the index.',
      ]},

      { type: 'h2', text: 'Core Web Vitals' },
      { type: 'p', text: 'Still a ranking factor in 2026. More importantly, slow sites convert worse — so even when rankings don\'t budge, you usually see a CVR lift from fixing these. Use CrUX data (real users) not Lighthouse lab scores.' },
      { type: 'list', items: [
        'LCP under 2.5s at the 75th percentile on mobile. Hero images are the usual culprit.',
        'CLS under 0.1. Watch for late-loading ads, embedded videos without dimensions, and web fonts swapping.',
        'INP under 200ms. This one is harder than the old FID. Usually it\'s third-party JS — tag managers, chat widgets, session replay tools all stacked up.',
      ]},
      { type: 'callout', text: 'A fun one we hit last year: a client\'s chat widget was adding 1.8 seconds of INP on every page. It had been there for two years. Nobody had connected it to traffic decline. We disabled it, traffic came back in six weeks.' },

      { type: 'h2', text: 'Structured data' },
      { type: 'p', text: 'Easy to implement, easy to get wrong, genuinely does help with rich results and (we suspect, though Google is cagey) with general understanding of your pages.' },
      { type: 'list', items: [
        'Organization schema on the homepage.',
        'BreadcrumbList on every inner page.',
        'Product / Article / FAQPage schema where applicable.',
        'Validate in the Rich Results Test, not just Schema.org. Google is stricter than the spec.',
      ]},

      { type: 'h2', text: 'What we don\'t audit (on purpose)' },
      { type: 'p', text: 'Meta description pixel length. Title tag tweaks for "power words." Keyword density. LSI keywords, whatever those are supposed to be in 2026. Most content plugins\' "SEO scores." These are all either noise or actively outdated.' },
      { type: 'p', text: 'If you\'re getting an audit back that spends more time on those than on the four sections above, ask for your money back.' },
    ],
  },

  {
    slug: 'creative-fatigue-ad-testing-loop',
    issueNo: 140,
    title: 'How we keep creative from going stale (imperfectly).',
    excerpt:
      'The production workflow we use for paid social creative. It\'s less systematic than it sounds and we still get it wrong constantly.',
    publishedAt: '2026-03-25',
    readTime: '6 min read',
    category: 'Creative',
    keywords: ['creative testing', 'ad fatigue', 'UGC', 'performance creative'],
    body: [
      { type: 'p', text: 'Creative fatigue is real and has gotten worse. A winning ad used to have 8–12 weeks of useful life on Meta. Now it\'s 3–5 weeks at scale, faster on TikTok. You can\'t produce your way out of that with a traditional studio pipeline — the math doesn\'t work.' },
      { type: 'p', text: 'So here\'s the workflow we use. I want to be upfront: it is not elegant, it doesn\'t always work, and we rework parts of it every quarter. But it beats what most in-house teams are running.' },

      { type: 'h2', text: 'Think in hooks, not ads' },
      { type: 'p', text: 'An "ad" is the finished thing. A "hook" is the first 2–3 seconds: the sentence, visual, or motion that makes someone stop scrolling. 90% of performance is decided in the hook. The rest of the ad mostly exists to not lose the people the hook caught.' },
      { type: 'p', text: 'So when we brief creators, we don\'t ask for ads. We ask for 6 hooks on a concept, each 4–8 seconds long. We stitch them to a common middle and end. One 90-minute shoot yields 12–18 testable variants that way.' },

      { type: 'h2', text: 'Creators beat studios for this kind of work' },
      { type: 'p', text: 'Controversial with creative directors, but: briefed creator content outperforms polished brand content on paid social about 3 times out of 4 in our tests. It\'s cheaper ($300–600 per deliverable vs. $5K+ for studio), faster (5-day turnaround), and looks native to the feed.' },
      { type: 'p', text: 'The hard part isn\'t finding creators. It\'s briefing them well. A bad brief produces bad content no matter who shoots it. Our briefs include the hook we want, a reference video showing the vibe, the product claim we can and can\'t make (legal stuff matters), and a hard no-list.' },
      { type: 'callout', text: 'We keep a running panel of 15–25 creators per client and rotate them. No single creator\'s face should carry more than 25% of active creative — if they burn out on one account they\'re done for the brand.' },

      { type: 'h2', text: 'The weekly cadence' },
      { type: 'p', text: 'Roughly — we flex this all the time based on account size and how things are performing:' },
      { type: 'list', items: [
        'Monday: pull last week\'s results. Kill anything underperforming by 30%+ vs account CPA. Scale things that are beating CPA by 30%+.',
        'Tuesday: brief next week\'s batch. Usually 2–3 concepts × 4 hooks.',
        'Wednesday–Thursday: receive footage, flag anything unusable.',
        'Friday: edit, upload, launch into the test campaign with small budgets.',
      ]},
      { type: 'p', text: 'You\'ll notice this doesn\'t give you time to be precious about anything. That\'s intentional. Most variants won\'t win. Volume is the point.' },

      { type: 'h2', text: 'What I still get wrong' },
      { type: 'p', text: 'We over-invest in hooks that worked 6 months ago and keep trying to resurrect them. The audience has moved on. I know this and still do it. I think most paid social teams do.' },
      { type: 'p', text: 'The other thing — we sometimes test too many variants too fast and don\'t give any of them enough data to judge fairly. You need at least $300–500 in spend per variant on a mid-ACV product before the numbers mean anything. Below that you\'re reading noise.' },
    ],
  },

  {
    slug: 'attribution-2026-platform-blackouts',
    issueNo: 139,
    title: 'Attribution in 2026, or: we don\'t really know, and that\'s fine.',
    excerpt:
      'Last-click attribution has been degrading for years. Here\'s how we\'re thinking about it now, and what we\'ve stopped promising clients.',
    publishedAt: '2026-03-18',
    readTime: '8 min read',
    category: 'Analytics',
    keywords: ['marketing attribution', 'multi-touch attribution', 'incrementality', 'privacy'],
    body: [
      { type: 'p', text: 'I\'m going to say something that will make half of you uncomfortable: session-level attribution is essentially dead in 2026, and no tool is going to bring it back. Not Triple Whale, not HockeyStack, not whatever you saw on LinkedIn yesterday. These tools are useful — we use a couple of them — but they don\'t solve the underlying problem, which is that user journeys are now genuinely invisible.' },
      { type: 'p', text: 'iOS 14 started it in 2021. Chrome finally deprecated third-party cookies in 2025. AI overviews are eating clicks. Half of your buyers are researching in ChatGPT and Claude and you\'ll never see those sessions. A customer discovers you on TikTok, mentions you to a colleague in Slack, gets an email weeks later, types your URL directly, and converts. Your attribution model credits "Direct / None."' },
      { type: 'p', text: 'So what do we do? Here\'s the honest version.' },

      { type: 'h2', text: 'Accept that you have three imperfect lenses' },
      { type: 'list', items: [
        'Platform-reported metrics (what Meta, Google, LinkedIn say they drove). Directional, biased toward themselves. Fine for within-channel optimization.',
        'Server-side CRM attribution (first-touch and last-touch UTMs stored on the lead record). Our working source of truth for channel mix.',
        'Incrementality (pause tests, geo-holdouts, MMM). The only thing that answers "did this channel cause revenue" — but slow and expensive to run.',
      ]},
      { type: 'p', text: 'None of these is true on its own. Together they triangulate.' },

      { type: 'h2', text: 'Pause tests are underrated' },
      { type: 'p', text: 'The cheapest honest attribution test is: turn a channel off for two weeks and see if revenue drops. Everyone finds reasons not to do this. Almost everyone who does it is surprised by the result in at least one direction.' },
      { type: 'p', text: 'We ran a pause test last year on a client\'s branded Google Ads spend — $32K/month. Conventional wisdom: branded search is always incremental, always keep it on. Our test: 78% of that spend was picking up traffic that would have converted anyway through organic. We reallocated $25K/month and nothing bad happened.' },
      { type: 'callout', text: 'Run one pause test per quarter on your biggest channel. Worst case you learn it\'s incremental and sleep better. Best case you find the money you\'re leaving on the table.' },

      { type: 'h2', text: 'What we\'ve stopped telling clients' },
      { type: 'p', text: 'We no longer claim a specific ROAS on paid social with two decimal places. We give a range. We explain that the low end is probably closer to true. This goes over badly in sales calls and well in quarterly reviews.' },
      { type: 'p', text: 'We also stopped building multi-touch attribution dashboards for most clients. They created a false sense of precision. A good marketing dashboard in 2026 has: total revenue, blended CAC, channel-level first/last touch from CRM, and a running list of what incrementality tests are planned or in-flight. That\'s it.' },

      { type: 'h2', text: 'The bottom line' },
      { type: 'p', text: 'Stop trying to prove exactly which ad drove which dollar. You can\'t, and the people selling you the dream can\'t either. Focus on: is total revenue growing, is blended CAC stable or improving, and do we have a good story to tell the board. That story doesn\'t need to be precise to be honest.' },
    ],
  },

  {
    slug: 'landing-page-teardown-7-fixes',
    issueNo: 138,
    title: 'Seven landing page changes that added up to 43%.',
    excerpt:
      'A real CRO project from last quarter. Some of these lifts are bigger than they should be, some are smaller. The total is what matters.',
    publishedAt: '2026-03-11',
    readTime: '10 min read',
    category: 'CRO',
    keywords: ['landing page optimization', 'conversion rate optimization', 'CRO', 'SaaS marketing'],
    body: [
      { type: 'p', text: 'Last quarter we reworked the primary landing page for a B2B SaaS client — I\'ll leave them nameless. Original baseline was 2.1% conversion to demo request. Ending CVR after a 3-week sprint was 3.0%. Net lift of 43%.' },
      { type: 'p', text: 'I want to write this one up honestly because a lot of CRO case studies read like every change was heroic. Most of them weren\'t. Two of the changes did most of the work; the other five were small wins that added up. Here they are, roughly ordered by impact.' },

      { type: 'h2', text: '1. Rewrote the headline' },
      { type: 'p', text: 'This was the biggest single lift, probably around +18% on its own, though it\'s hard to isolate cleanly.' },
      { type: 'p', text: 'The original headline was something like "Engineering momentum for modern teams." I don\'t know what that means and neither did half the people who landed on the page. New version: "Ship code 40% faster — without hiring more engineers." Specific outcome, specific number, specific constraint that their ICP feels in their bones.' },
      { type: 'p', text: 'There\'s a temptation, especially with brand-conscious clients, to be clever on the headline. Clever is fine for awareness campaigns. On a landing page getting paid traffic, clear beats clever every time.' },

      { type: 'h2', text: '2. Shortened the demo form' },
      { type: 'p', text: 'From 9 fields to 4. We cut phone, company size, industry, use case, and how-did-you-hear. Every field you require costs you somewhere between 1–3% of conversions. Fields the sales team asks again on the call anyway are pure friction.' },
      { type: 'p', text: 'This lifted CVR around +7%. The sales team pushed back because they thought lead quality would drop. It didn\'t. Turns out making someone type their phone number before a demo doesn\'t make them a better lead.' },

      { type: 'h2', text: '3. Moved social proof above the fold' },
      { type: 'p', text: 'Customer logos and one specific testimonial with a number in it. Previously these lived two screens down. Now they\'re visible without scrolling. About +5%. Standard advice, still works.' },

      { type: 'h2', text: '4. Added an interactive product tour' },
      { type: 'p', text: 'A 45-second click-through of the product, gated nowhere, above the demo form. This is slightly counterintuitive because you\'re giving people a way to satisfy their curiosity without converting. But the people who come back after watching convert at a much higher rate, and the ones who don\'t come back probably wouldn\'t have converted anyway.' },
      { type: 'p', text: 'Maybe +5% on CVR, and a meaningful improvement in sales-call show rates because prospects came in better informed. Harder to measure cleanly.' },

      { type: 'h2', text: '5. Rewrote feature copy as outcomes' },
      { type: 'p', text: '"Real-time collaboration with unlimited users" became "Your whole team in the same doc, no version conflicts." Small lift, maybe +3%. This one is mostly hygiene — doesn\'t hurt to do, doesn\'t hurt not to.' },

      { type: 'h2', text: '6. Sticky mobile CTA' },
      { type: 'p', text: '+1% blended, but more like +4% on mobile alone, which is where all the gains on landing pages live these days. Easy implementation, no design cost.' },

      { type: 'h2', text: '7. Sped up LCP' },
      { type: 'p', text: 'From 3.4s to 1.1s. This one is interesting: measured CVR barely moved on the existing traffic. But bounce rate dropped 22%, which means the funnel was getting more qualified visitors further down. Whether that shows up as CVR depends on what stage you\'re measuring at. I count it as a win, but I wouldn\'t have built a whole project around it.' },

      { type: 'h2', text: 'What this doesn\'t tell you' },
      { type: 'p', text: 'We had clean data. Enough traffic to run these sequentially with confidence (about 40K visits/month). A buyer\'s committee that was willing to approve changes in under 48 hours. Most of that is not typical.' },
      { type: 'p', text: 'Also — I\'ll admit it — we got lucky on the headline. I\'ve had headline rewrites move CVR by 1%. This one moved it by 18%. That\'s a tail event, not the expected value. If you\'re budgeting for a CRO engagement, don\'t assume that one.' },
      { type: 'callout', text: 'The actual lesson: there isn\'t one big thing. Seven specific decisions, most of them free to make, stacked into a meaningful number. That\'s how CRO works when it works.' },
    ],
  },
];

export const getIssueBySlug = (slug: string) =>
  issues.find((i) => i.slug === slug);