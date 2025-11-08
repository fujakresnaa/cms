# MBW Club - Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment

### Environment Setup
- [ ] Create `.env.local` with all required variables
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Verify Supabase project is active
- [ ] Test database connection from local machine

### Database
- [ ] Run migration: `scripts/007_consolidated_schema.sql`
- [ ] Verify all 11 tables created
- [ ] Verify RLS policies enabled
- [ ] Verify indexes created
- [ ] Run health check: `npm run health-check`

### Code Quality
- [ ] All v0 references removed ✓
- [ ] All v0 logging replaced with [mrc] ✓
- [ ] No console.log statements in production code
- [ ] TypeScript build passes: `npm run build`
- [ ] No ESLint errors: `npm run lint`

### Testing
- [ ] Test member registration flow
- [ ] Test admin dashboard access
- [ ] Test CMS content updates
- [ ] Test CSV export
- [ ] Test image uploads
- [ ] Test contact form submission
- [ ] Test date filtering
- [ ] Test all API endpoints

## Docker Deployment

### Local Docker Test
- [ ] Build image: `docker build -t mrc-app:latest .`
- [ ] Run container: `docker-compose up -d`
- [ ] Verify app runs on port 3000
- [ ] Run migrations in container
- [ ] Test all features

### Production Docker
- [ ] Push image to registry (Docker Hub, ECR, etc.)
- [ ] Update docker-compose.yml with production values
- [ ] Set production environment variables
- [ ] Verify logs don't contain sensitive data
- [ ] Set up monitoring

## Vercel Deployment

### Preparation
- [ ] Push code to GitHub
- [ ] Create GitHub repository secrets for env vars
- [ ] Update package.json version

### Configuration
- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables in Vercel dashboard
- [ ] Configure production domain
- [ ] Enable analytics

### Deployment
- [ ] Deploy to staging environment first
- [ ] Test all features on staging
- [ ] Run health checks
- [ ] Deploy to production
- [ ] Monitor logs for errors

## Post-Deployment

### Verification
- [ ] Admin dashboard accessible at `/admin`
- [ ] All sections load with CMS content
- [ ] Member list displays correctly
- [ ] Image previews work
- [ ] CSV export functions
- [ ] Contact form works
- [ ] Database queries perform well

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up uptime monitoring
- [ ] Set up database backup schedule
- [ ] Set up log aggregation
- [ ] Create runbook for common issues

### Security
- [ ] Enable CORS if needed
- [ ] Verify RLS policies prevent unauthorized access
- [ ] Test XSS prevention
- [ ] Test CSRF protection
- [ ] Verify no API keys exposed
- [ ] Enable rate limiting if needed

### Performance
- [ ] Test page load time
- [ ] Test API response time
- [ ] Verify image optimization
- [ ] Check database query performance
- [ ] Monitor memory usage

## Rollback Plan

If issues occur post-deployment:

1. Immediate: Revert to previous Vercel deployment
   - Click "Deployments" → Select previous version → Click "Restore"
   
2. If database corrupted: Restore from backup
   - Access Supabase dashboard
   - Use Point-in-Time Recovery if available
   - Or restore from backup snapshot

3. For Docker: Revert image version
   - `docker pull mrc-app:previous-version`
   - `docker-compose up -d`

## Maintenance

### Weekly
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Verify backups completed

### Monthly
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Performance analysis
- [ ] Database optimization

### Quarterly
- [ ] Security audit
- [ ] Disaster recovery drill
- [ ] Infrastructure review
- [ ] Cost analysis

## Support Contacts

- **Database**: support@supabase.io
- **Hosting**: support@vercel.com
- **Monitoring**: [Your monitoring service]
- **On-call**: [Contact information]

## Deployment History

| Date | Version | Environment | Status | Notes |
|------|---------|-------------|--------|-------|
| | | | | |

---

**Last Updated**: November 2025
**Created by**: MRC Development Team
\`\`\`
