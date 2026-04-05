from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..common.exceptions import EntityNotFoundError
from .models import User, UserBase, UserUpdate
from .repository import UserRepository, get_user_repository

RepoDep = Annotated[UserRepository, Depends(get_user_repository)]

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


@router.get("/")
def list_users(
    repo: RepoDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> Sequence[User]:
    """Get all users with pagination."""
    return repo.list(offset, limit)


@router.get("/{user_id}")
def retrieve_user(
    user_id: int,
    repo: RepoDep,
) -> User:
    """Get a single user by ID."""
    try:
        return repo.retrieve(user_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserBase,
    repo: RepoDep,
) -> User:
    """Create a new user."""
    return repo.create(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    repo: RepoDep,
):
    """Delete a user by ID."""
    try:
        repo.delete(user_id)
        return {"ok": "deleted"}
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.patch("/{user_id}", response_model=User)
def partial_update_user(
    user_id: int,
    user: UserUpdate,
    repo: RepoDep,
):
    """Partially update a user (only provided fields)."""
    try:
        return repo.patch(user_id, user)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
