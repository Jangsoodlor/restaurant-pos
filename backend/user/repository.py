from ..common.repository import AbstractRepository
from .models import User, UserBase, UserUpdate


class UserRepository(AbstractRepository[User, UserBase, UserUpdate]):
    model = User
