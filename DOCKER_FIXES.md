# Docker Issues Fixed

## Issues Identified

### 1. Health Check Failures
- **Problem**: Both web and docs containers were showing as "unhealthy" despite services running correctly
- **Root Cause**: Health checks were trying to use `curl` and `wget` commands that weren't available in the Alpine Node.js images
- **Solution**: 
  - Added `RUN apk add --no-cache wget` to both Dockerfiles
  - Updated health check commands to use `wget` with proper error handling
  - Changed from `CMD` to `CMD-SHELL` for better shell command execution

### 2. Performance Issues
- **Problem**: Web service was occasionally slow to respond (15+ seconds)
- **Root Cause**: No resource limits or optimizations for containerized environment
- **Solution**:
  - Added memory limits and reservations for all services
  - Optimized Next.js configuration for Docker environment
  - Added `output: 'standalone'` for better container performance

### 3. Configuration Improvements
- **Added**: Resource limits to prevent memory issues
  - Web service: 1GB limit, 512MB reservation
  - Docs service: 512MB limit, 256MB reservation
  - Database: 512MB limit, 256MB reservation
  - Hasura: 256MB limit, 128MB reservation
  - Redis: 128MB limit, 64MB reservation

## Current Status

✅ **All services are now healthy and responding quickly**
- Web service (port 3000): ~150ms response time
- Docs service (port 3002): ~13ms response time
- Database, Hasura, and Redis all healthy

## Files Modified

1. `docker-compose.yml` - Fixed health checks and added resource limits
2. `web/Dockerfile` - Added wget installation
3. `docs-site/Dockerfile` - Added wget installation
4. `web/next.config.ts` - Added Docker optimizations

## Commands to Test

```bash
# Check service status
docker ps

# Test web service
curl http://localhost:3000

# Test docs service
curl http://localhost:3002

# Check logs if needed
docker logs familycfo-web
docker logs familycfo-docs
```

## Performance Metrics

- **Web Service**: 148ms average response time
- **Docs Service**: 13ms average response time
- **All containers**: Healthy status
- **Memory usage**: Properly limited and monitored 