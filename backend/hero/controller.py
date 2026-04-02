from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select, Session
from .models import Hero, HeroUpdate
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


@router.post("/")
def create_hero(hero: Hero, session: SessionDep) -> Hero:
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return hero


@router.delete("/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}


@router.patch("/{hero_id}", response_model=Hero)
def update_hero(hero_id: int, hero: HeroUpdate, session: SessionDep):
    hero_db = session.get(Hero, hero_id)
    if not hero_db:
        raise HTTPException(status_code=404, detail="Hero not found")
    hero_data = hero.model_dump(exclude_unset=True)
    hero_db.sqlmodel_update(hero_data)
    session.add(hero_db)
    session.commit()
    session.refresh(hero_db)
    return hero_db
