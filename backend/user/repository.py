from collections.abc import Sequence

from sqlmodel import select

from ..common import AbstractRepository
from .models import User, UserBase, UserUpdate, Role


class UserRepository(AbstractRepository[User, UserBase, UserUpdate]):
    """Repository for User entities with optional role filtering"""

    model = User

    def list(
        self,
        offset: int = 0,
        limit: int | None = None,
        role: Role | None = None,
    ) -> Sequence[User]:
        """Get all users with optional filtering by role."""
        statement = select(self.model).offset(offset).limit(limit)

        if role is not None:
            statement = statement.where(self.model.role == role)

        return self.session.exec(statement).all()
