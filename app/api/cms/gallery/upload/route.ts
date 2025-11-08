import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    console.log("[v0] Upload request received:", { 
      hasFile: !!file, 
      fileName: file?.name, 
      fileSize: file?.size,
      title, 
      description 
    })

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, PNG, WebP and GIF are allowed" 
      }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
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
            } catch {
              // Ignore cookie errors in API routes
            }
          },
        },
      },
    )

    // Generate unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase() || 'jpg'
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log("[v0] Uploading to Supabase Storage:", { fileName, fileSize: buffer.length })

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error("[v0] Supabase upload error:", uploadError)
      return NextResponse.json({ 
        error: "Failed to upload image to storage: " + uploadError.message 
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl
    console.log("[v0] Image uploaded successfully:", { imageUrl })

    // Get next sort order
    const { data: countData } = await supabase.from("gallery").select("id", { count: "exact" })
    const nextSortOrder = (countData?.length || 0) + 1

    // Save to database
    const { data: galleryData, error: galleryError } = await supabase
      .from("gallery")
      .insert([
        {
          title: title || file.name,
          description: description || "",
          image_url: imageUrl,
          sort_order: nextSortOrder,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (galleryError) {
      console.error("[v0] Gallery insert error:", galleryError)
      // If database insert fails, try to delete the uploaded file
      await supabase.storage.from('gallery-images').remove([fileName])
      return NextResponse.json({ 
        error: "Failed to save image to gallery: " + galleryError.message 
      }, { status: 500 })
    }

    console.log("[v0] Gallery entry created successfully:", galleryData)
    return NextResponse.json(galleryData, { status: 201 })
    
  } catch (error) {
    console.error("[v0] Gallery upload error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to upload image",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 },
    )
  }
}