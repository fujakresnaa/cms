import { NextResponse } from "next/server"
import { getAllEvents } from "@/lib/database"

export async function GET() {
  try {
    const events = await getAllEvents()
    return NextResponse.json({ data: events }, { status: 200 })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
