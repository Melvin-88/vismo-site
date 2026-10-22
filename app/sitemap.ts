import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

// Оновлювати вручну, коли реально змінюється зміст сторінки (не дата збірки — інакше Google перестає вірити lastmod)
const UPDATED = { home: '2026-10-22', privacy: '2026-10-22' };

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: UPDATED.home, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/privacy`, lastModified: UPDATED.privacy, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
