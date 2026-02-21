# Peter T Conti Platform

A production-oriented, decoupled web platform for consultancy marketing and lead capture, built with:

- `backend/`: Payload CMS 3 on Next.js (headless API + admin)
- `frontend/`: Next.js 16 presentation layer (static-first with controlled revalidation)
- `infra/`: Terraform for AWS networking, data, storage, CDN, TLS, and OpenNext Lambda runtime

This README is intentionally written as a system design and operations document, not just a quickstart.

## 1. Executive Summary

This repository implements a split CMS + frontend architecture with clear operational boundaries:

1. Content and authoring live in Payload (`backend`), backed by PostgreSQL.
2. Public site delivery runs in a separate Next.js app (`frontend`), optimized for static generation and cache-tag revalidation.
3. Infrastructure is codified in Terraform (`infra`) and deployed to AWS using OpenNext for both frontend and backend Lambda runtimes.

Primary design goals:

- Clear separation of concerns between content operations and public delivery
- Fast read performance via static generation and cache tags
- Deterministic, scriptable infrastructure with environment-variable driven runtime config
- Production-safe content publishing with explicit revalidation hooks

## 2. System Architecture

### 2.1 Runtime Topology

```mermaid
flowchart LR
  U[Website Visitor] --> CF_FE[CloudFront: frontend domain]
  CF_FE --> FE_L[Frontend Lambda via OpenNext]
  FE_L -->|read content| API[Payload API on api subdomain]

  A[Content Editor] --> CF_API[CloudFront: api subdomain]
  CF_API --> BE_L[Backend Lambda via OpenNext + Payload]
  BE_L --> RDS[(Amazon RDS PostgreSQL)]
  BE_L --> S3[(S3 Media Bucket)]
  S3 --> CF_MEDIA[CloudFront: media subdomain]

  BE_L -->|publish hook| REVAL[/frontend /api/revalidate/]
  REVAL --> FE_CACHE[Next cache tags/paths]
  REVAL --> CF_INVALIDATE[CloudFront invalidation in production]
```

### 2.2 Core Design Decisions

| Decision | Implementation | Why |
|---|---|---|
| Decoupled CMS + presentation | Separate `backend` and `frontend` apps | Keeps editorial/admin concerns isolated from public rendering concerns |
| Static-first rendering | `getCached*` data access + cache tags in frontend | Strong performance and SEO with controlled freshness |
| Publish-triggered invalidation | Payload collection/global hooks call frontend revalidation endpoint | Avoids stale content while preserving caching efficiency |
| Serverless runtime on AWS | OpenNext module for both apps | Operationally simple deployment target with CDN-first routing |
| Managed relational datastore | RDS PostgreSQL in private DB subnets | Durable content persistence with network isolation |
| Media delivery through CDN | S3 + CloudFront + OAC | Prevents direct-public bucket access and improves global performance |

## 3. Repository Structure

```text
portfolio/
  backend/                    # Payload CMS (Next.js + Payload 3 + Postgres adapter)
  frontend/                   # Public site (Next.js 16, App Router)
  infra/                      # Terraform root + reusable modules
    bootstrap/                # One-time remote state bootstrap (S3 + DynamoDB lock)
    modules/
      vpc/                    # VPC, subnets, NAT, optional endpoints
      rds/                    # PostgreSQL RDS instance
      secrets/                # Secrets Manager + generated app secrets
      acm/                    # DNS-validated TLS certs
      media-storage/          # S3 + CloudFront media pipeline
  .github/workflows/
    deploy-dev.yml            # Full build + infra deploy + cache invalidation + health checks
    deploy-backend-only.yml   # Backend-only targeted deploy
```

## 4. Backend (Payload CMS) Architecture

### 4.1 Stack

- Payload CMS `3.70.x`
- Next.js `15.x`
- `@payloadcms/db-postgres` adapter
- Lexical editor + form builder + redirects + nested docs + SEO + optional S3 plugin

### 4.2 Content Model

Primary collections and globals:

- `pages`
- `services`
- `caseStudies`
- `posts`
- `categories`
- `media`
- `users`
- `icons`
- `lizards`
- globals: `nav`, `footer`

Common characteristics:

- Draft/publish workflow on major content collections
- Block-based layout system for reusable page composition
- Revalidation hooks on content change/delete events

### 4.3 Publishing and Revalidation

When content changes in Payload:

1. Collection/global hooks resolve affected paths/tags.
2. Backend calls frontend `POST /api/revalidate` with `x-revalidate-secret`.
3. Frontend runs `revalidatePath` / `revalidateTag`.
4. In production (`APP_STAGE=production`), frontend also triggers CloudFront invalidation.

This pattern gives strong cache hit rates with explicit invalidation semantics.

### 4.4 Forms and Anti-Spam Controls

Form handling includes:

- Cloudflare Turnstile verification
- Honeypot detection
- Form submission hooks in Payload form-builder plugin

## 5. Frontend Architecture

### 5.1 Stack

- Next.js `16.x` App Router
- React `19`
- Tailwind CSS `4`
- Payload API integration through typed fetch utilities (`frontend/src/lib/payload.ts`)

### 5.2 Rendering Strategy

