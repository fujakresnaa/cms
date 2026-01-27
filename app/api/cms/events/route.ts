import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset") || "0"

    // Get total count
    const { rows: countRows } = await pool.query("SELECT COUNT(*) as total FROM events")
    const total = parseInt(countRows[0].total)

    // Build query with optional pagination
    let query = "SELECT * FROM events ORDER BY created_at DESC"
    const values: any[] = []

    if (limit) {
      query += ` LIMIT $1 OFFSET $2`
      values.push(parseInt(limit), parseInt(offset))
    }

    const { rows } = await pool.query(query, values)
    return NextResponse.json({ data: rows, total, limit: limit ? parseInt(limit) : null, offset: parseInt(offset) })
  } catch (error) {
    console.error("[mrc] Events catch error:", error)
    return NextResponse.json({ data: [], total: 0 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Construct dynamic update query
    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    // Exclude id and updated_at from manual fields, we set them specifically
    Object.keys(body).forEach(key => {
      if (key !== 'id' && key !== 'updated_at' && key !== 'created_at') {
        fields.push(`${key} = $${paramIndex}`)
        values.push(body[key])
        paramIndex++
      }
    })

    // Add updated_at
    fields.push(`updated_at = NOW()`)

    // Add ID as last parameter
    values.push(body.id)

    const query = `UPDATE events SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`

    const { rows } = await pool.query(query, values)

    if (rows.length === 0) {
      return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[mrc] Error updating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const columns = Object.keys(body).join(", ")
    const values = Object.values(body)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")

    // Note: created_at default? If not in body, DB likely handles default or we should add it.
    // Previous code added `created_at: new Date().toISOString()`.
    // Let's rely on DB default NOW() if possible, or inject it if needed.
    // Assuming DB has default for created_at, but previous code was explicit.

    const query = `INSERT INTO events (${columns}) VALUES (${placeholders}) RETURNING *` // This assumes created_at handled by DB or passed in body, or we modify keys/values.

    // Safer to just pass body if it matches schema.

    const { rows } = await pool.query(query, values)

    if (rows.length === 0) {
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[mrc] Error creating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Event ID required" }, { status: 400 })
    }

    await pool.query("DELETE FROM events WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[mrc] Error deleting event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
