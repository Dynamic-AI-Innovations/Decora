"""Stage 4 — Budget & Shop.

Input:  RenderVariants + RoomAnalysis + price_catalogue rows + user budget.
Output: itemised list with Naira ranges, matched Jumia/Konga affiliate URLs,
        overrun flags + downgrade suggestions.

Tool:   Claude (cross-reference price catalogue).
Target: p50 5s, p95 10s. Cost: ~₦12 per call.
"""

from __future__ import annotations

from pydantic import BaseModel


class BudgetItem(BaseModel):
    item_name: str
    category: str
    price_min_ngn: int
    price_mid_ngn: int
    price_max_ngn: int
    affiliate_url: str | None = None
    affiliate_platform: str | None = None  # 'jumia' | 'konga' | 'vendor_direct'


class BudgetBreakdown(BaseModel):
    items: list[BudgetItem]
    total_min_ngn: int
    total_mid_ngn: int
    total_max_ngn: int
    over_budget: bool
    downgrade_suggestions: list[str] = []


async def score_budget(items: list[str], budget_ngn: int) -> BudgetBreakdown:
    # TODO(@dev, week 8): join detected items with price_catalogue + affiliate_product,
    # ask Claude to suggest downgrades when over budget.
    raise NotImplementedError("Stage 4 wired in week 8 — see docs/BUILD.md §9.")
