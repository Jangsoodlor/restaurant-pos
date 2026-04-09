from ..common.repository import AbstractRepository
from .models import (
    MenuBase,
    MenuItem,
    MenuModifier,
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


class MenuModifierRepository(
    AbstractRepository[
        MenuModifier,
        MenuBase,
        MenuUpdate,
    ]
):
    model = MenuModifier
