"""Decora render pipeline.

Each stage owns a tight contract. See docs/BUILD.md §7.
"""

from . import stages

__all__ = ["stages"]
