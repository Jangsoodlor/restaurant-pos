import abc
from collections.abc import Sequence
from typing import Generic, TypeVar, ClassVar

from sqlmodel import Session, SQLModel, select

from .exceptions import EntityNotFoundError
from .database import SessionDep

Model = TypeVar("Model", bound=SQLModel)
CreateDTO = TypeVar("CreateDTO", bound=SQLModel)
UpdateDTO = TypeVar("UpdateDTO", bound=SQLModel)


class AbstractRepository(abc.ABC, Generic[Model, CreateDTO, UpdateDTO]):
    model: ClassVar[Model]

    def __init__(
        self,
        session: Session,
    ):
        self.session = session

    def list(self, offset: int = 0, limit: int | None = None) -> Sequence[Model]:
        """Get all entities of a certain model."""
        statement = select(self.model).offset(offset).limit(limit)
        return self.session.exec(statement).all()

    def retrieve(self, entity_id: int) -> Model:
        """Get a single entity by ID."""
        entity = self.session.get(self.model, entity_id)
        if not entity:
            raise EntityNotFoundError(
                entity_name=self.model.__name__,
                entity_id=entity_id,
            )
        return entity

    def create(self, entity: CreateDTO) -> Model:
        """Create a new entity."""
        db_entity = self.model.model_validate(entity)
        self.session.add(db_entity)
        self.session.commit()
        self.session.refresh(db_entity)
        return db_entity

    def delete(self, entity_id: int) -> None:
        """Delete an entity by ID."""
        entity = self.session.get(self.model, entity_id)
        if not entity:
            raise EntityNotFoundError(
                entity_name=self.model.__name__,
                entity_id=entity_id,
            )
        self.session.delete(entity)
        self.session.commit()

    def patch(self, entity_id: int, entity: UpdateDTO) -> Model:
        """Update only the provided fields of an entity."""
        db_entity = self.session.get(self.model, entity_id)
        if not db_entity:
            raise EntityNotFoundError(
                entity_name=self.model.__name__,
                entity_id=entity_id,
            )
        update_data = entity.model_dump(exclude_unset=True)
        db_entity.sqlmodel_update(update_data)
        self.session.add(db_entity)
        self.session.commit()
        self.session.refresh(db_entity)
        return db_entity

    @classmethod
    def from_session(cls, session: SessionDep):
        """Get the repository for a database connection session"""
        return cls(session)
