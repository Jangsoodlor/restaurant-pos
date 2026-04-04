from sqlmodel import Field, SQLModel, Relationship


class MenuBase(SQLModel):
    name: str = Field(min_length=1, max_length=1000)
    price: float = Field(ge=0)


class MenuItem(MenuBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class MenuModifier(MenuBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class MenuRecordModifierLink(SQLModel, table=True):
    """Junction table for Many-to-Many relationship"""

    record_id: int | None = Field(
        default=None, foreign_key="menurecord.id", primary_key=True
    )
    modifier_id: int | None = Field(
        default=None, foreign_key="menumodifier.id", primary_key=True
    )


class MenuRecord(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    menu_item_id: int = Field(foreign_key="menuitem.id")
    menu_item: MenuItem = Relationship(back_populates="records")
    modifiers: list[MenuModifier] = Relationship(link_model=MenuRecordModifierLink)

    def get_price(self) -> float:
        return self.menu_item.price + sum(m.price for m in self.modifiers)
