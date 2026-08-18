export const site = {
  name: 'AdsPerio',
  shortName: 'AdsPerio',
  legalName: 'AdsPerio LLC',
  tagline: 'Ads, laid bare.',
  url: 'https://www.adsperio.com',
  description:
    'AdsPerio is a performance advertising firm. We buy the media, build the creative, and reconcile every dollar of spend against revenue you can verify in the bank.',
  keywords: [
    'performance advertising agency',
    'paid media agency',
    'marketing measurement',
    'media mix modeling',
    'incrementality testing',
    'Google Ads management',
    'Meta ads agency',
    'creative production',
    'AdsPerio',
  ],
  locale: 'en_US',
  twitter: '@adsperio',
  founded: '2019',

  /** The name is Ads + *aperio* (Latin: to uncover, to lay open). The
   *  about page tells this story; keeping it here stops it drifting. */
  brand: {
    etymology: 'aperio',
    etymologyLanguage: 'Latin',
    etymologyGloss: 'to uncover; to lay open; to bring to light',
    pronunciation: 'ads-PEER-ee-oh',
  },

  contact: {
    email: 'hello@adsperio.com',
    newBusiness: 'newbusiness@adsperio.com',
    careers: 'careers@adsperio.com',
    press: 'press@adsperio.com',
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
    hours: 'Monday to Friday, 9:00–18:00 ET',
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

/** The four numbers we are willing to be held to. Used on the home page
 *  and in the footer; kept in one place so they can never disagree. */
export const houseNumbers = [
  { value: '$84M', label: 'Media under management', note: 'Trailing 12 months' },
  { value: '1.9pt', label: 'Median reporting variance', note: 'Platform vs. reconciled' },
  { value: '31', label: 'Active accounts', note: 'Across 6 categories' },
  { value: '6.4 yr', label: 'Median client tenure', note: 'Of accounts still open' },
] as const;
