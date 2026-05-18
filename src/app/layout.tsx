import type { Metadata, Viewport } from 'next';
import './globals.css';
import { site } from '@/content/site';
import { Fraunces, JetBrains_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HiringBanner from '@/components/layout/HiringBanner';

const serif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Performance Marketing That Scales`,
    template: `%s | ${site.name}`,
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
    title: `${site.name} — Performance Marketing That Scales`,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    site: site.twitter,
    creator: site.twitter,
    title: `${site.name} — Performance Marketing That Scales`,
    description: site.description,
    images: [site.ogImage],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  logo: `${site.url}/favicon.svg`,
  description: site.description,
  email: site.contact.email,
  telephone: site.contact.phone,
  sameAs: [site.social.linkedin, site.social.twitter],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-adn-pathname') ?? '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
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