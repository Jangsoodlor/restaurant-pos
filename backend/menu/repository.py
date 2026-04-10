from collections.abc import Sequence
from sqlmodel import select
from ..common import AbstractRepository, EntityNotFoundError
from .models import (
    MenuBase,
    MenuItem,
    MenuItemType,
    MenuUpdate,
)


class MenuItemRepository(
    AbstractRepository[
        MenuItem,
        MenuBase,
        MenuUpdate,
    ]
):
    model = MenuItem

    def list(self, offset: int = 0, limit: int | None = None) -> Sequence[MenuItem]:
        """Get all menu items (excluding modifiers) with pagination."""
        statement = (
            select(self.model)
            .where(self.model.type == MenuItemType.ITEM)
            .offset(offset)
            .limit(limit)
        )
        return self.session.exec(statement).all()

    def create(self, entity: MenuBase) -> MenuItem:
        """Create a new menu item with type set to ITEM."""
        # Create MenuItem with the base fields and set type to ITEM
        db_entity = self.model.model_validate(
            entity, update={"type": MenuItemType.ITEM}
        )
        self.session.add(db_entity)
        self.session.commit()
        self.session.refresh(db_entity)
        return db_entity

    def patch(self, entity_id: int, entity: MenuUpdate) -> MenuItem:
        """Update only the provided fields of a menu item. Type cannot be changed."""
        db_entity = self.session.get(self.model, entity_id)
        if not db_entity:
            raise EntityNotFoundError(
                entity_name=self.model.__name__,
                entity_id=entity_id,
            )
        # Exclude type from update to prevent changing it
        update_data = entity.model_dump(exclude_unset=True)
        db_entity.sqlmodel_update(update_data)
        self.session.add(db_entity)
        self.session.commit()
        self.session.refresh(db_entity)
        return db_entity


class MenuModifierRepository(
    AbstractRepository[
        MenuItem,
        MenuBase,
        MenuUpdate,
    ]
):
    model = MenuItem

    def list(self, offset: int = 0, limit: int | None = None) -> Sequence[MenuItem]:
        """Get all menu modifiers (excluding items) with pagination."""
        statement = (
            select(self.model)
            .where(self.model.type == MenuItemType.MODIFIER)
            .offset(offset)
            .limit(limit)
        )
        return self.session.exec(statement).all()

    def create(self, entity: MenuBase) -> MenuItem:
        """Create a new menu modifier with type set to MODIFIER."""
        # Create MenuItem with the base fields and set type to MODIFIER
        db_entity = self.model.model_validate(
            entity, update={"type": MenuItemType.MODIFIER}
        )
        self.session.add(db_entity)
        self.session.commit()
        self.session.refresh(db_entity)
        return db_entity

    def patch(self, entity_id: int, entity: MenuUpdate) -> MenuItem:
        """Update only the provided fields of a menu modifier. Type cannot be changed."""
        db_entity = self.session.get(self.model, entity_id)
        if not db_entity:
            raise EntityNotFoundError(
                entity_name=self.model.__name__,
                entity_id=entity_id,
            )
        # Exclude type from update to prevent changing it
        update_data = entity.model_dump(exclude_unset=True)
        db_entity.sqlmodel_update(update_data)
        self.session.add(db_entity)
        self.session.commit()
        self.session.refresh(db_entity)
        return db_entity
