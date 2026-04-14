from sqlmodel import SQLModel
from .order_tables import Order
from collections.abc import Sequence
from ...menu import MenuItem


class OrderLineItemRead(SQLModel):
    """DTO for reading a line item, explicitly including its modifiers."""

    id: int
    order_id: int
    menu_item_id: int
    item_name: str
    unit_price: float
    quantity: int

    # 💡 This is the magic line. By defining it as a standard field
    # instead of a Relationship, Pydantic will serialize it!
    modifiers: list[MenuItem] = []


class OrderWithLineItems(SQLModel):
    order: Order
    order_line_items: Sequence[OrderLineItemRead]
