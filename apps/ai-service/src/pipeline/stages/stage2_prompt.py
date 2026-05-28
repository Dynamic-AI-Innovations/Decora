"""Stage 2 — Prompt Composition.

Input:  RoomAnalysis + selected style + budget tier + Nigerian prompt library.
Output: { prompt, negative_prompt, controlnet_mode } for Replicate.

Target latency: p50 2s, p95 5s. Target cost: ~₦5 per call.

The Nigerian style library lives in packages/prompts and is the platform's IP.
"""

from __future__ import annotations

from pydantic import BaseModel

from .stage1_room_intel import RoomAnalysis


class RenderPrompt(BaseModel):
    prompt: str
    negative_prompt: str
    controlnet_mode: str  # 'depth' | 'canny'


async def compose_prompt(
    room: RoomAnalysis,
    style: str,
    budget_ngn: int,
) -> RenderPrompt:
    # TODO(@dev, week 6): pull style descriptors from @decora/prompts and ask
    # Claude to compose the final SDXL prompt + negative prompt.
    raise NotImplementedError("Stage 2 wired in week 6 — see docs/BUILD.md §9.")
