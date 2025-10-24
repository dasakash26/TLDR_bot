from fastapi import FastAPI
from routes.user_routes import router as user_router
from contextlib import asynccontextmanager
from services.db_service import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


app = FastAPI(lifespan=lifespan)

app.include_router(user_router, prefix="/user", tags=["user"])


@app.get("/")
async def read_root():
    return {"message": "Server is running."}
