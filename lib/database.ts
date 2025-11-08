import { createClient } from "./supabase/server"

// Get all members with optional filtering
export async function getAllMembers(status?: string) {
  const supabase = await createClient()

  let query = supabase.from("members").select("*")

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("[mrc] Error fetching members:", error)
    throw new Error("Failed to fetch members")
  }

  return data || []
}

// Get member by ID
export async function getMemberById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("members").select("*").eq("id", id).single()

  if (error) {
    console.error("[mrc] Error fetching member:", error)
    throw new Error("Failed to fetch member")
  }

  return data
}

// Update member status
export async function updateMemberStatus(id: string, status: string) {
  const supabase = await createClient()

  const { data: existingMember, error: fetchError } = await supabase.from("members").select("id").eq("id", id).single()

  if (fetchError || !existingMember) {
    console.error("[mrc] Member not found with ID:", id)
    throw new Error("Member not found")
  }

  const { data, error } = await supabase
    .from("members")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[mrc] Error updating member:", error)
    throw new Error("Failed to update member")
  }

  return data
}

// Create new member
export async function createMember(memberData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("members").insert([memberData]).select().single()

  if (error) {
    console.error("Error creating member:", error)
    throw new Error("Failed to create member")
  }

  return data
}

// Get dashboard stats
export async function getDashboardStats() {
  const supabase = await createClient()

  const [allMembers, pending, approved, events] = await Promise.all([
    supabase.from("members").select("id"),
    supabase.from("members").select("id").eq("status", "pending"),
    supabase.from("members").select("id").eq("status", "approved"),
    supabase.from("events").select("id"),
  ])

  return {
    totalMembers: allMembers.data?.length || 0,
    pendingApprovals: pending.data?.length || 0,
    approvedMembers: approved.data?.length || 0,
    totalEvents: events.data?.length || 0,
  }
}

// Get all events
export async function getAllEvents() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching events:", error)
    throw new Error("Failed to fetch events")
  }

  return data || []
}

// Get showcase items
export async function getShowcase() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("showcase").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching showcase:", error)
    throw new Error("Failed to fetch showcase")
  }

  return data || []
}

// Create contact message
export async function createContactMessage(messageData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("contact_messages").insert([messageData]).select().single()

  if (error) {
    console.error("Error creating contact message:", error)
    throw new Error("Failed to send message")
  }

  return data
}

export async function softDeleteMember(id: string) {
  const supabase = await createClient()

  const { data: existingMember, error: fetchError } = await supabase.from("members").select("id").eq("id", id).single()

  if (fetchError || !existingMember) {
    console.error("[mrc] Member not found with ID:", id)
    throw new Error("Member not found")
  }

  const { data, error } = await supabase
    .from("members")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[mrc] Error soft deleting member:", error)
    throw new Error("Failed to delete member")
  }

  return data
}

export async function restoreMember(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("members")
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[mrc] Error restoring member:", error)
    throw new Error("Failed to restore member")
  }

  return data
}
