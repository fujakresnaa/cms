# MRC Club - Hostinger Deployment Guide

## Prerequisites
- Hostinger VPS with Docker installed
- Supabase account with database configured
- SSH access to your Hostinger server

## Setup Instructions

### 1. Connect to Hostinger VPS
\`\`\`bash
ssh root@your_hostinger_ip
\`\`\`

### 2. Clone Repository
\`\`\`bash
cd /home
git clone your-repo-url mrc-app
cd mrc-app
\`\`\`

### 3. Configure Environment Variables
\`\`\`bash
cp .env.example .env.production
nano .env.production
# Fill in your Supabase credentials
\`\`\`

### 4. Deploy with Docker
\`\`\`bash
chmod +x scripts/deploy-hostinger.sh
./scripts/deploy-hostinger.sh
\`\`\`

### 5. Set Up Nginx Reverse Proxy (Optional but Recommended)
\`\`\`bash
# Install Nginx
apt-get update && apt-get install -y nginx

# Create Nginx config
cat > /etc/nginx/sites-available/mrc-app << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/mrc-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
\`\`\`

### 6. Set Up SSL (Let's Encrypt)
\`\`\`bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
\`\`\`

### 7. Monitor Application
\`\`\`bash
# View logs
docker-compose -f docker-compose.hostinger.yml logs -f

# Check container status
docker ps

# Restart if needed
docker-compose -f docker-compose.hostinger.yml restart
\`\`\`

## Troubleshooting

### Container keeps restarting
\`\`\`bash
docker-compose -f docker-compose.hostinger.yml logs
\`\`\`

### Out of memory
- Reduce resource limits in docker-compose.hostinger.yml
- Increase Hostinger VPS RAM if needed

### Port already in use
\`\`\`bash
# Kill process using port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
\`\`\`

## Performance Optimization

1. Enable caching headers in Next.js
2. Use CDN for static assets
3. Monitor database queries in Supabase
4. Set up log rotation to save disk space
5. Use Hostinger's backup system

## Resource Limits

- Default: 1 CPU core, 512MB RAM
- Adjust in docker-compose.hostinger.yml based on your VPS plan
- Monitor with: \`docker stats\`
