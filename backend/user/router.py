from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..common import EntityNotFoundError
from .dependencies import get_current_user
from .models import (
    User,
    UserCreate,
    UserRead,
    UserUpdate,
    Role,
    UserLogin,
    Token,
)
from .repository import UserRepository

RepoDep = Annotated[UserRepository, Depends(UserRepository.from_session)]


router = APIRouter(
    prefix="/user",
    tags=["user"],
)


@router.get("/", response_model=Sequence[UserRead])
def list_users(
    repo: RepoDep,
    current_user: Annotated[User, Depends(get_current_user)],
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
    role: Role | None = Query(None),
) -> Sequence[User]:
    """Get all users with pagination."""
    return repo.list(offset, limit, role=role)


@router.get("/{user_id}", response_model=UserRead)
def retrieve_user(
    user_id: int,
    repo: RepoDep,
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Get a single user by ID."""
    try:
        return repo.retrieve(user_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserRead)
def create_user(
    user: UserCreate,
    repo: RepoDep,
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Create a new user."""
    return repo.create(user)


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserRead)
def register_user(
    user: UserCreate,
    repo: RepoDep,
) -> User:
    """Register a new user."""
    return repo.create(user)


@router.post("/login", response_model=Token)
def login_user(
    user_credentials: UserLogin,
    repo: RepoDep,
):
    """Authenticate user and return JWT access token."""
    from .auth_utils import verify_password, create_access_token

    # Find user by name
    user = repo.get_by_name(user_credentials.name)

    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    repo: RepoDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Delete a user by ID."""
    try:
        repo.delete(user_id)
        return {"ok": "deleted"}
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.patch("/{user_id}", response_model=UserRead)
def partial_update_user(
    user_id: int,
    user: UserUpdate,
    repo: RepoDep,
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Partially update a user (only provided fields)."""
    try:
        return repo.patch(user_id, user)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
