# MRC Application Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- Supabase account with database configured
- Vercel Blob storage token (for image uploads)
- Node.js 18+ (for local development)

## Environment Setup

1. Copy environment template:
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. Fill in your credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
BLOB_READ_WRITE_TOKEN=your-blob-token
\`\`\`

## Local Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

## Database Setup

1. Connect to your Supabase database
2. Run migration scripts in order:
   - `scripts/001_initial_schema.sql` - Creates all tables
   - `scripts/002_seed_initial_data.sql` - Seeds initial data

## Docker Deployment

### Build Image
\`\`\`bash
docker build -t mrc-app:latest .
\`\`\`

### Run with Docker Compose
\`\`\`bash
docker-compose up -d
\`\`\`

### View Logs
\`\`\`bash
docker-compose logs -f app
\`\`\`

### Stop Container
\`\`\`bash
docker-compose down
\`\`\`

## Production Deployment

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically on push

### Self-Hosted (VPS/Server)

1. SSH into your server
2. Clone the repository
3. Set up environment variables
4. Run with Docker Compose:
\`\`\`bash
docker-compose up -d
\`\`\`

### Health Check
The application includes a health check endpoint at `/api/health`. Monitor this to ensure the application is running.

## Monitoring

- Container logs: `docker-compose logs app`
- CPU/Memory usage: `docker stats mrc-app`
- Health status: `curl http://localhost:3000/api/health`

## Troubleshooting

### Image Upload Issues
- Verify Vercel Blob token is set correctly
- Check token permissions

### Database Connection Issues
- Verify Supabase credentials
- Check network connectivity
- Ensure RLS policies are configured

### Performance Issues
- Monitor container resource limits
- Check database query performance
- Review application logs

## Scaling

For production deployments requiring scaling:
- Use container orchestration (Kubernetes)
- Implement load balancer
- Set up CDN for static assets
- Configure database replication
