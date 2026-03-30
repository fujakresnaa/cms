import { MetadataRoute } from 'next'
import pool from "@/lib/db"

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mbw205ci.com'

  // Fetch all events for the sitemap
  let eventEntries: any[] = []
  try {
    const { rows } = await pool.query("SELECT id, created_at FROM events ORDER BY created_at DESC")
    eventEntries = rows.map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: new Date(event.created_at),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
  } catch (error) {
    console.error("Error fetching events for sitemap:", error)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...eventEntries,
  ]
}
