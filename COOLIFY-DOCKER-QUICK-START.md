# Quick Start Guide: Deploy n8nThai to Coolify Docker

This is a condensed visual guide showing exactly how to deploy n8nThai to Coolify using Docker.

## 1. Prepare Files

Make sure your repository contains these Docker files:
```
- Dockerfile                  # Multi-stage build configuration
- docker-compose.yml          # Container orchestration with Traefik
- .env.coolify                # Environment variables template
- .dockerignore               # Optimizes Docker build
- next.config.js              # Optimized for production
- traefik/traefik.yml         # Traefik main configuration
- traefik/config/dynamic.yml  # Traefik dynamic configuration
```

## 2. Coolify Deployment Flow

```
┌─────────────────────────┐
│ 1. Log in to Coolify    │
│    Dashboard            │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 2. Click "Create New    │
│    Resource"            │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 3. Select "Application" │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 4. Choose Git Provider  │
│    & Repository         │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 5. Select Branch (main) │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 6. Choose Deployment    │
│    Method: "Docker      │
│    Compose"             │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 7. Select your          │
│    docker-compose.yml   │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 8. Configure Env Vars   │
│    from .env.coolify    │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 9. Configure Volumes    │
│    & Network Settings   │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 10. Add Post-Deployment │
│     Command for DB      │
│     Migration           │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 11. Click "Deploy"      │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 12. Monitor Deployment  │
│     Logs                │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│ 13. Access Your App!    │
└─────────────────────────┘
```

## 3. Key UI Steps in Coolify

### Step 2-3: Create New Application
```
┌─────────────────────────────────────────────────┐
│ Coolify Dashboard                               │
│                                                 │
│  ┌─────────────┐                                │
│  │ Create New  ▼│                               │
│  └─────────────┘                                │
│    ┌─────────────┐                              │
│    │ Application │                              │
│    └─────────────┘                              │
│    │ Database    │                              │
│    └─────────────┘                              │
│    │ Service     │                              │
│    └─────────────┘                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Step 6-7: Select Docker Compose
```
┌─────────────────────────────────────────────────┐
│ Deployment Method                               │
│                                                 │
│  ○ Simple                                       │
│  ● Docker Compose                               │
│                                                 │
│ Docker Compose Configuration                    │
│  ┌───────────────────────────────────┐          │
│  │ docker-compose.yml              ▼ │          │
│  └───────────────────────────────────┘          │
│                                                 │
│ Deployment Command                              │
│  ┌───────────────────────────────────┐          │
│  │ docker-compose up -d               │          │
│  └───────────────────────────────────┘          │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Step 8: Import Environment Variables
```
┌─────────────────────────────────────────────────┐
│ Environment Variables                           │
│                                                 │
│  ┌─────────────┐ ┌─────────────┐                │
│  │ Add New     │ │ Add From    │                │
│  │             │ │ File        │                │
│  └─────────────┘ └─────────────┘                │
│                                                 │
│  KEY                   VALUE                    │
│  ┌─────────────┐ ┌─────────────────────────┐    │
│  │ DB_PASSWORD │ │ your_secure_password    │    │
│  └─────────────┘ └─────────────────────────┘    │
│                                                 │
│  ┌─────────────┐ ┌─────────────────────────┐    │
│  │ JWT_SECRET  │ │ your-secure-jwt-key     │    │
│  └─────────────┘ └─────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Step 10: Add Post-Deployment Command
```
┌─────────────────────────────────────────────────┐
│ Post-Deployment                                 │
│                                                 │
│ Command                                         │
│  ┌───────────────────────────────────────────┐  │
│  │ docker exec $(docker ps -qf "name=n8nth...│  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────────────┐                                │
│  │ Add         │                                │
│  └─────────────┘                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 4. Troubleshooting Commands

If you encounter issues, SSH into your Coolify server and run:

```bash
# Check running containers
docker ps

# Get container logs
docker logs n8nthai-app
docker logs n8nthai-postgres
docker logs n8nthai-redis
docker logs n8nthai-traefik

# Check database migration status
docker exec n8nthai-app /bin/sh -c "npx prisma migrate status"

# Check Traefik SSL certificates
docker exec n8nthai-traefik /bin/sh -c "cat /etc/traefik/acme/acme.json"

# Check Traefik routing status
curl -H Host:${INSTANCE_BASE_DOMAIN} http://localhost:8080/api/http/routers -u admin:password

# Restart services if needed
docker-compose restart
```

## 5. Accessing Your Application

After successful deployment:

1. Access using Coolify-provided URL
2. Or navigate to your custom domain if configured
3. Access Traefik dashboard at `traefik.yourdomain.com` (admin/password by default)
4. Log in to n8nThai using admin credentials:
   - Username: admin
   - Password: (set in environment variables)

For detailed step-by-step instructions, see `COOLIFY-DOCKER-DEPLOYMENT-STEPS.md`.
