from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import engine, Base, SessionLocal
from .seed import seed_database
from .api import (
    routes_students,
    routes_checkins,
    routes_support,
    routes_dashboards,
    routes_resources,
    routes_ml,
    routes_chat,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Seed realistic demo data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="CampusPulse API",
    description="Early Wellbeing Signal System for University Student Support",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API routers
app.include_router(routes_students.router)
app.include_router(routes_checkins.router)
app.include_router(routes_support.router)
app.include_router(routes_dashboards.router)
app.include_router(routes_resources.router)
app.include_router(routes_ml.router)
app.include_router(routes_chat.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "CampusPulse API",
        "version": "1.0.0",
        "privacy_mode": "Strict Anonymization & Consent-Driven"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
