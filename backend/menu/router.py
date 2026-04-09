from fastapi import APIRouter

from .routers import menu_item_router, menu_modifier_router

router = APIRouter(
    prefix="/menu",
    tags=["menu"],  # Updated to a list
)

router.include_router(
    menu_item_router,
    prefix="/item",
)

router.include_router(
    menu_modifier_router,
    prefix="/modifier",
)
