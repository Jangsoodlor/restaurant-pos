from collections.abc import Sequence

from sqlmodel import Session, select

from ...common.repository import AbstractRepository
from ...common.exceptions import EntityNotFoundError
from ..models.order_line_item import (
    OrderLineItemCreate,
    OrderLineItemUpdate,
)
from ..models.tables import OrderLineItem, OrderLineItemModifierLink


class OrderLineItemRepository(
    AbstractRepository[OrderLineItem, OrderLineItemCreate, OrderLineItemUpdate]
):
    """Repository for OrderLineItem entities with modifier junction table sync"""

    model = OrderLineItem

    def create(self, entity: OrderLineItemCreate) -> OrderLineItem:
        """Create a new line item and sync modifiers to junction table."""
        # Extract modifier_ids before creating the entity
        modifier_ids = entity.modifier_ids or []

        # Create entity without modifier_ids (they're not part of the model)
        entity_data = entity.model_dump(exclude={"modifier_ids"})
        db_entity = self.model.model_validate(entity_data)

        self.session.add(db_entity)
        self.session.commit()
        self.session.refresh(db_entity)

        # Now sync modifiers to junction table
        if modifier_ids and db_entity.id:
            self._sync_modifiers(db_entity.id, modifier_ids)
            # Refresh to include the relationships
            self.session.refresh(db_entity)

        return db_entity

    def create_many(
        self, entities: Sequence[OrderLineItemCreate]
    ) -> Sequence[OrderLineItem]:
        created_order_line_items = []
        for order_line_item in entities:
            created_order_line_items.append(self.create(order_line_item))
        return created_order_line_items

    def patch(self, entity_id: int, entity: OrderLineItemUpdate) -> OrderLineItem:
        """Update line item and sync modifiers if modifier_ids provided."""
        db_entity = self.session.get(self.model, entity_id)
        if not db_entity:
            raise EntityNotFoundError(
                entity_name=self.model.__name__,
                entity_id=entity_id,
            )

        # Extract modifier_ids for separate handling
        update_data = entity.model_dump(exclude_unset=True, exclude={"modifier_ids"})

        # Update non-modifier fields
        if update_data:
            db_entity.sqlmodel_update(update_data)

        # Handle modifier_ids if provided in the update
        if entity.modifier_ids is not None:
            modifier_ids = entity.modifier_ids
            self._sync_modifiers(entity_id, modifier_ids)

        self.session.add(db_entity)
        self.session.commit()
        self.session.refresh(db_entity)
        return db_entity

    def _sync_modifiers(self, line_item_id: int, modifier_ids: list[int]) -> None:
        """Sync modifier_ids to OrderLineItemModifierLink junction table.

        This replaces all existing modifiers with the provided list.
        """
        # Delete all existing modifier links for this line item
        statement = select(OrderLineItemModifierLink).where(
            OrderLineItemModifierLink.line_item_id == line_item_id
        )
        existing_links = self.session.exec(statement).all()
        for link in existing_links:
            self.session.delete(link)

        # Create new links for each modifier_id
        for modifier_id in modifier_ids:
            link = OrderLineItemModifierLink(
                line_item_id=line_item_id,
                modifier_id=modifier_id,
            )
            self.session.add(link)

        self.session.commit()
