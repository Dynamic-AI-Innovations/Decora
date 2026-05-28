"""Stage 3 — Image Generation.

Input:  RenderPrompt + original photo URL (ControlNet conditioning).
Output: list[RenderVariant] — 3 seed-shifted variants, structural fidelity preserved.

Tool:   Replicate SDXL + ControlNet (depth + canny).
Target: p50 60s, p95 90s. Cost: ~₦65–₦130 for all 3 variants.

Stage 3 is the only stage where retry is expensive — retry once, then surface
an apology + free credit to the user (see docs/BUILD.md §10 #8).
"""

from __future__ import annotations

from pydantic import BaseModel

from .stage2_prompt import RenderPrompt


class RenderVariant(BaseModel):
    variant_index: int  # 0..2
    image_url: str
    seed: int
    width: int
    height: int


async def generate_variants(
    prompt: RenderPrompt,
    source_image_url: str,
) -> list[RenderVariant]:
    # TODO(@dev, week 7): wire Replicate SDXL + ControlNet here.
    raise NotImplementedError("Stage 3 wired in week 7 — see docs/BUILD.md §9.")
