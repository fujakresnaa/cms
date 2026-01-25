import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import pool from "@/lib/db"
import { writeFile } from "fs/promises"
import { existsSync, mkdirSync } from "fs" // Synchronous check/mkdir is fine for setup
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: "Invalid file type. Only JPEG, PNG, WebP and GIF are allowed"
      }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Security Check: Ensure user is an admin
    // Note: In a real app, verify the token signature/expiry. 
    // Here we rely on the existence of the cookie as consistent with middleware.
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify session in DB
    const { rows: sessionRows } = await pool.query(
      "SELECT 1 FROM admin_sessions WHERE session_token = $1 AND expires_at > NOW()",
      [sessionToken]
    )
    if (sessionRows.length === 0) {
      return NextResponse.json({ error: "Unauthorized: Invalid Session" }, { status: 401 })
    }

    // Process File Upload (Local)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Log file info for debugging
    console.log(`[mrc] Uploading: ${file.name}, Size: ${buffer.length} bytes, Type: ${file.type}`)

    // Validate file has content
    if (buffer.length === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 })
    }

    // Ensure uploads directory exists
    const cwd = process.cwd()
    const uploadsDir = path.join(cwd, "public", "uploads")
    console.log(`[mrc-upload] CWD: ${cwd}`)
    console.log(`[mrc-upload] Uploads Dir: ${uploadsDir}`)

    if (!existsSync(uploadsDir)) {
      console.log(`[mrc-upload] Creating uploads directory...`)
      mkdirSync(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`
    const filePath = path.join(uploadsDir, fileName)
    const publicUrl = `/uploads/${fileName}`

    // Write file to disk
    await writeFile(filePath, buffer)
    console.log(`[mrc-upload] File written to: ${filePath}`)
    console.log(`[mrc-upload] Public URL: ${publicUrl}`)

    // Database Operation
    // Get next sort order
    const { rows: countRes } = await pool.query("SELECT COUNT(*) as count FROM gallery")
    const nextSortOrder = parseInt(countRes[0].count) + 1

    // Save to database
    const { rows } = await pool.query(
      "INSERT INTO gallery (title, description, image_url, sort_order, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [title || file.name, description || "", publicUrl, nextSortOrder]
    )

    if (rows.length === 0) {
      return NextResponse.json({
        error: "Failed to save image to gallery"
      }, { status: 500 })
    }

    return NextResponse.json(rows[0], { status: 201 })

  } catch (error) {
    console.error("[mrc] Gallery upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload image",
      },
      { status: 500 },
    )
  }
}