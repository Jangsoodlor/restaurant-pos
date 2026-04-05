from ..common.repository import AbstractRepository
from .models import Table, TableBase, TableUpdate
from ..database import SessionDep


class TableRepository(AbstractRepository[Table, TableBase, TableUpdate]):
    def __init__(self):
        # Pass the specific Database model to the base class
        super().__init__(Table)


def get_table_repository() -> TableRepository:
    """Dependency injection for TableRepository."""
    return TableRepository()
