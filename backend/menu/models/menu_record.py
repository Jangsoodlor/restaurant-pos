from sqlmodel import Field, SQLModel


class MenuRecordModifierLink(SQLModel, table=True):
    """Junction table for Many-to-Many relationship"""

    record_id: int | None = Field(
        default=None, foreign_key="menurecord.id", primary_key=True
    )
    modifier_id: int | None = Field(
        default=None, foreign_key="menumodifier.id", primary_key=True
    )


class MenuRecordBase(SQLModel):
    menu_item_id: int = Field(foreign_key="menuitem.id")


class MenuRecord(MenuRecordBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class MenuRecordUpdate(SQLModel):
    menu_item_id: int | None = None
