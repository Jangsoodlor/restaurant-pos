from sqlmodel import Field, SQLModel


class OrderLineItemCreate(SQLModel):
    """Schema for creating a new line item"""

    order_id: int
    menu_item_id: int
    item_name: str
    unit_price: float
    quantity: int = Field(default=1, ge=1)
    modifier_ids: list[int] = Field(default_factory=list)
    notes: str | None = Field(default=None, max_length=500)


class OrderLineItemUpdate(SQLModel):
    """Schema for updating a line item (all fields optional for PATCH)"""

    quantity: int | None = Field(default=None, ge=1)
    unit_price: float | None = None
    item_name: str | None = None
    modifier_ids: list[int] | None = None
    notes: str | None = Field(default=None, max_length=500)
