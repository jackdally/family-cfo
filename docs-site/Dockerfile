# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY docs-site/package*.json ./

# Install dependencies
RUN npm install

# Copy source files (excluding node_modules)
COPY docs-site/src ./src
COPY docs-site/static ./static
COPY docs-site/docusaurus.config.ts ./
COPY docs-site/sidebars.ts ./
COPY docs-site/tsconfig.json ./

# Expose the port the app runs on
EXPOSE 3000

# Start the development server with hot reload
CMD ["npm", "start"] 