import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import pool from "@/lib/db"
import { writeFile } from "fs/promises"
import { existsSync, mkdirSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const eventId = formData.get("eventId") as string

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

        if (buffer.length === 0) {
            return NextResponse.json({ error: "File is empty" }, { status: 400 })
        }

        // Ensure uploads/events directory exists
        const cwd = process.cwd()
        const uploadsDir = path.join(cwd, "public", "uploads", "events")

        if (!existsSync(uploadsDir)) {
            mkdirSync(uploadsDir, { recursive: true })
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop()?.toLowerCase() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`
        const filePath = path.join(uploadsDir, fileName)
        const publicUrl = `/uploads/events/${fileName}`

        // Write file to disk
        await writeFile(filePath, buffer)
        console.log(`[mrc-events] File written to: ${filePath}`)

        // If eventId is provided, update the event's header_image
        if (eventId) {
            await pool.query(
                "UPDATE events SET header_image = $1, updated_at = NOW() WHERE id = $2",
                [publicUrl, eventId]
            )
        }

        return NextResponse.json({ url: publicUrl }, { status: 201 })

    } catch (error) {
        console.error("[mrc] Events upload error:", error)
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to upload image",
            },
            { status: 500 },
        )
    }
}
