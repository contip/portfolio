# Production-grade Dockerfile for NestJS Lambda
# Multi-stage build optimized for Lambda container runtime

################################################################################
# Stage 1: Base image with pnpm
################################################################################
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

################################################################################
# Stage 2: Install dependencies
################################################################################
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

################################################################################
# Stage 3: Build application
################################################################################
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

################################################################################
# Stage 4: Production dependencies only
################################################################################
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

################################################################################
# Stage 5: Lambda runtime - ARM64 optimized
################################################################################
FROM public.ecr.aws/lambda/nodejs:20-arm64

# Lambda task root
ENV NODE_ENV=production

# Copy production node_modules
COPY --from=prod-deps /app/node_modules ${LAMBDA_TASK_ROOT}/node_modules

# Copy built application
COPY --from=builder /app/dist ${LAMBDA_TASK_ROOT}/dist

# Set the CMD to the handler
CMD ["dist/lambda.handler"]