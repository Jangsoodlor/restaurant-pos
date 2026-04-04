from sqlmodel import SQLModel, Field
from enum import Enum


class TableStatus(Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    OCCUPIED = "occupied"


class Table(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    table_name: str
    capacity: int = Field(ge=1)
    status: TableStatus
