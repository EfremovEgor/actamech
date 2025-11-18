from typing import Dict
from sqlalchemy import Select, func, select
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


async def paginate(
    session: AsyncSession,
    stmt,
    page: int = 0,
    per_page: int | None = get_app_settings().pagination_items_per_page,
) -> Dict[str, any]:

    result = await session.execute(stmt.offset(page * per_page).limit(per_page))
    items = result.mappings().all()

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await session.execute(count_stmt)
    total = total_result.scalar_one()

    return {
        "items": items,
        "meta": {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
        },
    }
