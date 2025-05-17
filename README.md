# n8nThai Docker Deployment

This repository contains Docker and Traefik configuration for deploying n8nThai to Coolify. n8nThai is a multi-tenant n8n hosting platform designed specifically for Thai customers, offering a seamless experience with Thai language support, local payment options, and automated workflow management.

## Repository Structure

- `Dockerfile` - Multi-stage build for Next.js application
- `docker-compose.yml` - Container orchestration with Traefik
- `traefik/` - Traefik reverse proxy configuration
- `.env.coolify` - Environment variables template for Coolify deployment
- `.github/workflows/` - GitHub Actions for continuous deployment
- Documentation files for deployment

## Technologies Used

- **Next.js** - React framework for the frontend
- **PostgreSQL** - Database for storing application data
- **Redis** - For caching and session management
- **Traefik** - Modern reverse proxy for automatic SSL and routing
- **Docker & Docker Compose** - Container orchestration
- **Coolify** - Self-hosted PaaS for deployment

## Deployment Options

We've provided comprehensive guides for deploying this application:

1. **[GitHub Deployment Guide](GITHUB-DEPLOYMENT-GUIDE.md)** - How to push the code to GitHub
2. **[Coolify Quick Start](COOLIFY-DOCKER-QUICK-START.md)** - Visual guide for Coolify deployment
3. **[Detailed Coolify Deployment Steps](COOLIFY-DOCKER-DEPLOYMENT-STEPS.md)** - Step-by-step Coolify instructions
4. **[Simple Coolify Deployment Guide](HOW-TO-DEPLOY-TO-COOLIFY.md)** - Concise version of the steps

## Features

- **Multi-stage Docker build** optimized for production
- **Traefik reverse proxy** with automatic SSL via Let's Encrypt
- **High security** with proper headers, rate limiting, and other protections
- **Persistent volumes** for database, Redis, and uploads
- **Automatic database migrations** with post-deployment commands
- **GitHub Actions workflow** for continuous deployment

## Getting Started

1. Clone this repository
2. Create appropriate environment variables file
3. Deploy using one of the provided guides

## CI/CD with GitHub Actions

This repository includes a GitHub Actions workflow in `.github/workflows/deploy-to-coolify.yml` that automatically triggers a Coolify deployment when you push to the main branch.

To use this workflow:

1. Add two secrets in your GitHub repository settings:
   - `COOLIFY_WEBHOOK_URL` - The webhook URL provided by Coolify
   - `COOLIFY_WEBHOOK_SECRET` - The webhook secret for authentication

2. Push to your main branch to trigger automatic deployment

## Environment Variables

See `.env.coolify` for the template of required environment variables. Remember to update with secure values in your production environment.

## License

This project is licensed under the MIT License.
