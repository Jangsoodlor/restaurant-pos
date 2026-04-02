from contextlib import asynccontextmanager
from fastapi import FastAPI
from .database import create_db_and_tables
from .hero import router as hero_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(hero_router)
