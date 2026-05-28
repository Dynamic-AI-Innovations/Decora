"""Typed settings loaded from environment. See repo root .env.example."""

from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env.local",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    env: str = Field(default="development")

    anthropic_api_key: str = ""
    anthropic_model_primary: str = "claude-sonnet-4-6"
    anthropic_model_cheap: str = "claude-haiku-4-5-20251001"

    replicate_api_token: str = ""
    replicate_sdxl_version: str = ""
    replicate_controlnet_version: str = ""

    fal_api_key: str = ""

    supabase_url: str = ""
    supabase_service_role: str = ""

    upstash_redis_rest_url: str = ""
    upstash_redis_rest_token: str = ""

    sentry_dsn: str = ""
    ai_service_shared_secret: str = ""

    cors_allow_origins: list[str] = ["http://localhost:3000"]


settings = Settings()
