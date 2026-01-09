import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    )

    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error("[Contact API] Contact messages error:", error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, message } = body

    // Validation
    const errors: Record<string, string> = {}

    if (!first_name?.trim()) errors.first_name = "First name is required"
    if (!last_name?.trim()) errors.last_name = "Last name is required"
    if (!email?.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format"
    }
    if (!message?.trim()) errors.message = "Message is required"

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Insert into DB using pg
    const { rows } = await pool.query(
      `INSERT INTO contact_messages (first_name, last_name, email, message) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [first_name.trim(), last_name.trim(), email.trim().toLowerCase(), message.trim()]
    )

    return NextResponse.json(
      {
        success: true,
        message: "Message submitted successfully! We'll get back to you soon.",
        data: rows[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Contact API] Contact form error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send message",
      },
      { status: 500 },
    )
  }
}