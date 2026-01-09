import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM cms_about LIMIT 1")
    const data = rows[0]

    if (!data) {
      return NextResponse.json({
        id: "default",
        title: "About Us",
        description: "The Mercedes-Benz W205CI Club is more than a club...",
        button_text: "Learn More",
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[mrc] CMS about catch error:", error)
    return NextResponse.json({
      id: "default",
      title: "About Us",
      description: "The Mercedes-Benz W205CI Club is more than a club...",
      button_text: "Learn More",
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Assuming body properties match DB columns
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

    const query = `UPDATE cms_about SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`

    const { rows } = await pool.query(query, values)

    if (rows.length === 0) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
