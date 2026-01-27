import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({ error: "Event ID required" }, { status: 400 })
        }

        const { rows } = await pool.query("SELECT * FROM events WHERE id = $1", [id])

        if (rows.length === 0) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }

        return NextResponse.json(rows[0])
    } catch (error) {
        console.error("[mrc] Error fetching event:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
