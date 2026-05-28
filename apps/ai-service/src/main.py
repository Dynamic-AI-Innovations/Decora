"""Decora AI service — FastAPI entrypoint.

Owns the 4-stage render pipeline (docs/BUILD.md §7):
  Stage 1: Room intelligence (Claude vision) → structured JSON
  Stage 2: Prompt composition (Claude) → SDXL prompt + negative prompt
  Stage 3: Image generation (Replicate SDXL + ControlNet) → 3 variants
  Stage 4: Budget & shop (Claude) → itemised Naira list + affiliate URLs
"""

from __future__ import annotations

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routes import health, render

logger = structlog.get_logger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Decora AI Service",
        version="0.1.0",
        docs_url="/docs" if settings.env != "production" else None,
        redoc_url=None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(render.router, prefix="/render", tags=["render"])

    logger.info("ai_service.boot", env=settings.env)
    return app


app = create_app()
