import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM cms_social_media ORDER BY platform ASC")

    if (rows.length === 0) {
      // Return default social media data
      return NextResponse.json({
        data: [
          { id: "1", platform: "whatsapp", url: "#", icon_type: "whatsapp" },
          { id: "2", platform: "youtube", url: "#", icon_type: "youtube" },
          { id: "3", platform: "instagram", url: "#", icon_type: "instagram" },
          { id: "4", platform: "facebook", url: "#", icon_type: "facebook" },
        ],
      })
    }

    return NextResponse.json({ data: rows })
  } catch (error) {
    console.error("[mrc] Social media catch error:", error)
    return NextResponse.json({
      data: [
        { id: "1", platform: "whatsapp", url: "#", icon_type: "whatsapp" },
        { id: "2", platform: "youtube", url: "#", icon_type: "youtube" },
        { id: "3", platform: "instagram", url: "#", icon_type: "instagram" },
        { id: "4", platform: "facebook", url: "#", icon_type: "facebook" },
      ],
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { rows } = await pool.query(
      "UPDATE cms_social_media SET url = $1, icon_type = $2, platform = $3 WHERE id = $4 RETURNING *",
      [body.url, body.icon_type, body.platform, body.id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
