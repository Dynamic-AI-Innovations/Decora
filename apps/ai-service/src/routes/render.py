"""Render request endpoints.

Inbound contract is enforced by RenderRequestIn (zod-mirrored).
Actual pipeline lives in src.pipeline. This route only validates,
enqueues, and returns the job id.
"""

from __future__ import annotations

from typing import Literal
from uuid import UUID, uuid4

import structlog
from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, Field

from ..config import settings

logger = structlog.get_logger(__name__)
router = APIRouter()


NigeriaStyle = Literal[
    "lagos_minimalist",
    "afro_contemporary",
    "abuja_executive",
    "yoruba_heritage",
    "diaspora_returnee",
    "tropical_luxe",
    "old_naija_comfort",
    "modern_ph",
]


class RenderRequestIn(BaseModel):
    user_id: UUID
    project_id: UUID
    source_image_url: str = Field(min_length=1)
    style: NigeriaStyle
    budget_ngn: int = Field(ge=50_000, le=200_000_000)


class RenderRequestOut(BaseModel):
    render_request_id: UUID
    status: Literal["queued"] = "queued"


@router.post("", response_model=RenderRequestOut, status_code=status.HTTP_202_ACCEPTED)
async def submit_render(
    payload: RenderRequestIn,
    x_decora_shared_secret: str = Header(..., alias="X-Decora-Shared-Secret"),
) -> RenderRequestOut:
    if x_decora_shared_secret != settings.ai_service_shared_secret:
        raise HTTPException(status_code=401, detail="unauthorized")

    render_request_id = uuid4()
    # TODO(@dev): enqueue BullMQ job, persist render_request row, kick the worker.
    logger.info(
        "render.submitted",
        render_request_id=str(render_request_id),
        user_id=str(payload.user_id),
        style=payload.style,
        budget_ngn=payload.budget_ngn,
    )
    return RenderRequestOut(render_request_id=render_request_id)
