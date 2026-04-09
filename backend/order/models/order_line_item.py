from sqlmodel import Field, Relationship, SQLModel

from ...menu import MenuItem
from .order import Order


class OrderLineItemModifierLink(SQLModel, table=True):
    """Automatic one-to-many junction table for modifiers applied to a line item"""

    line_item_id: int | None = Field(
        default=None, foreign_key="orderlineitem.id", primary_key=True
    )
    modifier_id: int | None = Field(
        default=None, foreign_key="menuitem.id", primary_key=True
    )


class OrderLineItemBase(SQLModel):
    """An item in one line of the order. Think of it as a line of item on the receipt printed by the POS."""

    order_id: int = Field(foreign_key="order.id")

    # Snapshot of menu item at time of sale
    menu_item_id: int = Field(foreign_key="menuitem.id")
    item_name: str  # snapshot
    unit_price: float  # snapshot
    quantity: int = Field(default=1, ge=1)

    # Relationships
    order: "Order" = Relationship(back_populates="line_items")
    menu_item: "MenuItem" = Relationship()
    modifiers: list["MenuItem"] = Relationship(link_model=OrderLineItemModifierLink)

    @property
    def subtotal(self) -> float:
        modifier_total = sum(m.price for m in self.modifiers)
        return (self.unit_price + modifier_total) * self.quantity


class OrderLineItem(OrderLineItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class OrderLineUpdate(SQLModel):
    # All fields are optional so a PATCH request can update just one or two things.
    quantity: int | None = Field(default=None, ge=1)

    # Optional: If your POS allows overriding the snapshot price/name after the fact
    unit_price: float | None = None
    item_name: str | None = None

    # For updating relationships (like modifiers), it is standard to accept a
    # list of IDs rather than nested objects. Your API endpoint would then
    # handle syncing these IDs with the OrderLineItemModifierLink table.
    modifier_ids: list[int] | None = None
