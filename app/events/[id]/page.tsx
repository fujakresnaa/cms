import pool from "@/lib/db"
import { notFound } from "next/navigation"
import { EventDetailClient } from "./event-detail-client"

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

    return <EventDetailClient event={event} />
}

