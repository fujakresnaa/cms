# Troubleshooting Guide

## Common Issues and Solutions

### Image Upload Not Working

**Problem**: Images fail to upload during registration

**Solutions**:
1. Check Vercel Blob token in `.env.local`
\`\`\`bash
echo $BLOB_READ_WRITE_TOKEN
