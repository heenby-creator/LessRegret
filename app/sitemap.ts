import type { MetadataRoute } from 'next';
import { cards } from '@/lib/cards';
import { LOCALES, SITE_URL } from '@/lib/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${lang}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    });
    for (const card of cards) {
      entries.push({
        url: `${SITE_URL}/${lang}/card/${card.id}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
