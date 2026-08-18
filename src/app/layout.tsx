import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { site } from '@/content/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HiringBanner from '@/components/layout/HiringBanner';

/* Söhne is licensed, so the system runs on Inter — the substitute the design
 * spec itself names. Variable, so weight 300 (display) and 400/500 (UI) all
 * come from one file. */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/* Mono is scoped to the faux-console panels in the product mockups. It never
 * appears in page chrome. Not variable, so the weights are explicit. */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: site.twitter,
    creator: site.twitter,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1a2f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  alternateName: 'AdsPerio LLC',
  url: site.url,
  logo: `${site.url}/favicon.svg`,
  description: site.description,
  email: site.contact.email,
  telephone: site.contact.phoneHref,
  foundingDate: site.founded,
  address: { '@type': 'PostalAddress', ...site.contact.postalAddress },
  sameAs: [site.social.linkedin, site.social.twitter].filter((u) => u !== '#'),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-adn-pathname') ?? '';
  const isAdmin = pathname.startsWith('/admin');
  const nonce = h.get('x-nonce') ?? undefined;

  return (
    <html
      lang="en"
      /* Next 16 no longer overrides scroll-behavior during navigation, so the
       * smooth scroll declared in globals.css has to be opted into here. */
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-ink min-h-screen font-sans antialiased">
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('adsperio-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        {!isAdmin && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
        )}
        {!isAdmin && <HiringBanner />}
        {!isAdmin && <Header />}
        {children}
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
