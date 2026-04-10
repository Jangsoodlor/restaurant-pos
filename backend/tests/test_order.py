import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select

from backend.user.models import User, Role
from backend.table.models import Table
from backend.menu.models import MenuItem, MenuItemType
from backend.order.models.tables import Order, OrderLineItem, OrderLineItemModifierLink
from backend.order.models.order_status import OrderStatus


@pytest.fixture(name="user_fixture")
def user_fixture(session: Session):
    """Create a sample User for testing."""
    user = User(name="Test Waiter", role=Role.WAITER)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="table_fixture")
def table_fixture(session: Session):
    """Create a sample Table for testing."""
    table = Table(table_name="Table 5", capacity=4, status="available")
    session.add(table)
    session.commit()
    session.refresh(table)
    return table


@pytest.fixture(name="menu_item_fixture")
def menu_item_fixture(session: Session):
    """Create a sample MenuItem for testing."""
    item = MenuItem(name="Burger", price=10.0, type=MenuItemType.ITEM)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@pytest.fixture(name="modifier_fixture")
def modifier_fixture(session: Session):
    """Create a sample modifier MenuItem for testing."""
    modifier = MenuItem(name="Extra Cheese", price=2.0, type=MenuItemType.MODIFIER)
    session.add(modifier)
    session.commit()
    session.refresh(modifier)
    return modifier


@pytest.fixture(name="order_request_payload")
def order_request_payload_fixture(menu_item_fixture: MenuItem):
    """Build a valid POST /order/ payload with at least one line item."""

    def _build(
        table_id: int,
        user_id: int,
        status: str | None = "draft",
        order_line_items: list[dict] | None = None,
    ) -> dict:
        order_data = {"table_id": table_id, "user_id": user_id}
        if status is not None:
            order_data["status"] = status

        if order_line_items is None:
            order_line_items = [
                {
                    "order_id": 0,
                    "menu_item_id": menu_item_fixture.id,
                    "item_name": menu_item_fixture.name,
                    "unit_price": menu_item_fixture.price,
                    "quantity": 1,
                }
            ]

        return {"order": order_data, "order_line_items": order_line_items}

    return _build


@pytest.fixture(name="order_fixture")
def order_fixture(session: Session, user_fixture: User, table_fixture: Table):
    """Create a sample Order for testing."""
    order = Order(
        table_id=table_fixture.id,
        user_id=user_fixture.id,
        status=OrderStatus.DRAFT,
    )
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


@pytest.fixture(name="line_item_fixture")
def line_item_fixture(
    session: Session, order_fixture: Order, menu_item_fixture: MenuItem
):
    """Create a sample OrderLineItem for testing."""
    line_item = OrderLineItem(
        order_id=order_fixture.id,
        menu_item_id=menu_item_fixture.id,
        item_name=menu_item_fixture.name,
        unit_price=menu_item_fixture.price,
        quantity=2,
    )
    session.add(line_item)
    session.commit()
    session.refresh(line_item)
    return line_item


# =====================================================================
# Test OrderRepository
# =====================================================================


