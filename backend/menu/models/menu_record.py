from sqlmodel import Field, SQLModel


class MenuRecordModifierLink(SQLModel, table=True):
    """Junction table for Many-to-Many relationship"""

    record_id: int | None = Field(
        default=None, foreign_key="menuitem.id", primary_key=True
    )
    modifier_id: int | None = Field(
        default=None, foreign_key="menumodifier.id", primary_key=True
    )
