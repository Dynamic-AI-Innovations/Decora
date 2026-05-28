"""Pipeline stage stubs. Each stage is async, idempotent, and emits structured logs."""

from .stage1_room_intel import analyze_room
from .stage2_prompt import compose_prompt
from .stage3_image import generate_variants
from .stage4_budget import score_budget

__all__ = [
    "analyze_room",
    "compose_prompt",
    "generate_variants",
    "score_budget",
]
