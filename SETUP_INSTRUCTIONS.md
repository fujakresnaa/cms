# Complete Setup Instructions

## Initial Setup

### 1. Environment Configuration

Create `.env` file (or `.env.local` for local dev overriding defaults) with the following. Use `CONFIG.md` for a detailed reference.

```env
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mrc_cms"

# Node Environment
NODE_ENV=production
```

### 2. Database Setup

The project uses a centralized migration script to set up the database schema.

#### Run Migration
Ensure your database is running (see Docker section below) and `DATABASE_URL` is set correctly.

```bash
npm run migrate
```
This command executes `scripts/schema.sql` which creates all necessary tables, indexes, and initial seed data.

### 3. Verify Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000
```

## Docker Deployment (Recommended)

You can run the entire stack (Application + Database) using Docker Compose.

### Local Docker Run

```bash
# Start App and Database
docker-compose up -d --build

# Run Migration (First time only)
# Note: You need Node.js installed on your host to run this, or exec into the container
npm run migrate

# View logs
docker-compose logs -f

# Access application at http://localhost:3000
```

### Stopping
```bash
docker-compose down
```

## Database Tables Reference

| Table | Purpose |
|-------|---------|
| `members` | User registrations with vehicle info and photos |
| `contact_messages` | Contact form submissions |
| `cms_*` | Content Management tables (Hero, About, Footer, etc.) |
| `gallery` | Image gallery with order |
| `events` | Event listings |
| `admin_users` | Admin accounts |
| `admin_sessions` | Admin login sessions |

## API Testing

### Register Member
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "namaLengkap": "John Doe",
    "alamatEmail": "john@example.com",
    "nomorTelephone": "+628123456789",
    "tipeMobile": "C180",
    "tahunKendaraan": "2020",
    "chapterDomisili": "Jakarta",
    "nomorPolisi": "B 1234 ABC"
  }'
```

## Troubleshooting

- **Database Connection Error**: Check if `DATABASE_URL` is correct and the Postgres server is running.
- **Migration Failed**: Ensure the database user has permissions to create tables and extensions (`pgcrypto`).
- **Image Uploads**: Verify `public/uploads` directory exists and has write permissions.
