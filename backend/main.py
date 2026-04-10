from contextlib import asynccontextmanager
from fastapi import FastAPI
from .common import create_db_and_tables
from .user import user_router
from .table import table_router
from .menu import menu_router
from .order import order_router


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
