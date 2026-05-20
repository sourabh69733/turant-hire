from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "TurantHire API"
    app_version: str = "0.1.0"
    api_prefix: str = "/api"
    debug: bool = True
    allowed_origins: list[str] = [
        "http://127.0.0.1:4174",
        "http://127.0.0.1:4175",
        "http://localhost:4174",
        "http://localhost:4175",
        "https://api.turanthire.com",
        "https://talent.turanthire.com",
        "https://turanthire.com",
    ]
    database_url: str = "postgresql+psycopg://postgres:password@db.project-ref.supabase.co:5432/postgres"
    supabase_url: str | None = None
    supabase_anon_key: str | None = None
    supabase_service_role_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")

    @property
    def is_supabase_postgres(self) -> bool:
        return "supabase.co" in self.database_url


@lru_cache
def get_settings() -> Settings:
    return Settings()
