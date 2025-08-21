# syntax=docker/dockerfile:1

# Set base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (only rebuilds when package.json changes)
RUN yarn install --production

# Build the application
RUN npm run build

# Expose port and start
EXPOSE 3000

# Copy source code last 
COPY . . 


CMD ["node", "./src/server/server.js"]