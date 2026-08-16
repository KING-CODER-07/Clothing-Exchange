FROM node:22-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create uploads directory and set permissions
RUN mkdir -p uploads

# Expose default port
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

# Start backend server
CMD ["node", "server.js"]
