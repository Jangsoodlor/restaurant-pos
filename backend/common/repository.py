import abc
from collections.abc import Sequence
from typing import Generic, TypeVar

from sqlmodel import Session, SQLModel, select

from .exceptions import EntityNotFoundError

Model = TypeVar("Model", bound=SQLModel)
CreateDTO = TypeVar("CreateDTO", bound=SQLModel)
UpdateDTO = TypeVar("UpdateDTO", bound=SQLModel)


class AbstractRepository(abc.ABC, Generic[Model, CreateDTO, UpdateDTO]):
    def __init__(
        self,
        model: type[Model],
    ):
        self.model = model

    def list(
        self, session: Session, offset: int = 0, limit: int | None = None
    ) -> Sequence[Model]:
        """Get all entities of a certain model."""
        statement = select(self.model).offset(offset).limit(limit)
        return session.exec(statement).all()

    def retrieve(self, session: Session, entity_id: int) -> Model:
        """Get a single entity by ID."""
        entity = session.get(self.model, entity_id)
        if not entity:
            raise EntityNotFoundError(
                entity_name=self.model.__name__,
                entity_id=entity_id,
            )
        return entity

    def create(self, session: Session, entity: CreateDTO) -> Model:
        """Create a new entity."""
        db_entity = self.model.model_validate(entity)
        session.add(db_entity)
        session.commit()
        session.refresh(db_entity)
        return db_entity

    def delete(self, session: Session, entity_id: int) -> None:
        """Delete an entity by ID."""
        entity = session.get(self.model, entity_id)
        if not entity:
            raise EntityNotFoundError(
                entity_name=self.model.__name__,
                entity_id=entity_id,
            )
        session.delete(entity)
        session.commit()

    def patch(self, session: Session, entity_id: int, entity: UpdateDTO) -> Model:
        """Update only the provided fields of an entity."""
        db_entity = session.get(self.model, entity_id)
        if not db_entity:
            raise EntityNotFoundError(
                entity_name=self.model.__name__,
                entity_id=entity_id,
            )
        update_data = entity.model_dump(exclude_unset=True)
        db_entity.sqlmodel_update(update_data)
        session.add(db_entity)
        session.commit()
        session.refresh(db_entity)
        return db_entity
