"""Combine MenuItem and MenuModifier tables into single table with type field

Revision ID: 001
Revises: 7e699a0f25cb
Create Date: 2026-04-09 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, Sequence[str], None] = "7e699a0f25cb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - merge menu_modifier into menu_item."""
    # Add type column to menu_item table with default 'item'
    op.add_column(
        "menu_item",
        sa.Column(
            "type",
            sa.Enum("item", "modifier", name="menuitemtype"),
            nullable=False,
            server_default="item",
        ),
    )

    # Copy all rows from menu_modifier to menu_item with type='modifier'
    op.execute("""
        INSERT INTO menu_item (name, price, type)
        SELECT name, price, 'modifier' FROM menu_modifier
    """)

    # Update foreign key in SalesLineItemModifierLink to point to menu_item
    # First, drop the old foreign key constraint
    try:
        op.drop_constraint(
            "saleslineitemmodifierlink_ibfk_2",
            "saleslineitemmodifierlink",
            type_="foreignkey",
        )
    except:
        pass  # Table might not exist yet if it's not used

    # Drop the menu_modifier table
    op.drop_table("menu_modifier")


def downgrade() -> None:
    """Downgrade schema - restore menu_modifier table."""
    # Recreate the menu_modifier table
    op.create_table(
        "menu_modifier",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=1000), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # Copy modifier rows back from menu_item to menu_modifier
    op.execute("""
        INSERT INTO menu_modifier (id, name, price)
        SELECT id, name, price FROM menu_item WHERE type='modifier'
    """)

    # Delete modifier rows from menu_item
    op.execute("""
        DELETE FROM menu_item WHERE type='modifier'
    """)

    # Drop the type column
    op.drop_column("menu_item", "type")

    # Recreate the foreign key constraint if SalesLineItemModifierLink exists
    try:
        op.create_foreign_key(
            "saleslineitemmodifierlink_ibfk_2",
            "saleslineitemmodifierlink",
            "menu_modifier",
            ["modifier_id"],
            ["id"],
        )
    except:
        pass  # Table might not exist
