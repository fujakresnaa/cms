import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// Cache control headers
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
  "Last-Modified": new Date().toUTCString(),
}

export async function GET() {
  try {
    console.log("[Hero API] GET request started")

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

    // Add timestamp to force fresh data
    const timestamp = Date.now()
    const { data, error } = await supabase
      .from("cms_hero")
      .select("*")
      .limit(1)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("[Hero API] Supabase error:", error)
      return NextResponse.json(
        {
          id: "default",
          title: "Your Journey with MBW205CI Starts Here",
          description:
            "Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.",
          button_text: "Continue Registration →",
          background_image_url: "",
          _timestamp: timestamp,
        },
        { status: 200, headers: NO_CACHE_HEADERS },
      )
    }

    const heroData = data && data.length > 0 ? data[0] : null

    if (!heroData) {
      console.log("[Hero API] No hero data found, returning defaults")
      return NextResponse.json(
        {
          id: "default",
          title: "Your Journey with MBW205CI Starts Here",
          description:
            "Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.",
          button_text: "Continue Registration →",
          background_image_url: "",
          _timestamp: timestamp,
        },
        { headers: NO_CACHE_HEADERS },
      )
    }

    // Add timestamp to response to force cache invalidation
    const responseData = {
      ...heroData,
      _timestamp: timestamp,
    }

    console.log("[Hero API] Hero data retrieved:", responseData)
    return NextResponse.json(responseData, { headers: NO_CACHE_HEADERS })
  } catch (error) {
    console.error("[Hero API] GET exception:", error)
    return NextResponse.json(
      {
        id: "default",
        title: "Your Journey with MBW205CI Starts Here",
        description:
          "Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.",
        button_text: "Continue Registration →",
        background_image_url: "",
        _timestamp: Date.now(),
      },
      { status: 200, headers: NO_CACHE_HEADERS },
    )
  }
}

export async function PUT(req: NextRequest) {
  console.log("[Hero API] PUT request started")

  try {
    // Parse request body
    let body
    try {
      body = await req.json()
      console.log("[Hero API] Request body:", JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error("[Hero API] JSON parse error:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details: parseError instanceof Error ? parseError.message : "Parse error",
        },
        { status: 400, headers: NO_CACHE_HEADERS },
      )
    }

    // Validate required fields
    if (!body || typeof body !== "object") {
      console.error("[Hero API] Invalid body type:", typeof body)
      return NextResponse.json(
        { error: "Request body must be a valid JSON object" },
        { status: 400, headers: NO_CACHE_HEADERS },
      )
    }

    if (!body.title || !body.description) {
      console.error("[Hero API] Missing required fields:", {
        hasTitle: !!body.title,
        hasDescription: !!body.description,
      })
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400, headers: NO_CACHE_HEADERS },
      )
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

    // Clean the update data - remove frontend-only fields
    const updateData = {
      title: body.title,
      description: body.description,
      button_text: body.button_text || "Continue Registration →",
      background_image_url: body.background_image_url || "",
      updated_at: new Date().toISOString(),
    }

    console.log("[Hero API] Clean update data:", updateData)

    // Check if we have an ID to update
    if (body.id && body.id !== "default") {
      // Try to update existing record by ID
      const { data, error } = await supabase
        .from("cms_hero")
        .update(updateData)
        .eq("id", body.id)
        .select()
        .single()

      if (error) {
        console.error("[Hero API] Update by ID error:", error)
        // If update by ID fails, try to get the first record and update it
        const { data: existingData, error: fetchError } = await supabase
          .from("cms_hero")
          .select("id")
          .limit(1)
          .single()

        if (fetchError || !existingData) {
          console.error("[Hero API] No existing record found, creating new:", fetchError)
          // Create new record
          const { data: newData, error: insertError } = await supabase
            .from("cms_hero")
            .insert([updateData])
            .select()
            .single()

          if (insertError) {
            console.error("[Hero API] Insert error:", insertError)
            return NextResponse.json(
              { error: "Failed to create hero config", details: insertError.message },
              { status: 500, headers: NO_CACHE_HEADERS }
            )
          }

          const responseData = {
            ...newData,
            _timestamp: Date.now(),
          }
          console.log("[Hero API] Hero created successfully:", responseData)
          return NextResponse.json(responseData, { headers: NO_CACHE_HEADERS })
        } else {
          // Update the existing record
          const { data: updatedData, error: updateError } = await supabase
            .from("cms_hero")
            .update(updateData)
            .eq("id", existingData.id)
            .select()
            .single()

          if (updateError) {
            console.error("[Hero API] Update existing record error:", updateError)
            return NextResponse.json(
              { error: "Failed to update hero config", details: updateError.message },
              { status: 500, headers: NO_CACHE_HEADERS }
            )
          }

          const responseData = {
            ...updatedData,
            _timestamp: Date.now(),
          }
          console.log("[Hero API] Hero updated successfully:", responseData)
          return NextResponse.json(responseData, { headers: NO_CACHE_HEADERS })
        }
      } else {
        const responseData = {
          ...data,
          _timestamp: Date.now(),
        }
        console.log("[Hero API] Hero updated by ID successfully:", responseData)
        return NextResponse.json(responseData, { headers: NO_CACHE_HEADERS })
      }
    } else {
      // No ID provided, update the first record or create new
      const { data: existingData, error: fetchError } = await supabase
        .from("cms_hero")
        .select("id")
        .limit(1)
        .single()

      if (fetchError || !existingData) {
        // Create new record
        const { data: newData, error: insertError } = await supabase
          .from("cms_hero")
          .insert([updateData])
          .select()
          .single()

        if (insertError) {
          console.error("[Hero API] Insert error:", insertError)
          return NextResponse.json(
            { error: "Failed to create hero config", details: insertError.message },
            { status: 500, headers: NO_CACHE_HEADERS }
          )
        }

        const responseData = {
          ...newData,
          _timestamp: Date.now(),
        }
        console.log("[Hero API] Hero created successfully:", responseData)
        return NextResponse.json(responseData, { headers: NO_CACHE_HEADERS })
      } else {
        // Update existing record
        const { data: updatedData, error: updateError } = await supabase
          .from("cms_hero")
          .update(updateData)
          .eq("id", existingData.id)
          .select()
          .single()

        if (updateError) {
          console.error("[Hero API] Update error:", updateError)
          return NextResponse.json(
            { error: "Failed to update hero config", details: updateError.message },
            { status: 500, headers: NO_CACHE_HEADERS }
          )
        }

        const responseData = {
          ...updatedData,
          _timestamp: Date.now(),
        }
        console.log("[Hero API] Hero updated successfully:", responseData)
        return NextResponse.json(responseData, { headers: NO_CACHE_HEADERS })
      }
    }
  } catch (error) {
    console.error("[Hero API] Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: NO_CACHE_HEADERS },
    )
  }
}