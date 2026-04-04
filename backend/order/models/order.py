from sqlmodel import Field, SQLModel
import datetime
from order_status import OrderStatus


class Order(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    status: OrderStatus = Field(max_length=255)
    created_at: datetime.datetime = Field()
    table: int = Field(foreign_key="table.id")
    menu_record: int = Field(foreign_key="menurecord.id")
    # created_by
    # special_instructions
