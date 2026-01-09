# Configuration Guide

This document explains the environment variables and configuration used in the project.

## Environment Variables (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Connection string for the PostgreSQL database. | **Yes** | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL of your Supabase project (used for Storage/Auth). | **Yes** | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous key for Supabase client. | **Yes** | `eyJ...` |
| `NODE_ENV` | Environment mode (`development` or `production`). | No | `production` |

## Database Configuration

The application uses **PostgreSQL**.

- **Client**: `pg` (node-postgres)
- **Migration**: Centralized script at `scripts/schema.sql`
- **Runner**: `scripts/run-migrations.ts`

To change the database configuration (e.g., pool size), edit `lib/db.ts`.

## Docker Configuration

The `docker-compose.yml` sets up:
1.  **App**: The Next.js application (Port 3000).
2.  **DB**: A PostgreSQL 15 container (Port 5432).

**Volumes:**
- `postgres_data`: Persists database files.

## External Services

### Supabase
Used strictly for **File Storage** (Gallery images) and potentially Auth integration on the client side. The main application data lives in your own Postgres database.
