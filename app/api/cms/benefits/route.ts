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

    const { data, error } = await supabase.from("cms_benefits").select("*").order("sort_order", { ascending: true })

    if (error) {
      console.error("[v0] CMS benefits error:", error)
      // Return default benefits data
      return NextResponse.json({
        data: [
          {
            id: "1",
            title: "City Night Drive",
            description: "Experience the thrill of night driving",
            icon_type: "moon",
            sort_order: 1,
          },
          {
            id: "2",
            title: "Weekend Touring Escape",
            description: "Adventure awaits on weekends",
            icon_type: "map",
            sort_order: 2,
          },
          {
            id: "3",
            title: "Tech & Care Workshop",
            description: "Learn maintenance and tech",
            icon_type: "wrench",
            sort_order: 3,
          },
        ],
      })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("[v0] CMS benefits catch error:", error)
    return NextResponse.json({
      data: [
        {
          id: "1",
          title: "City Night Drive",
          description: "Experience the thrill of night driving",
          icon_type: "moon",
          sort_order: 1,
        },
        {
          id: "2",
          title: "Weekend Touring Escape",
          description: "Adventure awaits on weekends",
          icon_type: "map",
          sort_order: 2,
        },
        {
          id: "3",
          title: "Tech & Care Workshop",
          description: "Learn maintenance and tech",
          icon_type: "wrench",
          sort_order: 3,
        },
      ],
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

    const { data, error } = await supabase.from("cms_benefits").update(body).eq("id", body.id).select()

    if (error) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { data, error } = await supabase.from("cms_benefits").insert([body]).select()

    if (error) {
      return NextResponse.json({ error: "Failed to create" }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
