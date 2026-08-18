export type Testimonial = {
  slug: string;
  author: string;
  role: string;
  company: string;
  caseSlug?: string;
  quote: string;
};

/** Kept short and specific. No portraits — see MonogramPlate. A quote that
 *  could have been written about any agency has been cut. */
export const testimonials: Testimonial[] = [
  {
    slug: 'dana-whitfield',
    author: 'Dana Whitfield',
    role: 'Founder',
    company: 'Harlow Supply',
    caseSlug: 'harlow-supply',
    quote:
      'They talked us out of spending more money. I have worked with nine agencies and that had never once happened.',
  },
  {
    slug: 'priya-raghunathan',
    author: 'Priya Raghunathan',
    role: 'Chief Revenue Officer',
    company: 'Northbeam Freight',
    caseSlug: 'northbeam-freight',
    quote:
      'The first six weeks were genuinely unpleasant. They had warned us it would be, in writing, which is the only reason we held our nerve.',
  },
  {
    slug: 'marguerite-osei',
    author: 'Marguerite Osei',
    role: 'Chief Operating Officer',
    company: 'Castellan Legal',
    caseSlug: 'castellan-legal',
    quote:
      'The monthly ledger did more for internal alignment than two years of partner meetings. Nobody argues with their own numbers in a shared column.',
  },
  {
    slug: 'tomas-egede',
    author: 'Tomas Egede',
    role: 'VP Commercial',
    company: 'Orpheus Audio',
    caseSlug: 'orpheus-audio',
    quote:
      'They spent less than we authorised and told us why. That is not the usual direction of that conversation.',
  },
];
