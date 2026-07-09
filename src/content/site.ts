export const site = {
  name: 'GrowthVireX',
  shortName: 'GrowthVireX',
  tagline: 'We make growth contagious.',
  url: 'https://www.growthvirex.com',
  description:
    'GrowthVireX is a growth studio that turns ambitious brands into category leaders. We engineer paid media, creative, and conversion systems that spread — turning every win into the next one.',
  keywords: [
    'growth marketing studio',
    'paid media agency',
    'creative ad production',
    'conversion optimization',
    'performance marketing',
    'Meta advertising',
    'Google advertising',
    'TikTok advertising',
    'GrowthVireX',
  ],
  locale: 'en_US',
  twitter: '@growthvirex',
  ogImage: '/images/og/default.jpg', // 1200x630
  contact: {
    email: 'contact@growthvirex.com',
    phone: '+1 (212) 695 1180',
    /** E.164, for `tel:` hrefs and schema.org. */
    phoneHref: '+12126951180',
    address: '450 Lexington Avenue, Floor 12, New York, NY 10017',
    postalAddress: {
      streetAddress: '450 Lexington Avenue, Floor 12',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10017',
      addressCountry: 'US',
    },
  },
  legal: {
    governingLaw: 'the State of New York',
    venue: 'New York County, New York',
  },
  social: {
    linkedin: '#',
    twitter: '#',
  },
} as const;
