import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM cms_membership LIMIT 1")
    const data = rows[0]

    if (!data) {
      return NextResponse.json({
        id: "default",
        title: "Join the Brotherhood",
        description: "Be part of an exclusive circle of W205CI enthusiasts",
        stats: [
          { label: "Member Club", value: "120+" },
          { label: "Events Club", value: "64+" },
          { label: "Partner W205CI", value: "20+" },
        ],
      })
    }

    const stats = typeof data.stats === "string" ? JSON.parse(data.stats) : data.stats || []

    return NextResponse.json({
      ...data,
      stats,
    })
  } catch (error) {
    console.error("[mrc] Membership catch error:", error)
    return NextResponse.json({
      id: "default",
      title: "Join the Brotherhood",
      description: "Be part of an exclusive circle of W205CI enthusiasts",
      stats: [
        { label: "Member Club", value: "120+" },
        { label: "Events Club", value: "64+" },
        { label: "Partner W205CI", value: "20+" },
      ],
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const updateData = {
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      image_url: body.image_url,
      stats: JSON.stringify(body.stats),
    }

    const { rows } = await pool.query(
      "UPDATE cms_membership SET title = $1, subtitle = $2, description = $3, image_url = $4, stats = $5 WHERE id = $6 RETURNING *",
      [updateData.title, updateData.subtitle, updateData.description, updateData.image_url, updateData.stats, body.id]
    )

    if (rows.length === 0) {
      console.error("[mrc] Membership update error: Not found")
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    const data = rows[0]
    const stats = typeof data.stats === "string" ? JSON.parse(data.stats) : data.stats || []

    return NextResponse.json({
      ...data,
      stats,
    })
  } catch (error) {
    console.error("[mrc] Membership put catch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
