import { readBanner } from '@/server/content/banner';
import HiringBannerClient from './HiringBannerClient';

export default async function HiringBanner() {
  const cfg = await readBanner();
  if (!cfg.enabled) return null;
  if (!cfg.message && !cfg.badge && !cfg.ctaText) return null;
  return <HiringBannerClient config={cfg} />;
}
