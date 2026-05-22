import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mbw205ci.com'

  // Fetch events from the database
  let eventsListMarkdown = ''
  try {
    const { rows } = await pool.query(
      'SELECT id, title, description, event_time, location FROM events ORDER BY event_time DESC LIMIT 10'
    )
    if (rows && rows.length > 0) {
      eventsListMarkdown = rows
        .map((event) => {
          const dateStr = event.event_time
            ? new Date(event.event_time).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'TBA'
          const locationStr = event.location || 'TBA'
          const cleanDesc = event.description
            ? event.description.replace(/\n/g, ' ').slice(0, 150) + '...'
            : 'No description available.'

          return `- [${event.title}](${baseUrl}/events/${event.id}): ${cleanDesc} (Date: ${dateStr}, Location: ${locationStr})`
        })
        .join('\n')
    } else {
      eventsListMarkdown = '_No upcoming events scheduled currently._'
    }
  } catch (error) {
    console.error('Error fetching events for llms.txt:', error)
    eventsListMarkdown = '_Failed to load events. Please check the main site for details._'
  }

  const content = `# Mercedes-Benz W205CI Club Indonesia

> The official community for Mercedes-Benz C-Class W205 owners and enthusiasts in Indonesia. We focus on building brotherhood, sharing technical knowledge, organizing luxury runs, and exclusive gatherings.

## Core Navigation

- [Home Page](${baseUrl}): Official website introduction, club overview, and landing section.
- [Registration](${baseUrl}/register): Online membership application form for Mercedes-Benz W205 owners wishing to join the club.

## Latest Events & Activities

${eventsListMarkdown}

## Contact & Socials

- [Instagram](https://www.instagram.com/w205ci): Official W205CI Club Instagram account.
- [Facebook](https://www.facebook.com/w205ci): Official W205CI Club Facebook page.
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  })
}
