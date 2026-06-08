# ResumeIQ AI

ResumeIQ AI is an AI-powered Resume Intelligence Platform focused on truthful resume optimization, ATS-safe formatting, semantic job alignment, recruiter-style feedback, and role-specific resume generation.

## Monorepo Structure

```text
apps/
  frontend/      Next.js App Router frontend
  backend/       FastAPI backend
packages/
  shared/        Shared frontend contracts and utilities
infrastructure/
  docker/        Container assets
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
cd ../..
docker compose up --build
```
