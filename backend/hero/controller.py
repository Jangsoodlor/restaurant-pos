from fastapi import APIRouter, Depends, Query
from sqlmodel import select, Session
from .models import Hero
from typing import Annotated
from ..database import get_session

router = APIRouter(
    prefix="/hero",
    tags=["hero"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/")
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Hero]:
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes
