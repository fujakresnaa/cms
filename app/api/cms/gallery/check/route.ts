import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { existsSync, statSync } from 'fs';
import path from 'path';

// GET: List gallery items with file status
// DELETE: Remove broken images from DB
export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('admin_session')?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { rows } = await pool.query('SELECT id, title, image_url FROM gallery ORDER BY created_at DESC');

        const results = rows.map((item: any) => {
            const filePath = path.join(process.cwd(), 'public', item.image_url);
            let status = 'unknown';
            let size = 0;

            if (existsSync(filePath)) {
                const stats = statSync(filePath);
                size = stats.size;
                status = size > 0 ? 'ok' : 'empty';
            } else {
                status = 'missing';
            }

            return {
                id: item.id,
                title: item.title,
                image_url: item.image_url,
                status,
                size,
            };
        });

        const broken = results.filter((r: any) => r.status !== 'ok');

        return NextResponse.json({
            total: results.length,
            broken: broken.length,
            items: results,
        });
    } catch (error: any) {
        console.error('[mrc] Gallery check error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Clean up broken gallery entries
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('admin_session')?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { rows } = await pool.query('SELECT id, image_url FROM gallery');

        let deleted = 0;
        for (const item of rows) {
            const filePath = path.join(process.cwd(), 'public', item.image_url);
            let isBroken = false;

            if (!existsSync(filePath)) {
                isBroken = true;
            } else {
                const stats = statSync(filePath);
                if (stats.size === 0) {
                    isBroken = true;
                }
            }

            if (isBroken) {
                await pool.query('DELETE FROM gallery WHERE id = $1', [item.id]);
                deleted++;
            }
        }

        return NextResponse.json({
            message: `Cleaned up ${deleted} broken gallery entries`,
            deleted,
        });
    } catch (error: any) {
        console.error('[mrc] Gallery cleanup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
