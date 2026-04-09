from collections.abc import Sequence
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ...common.exceptions import EntityNotFoundError
from ..models.order_line_item import OrderLineItemCreate, OrderLineItemUpdate
from ..models.tables import OrderLineItem
from ..repositories.order_line_item_repository import OrderLineItemRepository
from ..repositories.order_repository import OrderRepository

LineItemRepoDep = Annotated[
    OrderLineItemRepository, Depends(OrderLineItemRepository.from_session)
]
OrderRepoDep = Annotated[OrderRepository, Depends(OrderRepository.from_session)]

router = APIRouter(
    prefix="/order/{order_id}/line-items",
    tags=["order-line-items"],
)


@router.get("/")
def list_line_items(
    order_id: int,
    repo: LineItemRepoDep,
    order_repo: OrderRepoDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> Sequence[OrderLineItem]:
    """Get all line items for an order with pagination."""
    # Verify order exists
    try:
        order_repo.retrieve(order_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

    return repo.list(offset=offset, limit=limit)


@router.get("/{line_item_id}")
def retrieve_line_item(
    order_id: int,
    line_item_id: int,
    repo: LineItemRepoDep,
) -> OrderLineItem:
    """Get a single line item by ID."""
    try:
        line_item = repo.retrieve(line_item_id)
        # Verify line item belongs to the order
        if line_item.order_id != order_id:
            raise HTTPException(
                status_code=404,
                detail=f"Line item {line_item_id} not found in order {order_id}",
            )
        return line_item
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_line_item(
    order_id: int,
    line_item: OrderLineItemCreate,
    repo: LineItemRepoDep,
    order_repo: OrderRepoDep,
) -> OrderLineItem:
    """Create a new line item for an order."""
    # Verify order exists
    try:
        order_repo.retrieve(order_id)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

    # Verify the order_id in the payload matches the URL parameter
    if line_item.order_id != order_id:
        raise HTTPException(
            status_code=400,
            detail=f"Order ID in request body ({line_item.order_id}) does not match URL parameter ({order_id})",
        )

    return repo.create(line_item)


@router.delete("/{line_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_line_item(
    order_id: int,
    line_item_id: int,
    repo: LineItemRepoDep,
):
    """Delete a line item by ID."""
    try:
        line_item = repo.retrieve(line_item_id)
        # Verify line item belongs to the order
        if line_item.order_id != order_id:
            raise HTTPException(
                status_code=404,
                detail=f"Line item {line_item_id} not found in order {order_id}",
            )
        repo.delete(line_item_id)
        return {"ok": "deleted"}
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.patch("/{line_item_id}", response_model=OrderLineItem)
def partial_update_line_item(
    order_id: int,
    line_item_id: int,
    line_item: OrderLineItemUpdate,
    repo: LineItemRepoDep,
):
    """Partially update a line item (only provided fields)."""
    try:
        existing_item = repo.retrieve(line_item_id)
        # Verify line item belongs to the order
        if existing_item.order_id != order_id:
            raise HTTPException(
                status_code=404,
                detail=f"Line item {line_item_id} not found in order {order_id}",
            )
        return repo.patch(line_item_id, line_item)
    except EntityNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
