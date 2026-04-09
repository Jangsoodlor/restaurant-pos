from datetime import datetime, timezone

from order_status import OrderStatus
from sqlmodel import Field, Relationship, SQLModel

from ...table import Table
from ...user import User
from .order_line_item import OrderLineItem


class OrderBase(SQLModel):
    table_id: int = Field(foreign_key="table.id")
    user_id: int = Field(foreign_key="user.id")
    status: OrderStatus = Field(default=OrderStatus.OPEN)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )
    closed_at: datetime | None = Field(default=None)

    # Relationships
    table: "Table" = Relationship()
    user: "User" = Relationship()
    line_items: list["OrderLineItem"] = Relationship(back_populates="order")

    @property
    def total(self) -> float:
        return sum(item.subtotal for item in self.line_items)


class Order(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
