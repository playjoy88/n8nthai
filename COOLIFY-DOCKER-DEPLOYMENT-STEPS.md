# Step-by-Step Guide: Deploying n8nThai to Coolify Docker

This guide provides exact steps to deploy n8nThai to Coolify using Docker.

## Prerequisites

- Access to a Coolify server installation
- Admin access to Coolify dashboard
- Your n8nThai project with Docker files ready in a Git repository
- Basic knowledge of Docker and Coolify

## Deployment Steps

### 1. Prepare Your Code Repository

Ensure your repository contains these files:
- `Dockerfile`
- `docker-compose.yml`
- `.env.coolify`
- `.dockerignore`
- `next.config.js` (updated for production)
- `traefik/traefik.yml` (Traefik main configuration)
- `traefik/config/dynamic.yml` (Traefik dynamic configuration)

Push all changes to your Git repository.

### 2. Log In to Coolify Dashboard

1. Open your browser and navigate to your Coolify dashboard URL (e.g., `https://coolify.yourdomain.com`)
2. Log in with your administrator credentials

### 3. Create New Resource

1. Click on the **"Create New Resource"** button in the top right corner
2. Select **"Application"** from the dropdown menu

### 4. Connect to Git Repository

1. Select your Git provider (GitHub, GitLab, etc.)
2. If you haven't connected your Git account yet:
   - Click **"Connect"** next to your Git provider
   - Follow the OAuth flow to authorize Coolify
   - Return to the Coolify dashboard
3. Select your repository from the list (search for 'n8nThai' if needed)
4. Select the branch you want to deploy (e.g., `main` or `master`)

### 5. Configure Deployment Settings

1. For **"Deployment Method"**, select **"Docker Compose"**
2. In **"Docker Compose Configuration"**:
   - Select your `docker-compose.yml` file from the dropdown
   - Deployment command: `docker-compose up -d`
   - Build command: Leave default or set to `docker-compose build`

### 6. Configure Environment Variables

1. Click on the **"Environment Variables"** tab
2. Click **"Add From File"**
3. Select `.env.coolify` from your repository
4. Update the imported variables with your actual values:
   - Set secure passwords for database and Redis
   - Configure proper domain names
   - Set authentication secrets
   - Configure email settings
5. Click **"Save"** to store your environment variables

### 7. Configure Volumes and Networking

1. Click on the **"Volumes"** tab
2. Ensure persistent volumes are configured for:
   - `/var/lib/postgresql/data` (for PostgreSQL data)
   - `/data` (for Redis data)
   - `/srv/n8n-template` (for n8n templates)
   - `/app/uploads` (for application uploads)
   - `/etc/traefik/acme` (for Traefik SSL certificates)
3. Click on the **"Network"** tab and configure if needed:
   - Port mapping: Ensure ports 80, 443, and 8080 are properly mapped for Traefik
   - Custom domain: Add your domain if you want Coolify to manage it

### 8. Configure Database Migration

1. Click on the **"Post-Deployment"** tab
2. Add a post-deployment command:
   ```
   docker exec $(docker ps -qf "name=n8nthai-app") /bin/sh -c "npx prisma migrate deploy"
   ```
3. This ensures database migrations run after deployment

### 9. Deploy Application

1. Review all settings to make sure they're correct
2. Click the **"Deploy"** button
3. Monitor the deployment logs for any errors

### 10. Check Deployment Status

1. Wait for deployment to complete
2. Check the application status in Coolify dashboard
3. Verify all services are running:
   - n8nThai application
   - PostgreSQL database
   - Redis
   - Traefik reverse proxy

### 11. Access Your Application

1. Once deployment is successful, click on the URL provided by Coolify
2. Or navigate to your custom domain if configured
3. You should see the n8nThai application running

### 12. Troubleshooting

If you encounter issues:

1. Check deployment logs in Coolify dashboard
2. Verify environment variables are set correctly
3. Ensure all ports are correctly mapped
4. Check container logs:
   ```
   docker logs n8nthai-app
   docker logs n8nthai-postgres
   docker logs n8nthai-redis
   docker logs n8nthai-traefik
   ```
5. Check Traefik dashboard (if enabled) at `traefik.yourdomain.com` 
   (requires the admin username/password defined in docker-compose.yml)

### 13. Updating Your Application

To update your application:

1. Push new changes to your Git repository
2. In Coolify dashboard, navigate to your application
3. Click **"Redeploy"** to deploy the latest changes

## Advanced Configuration

### SSL/TLS Configuration with Traefik

1. Traefik is configured to automatically obtain SSL certificates from Let's Encrypt
2. The certificates are stored in the `/etc/traefik/acme` volume
3. To customize SSL configuration:
   - Modify `traefik/traefik.yml` file to change certificate resolver settings
   - Update the email address for Let's Encrypt notifications
   - Adjust TLS options in `traefik/config/dynamic.yml` for security requirements
4. To use custom certificates instead of Let's Encrypt:
   - Add your certificates to a directory and mount it as a volume
   - Update the Traefik configuration to use these certificates

### Resource Scaling

1. In Coolify dashboard, go to your application settings
2. Navigate to **"Resources"** tab
3. Adjust CPU, memory, and storage limits as needed
4. Click **"Save"** and redeploy your application

### Monitoring and Logs

1. From the Coolify dashboard, click on your application
2. Navigate to **"Monitoring"** to see resource usage
3. Navigate to **"Logs"** to view application logs
4. Set up alerts in **"Notifications"** for important events
5. Access the Traefik dashboard for additional routing and certificate information

## Conclusion

Your n8nThai application should now be successfully deployed on Coolify using Docker. The application includes the full stack with PostgreSQL database, Redis for caching and session management, and Traefik as a reverse proxy with automatic SSL certificate management.
