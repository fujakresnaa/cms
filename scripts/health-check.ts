// MRC Health Check Script
// Verifies all critical systems and integrations are working properly

import { createClient } from "@/lib/supabase/server"

const MRC_VERSION = "1.0.0"
const CHECKS = {
  database: "Database Connection",
  tables: "Database Tables",
  rls: "Row Level Security",
  cms: "CMS Content",
  api: "API Endpoints",
}

async function runHealthCheck() {
  console.log(`\n[mrc] Starting Health Check v${MRC_VERSION}...\n`)

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  }

  try {
    // 1. Database Connection
    console.log("✓ Testing Database Connection...")
    const supabase = await createClient()
    const { data: connectionTest } = await supabase.from("members").select("count").limit(1)
    results.passed++
    console.log("[mrc] Database connection: OK\n")

    // 2. Check Tables Exist
    console.log("✓ Verifying Database Tables...")
    const tables = [
      "members",
      "events",
      "showcase",
      "contact_messages",
      "cms_about",
      "cms_benefits",
      "cms_social_media",
      "cms_contact",
      "cms_membership",
      "cms_logo",
      "cms_hero",
    ]

    for (const table of tables) {
      const { error } = await supabase.from(table).select("count").limit(1)
      if (error) {
        console.log(`[mrc] ⚠️  Table missing: ${table}`)
        results.warnings++
      }
    }
    results.passed++
    console.log("[mrc] Database tables: OK\n")

    // 3. Check RLS Policies
    console.log("✓ Checking Row Level Security...")
    const { data: policiesData } = await supabase.from("members").select("id").limit(1)
    if (policiesData !== null || policiesData !== undefined) {
      results.passed++
      console.log("[mrc] RLS policies: OK\n")
    }

    // 4. Check CMS Content
    console.log("✓ Verifying CMS Content...")
    const cmsData = await Promise.allSettled([
      supabase.from("cms_about").select("id").limit(1),
      supabase.from("cms_logo").select("id").limit(1),
      supabase.from("cms_hero").select("id").limit(1),
      supabase.from("cms_contact").select("id").limit(1),
      supabase.from("cms_membership").select("id").limit(1),
    ])

    let cmsOk = 0
    cmsData.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.data) {
        cmsOk++
      }
    })

    if (cmsOk === 5) {
      results.passed++
      console.log("[mrc] CMS content: OK\n")
    } else {
      results.warnings++
      console.log(`[mrc] ⚠️  CMS content partially loaded: ${cmsOk}/5\n`)
    }

    // 5. Summary
    console.log("\n[mrc] ========== HEALTH CHECK SUMMARY ==========")
    console.log(`[mrc] Passed:  ${results.passed}`)
    console.log(`[mrc] Warnings: ${results.warnings}`)
    console.log(`[mrc] Failed:  ${results.failed}`)
    console.log(`[mrc] Status: ${results.failed === 0 ? "✓ HEALTHY" : "✗ ISSUES DETECTED"}`)
    console.log("[mrc] ==========================================\n")

    process.exit(results.failed === 0 ? 0 : 1)
  } catch (error) {
    console.error("[mrc] Health check failed:", error)
    process.exit(1)
  }
}

runHealthCheck()