class TestOrderRepository:
    """Test suite for OrderRepository class."""

    def test_list_empty(self, client: TestClient):
        """Test listing orders on empty database."""
        response = client.get("/order/")
        assert response.status_code == 200
        assert response.json() == []

    def test_create_order(
        self,
        client: TestClient,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
    ):
        """Test creating an order."""
        payload = order_request_payload(
            table_id=table_fixture.id,
            user_id=user_fixture.id,
            status="draft",
        )
        response = client.post("/order/", json=payload)
        assert response.status_code == 201
        assert response.json()["status"] == "draft"
        assert response.json()["table_id"] == table_fixture.id
        assert response.json()["user_id"] == user_fixture.id
        assert "id" in response.json()

    def test_retrieve_order(self, client: TestClient, order_fixture: Order):
        """Test retrieving an existing order."""
        response = client.get(f"/order/{order_fixture.id}")
        assert response.status_code == 200
        assert response.json()["id"] == order_fixture.id
        assert response.json()["status"] == "draft"

    def test_retrieve_order_not_found(self, client: TestClient):
        """Test retrieving a non-existent order returns 404."""
        response = client.get("/order/999")
        assert response.status_code == 404

    def test_patch_order_status(self, client: TestClient, order_fixture: Order):
        """Test patching order status."""
        payload = {"status": "in_progress"}
        response = client.patch(f"/order/{order_fixture.id}", json=payload)
        assert response.status_code == 200
        assert response.json()["status"] == "in_progress"

    def test_delete_order(self, client: TestClient, order_fixture: Order):
        """Test deleting an order."""
        response = client.delete(f"/order/{order_fixture.id}")
        assert response.status_code == 204

        # Verify it's deleted
        response = client.get(f"/order/{order_fixture.id}")
        assert response.status_code == 404

    def test_list_with_status_filter(
        self,
        client: TestClient,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
    ):
        """Test filtering orders by status."""
        # Create orders with different statuses
        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_fixture.id,
                user_id=user_fixture.id,
                status="draft",
            ),
        )
        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_fixture.id,
                user_id=user_fixture.id,
                status="in_progress",
            ),
        )

        # Filter by draft status
        response = client.get("/order/?status=draft")
        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["status"] == "draft"

    def test_list_with_table_id_filter(
        self,
        client: TestClient,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
    ):
        """Test filtering orders by table_id."""
        # Create Table 2
        response = client.post(
            "/table/",
            json={"table_name": "Table 10", "capacity": 6, "status": "available"},
        )
        table_2_id = response.json()["id"]

        # Create orders for different tables
        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_fixture.id,
                user_id=user_fixture.id,
            ),
        )
        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_2_id,
                user_id=user_fixture.id,
            ),
        )

        # Filter by table_id
        response = client.get(f"/order/?table_id={table_fixture.id}")
        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["table_id"] == table_fixture.id

    def test_list_with_user_id_filter(
        self, client: TestClient, table_fixture: Table, order_request_payload
    ):
        """Test filtering orders by user_id."""
        # Create User 2
        response = client.post("/user/", json={"name": "Chef", "role": "cook"})
        user_2_id = response.json()["id"]

        # Get User 1
        response = client.post("/user/", json={"name": "Waiter", "role": "waiter"})
        user_1_id = response.json()["id"]

        # Create orders for different users
        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_fixture.id,
                user_id=user_1_id,
            ),
        )
        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_fixture.id,
                user_id=user_2_id,
            ),
        )

        # Filter by user_id
        response = client.get(f"/order/?user_id={user_1_id}")
        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["user_id"] == user_1_id

    def test_list_with_multiple_filters(
        self, client: TestClient, table_fixture: Table, order_request_payload
    ):
        """Test filtering orders with multiple filters."""
        response = client.post("/user/", json={"name": "Waiter", "role": "waiter"})
        user_id = response.json()["id"]

        # Create multiple orders
        for i in range(3):
            client.post(
                "/order/",
                json=order_request_payload(
                    table_id=table_fixture.id,
                    user_id=user_id,
                    status="draft" if i < 2 else "in_progress",
                ),
            )

        # Filter by multiple criteria
        response = client.get(
            f"/order/?status=draft&table_id={table_fixture.id}&user_id={user_id}"
        )
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_list_pagination(
        self,
        client: TestClient,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
    ):
        """Test pagination works correctly."""
        # Create 10 orders
        for i in range(10):
            client.post(
                "/order/",
                json=order_request_payload(
                    table_id=table_fixture.id,
                    user_id=user_fixture.id,
                ),
            )

        # Get first page (limit=3)
        response = client.get("/order/?offset=0&limit=3")
        assert response.status_code == 200
        assert len(response.json()) == 3

        # Get second page
        response = client.get("/order/?offset=3&limit=3")
        assert response.status_code == 200
        assert len(response.json()) == 3

        # Get last page
        response = client.get("/order/?offset=9&limit=3")
        assert response.status_code == 200
        assert len(response.json()) == 1


# =====================================================================
# Test OrderLineItemRepository
# =====================================================================


