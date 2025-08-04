# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY web/package*.json ./

# Install dependencies
RUN npm install

# Copy source files (excluding node_modules)
COPY web/src ./src
COPY web/public ./public
COPY web/next.config.ts ./
COPY web/postcss.config.mjs ./
COPY web/tsconfig.json ./
COPY web/components.json ./
COPY web/eslint.config.mjs ./
COPY web/next-env.d.ts ./

# Expose the port the app runs on
EXPOSE 3000

# Start the application with hot reload
CMD ["npm", "run", "dev"] 