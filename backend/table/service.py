from fastapi import HTTPException
from sqlmodel import select, Session
from .models import Table, TableUpdate


class TableService:
    """Service layer for table operations with all business logic."""

    def list(self, session: Session, offset: int = 0, limit: int = 100) -> list[Table]:
        """Get all tables with pagination."""
        statement = select(Table).offset(offset).limit(limit)
        tables = session.exec(statement).all()
        return tables

    def retrieve(self, session: Session, table_id: int) -> Table:
        """Get a single table by ID."""
        table = session.get(Table, table_id)
        if not table:
            raise HTTPException(status_code=404, detail="Table not found")
        return table

    def create(self, session: Session, table: Table) -> Table:
        """Create a new table."""
        session.add(table)
        session.commit()
        session.refresh(table)
        return table

    def delete(self, session: Session, table_id: int) -> None:
        """Delete a table by ID."""
        table = session.get(Table, table_id)
        if not table:
            raise HTTPException(status_code=404, detail="Table not found")
        session.delete(table)
        session.commit()

    def partial_update(
        self, session: Session, table_id: int, table_update: TableUpdate
    ) -> Table:
        """Update only the provided fields of a table."""
        table = session.get(Table, table_id)
        if not table:
            raise HTTPException(status_code=404, detail="Table not found")

        update_data = table_update.model_dump(exclude_unset=True)
        table.sqlmodel_update(update_data)
        session.add(table)
        session.commit()
        session.refresh(table)
        return table
