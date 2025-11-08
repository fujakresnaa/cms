import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        },
      },
    )

    const { data: sessionData, error: sessionError } = await supabase
      .from("admin_sessions")
      .select("admin_id, expires_at")
      .eq("session_token", sessionToken)
      .limit(1)

    if (sessionError || !sessionData || sessionData.length === 0) {
      console.log("[v0] Session not found")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const session = sessionData[0]

    if (new Date(session.expires_at) < new Date()) {
      console.log("[v0] Session expired")
      // Delete expired session
      await supabase.from("admin_sessions").delete().eq("session_token", sessionToken)
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("is_active")
      .eq("id", session.admin_id)
      .limit(1)

    if (!adminData || adminData.length === 0 || !adminData[0].is_active) {
      console.log("[v0] Admin user not found or inactive")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Auth middleware error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
