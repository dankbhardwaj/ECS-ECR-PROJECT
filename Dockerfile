# Use a small, production-ready Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy app
COPY . .

# Security: run as non-root
USER node

# Expose the runtime port (ECS target group/SG should match this)
ENV PORT=8080
EXPOSE 8080

# Start
CMD ["node", "server.js"]
