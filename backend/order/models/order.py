from datetime import datetime, timezone

from sqlmodel import Field, SQLModel

from .order_status import OrderStatus


class OrderCreate(SQLModel):
    """Schema for creating a new order"""

    table_id: int
    user_id: int
    status: OrderStatus = OrderStatus.DRAFT


class OrderUpdate(SQLModel):
    """Schema for updating an order (all fields optional for PATCH)"""

    status: OrderStatus | None = None
    closed_at: datetime | None = None
