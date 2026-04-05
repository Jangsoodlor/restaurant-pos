from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..common.exceptions import EntityNotFoundError
from ..database import SessionDep
from .models import Table, TableBase, TableUpdate
from .repository import TableRepository, get_table_repository

RepoDep = Annotated[TableRepository, Depends(get_table_repository)]

router = APIRouter(
    prefix="/table",
    tags=["table"],
)


@router.get("/")
def list_tables(
    session: SessionDep,
    repo: RepoDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> Sequence[Table]:
    """Get all tables with pagination."""
    return repo.list(session, offset, limit)


@router.get("/{table_id}")
def retrieve_table(
    table_id: int,
    session: SessionDep,
    repo: RepoDep,
) -> Table:
    """Get a single table by ID."""
    try:
        return repo.retrieve(session, table_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_table(
    table: TableBase,
    session: SessionDep,
    repo: RepoDep,
) -> Table:
    """Create a new table."""
    return repo.create(session, table)


@router.delete("/{table_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_table(
    table_id: int,
    session: SessionDep,
    repo: RepoDep,
):
    """Delete a table by ID."""
    try:
        repo.delete(session, table_id)
        return {"ok", "deleted"}
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.patch("/{table_id}", response_model=Table)
def partial_update_table(
    table_id: int,
    table: TableUpdate,
    session: SessionDep,
    repo: RepoDep,
):
    """Partially update a table (only provided fields)."""
    try:
        return repo.patch(session, table_id, table)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
