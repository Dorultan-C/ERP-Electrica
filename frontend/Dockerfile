# Development Dockerfile for ERP Frontend
# This creates a containerized development environment with hot reloading
# Note: Running as root for development simplicity - not for production!

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for better compatibility
RUN apk add --no-cache \
    git \
    openssh-client \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p .next

# Expose the development port
EXPOSE 3000

# Default command - run development server
CMD ["npm", "run", "dev"]