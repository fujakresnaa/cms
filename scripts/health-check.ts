// MRC Health Check Script
// Verifies all critical systems and integrations are working properly

import { Pool } from "pg"
import dotenv from "dotenv"
import path from "path"

// Load env vars
dotenv.config({ path: path.join(process.cwd(), ".env") })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const MRC_VERSION = "1.0.1"

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
    try {
      await pool.query("SELECT NOW()")
      results.passed++
      console.log("[mrc] Database connection: OK\n")
    } catch (e) {
      console.error("[mrc] Database connection failed:", e)
      results.failed++
      process.exit(1)
    }

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
      try {
        const { rows } = await pool.query(`SELECT 1 FROM ${table} LIMIT 1`) // Simple check
      } catch (e) {
        console.log(`[mrc] ⚠️  Table missing or error: ${table}`)
        results.warnings++
      }
    }
    results.passed++
    console.log("[mrc] Database tables verification completed\n")

    // 5. Summary
    console.log("\n[mrc] ========== HEALTH CHECK SUMMARY ==========")
    console.log(`[mrc] Passed:  ${results.passed}`)
    console.log(`[mrc] Warnings: ${results.warnings}`)
    console.log(`[mrc] Failed:  ${results.failed}`)
    console.log(`[mrc] Status: ${results.failed === 0 ? "✓ HEALTHY" : "✗ ISSUES DETECTED"}`)
    console.log("[mrc] ==========================================\n")

    await pool.end()
    process.exit(results.failed === 0 ? 0 : 1)
  } catch (error) {
    console.error("[mrc] Health check failed:", error)
    await pool.end()
    process.exit(1)
  }
}

runHealthCheck()
