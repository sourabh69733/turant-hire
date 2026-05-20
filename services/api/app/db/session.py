from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from app.core.config import get_settings

settings = get_settings()

if settings.is_sqlite:
    connect_args = {"check_same_thread": False}
    pool_kwargs = {}
else:
    # Serverless runtimes work better without long-lived pooled connections.
    connect_args = {
        "connect_timeout": 10,
    }
    pool_kwargs = {
        "poolclass": NullPool,
    }

engine = create_engine(
    settings.database_url,
    future=True,
    pool_pre_ping=True,
    connect_args=connect_args,
    **pool_kwargs,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)
