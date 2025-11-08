import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Contact API] Error fetching messages:", error)
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    return NextResponse.json({ data: data || [] }, { status: 200 })
  } catch (error) {
    console.error("[Contact API] Contact messages error:", error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Contact API] POST request started")
    
    const body = await request.json()
    const { first_name, last_name, email, message } = body

    console.log("[Contact API] Contact form submission:", { first_name, last_name, email, messageLength: message?.length })

    // Validation
    const errors: Record<string, string> = {}

    if (!first_name?.trim()) errors.first_name = "First name is required"
    if (!last_name?.trim()) errors.last_name = "Last name is required"
    if (!email?.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format"
    }
    if (!message?.trim()) errors.message = "Message is required"

    if (Object.keys(errors).length > 0) {
      console.log("[Contact API] Validation errors:", errors)
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log("[Contact API] Environment check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl
    })
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("[Contact API] Missing Supabase environment variables")
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("[Contact API] Attempting to insert data...")

    const insertData = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    }

    console.log("[Contact API] Insert data:", insertData)

    const { data, error } = await supabase
      .from("contact_messages")
      .insert([insertData])
      .select()

    console.log("[Contact API] Supabase response:", { data, error })

    if (error) {
      console.error("[Contact API] Database error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log("[Contact API] Message saved successfully:", data)

    return NextResponse.json(
      {
        success: true,
        message: "Message submitted successfully! We'll get back to you soon.",
        data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Contact API] Contact form error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send message",
      },
      { status: 500 },
    )
  }
}