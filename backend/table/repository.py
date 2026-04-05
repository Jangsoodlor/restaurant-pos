from ..common.repository import AbstractRepository
from .models import Table, TableBase, TableUpdate
from ..database import SessionDep


class TableRepository(AbstractRepository[Table, TableBase, TableUpdate]):
    def __init__(self, session: SessionDep):
        # Pass the specific Database model and session to the base class
        super().__init__(Table, session)


def get_table_repository(session: SessionDep) -> TableRepository:
    """Dependency injection for TableRepository."""
    return TableRepository(session)