class TestOrderLineItemRepository:
    """Test suite for OrderLineItemRepository class."""

    def test_create_line_item(
        self, session: Session, order_fixture: Order, menu_item_fixture: MenuItem
    ):
        """Test creating a line item."""
        line_item = OrderLineItem(
            order_id=order_fixture.id,
            menu_item_id=menu_item_fixture.id,
            item_name=menu_item_fixture.name,
            unit_price=menu_item_fixture.price,
            quantity=1,
        )
        session.add(line_item)
        session.commit()
        session.refresh(line_item)

        assert line_item.id is not None
        assert line_item.order_id == order_fixture.id
        assert line_item.quantity == 1

    def test_create_line_item_with_modifiers(
        self,
        client: TestClient,
        order_fixture: Order,
        menu_item_fixture: MenuItem,
        modifier_fixture: MenuItem,
    ):
        """Test creating a line item with modifiers via API."""
        payload = {
            "order_id": order_fixture.id,
            "menu_item_id": menu_item_fixture.id,
            "item_name": menu_item_fixture.name,
            "unit_price": menu_item_fixture.price,
            "quantity": 2,
            "modifier_ids": [modifier_fixture.id],
        }
        response = client.post(f"/order/{order_fixture.id}/line-items/", json=payload)
        assert response.status_code == 201
        assert response.json()["quantity"] == 2

    def test_line_item_subtotal(
        self,
        session: Session,
        order_fixture: Order,
        menu_item_fixture: MenuItem,
        modifier_fixture: MenuItem,
    ):
        """Test line item subtotal calculation."""
        line_item = OrderLineItem(
            order_id=order_fixture.id,
            menu_item_id=menu_item_fixture.id,
            item_name=menu_item_fixture.name,
            unit_price=10.0,
            quantity=2,
        )
        session.add(line_item)
        session.commit()
        session.refresh(line_item)

        # Add modifier link
        link = OrderLineItemModifierLink(
            line_item_id=line_item.id,
            modifier_id=modifier_fixture.id,
        )
        session.add(link)
        session.commit()
        session.refresh(line_item)

        # Subtotal = (unit_price + modifier_price) * quantity = (10.0 + 2.0) * 2 = 24.0
        assert line_item.subtotal == 24.0


# =====================================================================
# Test Order Endpoints
# =====================================================================


class TestOrderList:
    """Test suite for GET /order/ endpoint."""

    def test_get_orders_empty(self, client: TestClient):
        """Test getting orders on empty database."""
        response = client.get("/order/")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_orders_with_pagination(
        self,
        client: TestClient,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
    ):
        """Test pagination works correctly."""
        for i in range(5):
            client.post(
                "/order/",
                json=order_request_payload(
                    table_id=table_fixture.id,
                    user_id=user_fixture.id,
                ),
            )

        response = client.get("/order/?offset=0&limit=2")
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_get_orders_filter_by_status(
        self,
        client: TestClient,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
    ):
        """Test filtering by status."""
        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_fixture.id,
                user_id=user_fixture.id,
                status="draft",
            ),
        )
        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_fixture.id,
                user_id=user_fixture.id,
                status="completed",
            ),
        )

        response = client.get("/order/?status=draft")
        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["status"] == "draft"

    def test_get_orders_filter_by_table(
        self, client: TestClient, user_fixture: User, order_request_payload
    ):
        """Test filtering by table_id."""
        table_resp = client.post(
            "/table/",
            json={"table_name": "Table 5", "capacity": 4, "status": "available"},
        )
        table_id = table_resp.json()["id"]

        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_id,
                user_id=user_fixture.id,
            ),
        )

        response = client.get(f"/order/?table_id={table_id}")
        assert response.status_code == 200
        assert len(response.json()) == 1

    def test_get_orders_filter_by_user(
        self, client: TestClient, table_fixture: Table, order_request_payload
    ):
        """Test filtering by user_id."""
        user_resp = client.post("/user/", json={"name": "Waiter", "role": "waiter"})
        user_id = user_resp.json()["id"]

        client.post(
            "/order/",
            json=order_request_payload(
                table_id=table_fixture.id,
                user_id=user_id,
            ),
        )

        response = client.get(f"/order/?user_id={user_id}")
        assert response.status_code == 200
        assert len(response.json()) == 1


class TestOrderCreate:
    """Test suite for POST /order/ endpoint."""

    def test_post_order_success(
        self,
        client: TestClient,
        session: Session,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
    ):
        """Test creating an order successfully."""
        payload = order_request_payload(
            table_id=table_fixture.id,
            user_id=user_fixture.id,
            status=None,
        )
        response = client.post("/order/", json=payload)
        assert response.status_code == 201
        assert "id" in response.json()
        assert response.json()["status"] == "draft"
        order_id = response.json()["id"]
        line_items = session.exec(
            select(OrderLineItem).where(OrderLineItem.order_id == order_id)
        ).all()
        assert len(line_items) == 1

    def test_post_order_sets_draft_status(
        self,
        client: TestClient,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
    ):
        """Test that orders default to DRAFT status."""
        payload = order_request_payload(
            table_id=table_fixture.id,
            user_id=user_fixture.id,
            status=None,
        )
        response = client.post("/order/", json=payload)
        assert response.status_code == 201
        assert response.json()["status"] == "draft"

    def test_post_order_rejects_empty_line_items(
        self,
        client: TestClient,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
    ):
        """Test creating an order fails when no line items are provided."""
        payload = order_request_payload(
            table_id=table_fixture.id,
            user_id=user_fixture.id,
            order_line_items=[],
        )
        response = client.post("/order/", json=payload)
        assert response.status_code == 422

    def test_post_order_rolls_back_when_create_many_fails(
        self,
        client: TestClient,
        session: Session,
        user_fixture: User,
        table_fixture: Table,
        order_request_payload,
        monkeypatch,
    ):
        """Test order is deleted when create_many raises an exception."""

        def raise_create_many_error(*_args, **_kwargs):
            raise RuntimeError("create_many failed")

        monkeypatch.setattr(
            "backend.order.repositories.order_line_item_repository.OrderLineItemRepository.create_many",
            raise_create_many_error,
        )

        payload = order_request_payload(
            table_id=table_fixture.id,
            user_id=user_fixture.id,
        )

        with pytest.raises(RuntimeError, match="create_many failed"):
            client.post("/order/", json=payload)

        assert session.exec(select(Order)).all() == []


