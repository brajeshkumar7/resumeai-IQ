# ResumeIQ API

FastAPI backend for ResumeIQ AI with service-layer architecture, typed schemas, health contracts, and infrastructure-ready configuration.

## Local Setup

```bash
pip install -e .[dev]
pytest
ruff check .
uvicorn resumeiq_api.main:app --reload
```
