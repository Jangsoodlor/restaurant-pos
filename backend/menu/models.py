from enum import Enum
from sqlmodel import Field, SQLModel


class MenuItemType(str, Enum):
    ITEM = "item"
    MODIFIER = "modifier"


class MenuBase(SQLModel):
    name: str = Field(min_length=1, max_length=1000)
    price: float = Field(ge=0)


class MenuItem(MenuBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    type: MenuItemType = Field(default=MenuItemType.ITEM)


class MenuUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=1000)
    price: float | None = Field(default=None, ge=0)
