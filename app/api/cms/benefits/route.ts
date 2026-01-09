import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM cms_benefits ORDER BY sort_order ASC")

    if (rows.length === 0) {
      // Default data
      return NextResponse.json({
        data: [
          { id: "1", title: "City Night Drive", description: "Experience the thrill of night driving", icon_type: "moon", sort_order: 1 },
          { id: "2", title: "Weekend Touring Escape", description: "Adventure awaits on weekends", icon_type: "map", sort_order: 2 },
          { id: "3", title: "Tech & Care Workshop", description: "Learn maintenance and tech", icon_type: "wrench", sort_order: 3 },
        ],
      })
    }

    return NextResponse.json({ data: rows })
  } catch (error) {
    console.error("[mrc] CMS benefits catch error:", error)
    return NextResponse.json({ data: [] })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Dynamic update
    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    Object.keys(body).forEach(key => {
      if (key !== 'id') {
        fields.push(`${key} = $${paramIndex}`)
        values.push(body[key])
        paramIndex++
      }
    })
    values.push(body.id)

    const query = `UPDATE cms_benefits SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`

    const { rows } = await pool.query(query, values)

    if (rows.length === 0) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const columns = Object.keys(body).join(", ")
    const values = Object.values(body)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")

    const { rows } = await pool.query(
      `INSERT INTO cms_benefits (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    )

    return NextResponse.json(rows[0])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
