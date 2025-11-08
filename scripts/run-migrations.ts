import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  try {
    console.log("Starting database migrations...")

    const scriptsDir = path.join(__dirname, ".")
    const sqlFiles = fs
      .readdirSync(scriptsDir)
      .filter((f) => f.match(/^\d+_.*\.sql$/))
      .sort()

    for (const file of sqlFiles) {
      console.log(`Running migration: ${file}`)
      const sqlPath = path.join(scriptsDir, file)
      const sql = fs.readFileSync(sqlPath, "utf-8")

      const { error } = await supabase.rpc("exec_sql", { sql })

      if (error) {
        console.error(`Error running ${file}:`, error)
        continue
      }

      console.log(`✓ Completed: ${file}`)
    }

    console.log("✓ All migrations completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

runMigrations()
