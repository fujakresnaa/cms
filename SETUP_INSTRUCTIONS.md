# Complete Setup Instructions

## Initial Setup

### 1. Environment Configuration

Create `.env.local` file with:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# Node Environment
NODE_ENV=production
\`\`\`

### 2. Database Setup

#### Option A: Direct SQL Execution (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy content from `scripts/001_initial_schema.sql`
4. Execute the query
5. Repeat for `scripts/002_seed_initial_data.sql`

#### Option B: Using Migration Script

\`\`\`bash
npm run migrate
\`\`\`

### 3. Verify Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000
\`\`\`

## Key Features to Test

### Member Registration
1. Go to `/register`
2. Fill in the form with test data
3. Upload a vehicle photo
4. Submit the registration
5. Check admin panel to verify photo upload

### Admin Dashboard
1. Go to `/admin` or `/login`
2. Login with admin credentials
3. View member registrations with uploaded photos
4. Check Contact Messages tab for submissions
5. Manage footer configuration in Content tab

### Contact Messages
1. Go to home page
2. Scroll to contact section
3. Submit a message
4. View in admin panel Messages tab

### Footer Management
1. Login to admin panel
2. Go to Content → Footer Configuration
3. Update company name, description, contact info
4. Save changes
5. Check homepage footer for updates

## Docker Deployment

### Local Docker Testing

\`\`\`bash
# Build image
npm run docker:build

# Start container
npm run docker:up

# View logs
npm run docker:logs

# Access application at http://localhost:3000

# Stop container
npm run docker:down
\`\`\`

### Production Deployment

#### VPS/Server Deployment

\`\`\`bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone <repo-url>
cd mrc-club-admin

# Create environment file
nano .env.local
# Paste your production environment variables

# Start with Docker Compose
docker-compose up -d

# Monitor logs
docker-compose logs -f
\`\`\`

#### Vercel Deployment

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Add environment variables in Vercel dashboard
5. Deploy

## Health Check

Verify the application is running:

\`\`\`bash
# Check health endpoint
curl http://localhost:3000/api/health

# Check container status
docker ps | grep mrc-app
\`\`\`

## Database Tables Reference

| Table | Purpose |
|-------|---------|
| `members` | User registrations with vehicle info and photos |
| `contact_messages` | Contact form submissions |
| `cms_footer` | Footer configuration |
| `cms_about` | About section content |
| `cms_benefits` | Membership benefits list |
| `cms_social_media` | Social media links |
| `cms_contact` | Contact section settings |
| `cms_events` | Events listing |
| `cms_logo` | Logo and branding |
| `cms_hero` | Hero section content |
| `cms_membership` | Membership benefits |
| `admin_users` | Admin user accounts |

## API Testing

### Register Member
\`\`\`bash
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
\`\`\`

### Submit Contact
\`\`\`bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "message": "Test message"
  }'
\`\`\`

## Troubleshooting Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase database is accessible
- [ ] Migration scripts have been executed
- [ ] Vercel Blob token is valid
- [ ] Docker image builds without errors
- [ ] Container starts and health check passes
- [ ] Admin dashboard loads without errors
- [ ] Image uploads work properly
- [ ] Contact messages appear in admin panel
- [ ] Footer configuration is saved and displayed

## Performance Optimization

- Database indexes are automatically created
- RLS policies restrict access appropriately
- Images are stored in Blob storage, not database
- Docker uses multi-stage build for smaller images
- Tailwind CSS is optimized for production

## Security Considerations

- RLS policies protect sensitive data
- Admin endpoints require authentication
- Images uploaded to secure Vercel Blob storage
- Environment variables kept out of source control
- Docker container runs as non-root user
- HTTPS should be enforced in production
