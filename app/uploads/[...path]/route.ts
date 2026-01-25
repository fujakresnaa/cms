import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params
        const filePath = resolvedParams.path.join("/")
        const cwd = process.cwd()
        const fullPath = path.join(cwd, "public", "uploads", filePath)

        console.log(`[mrc-serve] Request: ${filePath}`)
        console.log(`[mrc-serve] CWD: ${cwd}`)
        console.log(`[mrc-serve] Full Path: ${fullPath}`)
        console.log(`[mrc-serve] Exists: ${existsSync(fullPath)}`)

        if (!existsSync(fullPath)) {
            // Try fallback to app/public/uploads if standalone structure is weird
            const fallbackPath = path.join(cwd, "uploads", filePath)
            console.log(`[mrc-serve] Fallback check: ${fallbackPath}`)

            if (existsSync(fallbackPath)) {
                console.log(`[mrc-serve] Found in fallback!`)
                const fileBuffer = await readFile(fallbackPath)
                return serveFile(fileBuffer, fallbackPath)
            }

            return new NextResponse("File not found", { status: 404 })
        }

        const fileBuffer = await readFile(fullPath)
        return serveFile(fileBuffer, fullPath)

    } catch (error) {
        console.error("[mrc-serve] Error serving file:", error)
        return new NextResponse("Error serving file", { status: 500 })
    }
}

function serveFile(fileBuffer: Buffer, fullPath: string) {
    const ext = path.extname(fullPath).toLowerCase()
    let contentType = "application/octet-stream"

    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg"
    else if (ext === ".png") contentType = "image/png"
    else if (ext === ".webp") contentType = "image/webp"
    else if (ext === ".gif") contentType = "image/gif"
    else if (ext === ".svg") contentType = "image/svg+xml"

    return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    })
}
