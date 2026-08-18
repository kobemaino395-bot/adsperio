import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { services } from '@/content/services';
import { caseStudies } from '@/content/case-studies';
import { issues } from '@/content/newsletter';
import { listPositions } from '@/server/content/positions';

/** `trailingSlash: true`, so every URL here ends in a slash to match what the
 *  app actually serves. */
const url = (path: string) => `${site.url}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: url('/services/'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/case-studies/'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/about/'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/contact/'), lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: url('/careers/'), lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: url('/newsletter/'), lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: url('/privacy/'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: url('/terms/'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: url(`/services/${s.slug}/`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const caseRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: url(`/case-studies/${c.slug}/`),
    lastModified: new Date(`${c.publishedAt}T00:00:00Z`),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  const issueRoutes: MetadataRoute.Sitemap = issues.map((i) => ({
    url: url(`/newsletter/${i.slug}/`),
    lastModified: new Date(`${i.publishedAt}T00:00:00Z`),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  let positionRoutes: MetadataRoute.Sitemap = [];
  try {
    const open = await listPositions({ visibleOnly: true });
    positionRoutes = open.map((p) => ({
      url: url(`/careers/${p.slug}/`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch {
    // Positions come from a JSON store; a read failure should not break the
    // sitemap for every other route.
  }

  return [...staticRoutes, ...serviceRoutes, ...caseRoutes, ...issueRoutes, ...positionRoutes];
}
