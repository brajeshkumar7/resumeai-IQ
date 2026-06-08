# ResumeIQ AI

ResumeIQ AI is an AI-powered Resume Intelligence Platform focused on truthful resume optimization, ATS-safe formatting, semantic job alignment, recruiter-style feedback, and role-specific resume generation.

## Monorepo Structure

```text
apps/
  frontend/      Next.js App Router frontend
  backend/       FastAPI backend
packages/
  shared/        Shared frontend contracts and utilities
AI/              AI prompts, orchestration modules, model policies, and intelligence workflows
docs/
  phases/        Phase-by-phase delivery notes
```

## Phase Status

- Phase 1: Foundation scaffold complete

See [docs/phases/phase-01-foundation.md](docs/phases/phase-01-foundation.md) for objective, architecture decisions, install commands, API contracts, testing instructions, and startup instructions.

## Quick Start

```bash
npm install
cd apps/backend
pip install -e .[dev]
```

## Environment Files

- [`.env`](</d:/ResumeIQ AI/.env>) is the main application env file for backend, infrastructure, and shared runtime values.
- [`apps/frontend/.env.vercel.example`](</d:/ResumeIQ AI/apps/frontend/.env.vercel.example>) is the separate frontend/Vercel env file.

## Authentication Setup

Set these values before using the authenticated dashboard:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
RESUMEIQ_CLERK_JWKS_URL=...
RESUMEIQ_CLERK_ISSUER=...
```

Optional:

```bash
RESUMEIQ_CLERK_AUDIENCE=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

The frontend uses Clerk for email login and Google OAuth, while the backend validates Clerk session JWTs before serving protected profile APIs.

## Deployment Notes

### Render Backend

Use the backend-related values from [`.env`](</d:/ResumeIQ AI/.env>) in your Render backend service.

Important backend variables:

```bash
RESUMEIQ_DATABASE_URL=postgresql+asyncpg://...
RESUMEIQ_REDIS_URL=rediss://...
RESUMEIQ_CLERK_JWKS_URL=...
RESUMEIQ_CLERK_ISSUER=...
```

For Render PostgreSQL, use the internal hostname for backend-to-database traffic.

### Vercel Frontend

Use the values from [`apps/frontend/.env.vercel.example`](</d:/ResumeIQ AI/apps/frontend/.env.vercel.example>) in your Vercel project.

Important frontend variables:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-render-backend.onrender.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### Database Migration

Before first production use:

```bash
cd apps/backend
alembic upgrade head
```

## Current Deployment Stack

- `Vercel` for the Next.js frontend
- `Render` for the FastAPI backend
- `Render PostgreSQL` for the primary database
- `Upstash Redis` for Redis connectivity
- `Clerk` for authentication

## Future Scope

AWS is not part of the current deployment architecture.

Possible future use:
- `AWS S3` for resume and generated document storage
- related cloud file lifecycle features such as signed uploads, archival, and secure download delivery
