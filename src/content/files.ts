/**
 * Adnovara admin file slots.
 *
 * Each entry defines a managed file that the admin can upload/replace via
 * /admin/files. Files are stored at data/files/<slug>/file.bin on disk.
 *
 * To add a new file slot, append an entry here and rebuild. No code changes
 * are required elsewhere.
 */

export type FileSlot = {
  slug: string;
  title: string;
  description: string;
  publicFilename: string;
  publicMimeType: string;
  accept: string;
  magicBytes: string[];
  maxBytes: number;
};

export const fileSlots: FileSlot[] = [
  {
    slug: 'take-home',
    title: 'Ads Manager take-home test',
    description: 'Served at /api/downloads/take-home. Linked from /careers/ads-manager and /ads-manager-test.',
    publicFilename: 'Technical_Assessment.zip',
    publicMimeType: 'application/zip',
    accept: '.zip,.docx,application/zip,application/x-zip-compressed,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    magicBytes: ['504b0304'],
    maxBytes: 50 * 1024 * 1024,
  },
  {
    slug: 'remote-policy',
    title: 'Remote work policy',
    description: 'PDF available at /api/downloads/remote-policy. Link to it from wherever you need.',
    publicFilename: 'Adnovara_Remote_Policy.pdf',
    publicMimeType: 'application/pdf',
    accept: '.pdf,application/pdf',
    magicBytes: ['25504446'],
    maxBytes: 20 * 1024 * 1024,
  },
];

export function getFileSlot(slug: string): FileSlot | undefined {
  return fileSlots.find((s) => s.slug === slug);
}
