import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
    else if (!/^(\+62|08)[0-9]{9,}$/.test(nomorTelephone.replace(/\s/g, ""))) {
      errors.nomorTelephone = "Invalid Indonesian phone number"
    }

    if (!nomorPolisi?.trim()) errors.nomorPolisi = "License plate is required"
    if (!chapterDomisili?.trim()) errors.chapterDomisili = "City is required"
    if (!tipeMobile?.trim()) errors.tipeMobile = "Car variant is required"
    if (!tahunKendaraan?.trim()) errors.tahunKendaraan = "Year car is required"

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    let photoUrl: string | null = null

    if (fotoKendaraan) {
      try {
        const supabase = await createClient()
        const fileBuffer = await fotoKendaraan.arrayBuffer()
        const filename = `${Date.now()}-${fotoKendaraan.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
        const filepath = `member-photos/${filename}`

        const { data, error: uploadError } = await supabase.storage
          .from("member-uploads")
          .upload(filepath, fileBuffer, {
            contentType: fotoKendaraan.type,
            upsert: false,
          })

        if (uploadError) {
          console.error("[v0] Image upload error:", uploadError)
          errors.fotoKendaraan = "Failed to upload image"
          return NextResponse.json({ errors }, { status: 400 })
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("member-uploads").getPublicUrl(filepath)
        photoUrl = publicUrl
      } catch (uploadError) {
        console.error("[v0] Image upload error:", uploadError)
        errors.fotoKendaraan = "Failed to upload image"
        return NextResponse.json({ errors }, { status: 400 })
      }
    }

    const { createMember } = await import("@/lib/database")

    const newMember = await createMember({
      full_name: namaLengkap,
      email: alamatEmail,
      phone_number: nomorTelephone,
      city: chapterDomisili,
      car_variant: tipeMobile,
      year_car: tahunKendaraan,
      license_plate: nomorPolisi,
      photo_url: photoUrl,
      status: "pending",
    })

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: newMember,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const { getAllMembers } = await import("@/lib/database")
    const members = await getAllMembers()
    return NextResponse.json({ members }, { status: 200 })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
