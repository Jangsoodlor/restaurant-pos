from ..common.repository import AbstractRepository
from .models import Table, TableBase, TableUpdate


class TableRepository(AbstractRepository[Table, TableBase, TableUpdate]):
    model = Table
