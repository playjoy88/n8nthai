# n8nThai - Coolify Deployment Guide

This document provides instructions for deploying the n8nThai application on Coolify, a self-hostable Heroku/Netlify alternative.

## Prerequisites

- Coolify server set up and running
- Domain name configured and pointed to your Coolify server
- Basic understanding of Docker and container deployment
- Git repository with your n8nThai codebase

## Files Overview

We've created several files to facilitate deployment on Coolify:

1. `Dockerfile` - Multi-stage build for optimizing the Next.js application
2. `docker-compose.yml` - Defines all required services (app, PostgreSQL, Redis)
3. `.env.coolify` - Template for environment variables
4. Updated `next.config.js` - Optimized for production deployment

## Deployment Steps

### 1. Prepare Your Environment Variables

1. Copy `.env.coolify` to `.env` on your Coolify server or use Coolify's environment variable management:
   ```
   cp .env.coolify .env
   ```

2. Update all placeholder values in the `.env` file with your actual configuration:
   - Generate secure passwords for `DB_PASSWORD` and `REDIS_PASSWORD`
   - Set proper JWT and NextAuth secrets
   - Configure your domain in all URL-related variables
   - Set up proper SMTP details for email notifications

### 2. Deploy using Coolify UI

#### Option A: Direct Repository Deployment (Recommended)

1. Log in to your Coolify dashboard
2. Click "Create New Resource" → "Application"
3. Select your Git provider and repository
4. Choose "Docker Compose" as the deployment method
5. Select the `docker-compose.yml` file in your repository
6. Configure environment variables (import from `.env.coolify`)
7. Configure build and deployment settings:
   - Build command: `docker-compose build`
   - Start command: `docker-compose up -d`
8. Click "Deploy"

#### Option B: Manual Docker Deployment

If you prefer to deploy manually or need more control:

1. SSH into your Coolify server
2. Clone your repository:
   ```bash
   git clone https://your-repository-url.git
   cd n8nthai
   ```
3. Create an `.env` file from your template:
   ```bash
   cp .env.coolify .env
   ```
4. Edit the `.env` file with your specific configuration
5. Build and start the containers:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

### 3. Database Migration

After successful deployment, you need to run Prisma migrations:

```bash
# Connect to the running container
docker exec -it n8nthai-app /bin/sh

# Run Prisma migrations
npx prisma migrate deploy

# Seed the database if needed
npx prisma db seed
```

This can also be added as a post-deployment script in Coolify.

## Persistent Data

The Docker Compose configuration includes volumes for:

- PostgreSQL data: `postgres-data`
- Redis data: `redis-data`
- n8n instance templates: `instance-volume`
- Uploads: `./uploads:/app/uploads`

Ensure these volumes are backed up regularly.

## SSL Configuration

Coolify typically handles SSL termination automatically. If you're using the included NGINX configuration (commented out in docker-compose.yml), you'll need to:

1. Create a `nginx` directory
2. Add configuration files:
   - `nginx.conf`
   - `conf.d/default.conf`
3. Set up SSL certificates in the `nginx/ssl` directory

## Monitoring

Monitor your application using:

- Coolify's built-in monitoring tools
- Container logs: `docker-compose logs -f`
- Application logs: Check the Next.js logs in the container

## Scaling

For scaling the n8nThai application:

1. Adjust resources in Coolify dashboard
2. For database scaling:
   - Consider managed PostgreSQL service
   - Set up replication for high availability

## Troubleshooting

### Common Issues

1. **Database connection issues**:
   - Verify PostgreSQL service is running: `docker-compose ps`
   - Check connection string in environment variables
   - Ensure database password is correct

2. **Redis connection issues**:
   - Verify Redis service is running
   - Check Redis password in environment variables

3. **Application not starting**:
   - Check container logs: `docker-compose logs n8nthai`
   - Verify all required environment variables are set
   - Check for build errors in Coolify logs

4. **n8n instances not working**:
   - Verify `INSTANCE_TEMPLATE_PATH` is correctly mounted
   - Check instance service logs
   - Ensure ports are properly configured

## Updates and Maintenance

To update your application:

1. Push changes to your Git repository
2. Coolify will automatically detect changes and trigger a new deployment
3. Or manually trigger redeployment in the Coolify dashboard

For major updates:

1. Consider creating a separate staging environment first
2. Test thoroughly before updating production
3. Have a rollback plan ready

## Support

If you encounter issues with the deployment:

1. Check Coolify documentation
2. Review Docker and Next.js deployment guides
3. Refer to n8nThai documentation
