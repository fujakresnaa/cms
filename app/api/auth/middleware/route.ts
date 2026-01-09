import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const { rows: sessionData } = await pool.query(
      "SELECT admin_id, expires_at FROM admin_sessions WHERE session_token = $1 LIMIT 1",
      [sessionToken]
    )

    if (sessionData.length === 0) {
      // Session not found
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const session = sessionData[0]

    if (new Date(session.expires_at) < new Date()) {
      console.log("[mrc] Session expired")
      // Delete expired session
      await pool.query("DELETE FROM admin_sessions WHERE session_token = $1", [sessionToken])
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const { rows: adminData } = await pool.query(
      "SELECT is_active FROM admin_users WHERE id = $1 LIMIT 1",
      [session.admin_id]
    )

    if (adminData.length === 0 || !adminData[0].is_active) {
      console.log("[mrc] Admin user not found or inactive")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true }, { status: 200 })
  } catch (error) {
    console.error("[mrc] Auth middleware error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
