from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..common.exceptions import EntityNotFoundError
from .models.order import OrderCreate, OrderUpdate
from .models.order_status import OrderStatus
from .models.tables import Order
from .repositories.order_repository import OrderRepository

RepoDep = Annotated[OrderRepository, Depends(OrderRepository.from_session)]

router = APIRouter(
    prefix="/order",
    tags=["order"],
)


@router.get("/")
def list_orders(
    repo: RepoDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
    status: OrderStatus | None = None,
    table_id: int | None = None,
    user_id: int | None = None,
) -> Sequence[Order]:
    """Get all orders with pagination and optional filtering by status, table_id, or user_id."""
    return repo.list(
        offset=offset, limit=limit, status=status, table_id=table_id, user_id=user_id
    )


@router.get("/{order_id}")
def retrieve_order(
    order_id: int,
    repo: RepoDep,
) -> Order:
    """Get a single order by ID."""
    try:
        return repo.retrieve(order_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_order(
    order: OrderCreate,
    repo: RepoDep,
) -> Order:
    """Create a new order."""
    return repo.create(order)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    repo: RepoDep,
):
    """Delete an order by ID."""
    try:
        repo.delete(order_id)
        return {"ok": "deleted"}
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.patch("/{order_id}", response_model=Order)
def partial_update_order(
    order_id: int,
    order: OrderUpdate,
    repo: RepoDep,
):
    """Partially update an order (only provided fields)."""
    try:
        return repo.patch(order_id, order)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
