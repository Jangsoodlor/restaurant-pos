from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ...common.exceptions import EntityNotFoundError
from ..models import MenuBase, MenuModifier, MenuUpdate
from ..repository import MenuModifierRepository

# Update the dependency to use the MenuModifierRepository
RepoDep = Annotated[
    MenuModifierRepository,
    Depends(MenuModifierRepository.from_session),
]

router = APIRouter()


@router.get("/")
def list_modifiers(
    repo: RepoDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] | None = None,
) -> Sequence[MenuModifier]:
    """Get all menu modifiers with pagination."""
    return repo.list(offset, limit)


@router.get("/{modifier_id}")
def retrieve_modifier(
    modifier_id: int,
    repo: RepoDep,
) -> MenuModifier:
    """Get a single menu modifier by ID."""
    try:
        return repo.retrieve(modifier_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_modifier(
    modifier: MenuBase,
    repo: RepoDep,
) -> MenuModifier:
    """Create a new menu modifier."""
    return repo.create(modifier)


@router.delete("/{modifier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_modifier(
    modifier_id: int,
    repo: RepoDep,
):
    """Delete a menu modifier by ID."""
    try:
        repo.delete(modifier_id)
        return {"ok": "deleted"}  # Fixed from set {"ok", "deleted"} to dict
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.patch("/{modifier_id}", response_model=MenuModifier)
def partial_update_modifier(
    modifier_id: int,
    modifier: MenuUpdate,
    repo: RepoDep,
):
    """Partially update a menu modifier (only provided fields)."""
    try:
        return repo.patch(modifier_id, modifier)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
