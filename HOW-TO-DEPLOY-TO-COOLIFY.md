# How to Deploy n8nThai to Coolify: Simple Step-by-Step Guide

This guide will walk you through the exact process of deploying n8nThai to Coolify.

## Prerequisites

1. A server with Coolify installed
2. Access to Coolify dashboard
3. Your n8nThai code in a Git repository (GitHub, GitLab, etc.)

## Step 1: Prepare Your Repository

Make sure your repository has these files:

- `Dockerfile` - For building the application
- `docker-compose.yml` - For defining the service stack
- `.env.coolify` - For environment variables template
- Updated `next.config.js` - Optimized for production

## Step 2: Deploy to Coolify

### A. Access Coolify

1. Open your browser and go to your Coolify dashboard URL
   ```
   https://coolify.your-domain.com
   ```

2. Log in with your Coolify credentials

### B. Create New Application

1. Click the **"Create New Resource"** button in the top-right corner
2. Select **"Application"** from the dropdown

### C. Connect to Repository

1. Choose your Git provider (GitHub, GitLab, etc.)
2. Select your n8nThai repository
3. Choose the branch you want to deploy (usually `main` or `master`)

### D. Configure Deployment Settings

1. For **"Deployment Method"**, select **"Docker Compose"**
2. Select your `docker-compose.yml` file from the dropdown
3. Set deployment command to `docker-compose up -d`

### E. Configure Environment Variables

1. Click the **"Environment Variables"** tab
2. Click **"Add From File"** and select `.env.coolify`
3. Update the imported variables with your actual values:
   - Set secure passwords for database and Redis
   - Configure domain names and ports
   - Set JWT secrets

### F. Configure Volumes

1. Click the **"Volumes"** tab
2. Ensure the following persistent volumes are configured:
   - PostgreSQL data: `/var/lib/postgresql/data`
   - Redis data: `/data`
   - n8n templates: `/srv/n8n-template`
   - Uploads: `/app/uploads`

### G. Add Post-Deployment Command

1. Click the **"Post-Deployment"** tab
2. Add this command to run database migrations after deployment:
   ```
   docker exec $(docker ps -qf "name=n8nthai-app") /bin/sh -c "npx prisma migrate deploy"
   ```

### H. Deploy

1. Click the **"Deploy"** button
2. Monitor the deployment logs

## Step 3: Access Your Application

1. Once deployment is complete, Coolify will provide a URL
2. Access your application using this URL or your custom domain

## Troubleshooting

If deployment fails:

1. Check the deployment logs in Coolify dashboard
2. SSH into your Coolify server and run:
   ```
   docker ps                       # Check running containers
   docker logs n8nthai-app         # Check application logs
   docker logs n8nthai-postgres    # Check database logs
   docker logs n8nthai-redis       # Check Redis logs
   ```

## Updating Your Application

To update your deployed application:

1. Push changes to your Git repository
2. In Coolify dashboard, go to your application
3. Click **"Redeploy"**

---

For more detailed instructions, refer to:
- `COOLIFY-DOCKER-DEPLOYMENT-STEPS.md` - Comprehensive guide
- `COOLIFY-DOCKER-QUICK-START.md` - Visual quick start guide
