from sqlmodel import Field, SQLModel
from enum import Enum
from pydantic import ConfigDict


class Role(str, Enum):
    WAITER = "waiter"
    COOK = "cook"
    MANAGER = "manager"


class UserBase(SQLModel):
    model_config = ConfigDict(use_enum_values=True)

    name: str = Field(max_length=255)
    role: Role


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class UserUpdate(UserBase):
    model_config = ConfigDict(use_enum_values=True)

    name: str | None = Field(default=None, max_length=255)
    role: Role | None = None
