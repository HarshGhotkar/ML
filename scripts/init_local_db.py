import asyncio
import os
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent
backend_dir = repo_root / "backend"
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(repo_root))

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./adaptivecloud.db")

from app.db.session import engine, AsyncSessionLocal
from app.models import Base
from app.models.user import User
from app.core.security import hash_password
from sqlalchemy import select

async def init():
    print("[*] Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[+] Database tables created successfully.")

    async with AsyncSessionLocal() as session:
        res = await session.execute(select(User).where(User.username == "admin"))
        admin = res.scalar_one_or_none()
        if not admin:
            admin = User(
                username="admin",
                email="admin@adaptivecloud.local",
                hashed_password=hash_password("password123"),
                role="admin",
                is_active=True,
            )
            session.add(admin)
            await session.commit()
            print("[+] Created default admin user (username: admin, password: password123)")
        else:
            print("[+] Admin user already exists.")

if __name__ == "__main__":
    asyncio.run(init())
