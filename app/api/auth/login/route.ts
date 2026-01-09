import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { cookies } from "next/headers"
import { createHash, randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[mrc] Login attempt with email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { rows: adminData } = await pool.query(
      "SELECT * FROM admin_users WHERE email = $1 LIMIT 1",
      [email]
    )

    if (adminData.length === 0) {
      console.log("[mrc] Admin not found for email:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const admin = adminData[0]
    // Check is_active if it exists in the schema. Previously used so keeping it.
    // If schema differs, this might error, but assuming schema matches previous `supabase.from('admin_users')`

    // Note: in previous code `admin.password_hash`.
    const passwordHash = createHash("sha256").update(password).digest("hex")

    if (admin.password_hash !== passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!admin.is_active) {
      console.log("[mrc] Admin account is inactive")
      return NextResponse.json({ error: "Admin account is inactive" }, { status: 403 })
    }

    const sessionToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

    await pool.query(
      "INSERT INTO admin_sessions (admin_id, session_token, expires_at) VALUES ($1, $2, $3)",
      [admin.id, sessionToken, expiresAt]
    )

    console.log("[mrc] Session created successfully for admin:", admin.id)

    // Update last_login
    await pool.query("UPDATE admin_users SET last_login = NOW() WHERE id = $1", [admin.id])

    const cookieStore = await cookies()
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    console.error("[mrc] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
