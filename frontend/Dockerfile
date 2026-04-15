# ==========================================
# STAGE 1: Build the React App using Bun
# ==========================================
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy dependencies first for caching
COPY frontend/package.json frontend/bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy the rest of the code and environment variables
COPY frontend/ ./
COPY frontend/.env.example .env

# This runs your package.json "build" script, creating the /app/dist folder
RUN bun run build


# ==========================================
# STAGE 2: Serve the App using Nginx
# ==========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clear out the default Nginx files
RUN rm -rf ./*

# Copy the compiled static files from the builder stage
COPY --from=builder /app/dist .

# Add a simple Nginx configuration to support Wouter (SPA routing)
RUN echo 'server { \
  listen 3000; \
  location / { \
  root /usr/share/nginx/html; \
  index index.html index.htm; \
  try_files $uri $uri/ /index.html; \
  } \
  }' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]