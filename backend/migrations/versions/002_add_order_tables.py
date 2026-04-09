"""Add order and orderlineitem tables

Revision ID: 002
Revises: 001
Create Date: 2026-04-09 13:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "002"
down_revision: Union[str, Sequence[str], None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - add order and orderlineitem tables."""
    # Create order table
    op.create_table(
        "order",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("table_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "draft",
                "in_progress",
                "awaiting_payment",
                "on_hold",
                "completed",
                "cancelled",
                "voided",
                "refunded",
                name="orderstatus",
            ),
            nullable=False,
            server_default="draft",
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("closed_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["table_id"], ["table.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create orderlineitem table
    op.create_table(
        "orderlineitem",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("order_id", sa.Integer(), nullable=False),
        sa.Column("menu_item_id", sa.Integer(), nullable=False),
        sa.Column("item_name", sa.String(length=1000), nullable=False),
        sa.Column("unit_price", sa.Float(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.ForeignKeyConstraint(["order_id"], ["order.id"]),
        sa.ForeignKeyConstraint(["menu_item_id"], ["menu_item.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create orderlineitemmodifierlink junction table
    op.create_table(
        "orderlineitemmodifierlink",
        sa.Column("line_item_id", sa.Integer(), nullable=True),
        sa.Column("modifier_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["line_item_id"], ["orderlineitem.id"]),
        sa.ForeignKeyConstraint(["modifier_id"], ["menu_item.id"]),
        sa.PrimaryKeyConstraint("line_item_id", "modifier_id"),
    )


def downgrade() -> None:
    """Downgrade schema - drop order tables."""
    op.drop_table("orderlineitemmodifierlink")
    op.drop_table("orderlineitem")
    op.drop_table("order")
