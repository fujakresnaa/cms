import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

// Cache control headers
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
  "Last-Modified": new Date().toUTCString(),
}

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM cms_hero LIMIT 1")
    const timestamp = Date.now()

    if (rows.length === 0) {
      return NextResponse.json(
        {
          id: "default",
          title: "Your Journey with MBW205CI Starts Here",
          description:
            "Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.",
          button_text: "Continue Registration →",
          background_image_url: "",
          _timestamp: timestamp,
        },
        { status: 200, headers: NO_CACHE_HEADERS },
      )
    }

    const heroData = rows[0]

    // Add timestamp to response to force cache invalidation
    const responseData = {
      ...heroData,
      _timestamp: timestamp,
    }

    return NextResponse.json(responseData, { headers: NO_CACHE_HEADERS })
  } catch (error) {
    console.error("[Hero API] GET exception:", error)
    return NextResponse.json(
      {
        id: "default",
        title: "Your Journey with MBW205CI Starts Here",
        description:
          "Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.",
        button_text: "Continue Registration →",
        background_image_url: "",
        _timestamp: Date.now(),
      },
      { status: 200, headers: NO_CACHE_HEADERS },
    )
  }
}

export async function PUT(req: NextRequest) {
  console.log("[Hero API] PUT request started")

  try {
    // Parse request body
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("[Hero API] JSON parse error:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details: parseError instanceof Error ? parseError.message : "Parse error",
        },
        { status: 400, headers: NO_CACHE_HEADERS },
      )
    }

    const { id, title, description, button_text, background_image_url } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400, headers: NO_CACHE_HEADERS },
      )
    }

    // Check existing
    const { rows: existing } = await pool.query("SELECT id FROM cms_hero LIMIT 1")

    let result
    if (existing.length === 0) {
      // Insert
      const { rows } = await pool.query(
        "INSERT INTO cms_hero (title, description, button_text, background_image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *",
        [title, description, button_text || "Continue Registration →", background_image_url || ""]
      )
      result = rows[0]
    } else {
      // Update
      const { rows } = await pool.query(
        "UPDATE cms_hero SET title = $1, description = $2, button_text = $3, background_image_url = $4, updated_at = NOW() WHERE id = $5 RETURNING *",
        [title, description, button_text || "Continue Registration →", background_image_url || "", existing[0].id]
      )
      result = rows[0]
    }

    if (!result) {
      return NextResponse.json({ error: "Failed to update hero config" }, { status: 500, headers: NO_CACHE_HEADERS })
    }

    const responseData = {
      ...result,
      _timestamp: Date.now(),
    }
    return NextResponse.json(responseData, { headers: NO_CACHE_HEADERS })

  } catch (error) {
    console.error("[Hero API] Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: NO_CACHE_HEADERS },
    )
  }
}