from sqlmodel import SQLModel, Field
from enum import Enum
from pydantic import ConfigDict


class TableStatus(str, Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    OCCUPIED = "occupied"


class Table(SQLModel, table=True):
    model_config = ConfigDict(use_enum_values=True)

    id: int | None = Field(default=None, primary_key=True)
    table_name: str
    capacity: int = Field(ge=1)
    status: TableStatus


class TableUpdate(SQLModel):
    model_config = ConfigDict(use_enum_values=True)

    table_name: str | None = None
    capacity: int | None = None
    status: TableStatus | None = None
