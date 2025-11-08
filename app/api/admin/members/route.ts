import { type NextRequest, NextResponse } from "next/server"
import { getAllMembers, updateMemberStatus, softDeleteMember, restoreMember } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const includeDeleted = searchParams.get("includeDeleted") === "true"

    let members = await getAllMembers()

    if (!includeDeleted) {
      members = members.filter((m: any) => !m.deleted_at)
    }

    if (status && status !== "all") {
      members = members.filter((m: any) => m.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      members = members.filter(
        (m: any) =>
          m.full_name.toLowerCase().includes(searchLower) ||
          m.email.toLowerCase().includes(searchLower) ||
          m.license_plate.toLowerCase().includes(searchLower),
      )
    }

    if (startDate || endDate) {
      members = members.filter((m: any) => {
        const memberDate = new Date(m.created_at)
        if (startDate && memberDate < new Date(startDate)) return false
        if (endDate && memberDate > new Date(endDate)) return false
        return true
      })
    }

    return NextResponse.json({ data: members }, { status: 200 })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberId, status, action } = body

    if (action === "delete") {
      const deletedMember = await softDeleteMember(memberId)
      return NextResponse.json({ data: deletedMember }, { status: 200 })
    }

    if (action === "restore") {
      const restoredMember = await restoreMember(memberId)
      return NextResponse.json({ data: restoredMember }, { status: 200 })
    }

    // Existing status update logic
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updatedMember = await updateMemberStatus(memberId, status)

    return NextResponse.json({ data: updatedMember }, { status: 200 })
  } catch (error) {
    console.error("Error updating member:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update member" },
      { status: 500 },
    )
  }
}
