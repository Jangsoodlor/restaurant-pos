from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .common import create_db_and_tables
from .user import user_router
from .table import table_router
from .menu import menu_router
from .order import order_router
from .config import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan, title="Restaurant POS", version="1.0.0")

origins = [origin.strip() for origin in get_settings().cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(user_router)
app.include_router(table_router)
app.include_router(menu_router)
app.include_router(order_router)
