"""Stage 1 — Room Intelligence.

Input:  source_image_url (signed Supabase Storage URL).
Output: RoomAnalysis JSON (roomType, dims, furniture[], lighting, walls, floor, openings).
LLM:    Claude (vision) — model from settings.anthropic_model_primary.

Target latency: p50 4s, p95 8s. Target cost: ~₦8 per call.

NOTE: prompt caching MUST be enabled on the Nigerian-context system prompt to
keep per-render cost inside the BUILD.md envelope.
"""

from __future__ import annotations

from pydantic import BaseModel


class RoomAnalysis(BaseModel):
    room_type: str
    width_m: float | None = None
    length_m: float | None = None
    height_m: float | None = None
    furniture: list[str] = []
    lighting: str | None = None
    wall_finish: str | None = None
    floor_finish: str | None = None
    openings: list[str] = []  # windows, doors


async def analyze_room(source_image_url: str) -> RoomAnalysis:
    # TODO(@dev, week 4): wire Anthropic vision call here.
    raise NotImplementedError("Stage 1 wired in week 4 — see docs/BUILD.md §9.")
