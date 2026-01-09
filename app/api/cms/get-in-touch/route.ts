import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM cms_get_in_touch LIMIT 1")

    if (rows.length === 0) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[mrc] Get In Touch catch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Assuming body contains fields matching DB table
    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    Object.keys(body).forEach(key => {
      if (key !== 'id') { // Don't update ID
        fields.push(`${key} = $${paramIndex}`)
        values.push(body[key])
        paramIndex++
      }
    })

    values.push(body.id)

    const query = `UPDATE cms_get_in_touch SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`

    const { rows } = await pool.query(query, values)

    if (rows.length === 0) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[mrc] Get In Touch update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