class TestOrderRetrieve:
    """Test suite for GET /order/{order_id} endpoint."""

    def test_get_order_found(self, client: TestClient, order_fixture: Order):
        """Test retrieving an existing order."""
        response = client.get(f"/order/{order_fixture.id}")
        assert response.status_code == 200
        assert response.json()["id"] == order_fixture.id

    def test_get_order_not_found(self, client: TestClient):
        """Test retrieving a non-existent order."""
        response = client.get("/order/999")
        assert response.status_code == 404


class TestOrderUpdate:
    """Test suite for PATCH /order/{order_id} endpoint."""

    def test_patch_order_status(self, client: TestClient, order_fixture: Order):
        """Test updating order status."""
        payload = {"status": "in_progress"}
        response = client.patch(f"/order/{order_fixture.id}", json=payload)
        assert response.status_code == 200
        assert response.json()["status"] == "in_progress"

    def test_patch_order_partial(self, client: TestClient, order_fixture: Order):
        """Test partial update only changes specified fields."""
        original_user_id = order_fixture.user_id
        payload = {"status": "completed"}
        response = client.patch(f"/order/{order_fixture.id}", json=payload)
        assert response.status_code == 200
        assert response.json()["status"] == "completed"
        assert response.json()["user_id"] == original_user_id

    def test_patch_order_not_found(self, client: TestClient):
        """Test patching a non-existent order."""
        payload = {"status": "completed"}
        response = client.patch("/order/999", json=payload)
        assert response.status_code == 404


class TestOrderDelete:
    """Test suite for DELETE /order/{order_id} endpoint."""

    def test_delete_order_success(self, client: TestClient, order_fixture: Order):
        """Test deleting an order successfully."""
        response = client.delete(f"/order/{order_fixture.id}")
        assert response.status_code == 204

    def test_delete_order_not_found(self, client: TestClient):
        """Test deleting a non-existent order."""
        response = client.delete("/order/999")
        assert response.status_code == 404


# =====================================================================
# Test OrderLineItem Endpoints
# =====================================================================


class TestLineItemList:
    """Test suite for GET /order/{order_id}/line-items/ endpoint."""

    def test_get_line_items_for_order(
        self, client: TestClient, order_fixture: Order, line_item_fixture: OrderLineItem
    ):
        """Test listing line items for an order."""
        response = client.get(f"/order/{order_fixture.id}/line-items/")
        assert response.status_code == 200
        assert len(response.json()) == 1

    def test_get_line_items_order_not_found(self, client: TestClient):
        """Test listing line items for non-existent order."""
        response = client.get("/order/999/line-items/")
        assert response.status_code == 404

    def test_get_line_items_pagination(
        self, client: TestClient, order_fixture: Order, menu_item_fixture: MenuItem
    ):
        """Test pagination for line items."""
        # Create multiple line items
        for i in range(5):
            client.post(
                f"/order/{order_fixture.id}/line-items/",
                json={
                    "order_id": order_fixture.id,
                    "menu_item_id": menu_item_fixture.id,
                    "item_name": menu_item_fixture.name,
                    "unit_price": menu_item_fixture.price,
                    "quantity": i + 1,
                },
            )

        response = client.get(f"/order/{order_fixture.id}/line-items/?offset=0&limit=2")
        assert response.status_code == 200
        assert len(response.json()) == 2


