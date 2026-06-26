import { MetadataRoute } from 'next'
import { programs } from '@/lib/programs-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://brankystemlab.com'

  const programPages: MetadataRoute.Sitemap = programs.map(p => ({
    url: `${base}/programs/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/programs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    ...programPages,
    { url: `${base}/our-labs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/bootcamp-workshops`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
