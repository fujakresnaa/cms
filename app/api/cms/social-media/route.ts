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

    const { data, error } = await supabase.from("cms_social_media").select("*").order("platform", { ascending: true })

    if (error) {
      console.error("[v0] Social media error:", error)
      // Return default social media data
      return NextResponse.json({
        data: [
          { id: "1", platform: "whatsapp", url: "#", icon_type: "whatsapp" },
          { id: "2", platform: "youtube", url: "#", icon_type: "youtube" },
          { id: "3", platform: "instagram", url: "#", icon_type: "instagram" },
          { id: "4", platform: "facebook", url: "#", icon_type: "facebook" },
        ],
      })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("[v0] Social media catch error:", error)
    return NextResponse.json({
      data: [
        { id: "1", platform: "whatsapp", url: "#", icon_type: "whatsapp" },
        { id: "2", platform: "youtube", url: "#", icon_type: "youtube" },
        { id: "3", platform: "instagram", url: "#", icon_type: "instagram" },
        { id: "4", platform: "facebook", url: "#", icon_type: "facebook" },
      ],
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const cookieStore = cookies()
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

    const { data, error } = await supabase.from("cms_social_media").update(body).eq("id", body.id).select().single()

    if (error) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
