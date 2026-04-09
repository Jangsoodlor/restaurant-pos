from ..common.repository import AbstractRepository
from .models import (
    MenuBase,
    MenuItem,
    MenuModifier,
    MenuRecord,
    MenuRecordBase,
    MenuUpdate,
    MenuRecordUpdate,
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


class MenuRecordRepository(
    AbstractRepository[MenuRecord, MenuRecordBase, MenuRecordUpdate]
):
    model = MenuRecord
