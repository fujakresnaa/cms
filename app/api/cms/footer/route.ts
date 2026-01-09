import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

function getDefaultFooter() {
  return {
    id: "default",
    company_name: "Mercedes-Benz W205CI Club Indonesia",
    description: "Your Ultimate Community for W205CI Enthusiasts",
    phone: "+62 123 456 7890",
    email: "contact@mbw205ci.id",
    address: "Indonesia",
    copyright_year: new Date().getFullYear(),
    copyright_text: "Mercedes-Benz W205CI Club Indonesia. All rights reserved.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM cms_footer LIMIT 1")

    if (rows.length === 0) {
      return NextResponse.json(getDefaultFooter(), { status: 200 })
    }

    return NextResponse.json(rows[0], { status: 200 })
  } catch (error) {
    console.error("[mrc] Footer error:", error)
    return NextResponse.json(getDefaultFooter(), { status: 200 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Destructure known fields to prevent SQL injection or bad data
    // We ignore the 'id' from the body since we manage it internally
    const {
      company_name,
      description,
      phone,
      email,
      address,
      copyright_year,
      copyright_text
    } = body

    // Check if a row exists
    const { rows: existingRows } = await pool.query("SELECT id FROM cms_footer LIMIT 1")

    let result

    if (existingRows.length === 0) {
      // INSERT
      const { rows } = await pool.query(
        `INSERT INTO cms_footer 
         (company_name, description, phone, email, address, copyright_year, copyright_text, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING *`,
        [company_name, description, phone, email, address, copyright_year, copyright_text]
      )
      result = rows[0]
    } else {
      // UPDATE existing row
      const id = existingRows[0].id
      const { rows } = await pool.query(
        `UPDATE cms_footer 
         SET company_name = $1, 
             description = $2, 
             phone = $3, 
             email = $4, 
             address = $5, 
             copyright_year = $6, 
             copyright_text = $7, 
             updated_at = NOW()
         WHERE id = $8
         RETURNING *`,
        [company_name, description, phone, email, address, copyright_year, copyright_text, id]
      )
      result = rows[0]
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("[mrc] Footer update error:", error)
    return NextResponse.json({ error: "Failed to update footer" }, { status: 500 })
  }
}
