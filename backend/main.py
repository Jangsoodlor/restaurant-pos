from contextlib import asynccontextmanager
from fastapi import FastAPI
from .common.database import create_db_and_tables
from .user import router as user_router
from .table import router as table_router
from .menu import router as menu_router
from .order import router as order_router
from .order.routers import order_line_item_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(user_router)
app.include_router(table_router)
app.include_router(menu_router)
app.include_router(order_router)
app.include_router(order_line_item_router)
