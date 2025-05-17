# n8nThai Docker Deployment Files

## Overview

We've prepared the following files to help you deploy n8nThai on Coolify:

1. **`Dockerfile`**: Optimized for Next.js application deployment with multi-stage build
   - Reduces final image size
   - Implements security best practices
   - Properly handles Prisma client generation
   - Includes health checks

2. **`docker-compose.yml`**: Full stack deployment configuration
   - n8nThai application service
   - PostgreSQL database service
   - Redis service
   - Proper networking and volume configuration
   - Optional NGINX configuration (commented)

3. **`.env.coolify`**: Environment variable template
   - Database configuration
   - Authentication secrets
   - Service URLs
   - n8n instance configuration

4. **`next.config.js`**: Updated with Docker/production optimizations
   - Standalone output mode for optimal container deployment
   - Security headers
   - Image optimization settings

5. **`.dockerignore`**: Optimizes the Docker build process
   - Prevents unnecessary files from being included in the build context
   - Reduces build time and image size

6. **`COOLIFY-DEPLOYMENT.md`**: Detailed deployment guide
   - Step-by-step instructions
   - Environment variable setup
   - Coolify configuration
   - Troubleshooting guidance

## Quick Start

1. **Setup Coolify**:
   Make sure you have Coolify installed and running on your server.

2. **Configure Repository**:
   Add these files to your repository and push to your Git provider.

3. **Deploy on Coolify**:
   - Create a new application in Coolify
   - Connect to your Git repository
   - Select Docker Compose as the deployment method
   - Configure environment variables
   - Deploy

## Environment Variables

Before deployment, make sure to update the environment variables in `.env.coolify`:

```
# Update the following with secure values:
DB_PASSWORD=your_secure_database_password
REDIS_PASSWORD=your_secure_redis_password
JWT_SECRET=your-super-secure-jwt-key-for-production
NEXTAUTH_SECRET=your-nextauth-secret-for-production

# Update with your domain:
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
INSTANCE_BASE_DOMAIN=n8n.your-domain.com

# Configure email:
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@your-domain.com
```

## Post-Deployment

After successful deployment, you need to run database migrations:

```bash
docker exec -it n8nthai-app /bin/sh -c "npx prisma migrate deploy"
```

## For Detailed Instructions

Please refer to `COOLIFY-DEPLOYMENT.md` for complete deployment instructions and troubleshooting.
