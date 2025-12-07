# Production Dockerfile for Strapi CMS
# Multi-stage build for optimized image size

################################################################################
# Stage 1: Build
################################################################################
FROM node:22-alpine AS build

# Install build dependencies
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    git \
    > /dev/null 2>&1

WORKDIR /opt

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Copy application code
WORKDIR /opt/app
COPY . .

# Set production environment for build
ENV NODE_ENV=production

# Build Strapi admin panel
RUN pnpm build

################################################################################
# Stage 2: Production
################################################################################
FROM node:22-alpine AS production

# Install runtime dependencies only
RUN apk add --no-cache vips-dev

# Set environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

WORKDIR /opt

# Copy node_modules from build stage
COPY --from=build /opt/node_modules ./node_modules

# Copy built application
WORKDIR /opt/app
COPY --from=build /opt/app ./

# Add node_modules/.bin to PATH
ENV PATH=/opt/node_modules/.bin:$PATH

# Create non-root user for security
RUN chown -R node:node /opt/app
USER node

# Expose Strapi port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1

# Start Strapi
CMD ["pnpm", "start"]
