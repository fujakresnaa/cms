import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM cms_logo LIMIT 1")
    const data = rows[0]

    if (!data) {
      return NextResponse.json({
        id: "default",
        text: "MBW205 Indonesia",
        subtext: "Club Indonesia",
        image_url: "/logo.png",
      })
    }

    return NextResponse.json({
      id: data.id,
      text: data.text,
      subtext: data.subtext,
      image_url: data.image_url,
    })
  } catch (error) {
    console.error("[mrc] Logo catch error:", error)
    return NextResponse.json({
      id: "default",
      text: "MBW205 Indonesia",
      subtext: "Club Indonesia",
      image_url: "/logo.png",
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Using COALESCE to allow partial updates (e.g. only updating image_url)
    // and correcting column names to match schema (text, subtext, image_url)
    const { rows } = await pool.query(
      `UPDATE cms_logo 
       SET text = COALESCE($1, text), 
           subtext = COALESCE($2, subtext), 
           image_url = COALESCE($3, image_url) 
       WHERE id = $4 
       RETURNING *`,
      [body.text, body.subtext, body.image_url, body.id]
    )

    if (rows.length === 0) {
      // If no ID matches, maybe we haven't initialized? 
      // Or the ID provided is wrong.
      return NextResponse.json({ error: "Failed to update or ID not found" }, { status: 404 })
    }

    const data = rows[0]

    return NextResponse.json({
      id: data.id,
      text: data.text,
      subtext: data.subtext,
      image_url: data.image_url,
    })
  } catch (error) {
    console.error("[mrc] Logo put catch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
