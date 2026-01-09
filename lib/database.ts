import pool from "./db"
import { cookies } from "next/headers"

// Helper to check authentication
async function requireAuth() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("admin_session")?.value

  if (!sessionToken) {
    throw new Error("Unauthorized")
  }

  const { rows } = await pool.query(
    "SELECT * FROM admin_sessions WHERE session_token = $1 AND expires_at > NOW()",
    [sessionToken]
  )

  if (rows.length === 0) {
    throw new Error("Unauthorized")
  }

  return rows[0]
}

// Get all members with optional filtering
export async function getAllMembers(status?: string) {
  await requireAuth()

  let query = "SELECT * FROM members"
  const params: any[] = []

  if (status) {
    query += " WHERE status = $1"
    params.push(status)
  }

  query += " ORDER BY created_at DESC"

  try {
    const { rows } = await pool.query(query, params)
    return rows
  } catch (error) {
    console.error("[mrc] Error fetching members:", error)
    throw new Error("Failed to fetch members")
  }
}

// Get member by ID
export async function getMemberById(id: string) {
  await requireAuth()

  try {
    const { rows } = await pool.query("SELECT * FROM members WHERE id = $1", [id])
    return rows[0]
  } catch (error) {
    console.error("[mrc] Error fetching member:", error)
    throw new Error("Failed to fetch member")
  }
}

// Update member status
export async function updateMemberStatus(id: string, status: string) {
  await requireAuth()

  try {
    const { rows } = await pool.query(
      `UPDATE members 
       SET status = $2, updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id, status]
    )

    if (rows.length === 0) {
      throw new Error("Member not found")
    }

    return rows[0]
  } catch (error) {
    console.error("[mrc] Error updating member:", error)
    throw new Error("Failed to update member")
  }
}

// Create new member
export async function createMember(memberData: any) {
  const columns = Object.keys(memberData).join(", ")
  const values = Object.values(memberData)
  const placehorders = values.map((_, i) => `$${i + 1}`).join(", ")

  try {
    const { rows } = await pool.query(
      `INSERT INTO members (${columns}) VALUES (${placehorders}) RETURNING *`,
      values
    )
    return rows[0]
  } catch (error) {
    console.error("Error creating member:", error)
    throw new Error("Failed to create member")
  }
}

// Get dashboard stats
export async function getDashboardStats() {
  await requireAuth()

  try {
    const [membersRes, pendingRes, approvedRes, eventsRes] = await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM members"),
      pool.query("SELECT COUNT(*) as count FROM members WHERE status = 'pending'"),
      pool.query("SELECT COUNT(*) as count FROM members WHERE status = 'approved'"),
      pool.query("SELECT COUNT(*) as count FROM events"),
    ])

    return {
      totalMembers: parseInt(membersRes.rows[0].count),
      pendingApprovals: parseInt(pendingRes.rows[0].count),
      approvedMembers: parseInt(approvedRes.rows[0].count),
      totalEvents: parseInt(eventsRes.rows[0].count),
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalMembers: 0,
      pendingApprovals: 0,
      approvedMembers: 0,
      totalEvents: 0,
    }
  }
}

// Get all events
export async function getAllEvents() {
  try {
    const { rows } = await pool.query("SELECT * FROM events ORDER BY created_at DESC")
    return rows
  } catch (error) {
    console.error("Error fetching events:", error)
    throw new Error("Failed to fetch events")
  }
}

// Get showcase items
export async function getShowcase() {
  try {
    const { rows } = await pool.query("SELECT * FROM showcase ORDER BY created_at DESC")
    return rows
  } catch (error) {
    console.error("Error fetching showcase:", error)
    throw new Error("Failed to fetch showcase")
  }
}

// Create contact message
export async function createContactMessage(messageData: any) {
  const columns = Object.keys(messageData).join(", ")
  const values = Object.values(messageData)
  const placehorders = values.map((_, i) => `$${i + 1}`).join(", ")

  try {
    const { rows } = await pool.query(
      `INSERT INTO contact_messages (${columns}) VALUES (${placehorders}) RETURNING *`,
      values
    )
    return rows[0]
  } catch (error) {
    console.error("Error creating contact message:", error)
    throw new Error("Failed to send message")
  }
}

export async function softDeleteMember(id: string) {
  await requireAuth()

  try {
    const { rows } = await pool.query(
      `UPDATE members 
       SET deleted_at = NOW(), updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id]
    )

    if (rows.length === 0) {
      throw new Error("Member not found")
    }

    return rows[0]
  } catch (error) {
    console.error("[mrc] Error soft deleting member:", error)
    throw new Error("Failed to delete member")
  }
}

export async function restoreMember(id: string) {
  await requireAuth()

  try {
    const { rows } = await pool.query(
      `UPDATE members 
       SET deleted_at = NULL, updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id]
    )

    if (rows.length === 0) {
      throw new Error("Member not found")
    }

    return rows[0]
  } catch (error) {
    console.error("[mrc] Error restoring member:", error)
    throw new Error("Failed to restore member")
  }
}
