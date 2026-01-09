import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM gallery ORDER BY sort_order DESC, created_at DESC")
    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error("[mrc] Gallery error:", error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image_url } = body

    if (!image_url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Get count for sort_order
    const { rows: countRes } = await pool.query("SELECT COUNT(*) as count FROM gallery")
    const nextSortOrder = parseInt(countRes[0].count) + 1

    const { rows } = await pool.query(
      `INSERT INTO gallery (title, description, image_url, sort_order, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [title || "Untitled", description || "", image_url, nextSortOrder]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("[mrc] Gallery POST error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to add image" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, sort_order } = body

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    const { rows } = await pool.query(
      `UPDATE gallery 
       SET title = $1, description = $2, sort_order = $3, updated_at = NOW() 
       WHERE id = $4 
       RETURNING *`,
      [title || "Untitled", description || "", sort_order ?? null, id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
    }

    return NextResponse.json(rows[0], { status: 200 })
  } catch (error) {
    console.error("[mrc] Gallery PUT error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update image" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    await pool.query("DELETE FROM gallery WHERE id = $1", [id])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[mrc] Gallery DELETE error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete image" },
      { status: 500 },
    )
  }
}
