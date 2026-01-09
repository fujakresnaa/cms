import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM cms_contact LIMIT 1")
    const contactData = rows[0]

    if (!contactData) {
      return NextResponse.json({
        id: "default",
        title: "Get in Touch",
        description: "Our friendly team would love to hear from you. Send us a message anytime.",
        phone: "+62 XXX XXXX XXXX",
        email: "info@mbw205ci.com",
      })
    }

    return NextResponse.json(contactData)
  } catch (error) {
    console.error("[mrc] Contact API error:", error)
    return NextResponse.json({
      id: "default",
      title: "Get in Touch",
      description: "Our friendly team would love to hear from you. Send us a message anytime.",
      phone: "+62 XXX XXXX XXXX",
      email: "info@mbw205ci.com",
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if exists
    const { rows: existing } = await pool.query("SELECT id FROM cms_contact LIMIT 1")

    let result
    if (existing.length === 0) {
      // Insert
      const columns = Object.keys(body).join(", ")
      const values = Object.values(body)
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")

      const { rows } = await pool.query(`INSERT INTO cms_contact (${columns}) VALUES (${placeholders}) RETURNING *`, values)
      result = rows[0]
    } else {
      // Update
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

      values.push(body.id || existing[0].id)

      const query = `UPDATE cms_contact SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`
      const { rows } = await pool.query(query, values)
      result = rows[0]
    }

    if (!result) {
      return NextResponse.json({ error: "Failed to update contact config" }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[mrc] Contact PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
