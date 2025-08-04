# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY docs-site/package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY docs-site/ .

# Expose the port the app runs on
EXPOSE 3000

# Start the development server with hot reload
CMD ["pnpm", "start"] 