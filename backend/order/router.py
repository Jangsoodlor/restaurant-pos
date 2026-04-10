from fastapi import APIRouter
from .routers import order_line_item_router, order_router

router = APIRouter(
    prefix="/order",
    tags=["order"],
)

router.include_router(order_router)
router.include_router(order_line_item_router)
