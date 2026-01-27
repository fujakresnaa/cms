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
          { id: "5", platform: "email", url: "#", icon_type: "email" },
          { id: "6", platform: "x", url: "#", icon_type: "x" },
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
        { id: "5", platform: "email", url: "#", icon_type: "email" },
        { id: "6", platform: "x", url: "#", icon_type: "x" },
      ],
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, icon_type, platform } = body

    if (!url || !platform || !icon_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use UPSERT based on platform since it's UNIQUE
    // This allows fixing placeholder IDs (like "1", "2") by inserting them if they don't exist
    const { rows } = await pool.query(
      `INSERT INTO cms_social_media (platform, url, icon_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (platform)
       DO UPDATE SET url = EXCLUDED.url, icon_type = EXCLUDED.icon_type, updated_at = now()
       RETURNING *`,
      [platform, url, icon_type]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Failed to update social media" }, { status: 500 })
    }

    return NextResponse.json({ data: rows[0] })
  } catch (error) {
    console.error("[mrc] Social media update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
