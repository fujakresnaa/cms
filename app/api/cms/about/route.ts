import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
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

    const { data, error } = await supabase.from("cms_about").select("*").single()

    if (error) {
      console.error("[v0] CMS about error:", error)
      // Return empty default data instead of error
      return NextResponse.json({
        id: "default",
        title: "About Us",
        description: "The Mercedes-Benz W205CI Club is more than a club...",
        button_text: "Learn More",
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] CMS about catch error:", error)
    return NextResponse.json({
      id: "default",
      title: "About Us",
      description: "The Mercedes-Benz W205CI Club is more than a club...",
      button_text: "Learn More",
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
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

    const { data, error } = await supabase.from("cms_about").update(body).eq("id", body.id).select()

    if (error) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
