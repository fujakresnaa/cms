import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { existsSync, mkdirSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, and WEBP formats are allowed" }, { status: 400 })
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true })
    }

    const fileBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(fileBuffer)
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
    const filePath = path.join(uploadsDir, filename)

    await writeFile(filePath, buffer)
    const url = `/uploads/${filename}`

    console.log(`[mrc] Upload success: ${url}`)

    return NextResponse.json({
      success: true,
      url: url,
    })
  } catch (error) {
    console.error("[mrc] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
