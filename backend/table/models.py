from sqlmodel import SQLModel, Field
from enum import Enum
from pydantic import ConfigDict


class TableStatus(str, Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    OCCUPIED = "occupied"


class TableBase(SQLModel):
    model_config = ConfigDict(use_enum_values=True)

    table_name: str = Field(max_length=255)
    capacity: int = Field(ge=1)
    status: TableStatus


class Table(TableBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class TableUpdate(SQLModel):
    model_config = ConfigDict(use_enum_values=True)

    table_name: str | None = None
    capacity: int | None = Field(default=None, ge=1)
    status: TableStatus | None = None
