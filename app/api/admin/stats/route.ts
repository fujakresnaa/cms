import { NextResponse } from "next/server"
import { getDashboardStats, getAllMembers } from "@/lib/database"

export async function GET() {
  try {
    const stats = await getDashboardStats()
    const allMembers = await getAllMembers()

    // Get recent registrations (last 5)
    const recentRegistrations = allMembers.slice(0, 5).map((m: any) => ({
      id: m.id,
      name: m.full_name,
      email: m.email,
      status: m.status,
      registeredAt: m.created_at,
    }))

    return NextResponse.json(
      {
        totalMembers: stats.totalMembers,
        pendingApprovals: stats.pendingApprovals,
        approvedMembers: stats.approvedMembers,
        totalEvents: stats.totalEvents,
        recentRegistrations,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
