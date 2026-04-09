from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..common.exceptions import EntityNotFoundError
from .models import Table, TableBase, TableUpdate
from .repository import TableRepository

RepoDep = Annotated[TableRepository, Depends(TableRepository.from_session)]

router = APIRouter(
    prefix="/table",
    tags=["table"],
)


@router.get("/")
def list_tables(
    repo: RepoDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> Sequence[Table]:
    """Get all tables with pagination."""
    return repo.list(offset, limit)


@router.get("/{table_id}")
def retrieve_table(
    table_id: int,
    repo: RepoDep,
) -> Table:
    """Get a single table by ID."""
    try:
        return repo.retrieve(table_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_table(
    table: TableBase,
    repo: RepoDep,
) -> Table:
    """Create a new table."""
    return repo.create(table)


@router.delete("/{table_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_table(
    table_id: int,
    repo: RepoDep,
):
    """Delete a table by ID."""
    try:
        repo.delete(table_id)
        return {"ok": "deleted"}
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.patch("/{table_id}", response_model=Table)
def partial_update_table(
    table_id: int,
    table: TableUpdate,
    repo: RepoDep,
):
    """Partially update a table (only provided fields)."""
    try:
        return repo.patch(table_id, table)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
