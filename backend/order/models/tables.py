"""SQLModel table definitions for order module - separate from DTOs to avoid import issues."""

from datetime import datetime, timezone
from sqlmodel import Field, Relationship, SQLModel

from ...table import Table
from ...user import User
from .order_status import OrderStatus


class Order(SQLModel, table=True):
    """Order database table"""

    id: int | None = Field(default=None, primary_key=True)
    table_id: int = Field(foreign_key="table.id")
    user_id: int = Field(foreign_key="user.id")
    status: OrderStatus = Field(default=OrderStatus.DRAFT)
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


class OrderLineItemModifierLink(SQLModel, table=True):
    """Junction table for modifiers applied to a line item"""

    line_item_id: int | None = Field(
        default=None, foreign_key="orderlineitem.id", primary_key=True
    )
    modifier_id: int | None = Field(
        default=None, foreign_key="menuitem.id", primary_key=True
    )


class OrderLineItem(SQLModel, table=True):
    """OrderLineItem database table"""

    id: int | None = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    menu_item_id: int = Field(foreign_key="menuitem.id")
    item_name: str
    unit_price: float
    quantity: int = Field(default=1, ge=1)

    # Relationships
    order: "Order" = Relationship(back_populates="line_items")
    menu_item: "MenuItem" = Relationship()  # type: ignore
    modifiers: list["MenuItem"] = Relationship(link_model=OrderLineItemModifierLink)  # type: ignore

    @property
    def subtotal(self) -> float:
        modifier_total = sum(m.price for m in self.modifiers)
        return (self.unit_price + modifier_total) * self.quantity


# Import MenuItem here to avoid circular imports in schemas
from ...menu import MenuItem  # noqa: E402
