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

    const { data, error } = await supabase.from("cms_contact").select("*").limit(1)

    if (error) {
      return NextResponse.json({
        id: "default",
        title: "Get in Touch",
        description: "Our friendly team would love to hear from you. Send us a message anytime.",
        phone: "+62 XXX XXXX XXXX",
        email: "info@mbw205ci.com",
      })
    }

    const contactData = data && data.length > 0 ? data[0] : null

    if (!contactData) {
      return NextResponse.json({
        id: "default",
        title: "Get in Touch",
        description: "Our friendly team would love to hear from you. Send us a message anytime.",
        phone: "+62 XXX XXXX XXXX",
        email: "info@mbw205ci.com",
      })
    }

    return NextResponse.json(contactData)
  } catch (error) {
    console.error("[v0] Contact API error:", error)
    return NextResponse.json({
      id: "default",
      title: "Get in Touch",
      description: "Our friendly team would love to hear from you. Send us a message anytime.",
      phone: "+62 XXX XXXX XXXX",
      email: "info@mbw205ci.com",
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

    const { data: existingData, error: fetchError } = await supabase.from("cms_contact").select("id").limit(1)

    let result
    if (!existingData || existingData.length === 0) {
      // Insert if no record exists
      const { data, error } = await supabase.from("cms_contact").insert([body]).select().limit(1)
      if (error) {
        return NextResponse.json({ error: "Failed to create contact config" }, { status: 500 })
      }
      result = data && data.length > 0 ? data[0] : null
    } else {
      // Update existing record
      const { data, error } = await supabase
        .from("cms_contact")
        .update(body)
        .eq("id", body.id || existingData[0].id)
        .select()
        .limit(1)

      if (error) {
        return NextResponse.json({ error: "Failed to update contact config" }, { status: 500 })
      }
      result = data && data.length > 0 ? data[0] : null
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Contact PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
