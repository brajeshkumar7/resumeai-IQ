# Phase 1 - Foundation Scaffold

## Objective

Establish a production-grade baseline for ResumeIQ AI with a scalable monorepo layout, a typed Next.js frontend shell, a service-layer FastAPI backend, deployment-ready configuration for Render and Vercel, health-check APIs, and phase documentation.

## Architecture Decisions

- Use `apps/frontend`, `apps/backend`, `packages/shared`, and `AI` so the interface, API, shared contracts, and intelligence workflows can evolve independently without coupling.
- Start with a `system` capability slice instead of fake business logic so health, metadata, observability, and platform contracts are real from day one.
- Use App Router on the frontend and service-layer routing on the backend to preserve modular growth for resume parsing, JD analysis, ATS scoring, and orchestration later.
- Standardize environment-based configuration for Render, Vercel, Clerk, PostgreSQL, Redis, and Qdrant without adding unused deployment layers.
- Add truthful AI policy scaffolding up front so later optimization flows inherit the no-fabrication rule.

## Implementation Steps

1. Create the monorepo root, workspace configuration, `.gitignore`, and root README.
2. Scaffold a Next.js frontend with strict TypeScript, TailwindCSS, React Query, Zustand, Zod, React Hook Form, and Framer Motion.
3. Scaffold a FastAPI backend with Pydantic settings, structured logging, health endpoints, service-layer organization, async dependency checks, and Celery bootstrap.
4. Prepare deployment-ready env architecture for backend, frontend, PostgreSQL, Redis, and Qdrant.
5. Document installation, validation, and run instructions for this phase.

## Files Created

- `.gitignore`
- `.env`
- `package.json`
- `README.md`
- `docs/phases/phase-01-foundation.md`
- `apps/frontend/*`
- `apps/backend/*`
- `packages/shared/*`
- `AI/*`

## APIs Created

- `GET /api/v1/health/live`
- `GET /api/v1/health/ready`
- `GET /api/v1/system/meta`

## Package Installation Commands

```bash
npm install
cd apps/backend
pip install -e .[dev]
cd ../..
```

## Migration Commands

Alembic is configured for future database revisions. No schema migration is required in this phase because no domain tables have been introduced yet.

When the first persistent model is added:

```bash
cd apps/backend
alembic revision --autogenerate -m "create initial domain tables"
alembic upgrade head
```

## Testing Instructions

```bash
npm run lint:web
npm run build:web
cd apps/backend
pytest
ruff check .
cd ../..
```

## Startup Instructions

## Folder Structure

```text
apps/
  frontend/
  backend/
packages/
  shared/
AI/
docs/
```

## Git Commit Message

```text
chore: scaffold production-grade foundation for resumeiq ai
```
