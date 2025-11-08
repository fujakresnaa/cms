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

    const { data, error } = await supabase.from("cms_logo").select("*").single()

    if (error) {
      console.error("[v0] Logo fetch error:", error)
      return NextResponse.json({
        id: "default",
        text: "MBW205 Indonesia",
        subtext: "Club Indonesia",
        image_url: "/logo.png",
      })
    }

    return NextResponse.json({
      id: data.id,
      text: data.logo_text,
      subtext: data.logo_subtext,
      image_url: data.logo_image_url,
    })
  } catch (error) {
    console.error("[v0] Logo catch error:", error)
    return NextResponse.json({
      id: "default",
      text: "MBW205 Indonesia",
      subtext: "Club Indonesia",
      image_url: "/logo.png",
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

    const { data, error } = await supabase
      .from("cms_logo")
      .update({
        logo_text: body.text,
        logo_subtext: body.subtext,
        logo_image_url: body.image_url,
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Logo update error:", error)
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json({
      id: data.id,
      text: data.logo_text,
      subtext: data.logo_subtext,
      image_url: data.logo_image_url,
    })
  } catch (error) {
    console.error("[v0] Logo put catch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