- Static-first and cache-tag aware content retrieval
- ISR/revalidation orchestrated by secure backend-triggered endpoint
- Dynamic route coverage for:
  - generic pages (`/[slug]`)
  - services
  - case studies
  - blog and categories
  - supplemental content (`lizards`)

### 5.3 Sitemap and SEO

- Dynamic sitemap endpoint: `frontend/src/app/static-sitemap.xml/route.ts`
- `next-sitemap` config included
- Note: current robots policy in `frontend/next-sitemap.config.cjs` disallows all crawlers; update before production indexing.

## 6. Infrastructure and Terraform

### 6.1 Provisioned Components

Terraform in `infra/` provisions:

- VPC with public/private/database subnet tiers
- NAT + route tables + optional VPC endpoints
- Security groups for Lambda and RDS access
- RDS PostgreSQL instance
- Secrets Manager for DB/app/revalidation secrets
- ACM certificate with Route53 DNS validation
- Media plane:
  - S3 bucket with encryption and public access block
  - CloudFront distribution with Origin Access Control (OAC)
  - Route53 alias for `media.<domain>`
- Frontend and backend OpenNext deployments as Lambda + CloudFront

### 6.2 Bootstrap vs Main Apply

`infra/bootstrap/` must run first to create Terraform remote state resources:

- S3 bucket for state
- DynamoDB lock table

Then `infra/` manages application infrastructure.

Important implementation note:

- `infra/main.tf` and the deploy workflows currently assume the bootstrap names `portfolio-pconti-tfstate` and `portfolio-pconti-tf-lock`.
- If you use different names, update the Terraform backend configuration and GitHub workflow bootstrap checks accordingly.

### 6.3 Terraform Runbook

#### Prerequisites

1. Terraform `>= 1.5`
2. AWS credentials with permissions for VPC, RDS, IAM, ACM, Route53, CloudFront, Lambda, Secrets Manager
3. OpenNext build artifacts from both apps

#### Step 1: Bootstrap remote state

```bash
cd infra/bootstrap
terraform init
terraform apply
```

#### Step 2: Build app artifacts (required by OpenNext modules)

```bash
cd backend
pnpm install
pnpm build
pnpm dlx @opennextjs/aws build

cd ../frontend
pnpm install
pnpm build
pnpm dlx @opennextjs/aws build
```

#### Step 3: Configure infra variables

```bash
cd ../infra
cp terraform.tfvars.example terraform.tfvars
# fill in domain_name, hosted_zone_id, and optional values
```

#### Step 4: Init/plan/apply

```bash
terraform init -input=false
terraform validate
terraform plan -var-file=terraform.tfvars -out=tfplan
terraform apply tfplan
```

Key outputs include:

- `frontend_url`
- `payload_url`
- `media_url`
- `cloudfront_distribution_id`
- `database_secret_arn`

## 7. CI/CD Design

### 7.1 Full Deploy Workflow (`deploy-dev.yml`)

Triggered by push to `main` and manual dispatch:

1. Verify Terraform bootstrap resources exist.
2. Build frontend OpenNext artifact.
3. Build backend OpenNext artifact.
4. Run Terraform plan/apply with decoded `terraform.tfvars` secret.
5. Invalidate frontend CloudFront cache.
6. Run frontend and API health checks.
7. Emit deployment summary.

### 7.2 Backend-Only Workflow (`deploy-backend-only.yml`)

Manual workflow for targeted backend rollouts:

- Builds backend artifact
- Runs Terraform targeted apply against `module.opennext_backend`
- Executes API health check

## 8. Local Development

### 8.1 Prerequisites

- Node.js 20+
- pnpm 10+
- Docker + Docker Compose

### 8.2 Start local database (backend)

```bash
cd backend
docker compose up -d
```

Default local ports:

- PostgreSQL: `5999`
- pgAdmin: `5050`

### 8.3 Configure backend env

Create `backend/.env` (or adapt from `backend/.env.example`) with at least:

```env
DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:5999/payload
PAYLOAD_SECRET=replace-with-strong-random-secret
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
PUBLIC_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
REVALIDATE_SECRET=local-revalidate-secret
PREVIEW_SECRET=local-preview-secret
APP_STAGE=local
```

Then run backend:

```bash
pnpm install
pnpm dev
```

Open admin at `http://localhost:3000/admin` and create the first admin user if needed.

### 8.4 Configure frontend env

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_PAYLOAD_API_URL=http://localhost:3000
PAYLOAD_API_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
REVALIDATE_SECRET=local-revalidate-secret
PREVIEW_SECRET=local-preview-secret
APP_STAGE=local
```

Run frontend on a separate port:

```bash
cd frontend
pnpm install
pnpm dev -- -p 3001
```

### 8.5 Optional seed operations

```bash
cd backend
pnpm seed            # seed content
pnpm seed:reset      # reset-oriented seed path
```

## 9. High-Level System Contract

The platform contract is:

1. Payload is the source of truth for content and editorial configuration.
2. Frontend consumes only the API surface it needs and owns rendering/caching policy.
3. Terraform owns infrastructure state and deployment topology.
4. CI/CD is the only sanctioned path for production infra mutation.

This keeps the system predictable under change, auditable in operations, and scalable for additional environments or capability expansion.
