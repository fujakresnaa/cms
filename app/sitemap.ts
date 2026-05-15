import { MetadataRoute } from 'next'
import pool from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mbw205ci.com'

  // Fetch all events to include in sitemap
  let eventUrls: MetadataRoute.Sitemap = []
  try {
    const { rows } = await pool.query('SELECT id, created_at FROM events ORDER BY created_at DESC')
    eventUrls = rows.map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: new Date(event.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching events for sitemap:', error)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...eventUrls,
  ]
}
