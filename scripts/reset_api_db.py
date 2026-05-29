from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine

# Import models so SQLAlchemy metadata is fully registered before reset.
from app.db import models  # noqa: F401


def main() -> None:
    settings = get_settings()
    print(f"Resetting database schema for: {settings.database_url}")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database reset complete.")


if __name__ == "__main__":
    main()
