# Stage 1: Use the pre-built frontend
FROM node:18-alpine AS base

# Copy the pre-built frontend (this assumes the build was already done locally)
WORKDIR /app
COPY dist/ ./dist/

# Stage 2: Set up the backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install

# Copy backend files
COPY backend/ ./

# Environment vars
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]

