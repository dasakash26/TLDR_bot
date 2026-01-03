from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user_routes import router as user_router
from routes.file_routes import router as file_routes
from routes.folder_routes import router as folder_routes
from contextlib import asynccontextmanager
from services.db_service import db
from routes.thread_routes import router as thread_routes
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


limiter = Limiter(key_func=get_remote_address)
app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/user", tags=["user"])
app.include_router(folder_routes, prefix="/folder", tags=["folder"])
app.include_router(file_routes, prefix="/file", tags=["file"])
app.include_router(thread_routes, prefix="/thread", tags=["thread"])


@app.get("/")
async def read_root():
    return {"message": "Server is running."}
