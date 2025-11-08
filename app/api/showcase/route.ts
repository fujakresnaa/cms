import { NextResponse } from "next/server"
import { getShowcase } from "@/lib/database"

export async function GET() {
  try {
    const showcase = await getShowcase()
    return NextResponse.json({ data: showcase }, { status: 200 })
  } catch (error) {
    console.error("Error fetching showcase:", error)
    return NextResponse.json({ error: "Failed to fetch showcase" }, { status: 500 })
  }
}
