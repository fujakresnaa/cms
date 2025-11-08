import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { createHash, randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt with email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const cookieStore = await cookies()
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

    const { data: adminData, error: queryError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .limit(1)

    if (queryError) {
      console.error("[v0] Database query error:", queryError)
      return NextResponse.json({ error: "Database error occurred" }, { status: 500 })
    }

    if (!adminData || adminData.length === 0) {
      console.log("[v0] Admin not found for email:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const admin = adminData[0]
    console.log("[v0] Admin found:", admin.email, "is_active:", admin.is_active)

    const passwordHash = createHash("sha256").update(password).digest("hex")
    console.log("[v0] Password hash match:", admin.password_hash === passwordHash)

    if (admin.password_hash !== passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!admin.is_active) {
      console.log("[v0] Admin account is inactive")
      return NextResponse.json({ error: "Admin account is inactive" }, { status: 403 })
    }

    const sessionToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

    const { error: sessionError } = await supabase.from("admin_sessions").insert({
      admin_id: admin.id,
      session_token: sessionToken,
      expires_at: expiresAt,
    })

    if (sessionError) {
      console.error("[v0] Session creation error:", sessionError)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    console.log("[v0] Session created successfully for admin:", admin.id)

    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", admin.id)

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
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
