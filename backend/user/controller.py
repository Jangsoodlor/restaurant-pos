from fastapi import APIRouter, Query, HTTPException
from sqlmodel import select
from .models import User, UserUpdate
from typing import Annotated
from ..database import SessionDep

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


@router.get("/")
def list_users(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[User]:
    heroes = session.exec(select(User).offset(offset).limit(limit)).all()
    return heroes


@router.post("/")
def create_user(user: User, session: SessionDep) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(user_id: int, session: SessionDep):
    hero = session.get(User, user_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}


@router.patch("/{user_id}", response_model=User)
def partial_update_user(user_id: int, user: UserUpdate, session: SessionDep):
    hero_db = session.get(User, user_id)
    if not hero_db:
        raise HTTPException(status_code=404, detail="Hero not found")
    hero_data = user.model_dump(exclude_unset=True)
    hero_db.sqlmodel_update(hero_data)
    session.add(hero_db)
    session.commit()
    session.refresh(hero_db)
    return hero_db
