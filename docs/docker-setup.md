---
sidebar_position: 3
---

# Docker Development Environment

## 🎯 Overview

This guide covers setting up and using the FamilyCFO Docker development environment. The environment includes PostgreSQL 15, Hasura GraphQL Engine, and Redis for a complete local development experience.

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** - [Install Docker](https://docs.docker.com/get-docker/)
- **Git** - [Install Git](https://git-scm.com/downloads)
- **Node.js 18+** - [Install Node.js](https://nodejs.org/)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:jackdally/family-cfo.git
   cd family-cfo
   ```

2. **Copy environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your specific configuration
   ```

3. **Start the development environment**
   ```bash
   docker compose up -d
   ```

4. **Verify services are running**
   ```bash
   docker compose ps
   ```

## 🏗️ Services Overview

### PostgreSQL 15 Database

- **Port**: `5432`
- **Database**: `familycfo`
- **User**: `postgres`
- **Password**: `postgres`
- **Health Check**: `pg_isready`

**Features:**
- UUID extension enabled
- PGCrypto extension for encryption
- UTC timezone configuration
- Row Level Security (RLS) ready

### Hasura GraphQL Engine

- **Port**: `8080`
- **Console**: http://localhost:8080/console
- **Admin Secret**: `myadminsecretkey`
- **Health Check**: HTTP endpoint

**Features:**
- Development mode enabled
- Console access for metadata management
- JWT authentication configured
- Telemetry disabled

### Redis Cache

- **Port**: `6379`
- **Health Check**: Redis ping
- **Purpose**: Session storage and caching

### Next.js Web Application

- **Port**: `3000`
- **Health Check**: HTTP endpoint `/api/health`
- **Purpose**: Main FamilyCFO application
- **Hot Reload**: Enabled for development

### Docusaurus Documentation Site

- **Port**: `3001`
- **Health Check**: HTTP endpoint
- **Purpose**: Project documentation and guides
- **Hot Reload**: Enabled for development

## 📋 Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/familycfo"
POSTGRES_DB=familycfo
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Hasura
HASURA_GRAPHQL_ENDPOINT="http://localhost:8080"
HASURA_GRAPHQL_ADMIN_SECRET="myadminsecretkey"
HASURA_GRAPHQL_JWT_SECRET='{"type":"HS256", "key":"your-jwt-secret-key-here"}'

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_HASURA_ENDPOINT="http://localhost:8080"
```

### Optional Variables

```bash
# Redis
REDIS_URL="redis://localhost:6379"

# Documentation
NEXT_PUBLIC_DOCS_URL="http://localhost:3001"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Development
DEBUG=true
LOG_LEVEL=debug
```

## 🛠️ Common Commands

### Starting Services

```bash
# Start all services
docker compose up -d

# Start specific services
docker compose up -d db hasura

# Start with logs
docker compose up
```

### Stopping Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Stop specific services
docker compose stop db
```

### Managing Data

```bash
# View logs
docker compose logs db
docker compose logs hasura

# Access database
docker compose exec db psql -U postgres -d familycfo

# Reset database
docker compose down -v
docker compose up -d db
```

### Health Checks

```bash
# Check service status
docker compose ps

# Check health status
docker compose exec db pg_isready -U postgres -d familycfo
curl http://localhost:8080/healthz
docker compose exec redis redis-cli ping
```

## 🔧 Development Workflow

### 1. Database Migrations

```bash
# Generate Prisma client
pnpm exec prisma generate

# Run migrations
pnpm exec prisma migrate dev

# Reset database
pnpm exec prisma migrate reset
```

### 2. Hasura Metadata

```bash
# Access Hasura console
open http://localhost:8080/console

# Apply metadata (if using Hasura CLI)
hasura metadata apply
```

### 3. Application Development

```bash
# Start Next.js development server
pnpm --filter web dev

# Start Docusaurus development server
pnpm --filter docs-site start

# Run tests
pnpm test

# Build for production
pnpm build
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Conflicts

**Problem**: Services can't start due to port conflicts
```bash
# Check what's using the ports
lsof -i :5432
lsof -i :8080
lsof -i :6379

# Stop conflicting services
sudo systemctl stop postgresql
```

#### 2. Database Connection Issues

**Problem**: Can't connect to PostgreSQL
```bash
# Check if database is running
docker compose ps db

# Check database logs
docker compose logs db

# Reset database
docker compose down -v
docker compose up -d db
```

#### 3. Hasura Connection Issues

**Problem**: Hasura can't connect to database
```bash
# Check if database is healthy
docker compose exec db pg_isready -U postgres -d familycfo

# Restart Hasura
docker compose restart hasura

# Check Hasura logs
docker compose logs hasura
```

#### 4. Permission Issues

**Problem**: Docker permission errors
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker
```

### Performance Optimization

#### 1. Fast Startup

```bash
# Use specific images for faster pulls
docker compose pull

# Use volume caching
docker compose up -d --build
```

#### 2. Resource Limits

Add to `docker-compose.yml`:
```yaml
services:
  db:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

#### 3. Development Optimizations

```bash
# Use Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Use Docker Compose v2
docker compose up -d
```

## 🔒 Security Considerations

### Development Environment

- **Admin Secret**: Change `HASURA_GRAPHQL_ADMIN_SECRET` in production
- **JWT Secret**: Use strong, unique JWT secrets
- **Database Password**: Use strong passwords in production
- **Network Isolation**: Services are isolated in `familycfo-network`

### Production Deployment

- **Environment Variables**: Never commit `.env` files
- **Secrets Management**: Use Docker secrets or external secret managers
- **Network Security**: Configure proper firewall rules
- **SSL/TLS**: Enable HTTPS for all external connections

## 📊 Monitoring

### Service Health

```bash
# Check all service health
docker compose ps

# Monitor resource usage
docker stats

# View service logs
docker compose logs -f
```

### Database Monitoring

```bash
# Connect to database
docker compose exec db psql -U postgres -d familycfo

# Check database size
SELECT pg_size_pretty(pg_database_size('familycfo'));

# Check active connections
SELECT count(*) FROM pg_stat_activity;
```

## 🚀 Next Steps

After setting up the Docker environment:

1. **Run database migrations** - `pnpm exec prisma migrate dev`
2. **Start the Next.js application** - `pnpm --filter web dev`
3. **Configure Hasura metadata** - Access console at http://localhost:8080
4. **Set up authentication** - Configure Supabase Auth
5. **Begin development** - Start building features!

## 📚 Related Documentation

- [Development Guide](./development.md)
- [API Documentation](./api.md)
- [Database Schema](./data-dictionary.md)
- [Project Overview](./project-overview.md) 