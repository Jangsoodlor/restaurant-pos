from fastapi import APIRouter, Query, HTTPException, Depends, status
from sqlmodel import select
from .models import Table, TableUpdate, TableBase
from .service import TableService
from typing import Annotated
from ..database import SessionDep

router = APIRouter(
    prefix="/table",
    tags=["table"],
)


def get_table_service() -> TableService:
    """Dependency injection for TableService."""
    return TableService()


@router.get("/")
def list_tables(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
    service: TableService = Depends(get_table_service),
) -> list[Table]:
    """Get all tables with pagination."""
    return service.list(session, offset, limit)


@router.get("/{table_id}")
def retrieve_table(
    table_id: int,
    session: SessionDep,
    service: TableService = Depends(get_table_service),
) -> Table:
    """Get a single table by ID."""
    return service.retrieve(session, table_id)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_table(
    table: TableBase,
    session: SessionDep,
    service: TableService = Depends(get_table_service),
) -> Table:
    """Create a new table."""
    return service.create(session, table)


@router.delete("/{table_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_table(
    table_id: int,
    session: SessionDep,
    service: TableService = Depends(get_table_service),
):
    """Delete a table by ID."""
    service.delete(session, table_id)


@router.patch("/{table_id}", response_model=Table)
def partial_update_table(
    table_id: int,
    table: TableUpdate,
    session: SessionDep,
    service: TableService = Depends(get_table_service),
):
    """Partially update a table (only provided fields)."""
    return service.patch(session, table_id, table)
