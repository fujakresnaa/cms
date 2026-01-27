import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
    try {
        const query = `
      SELECT 
        er.*,
        e.title as event_title
      FROM event_registrations er
      LEFT JOIN events e ON er.event_id = e.id
      ORDER BY er.created_at DESC
    `
        const { rows } = await pool.query(query)
        return NextResponse.json({ data: rows })
    } catch (error) {
        console.error("[mrc] Error fetching registrations:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
