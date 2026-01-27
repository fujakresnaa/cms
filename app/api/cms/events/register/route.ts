import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { event_id, full_name, email, phone_number, message } = body

        if (!event_id || !full_name || !email || !phone_number) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const query = `
      INSERT INTO event_registrations (event_id, full_name, email, phone_number, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
        const values = [event_id, full_name, email, phone_number, message]

        const { rows } = await pool.query(query, values)

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Failed to submit registration" },
                { status: 500 }
            )
        }

        return NextResponse.json(rows[0], { status: 201 })
    } catch (error) {
        console.error("[mrc] Event registration error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
