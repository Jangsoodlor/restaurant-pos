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
    password_hash: str


class UserCreate(UserBase):
    password: str = Field(max_length=72)


class UserLogin(SQLModel):
    name: str
    password: str = Field(max_length=72)


class Token(SQLModel):
    access_token: str
    token_type: str


class UserRead(UserBase):
    id: int


class UserUpdate(UserBase):
    model_config = ConfigDict(use_enum_values=True)

    name: str | None = Field(default=None, max_length=72)
    role: Role | None = None
