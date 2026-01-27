import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { writeFile } from "fs/promises"
import { existsSync, mkdirSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const namaLengkap = formData.get("namaLengkap") as string
    const alamatEmail = formData.get("alamatEmail") as string
    const nomorTelephone = formData.get("nomorTelephone") as string
    const tipeMobile = formData.get("tipeMobile") as string
    const tahunKendaraan = formData.get("tahunKendaraan") as string
    const chapterDomisili = formData.get("chapterDomisili") as string
    const nomorPolisi = formData.get("nomorPolisi") as string
    const fotoKendaraan = formData.get("fotoKendaraan") as File | null

    // Validation
    const errors: Record<string, string> = {}

    if (!namaLengkap?.trim()) errors.namaLengkap = "Full name is required"
    if (!alamatEmail?.trim()) errors.alamatEmail = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alamatEmail)) {
      errors.alamatEmail = "Invalid email format"
    }

    if (!nomorTelephone?.trim()) errors.nomorTelephone = "Phone number is required"
    if (!nomorPolisi?.trim()) errors.nomorPolisi = "License plate is required"
    if (!chapterDomisili?.trim()) errors.chapterDomisili = "City is required"
    if (!tipeMobile?.trim()) errors.tipeMobile = "Car variant is required"
    if (!tahunKendaraan?.trim()) errors.tahunKendaraan = "Year car is required"

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    let photoUrl: string | null = null

    if (fotoKendaraan) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(fotoKendaraan.type)) {
        return NextResponse.json({ errors: { fotoKendaraan: "Invalid file type" } }, { status: 400 })
      }

      try {
        const fileBuffer = await fotoKendaraan.arrayBuffer()
        const buffer = Buffer.from(fileBuffer)

        // Log file info for debugging
        console.log(`[mrc] Registration upload: ${fotoKendaraan.name}, Size: ${buffer.length} bytes, Type: ${fotoKendaraan.type}`)

        // If file is empty, skip writing but don't error (useful for curl tests / mobile-only fields)
        if (buffer.length > 0) {
          // Ensure uploads directory exists
          const uploadsDir = path.join(process.cwd(), "public", "uploads")
          if (!existsSync(uploadsDir)) {
            mkdirSync(uploadsDir, { recursive: true })
          }

          const filename = `${Date.now()}-${fotoKendaraan.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
          const filePath = path.join(uploadsDir, filename)
          photoUrl = `/uploads/${filename}`

          await writeFile(filePath, buffer)
          console.log(`[mrc] Registration file written to: ${filePath}`)
        }
      } catch (uploadError) {
        console.error("[mrc] Image upload error:", uploadError)
        errors.fotoKendaraan = "Failed to upload image"
        return NextResponse.json({ errors }, { status: 500 })
      }
    }

    // Insert into DB using pg
    const { rows } = await pool.query(
      `INSERT INTO members 
      (full_name, email, phone_number, city, car_variant, year_car, license_plate, photo_url, status, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
      RETURNING *`,
      [
        namaLengkap,
        alamatEmail,
        nomorTelephone,
        chapterDomisili,
        tipeMobile,
        tahunKendaraan,
        nomorPolisi,
        photoUrl,
        "pending"
      ]
    )

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: rows[0],
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    // Handle duplicate key error (Postgres code 23505)
    if (error?.code === '23505') {
      const isEmail = error.detail?.toLowerCase().includes("email")
      const isLicense = error.detail?.toLowerCase().includes("license_plate")

      const errors: Record<string, string> = {}
      if (isEmail) errors.alamatEmail = "This email is already registered"
      else if (isLicense) errors.nomorPolisi = "This license plate is already registered"
      else errors.submit = "This data is already registered"

      return NextResponse.json({ errors }, { status: 409 })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Use pg to fetch members
    const { rows } = await pool.query("SELECT * FROM members ORDER BY created_at DESC")
    return NextResponse.json({ members: rows }, { status: 200 })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
