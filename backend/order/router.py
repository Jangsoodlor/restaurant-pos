from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status

from ..common import EntityNotFoundError
from .models import (
    Order,
    OrderCreate,
    OrderLineItemBase,
    OrderLineItemCreate,
    OrderStatus,
    OrderUpdate,
    OrderWithLineItems,
)
from .repositories import OrderLineItemRepository, OrderRepository

OrderRepoDep = Annotated[OrderRepository, Depends(OrderRepository.from_session)]
OrderLineItemRepoDep = Annotated[
    OrderLineItemRepository, Depends(OrderLineItemRepository.from_session)
]

router = APIRouter(
    prefix="/order",
    tags=["order"],
)


@router.get("/")
def list_orders(
    repo: OrderRepoDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
    status: OrderStatus | None = None,
    table_id: int | None = None,
    user_id: int | None = None,
) -> Sequence[OrderWithLineItems]:  # Uses the updated DTO
    orders = repo.list(
        offset=offset, limit=limit, status=status, table_id=table_id, user_id=user_id
    )

    return [
        OrderWithLineItems(order=order, order_line_items=order.line_items)
        for order in orders
    ]


@router.get("/{order_id}")
def retrieve_order(
    order_id: int,
    repo: OrderRepoDep,
) -> Order:
    """Get a single order by ID."""
    try:
        return repo.retrieve(order_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_order(
    order: OrderCreate,
    order_line_items: Annotated[Sequence[OrderLineItemBase], Body(min_length=1)],
    order_repo: OrderRepoDep,
    order_line_item_repo: OrderLineItemRepoDep,
) -> Order:
    """Create a new order."""
    created_order = order_repo.create(order)
    line_items_for_order = [
        OrderLineItemCreate(
            **line_item.model_dump(),
            order_id=created_order.id,
        )
        for line_item in order_line_items
    ]

    try:
        order_line_item_repo.create_many(line_items_for_order)
    except Exception:
        try:
            order_repo.delete(created_order.id)
        except EntityNotFoundError:
            pass
        raise

    return order_repo.retrieve(created_order.id)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    repo: OrderRepoDep,
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
    repo: OrderRepoDep,
):
    """Partially update an order (only provided fields)."""
    try:
        return repo.patch(order_id, order)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
