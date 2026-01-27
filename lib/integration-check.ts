// Integration Health Check Module
// Used by API routes and admin dashboard to verify all systems

export interface IntegrationStatus {
  database: boolean
  supabase: boolean
  cms: boolean
  api: boolean
  timestamp: string
}

export async function checkIntegrations(): Promise<IntegrationStatus> {
  const status: IntegrationStatus = {
    database: false,
    supabase: false,
    cms: false,
    api: false,
    timestamp: new Date().toISOString(),
  }

  try {
    // Check Database connection using pg pool
    const pool = (await import("@/lib/db")).default
    const client = await pool.connect()
    try {
      const { rows } = await client.query("SELECT 1 as health_check")
      status.database = rows.length > 0
      status.supabase = true // Keep true for compatibility if needed, or set to same as database
    } finally {
      client.release()
    }

    // Check CMS
    try {
      const response = await fetch("/api/cms/about")
      status.cms = response.ok
    } catch (e) {
      status.cms = false
    }

    // Check API health
    try {
      const response = await fetch("/api/admin/stats")
      status.api = response.ok
    } catch (e) {
      status.api = false
    }
  } catch (error) {
    console.error("[mrc] Integration check failed:", error)
  }

  return status
}

export function areAllIntegrationsHealthy(status: IntegrationStatus): boolean {
  return status.database && status.supabase && status.cms && status.api
}
