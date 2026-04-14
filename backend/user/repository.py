from collections.abc import Sequence

from sqlmodel import select

from ..common import AbstractRepository
from .models import User, UserCreate, UserUpdate, Role


class UserRepository(AbstractRepository[User, UserCreate, UserUpdate]):
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

    def create(self, user: UserCreate) -> User:
        from .auth_utils import get_password_hash

        user_data = user.model_dump()
        password = user_data.pop("password")
        user_data["password_hash"] = get_password_hash(password)
        db_user = User(**user_data)
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        return db_user

    def get_by_name(self, name: str) -> User | None:
        """Get a user by name."""
        statement = select(self.model).where(self.model.name == name)
        return self.session.exec(statement).first()
