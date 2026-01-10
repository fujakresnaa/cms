import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Use a separate pool for migration to ensure fresh connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.MIGRATION_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.MIGRATION_SECRET) {
        return NextResponse.json({ error: 'Migration secret not configured' }, { status: 500 });
    }

    try {
        const schemaPath = path.join(process.cwd(), 'scripts', 'schema.sql');

        if (!fs.existsSync(schemaPath)) {
            return NextResponse.json({ error: 'Schema file not found' }, { status: 500 });
        }

        const sql = fs.readFileSync(schemaPath, 'utf-8');

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        return NextResponse.json({
            status: 'success',
            message: 'Migration completed successfully'
        });
    } catch (error: any) {
        console.error('Migration failed:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
