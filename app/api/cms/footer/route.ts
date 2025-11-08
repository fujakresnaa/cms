import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getDefaultFooter() {
  return {
    id: "default",
    company_name: "Mercedes-Benz W205CI Club Indonesia",
    description: "Your Ultimate Community for W205CI Enthusiasts",
    phone: "+62 123 456 7890",
    email: "contact@mbw205ci.id",
    address: "Indonesia",
    copyright_year: new Date().getFullYear(),
    copyright_text: "Mercedes-Benz W205CI Club Indonesia. All rights reserved.",
  }
}

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

    const { data, error } = await supabase.from("cms_footer").select("*").limit(1)

    if (error) {
      console.error("[v0] Footer fetch error:", error)
      return NextResponse.json(getDefaultFooter(), { status: 200 })
    }

    // Return first record if exists, otherwise return default
    if (data && data.length > 0) {
      return NextResponse.json(data[0], { status: 200 })
    }

    return NextResponse.json(getDefaultFooter(), { status: 200 })
  } catch (error) {
    console.error("[v0] Footer error:", error)
    return NextResponse.json(getDefaultFooter(), { status: 200 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

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

    const { data: existingData, error: selectError } = await supabase.from("cms_footer").select("id").limit(1)

    let result

    if (!selectError && existingData && existingData.length > 0) {
      // Update existing record
      result = await supabase
        .from("cms_footer")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingData[0].id)
        .select()
    } else {
      // Insert new record if none exists
      result = await supabase
        .from("cms_footer")
        .insert([
          {
            ...updateData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
    }

    const { data, error } = result

    if (error) {
      console.error("[v0] Footer update error:", error)
      return NextResponse.json({ error: "Failed to update footer" }, { status: 500 })
    }

    return NextResponse.json(data?.[0], { status: 200 })
  } catch (error) {
    console.error("[v0] Footer update error:", error)
    return NextResponse.json({ error: "Failed to update footer" }, { status: 500 })
  }
}
