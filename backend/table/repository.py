from ..common import AbstractRepository
from .models import Table, TableBase, TableUpdate


class TableRepository(AbstractRepository[Table, TableBase, TableUpdate]):
    model = Table

    def on_event(self, event_type):
        return super().on_event(event_type)
