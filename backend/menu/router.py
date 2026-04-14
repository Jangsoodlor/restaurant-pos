from fastapi import APIRouter, Depends
from ..user.dependencies import get_current_user

from .routers import menu_item_router, menu_modifier_router

router = APIRouter(
    prefix="/menu",
    tags=["menu"],  # Updated to a list
    dependencies=[Depends(get_current_user)],
)

router.include_router(
    menu_item_router,
    prefix="/item",
)

router.include_router(
    menu_modifier_router,
    prefix="/modifier",
)
