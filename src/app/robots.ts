import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Admin, one-time download tokens and internal APIs are not for crawlers.
      disallow: ['/admin/', '/api/', '/dt/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
