from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ...common import EntityNotFoundError
from ..models import MenuBase, MenuItem, MenuUpdate
from ..repository import MenuItemRepository

RepoDep = Annotated[
    MenuItemRepository,
    Depends(MenuItemRepository.from_session),
]

router = APIRouter()


@router.get("/")
def list_tables(
    repo: RepoDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] | None = None,
) -> Sequence[MenuItem]:
    """Get all menu items with pagination."""
    return repo.list(offset, limit)


@router.get("/{menu_item_id}")
def retrieve_menu_item(
    menu_item_id: int,
    repo: RepoDep,
) -> MenuItem:
    """Get a single menu item by ID."""
    try:
        return repo.retrieve(menu_item_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_menu_item(
    table: MenuBase,
    repo: RepoDep,
) -> MenuItem:
    """Create a new menu item."""
    return repo.create(table)


@router.delete("/{menu_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(
    menu_item_id: int,
    repo: RepoDep,
):
    """Delete a menu item by ID."""
    try:
        repo.delete(menu_item_id)
        return {"ok": "deleted"}
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.patch("/{menu_item_id}", response_model=MenuItem)
def partial_update_item(
    menu_item_id: int,
    table: MenuUpdate,
    repo: RepoDep,
):
    """Partially update a menu item (only provided fields)."""
    try:
        return repo.patch(menu_item_id, table)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
