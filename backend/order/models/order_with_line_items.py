from sqlmodel import SQLModel
from .order_tables import Order, OrderLineItem
from collections.abc import Sequence


class OrderWithLineItems(SQLModel):
    order: Order
    order_line_items: Sequence[OrderLineItem]
