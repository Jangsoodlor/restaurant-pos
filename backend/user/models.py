from sqlmodel import Field, SQLModel
from enum import Enum


class Role(Enum):
    WAITER = "waiter"
    COOK = "cook"
    MANAGER = "manager"


class UserBase(SQLModel):
    name: str = Field(max_length=255)
    role: Role


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class UserUpdate(UserBase):
    name: str | None = None
    role: Role | None = None
