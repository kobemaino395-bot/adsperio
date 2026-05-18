/**
 * Built-in file slots seeded on first run.
 *
 * After the first request the live source of truth is
 * data/files/slots.json (managed via /admin/files). Editing these
 * defaults only affects fresh installs - existing servers keep their
 * registry as-is.
 *
 * Built-in slugs are protected from deletion since the public site
 * links to them by path.
 */

export type DefaultSlot = {
  slug: string;
  title: string;
  description: string;
  publicFilename: string;
  publicMimeType: string;
};

export const DEFAULT_SLOTS: DefaultSlot[] = [
  {
    slug: 'take-home',
    title: 'Ads Manager take-home test',
    description: 'Served at /api/downloads/take-home. Linked from /careers/ads-manager and /ads-manager-test.',
    publicFilename: 'Technical_Assessment.zip',
    publicMimeType: 'application/zip',
  },
  {
    slug: 'remote-policy',
    title: 'Remote work policy',
    description: 'Available at /api/downloads/remote-policy.',
    publicFilename: 'Adnovara_Remote_Policy.pdf',
    publicMimeType: 'application/pdf',
  },
];

export const BUILTIN_SLUGS = new Set(DEFAULT_SLOTS.map((s) => s.slug));
