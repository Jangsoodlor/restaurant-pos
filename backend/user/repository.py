from ..common.repository import AbstractRepository
from .models import User, UserBase, UserUpdate
from ..database import SessionDep


class UserRepository(AbstractRepository[User, UserBase, UserUpdate]):
    def __init__(self, session: SessionDep):
        super().__init__(User, session)


def get_user_repository(session: SessionDep) -> UserRepository:
    """Dependency injection for UserRepository."""
    return UserRepository(session)
