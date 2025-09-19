# ERP Frontend Container Setup

This document explains how to run the ERP frontend in a container using Podman or Docker.

## Prerequisites

Make sure you have either Podman or Docker installed on your system.

### Installing Podman (Recommended)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install podman

# Fedora/RHEL
sudo dnf install podman

# macOS (using Homebrew)
brew install podman
```

### Installing Docker (Alternative)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Fedora/RHEL
sudo dnf install docker docker-compose

# macOS/Windows: Download Docker Desktop
```

## Quick Start

### Using Docker Compose (Easiest)
```bash
# Navigate to the frontend directory
cd /home/ericzobel/Documents/PROJECTS/ERP/frontend

# Build and start the container
docker-compose up --build

# Or with Podman
podman-compose up --build
```

### Using Podman Directly
```bash
# Navigate to the frontend directory
cd /home/ericzobel/Documents/PROJECTS/ERP/frontend

# Build the image
podman build -t erp-frontend-dev .

# Run the container
podman run -d \
  --name erp-frontend-dev \
  -p 3000:3000 \
  -v .:/app \
  -v /app/node_modules \
  -e WATCHPACK_POLLING=true \
  -e NODE_ENV=development \
  erp-frontend-dev
```

### Using Docker Directly
```bash
# Navigate to the frontend directory
cd /home/ericzobel/Documents/PROJECTS/ERP/frontend

# Build the image
docker build -t erp-frontend-dev .

# Run the container
docker run -d \
  --name erp-frontend-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e WATCHPACK_POLLING=true \
  -e NODE_ENV=development \
  erp-frontend-dev
```

## Access the Application

Once the container is running, you can access the ERP application at:
- **Local URL**: http://localhost:30001 (mapped from container port 3000)
- **Network URL**: http://your-host-ip:30001

Note: The docker-compose.yml uses port 30001 to avoid conflicts with other development servers.

## Container Features

- **Hot Reloading**: Code changes are automatically reflected
- **Volume Mounting**: Source code is mounted for development
- **Port Mapping**: Container port 3000 mapped to host port 3000
- **Environment Variables**: Development environment configured
- **Health Checks**: Container health monitoring
- **Non-root User**: Runs as non-root user for security

## Container Management

### View Running Containers
```bash
# Podman
podman ps

# Docker
docker ps
```

### View Container Logs
```bash
# Podman
podman logs erp-frontend-dev

# Docker
docker logs erp-frontend-dev

# Follow logs in real-time
podman logs -f erp-frontend-dev
docker logs -f erp-frontend-dev
```

### Stop the Container
```bash
# Using compose
docker-compose down
podman-compose down

# Using container name
podman stop erp-frontend-dev
docker stop erp-frontend-dev
```

### Restart the Container
```bash
# Using compose
docker-compose restart
podman-compose restart

# Using container name
podman restart erp-frontend-dev
docker restart erp-frontend-dev
```

### Remove the Container
```bash
# Stop and remove
podman rm -f erp-frontend-dev
docker rm -f erp-frontend-dev

# Remove image
podman rmi erp-frontend-dev
docker rmi erp-frontend-dev
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can change the port mapping:
```bash
# Use port 3001 instead
podman run -p 3001:3000 ...
docker run -p 3001:3000 ...
```

### File Changes Not Detected
Make sure `WATCHPACK_POLLING=true` is set in the environment variables.

### Permission Issues
The container runs as a non-root user. If you encounter permission issues:
```bash
# Check file permissions
ls -la

# Fix permissions if needed
sudo chown -R $USER:$USER .
```

### Container Won't Start
Check the logs for errors:
```bash
podman logs erp-frontend-dev
docker logs erp-frontend-dev
```

## Development Workflow

1. **Start the container** using one of the methods above
2. **Edit code** in your favorite editor - changes will be automatically detected
3. **View changes** in your browser at http://localhost:3000
4. **Check logs** if something isn't working
5. **Stop the container** when done

## Production Note

This container setup is optimized for development with hot reloading and volume mounting. For production deployment, you would need a different Dockerfile that builds a static production bundle.

## Next Steps

Once you're running the container successfully, you can:
- Access the HR Users section with the new DataList component
- Test search, filtering, and sorting functionality
- Navigate between different HR sections
- Explore the permission system with different user roles

The container includes all the current features:
- ✅ Module navigation system
- ✅ Permission-based access control
- ✅ HR Users and Schedules sections
- ✅ DataList component with search/filter/sort
- ✅ Responsive design with dark mode support