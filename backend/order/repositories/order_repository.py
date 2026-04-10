from collections.abc import Sequence

from sqlmodel import select

from ...common import AbstractRepository
from ..models.order import OrderCreate, OrderUpdate
from ..models.order_status import OrderStatus
from ..models.tables import Order


class OrderRepository(AbstractRepository[Order, OrderCreate, OrderUpdate]):
    """Repository for Order entities with filtering support"""

    model = Order

    def list(
        self,
        offset: int = 0,
        limit: int | None = None,
        status: OrderStatus | None = None,
        table_id: int | None = None,
        user_id: int | None = None,
    ) -> Sequence[Order]:
        """Get all orders with optional filtering by status, table_id, or user_id."""
        statement = select(self.model).offset(offset).limit(limit)

        # Apply filters if provided
        if status is not None:
            statement = statement.where(self.model.status == status)
        if table_id is not None:
            statement = statement.where(self.model.table_id == table_id)
        if user_id is not None:
            statement = statement.where(self.model.user_id == user_id)

        return self.session.exec(statement).all()
