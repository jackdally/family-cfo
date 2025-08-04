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
COPY web/package*.json ./
COPY docs-site/package*.json ./docs-site/

# Install dependencies for the web workspace
RUN pnpm install --filter web

# Copy the rest of the application
COPY web/ ./

# Expose the port the app runs on
EXPOSE 3000

# Start the application with hot reload
CMD ["pnpm", "dev"] 