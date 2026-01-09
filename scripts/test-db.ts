import { Pool } from "pg"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

console.log("Connecting to:", process.env.DATABASE_URL)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Connection error:", err)
        process.exit(1)
    }
    console.log("Connection success:", res.rows[0])
    pool.end()
})
