import { Pool } from "pg"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error("Missing DATABASE_URL")
  process.exit(1)
}

const pool = new Pool({
  connectionString: databaseUrl,
})

async function runMigrations() {
  const client = await pool.connect()
  try {
    console.log("Starting database migrations...")
    console.log("Reading schema from scripts/schema.sql...")

    const schemaPath = path.join(process.cwd(), "scripts", "schema.sql")
    if (!fs.existsSync(schemaPath)) {
      console.error("schema.sql not found!")
      process.exit(1)
    }

    const sql = fs.readFileSync(schemaPath, "utf-8")

    console.log("Executing schema...")

    // Split by statement if needed, or run as one block. 
    // running as one block is fine for `schema.sql` usually if it doesn't have complex concurrent mixed transactions.

    await client.query("BEGIN")
    await client.query(sql)
    await client.query("COMMIT")

    console.log("✓ Schema applied successfully!")
    console.log("✓ All migrations completed!")
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Migration failed:", error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations()
