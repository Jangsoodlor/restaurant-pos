from sqlmodel import Field, SQLModel, Relationship


class MenuBase(SQLModel):
    name: str = Field(min_length=1, max_length=1000)
    price: float = Field(ge=0)


class MenuItem(MenuBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class MenuModifier(MenuBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class MenuUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=1000)
    price: float | None = Field(default=None, ge=0)