class TestLineItemCreate:
    """Test suite for POST /order/{order_id}/line-items/ endpoint."""

    def test_post_line_item_success(
        self, client: TestClient, order_fixture: Order, menu_item_fixture: MenuItem
    ):
        """Test creating a line item successfully."""
        payload = {
            "order_id": order_fixture.id,
            "menu_item_id": menu_item_fixture.id,
            "item_name": menu_item_fixture.name,
            "unit_price": menu_item_fixture.price,
            "quantity": 2,
        }
        response = client.post(f"/order/{order_fixture.id}/line-items/", json=payload)
        assert response.status_code == 201
        assert response.json()["quantity"] == 2

    def test_post_line_item_with_modifiers(
        self,
        client: TestClient,
        order_fixture: Order,
        menu_item_fixture: MenuItem,
        modifier_fixture: MenuItem,
    ):
        """Test creating a line item with modifiers."""
        payload = {
            "order_id": order_fixture.id,
            "menu_item_id": menu_item_fixture.id,
            "item_name": menu_item_fixture.name,
            "unit_price": menu_item_fixture.price,
            "quantity": 1,
            "modifier_ids": [modifier_fixture.id],
        }
        response = client.post(f"/order/{order_fixture.id}/line-items/", json=payload)
        assert response.status_code == 201

    def test_post_line_item_bad_order_id(
        self, client: TestClient, menu_item_fixture: MenuItem
    ):
        """Test creating a line item for non-existent order."""
        payload = {
            "order_id": 999,
            "menu_item_id": menu_item_fixture.id,
            "item_name": menu_item_fixture.name,
            "unit_price": menu_item_fixture.price,
        }
        response = client.post("/order/999/line-items/", json=payload)
        assert response.status_code == 404

    def test_post_line_item_defaults_quantity(
        self, client: TestClient, order_fixture: Order, menu_item_fixture: MenuItem
    ):
        """Test that quantity defaults to 1."""
        payload = {
            "order_id": order_fixture.id,
            "menu_item_id": menu_item_fixture.id,
            "item_name": menu_item_fixture.name,
            "unit_price": menu_item_fixture.price,
        }
        response = client.post(f"/order/{order_fixture.id}/line-items/", json=payload)
        assert response.status_code == 201
        assert response.json()["quantity"] == 1


class TestLineItemRetrieve:
    """Test suite for GET /order/{order_id}/line-items/{line_item_id} endpoint."""

    def test_get_line_item_found(
        self, client: TestClient, order_fixture: Order, line_item_fixture: OrderLineItem
    ):
        """Test retrieving an existing line item."""
        response = client.get(
            f"/order/{order_fixture.id}/line-items/{line_item_fixture.id}"
        )
        assert response.status_code == 200
        assert response.json()["id"] == line_item_fixture.id

    def test_get_line_item_not_found(self, client: TestClient, order_fixture: Order):
        """Test retrieving a non-existent line item."""
        response = client.get(f"/order/{order_fixture.id}/line-items/999")
        assert response.status_code == 404


class TestLineItemUpdate:
    """Test suite for PATCH /order/{order_id}/line-items/{line_item_id} endpoint."""

    def test_patch_line_item_quantity(
        self, client: TestClient, order_fixture: Order, line_item_fixture: OrderLineItem
    ):
        """Test updating line item quantity."""
        payload = {"quantity": 5}
        response = client.patch(
            f"/order/{order_fixture.id}/line-items/{line_item_fixture.id}", json=payload
        )
        assert response.status_code == 200
        assert response.json()["quantity"] == 5

    def test_patch_line_item_modifiers(
        self,
        client: TestClient,
        order_fixture: Order,
        line_item_fixture: OrderLineItem,
        modifier_fixture: MenuItem,
    ):
        """Test updating line item modifiers."""
        payload = {"modifier_ids": [modifier_fixture.id]}
        response = client.patch(
            f"/order/{order_fixture.id}/line-items/{line_item_fixture.id}", json=payload
        )
        assert response.status_code == 200

    def test_patch_line_item_not_found(self, client: TestClient, order_fixture: Order):
        """Test patching a non-existent line item."""
        payload = {"quantity": 5}
        response = client.patch(
            f"/order/{order_fixture.id}/line-items/999", json=payload
        )
        assert response.status_code == 404


class TestLineItemDelete:
    """Test suite for DELETE /order/{order_id}/line-items/{line_item_id} endpoint."""

    def test_delete_line_item_success(
        self, client: TestClient, order_fixture: Order, line_item_fixture: OrderLineItem
    ):
        """Test deleting a line item successfully."""
        response = client.delete(
            f"/order/{order_fixture.id}/line-items/{line_item_fixture.id}"
        )
        assert response.status_code == 204

    def test_delete_line_item_not_found(self, client: TestClient, order_fixture: Order):
        """Test deleting a non-existent line item."""
        response = client.delete(f"/order/{order_fixture.id}/line-items/999")
        assert response.status_code == 404
