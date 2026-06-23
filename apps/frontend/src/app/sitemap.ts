import type { MetadataRoute } from 'next'

const siteUrl = 'https://dr-pediatre.vercel.app'
const locales = ['fr', 'ar', 'en', 'tzm'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: locale === 'fr' ? 1 : 0.8,
    })
  }

  return entries
}
