# Stage 1: Build frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server files
COPY server.js admin-routes.js verify-indexes.js ./
COPY src/data/colleges.js ./src/data/colleges.js
COPY --from=build /app/dist ./dist

# Create uploads directory
RUN mkdir -p public/uploads

EXPOSE 5000

# Healthcheck to monitor server container status
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then(res => res.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
