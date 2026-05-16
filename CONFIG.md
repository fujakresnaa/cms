# Configuration Guide

This document explains the environment variables and configuration used in the project.

## Environment Variables (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Connection string for the PostgreSQL database. | **Yes** | `postgresql://user:pass@host:5432/db` |

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

### Local Storage
Used for Gallery images and file uploads. Files are stored in the `public/uploads` directory.
