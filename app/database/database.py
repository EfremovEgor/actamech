from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import get_app_settings  # your settings loader
from collections.abc import AsyncGenerator

settings = get_app_settings()

DATABASE_URL = settings.database_url.replace(
    "postgresql+psycopg2", "postgresql+asyncpg"
)

engine = create_async_engine(
    DATABASE_URL,
    echo=True,  
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
    class_=AsyncSession,
)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session