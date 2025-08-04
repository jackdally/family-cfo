# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy package files
COPY docs-site/package*.json ./
COPY web/package*.json ./web/

# Install dependencies for the docs-site workspace
RUN pnpm install --filter docs-site

# Copy the rest of the application
COPY docs-site/ ./

# Expose the port the app runs on
EXPOSE 3000

# Start the development server with hot reload
CMD ["pnpm", "start"] 