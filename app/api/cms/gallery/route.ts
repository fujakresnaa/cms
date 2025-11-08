import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Gallery fetch error:", error)
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    return NextResponse.json({ data: data || [] }, { status: 200 })
  } catch (error) {
    console.error("[v0] Gallery error:", error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image_url } = body

    if (!image_url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
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

    const { data: countData } = await supabase.from("gallery").select("id", { count: "exact" })
    const nextSortOrder = (countData?.length || 0) + 1

    const { data: insertData, error: insertError } = await supabase
      .from("gallery")
      .insert([
        {
          title: title || "Untitled",
          description: description || "",
          image_url,
          sort_order: nextSortOrder,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Gallery insert error:", insertError)
      return NextResponse.json({ error: "Failed to add image" }, { status: 500 })
    }

    return NextResponse.json(insertData, { status: 201 })
  } catch (error) {
    console.error("[v0] Gallery POST error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to add image" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, sort_order } = body

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
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

    const { data: updateData, error: updateError } = await supabase
      .from("gallery")
      .update({
        title: title || "Untitled",
        description: description || "",
        sort_order: sort_order ?? undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Gallery update error:", updateError)
      return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
    }

    return NextResponse.json(updateData, { status: 200 })
  } catch (error) {
    console.error("[v0] Gallery PUT error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update image" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
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

    const { error: deleteError } = await supabase.from("gallery").delete().eq("id", id)

    if (deleteError) {
      console.error("[v0] Gallery delete error:", deleteError)
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Gallery DELETE error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete image" },
      { status: 500 },
    )
  }
}
