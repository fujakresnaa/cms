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

    const { data, error } = await supabase.from("cms_membership").select("*").single()

    if (error) {
      console.error("[v0] Membership fetch error:", error)
      return NextResponse.json({
        id: "default",
        title: "Join the Brotherhood",
        description: "Be part of an exclusive circle of W205CI enthusiasts",
        stats: [
          { label: "Member Club", value: "120+" },
          { label: "Events Club", value: "64+" },
          { label: "Partner W205CI", value: "20+" },
        ],
      })
    }

    const stats = typeof data.stats === "string" ? JSON.parse(data.stats) : data.stats || []

    return NextResponse.json({
      ...data,
      stats,
    })
  } catch (error) {
    console.error("[v0] Membership catch error:", error)
    return NextResponse.json({
      id: "default",
      title: "Join the Brotherhood",
      description: "Be part of an exclusive circle of W205CI enthusiasts",
      stats: [
        { label: "Member Club", value: "120+" },
        { label: "Events Club", value: "64+" },
        { label: "Partner W205CI", value: "20+" },
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

    const updateData = {
      title: body.title,
      description: body.description,
      stats: body.stats,
    }

    const { data, error } = await supabase.from("cms_membership").update(updateData).eq("id", body.id).select().single()

    if (error) {
      console.error("[v0] Membership update error:", error)
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    const stats = typeof data.stats === "string" ? JSON.parse(data.stats) : data.stats || []

    return NextResponse.json({
      ...data,
      stats,
    })
  } catch (error) {
    console.error("[v0] Membership put catch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
