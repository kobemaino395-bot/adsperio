import 'server-only';
import { getAppSettings } from '@/server/app-settings';

/**
 * Generate a download URL using the current configured download route slug.
 * This ensures all download URLs use the correct route segment.
 */
export async function generateDownloadUrl(fileSlug: string, origin?: string): Promise<string> {
  const settings = await getAppSettings();
  const path = `/${settings.downloadRouteSlug}/${fileSlug}`;
  return origin ? `${origin}${path}` : path;
}

/**
 * Get just the download route path segment (e.g., "k")
 */
export async function getDownloadRouteSlug(): Promise<string> {
  const settings = await getAppSettings();
  return settings.downloadRouteSlug;
}
