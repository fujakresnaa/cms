import pool from "@/lib/db"
import { notFound } from "next/navigation"
import { EventDetailClient } from "./event-detail-client"
import type { Metadata } from "next"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const event = await getEvent(id)

    if (!event) {
        return {
            title: "Event Not Found",
        }
    }

    const description = event.description?.slice(0, 160) || "Join us for this exclusive event."

    return {
        title: event.title,
        description: description,
        openGraph: {
            title: event.title,
            description: description,
            images: event.header_image ? [event.header_image] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: event.title,
            description: description,
            images: event.header_image ? [event.header_image] : [],
        }
    }
}

async function getEvent(id: string) {
    // Sanitize the ID: Extract the first UUID if there is extra text
    const uuidMatch = id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
    const sanitizedId = uuidMatch ? uuidMatch[0] : id

    try {
        const { rows } = await pool.query("SELECT * FROM events WHERE id = $1", [sanitizedId])
        return rows[0]
    } catch (error) {
        console.error("Error fetching event:", error)
        // If query fails (e.g. invalid UUID syntax), return null instead of crashing
        return null
    }
}

export default async function EventPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const event = await getEvent(id)

    if (!event) {
        notFound()
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": event.title,
        "description": event.description,
        "image": event.header_image ? [event.header_image] : [],
        "startDate": event.event_time || event.created_at,
        "location": {
            "@type": "Place",
            "name": event.location || "TBA",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": event.location || "Indonesia",
                "addressRegion": "ID",
            }
        },
        "organizer": {
            "@type": "Organization",
            "name": "W205CI Club Indonesia",
            "url": process.env.NEXT_PUBLIC_BASE_URL || "https://mbw205ci.com"
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <EventDetailClient event={event} />
        </>
    )
}

