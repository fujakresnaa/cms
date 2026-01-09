import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (sessionToken) {
      await pool.query("DELETE FROM admin_sessions WHERE session_token = $1", [sessionToken])
    }

    cookieStore.delete("admin_session")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[mrc] Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
