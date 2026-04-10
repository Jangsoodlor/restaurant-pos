"""
Comprehensive tests for the /menu/item endpoint using FastAPI TestClient.
Tests all CRUD operations and edge cases.
"""

from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.menu.models import MenuItem


class TestMenuItemList:
    """Test cases for GET /menu/item/"""

    def test_list_menu_items_empty(self, client: TestClient):
        """Test listing menu items when none exist."""
        response = client.get("/menu/item/")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_menu_items_with_pagination_offset(
        self, client: TestClient, session: Session
    ):
        """Test listing menu items with offset parameter."""
        # Create 5 menu items
        for i in range(5):
            item = MenuItem(name=f"Item {i + 1}", price=10.99 + i)
            session.add(item)
        session.commit()

        # Get first 2 items
        response = client.get("/menu/item/?offset=0&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] == "Item 1"
        assert data[1]["name"] == "Item 2"

    def test_list_menu_items_with_pagination_limit(
        self, client: TestClient, session: Session
    ):
        """Test listing menu items respects limit parameter."""
        # Create 5 menu items
        for i in range(5):
            item = MenuItem(name=f"Item {i + 1}", price=10.99 + i)
            session.add(item)
        session.commit()

        # Get items with offset=2, limit=2
        response = client.get("/menu/item/?offset=2&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] == "Item 3"
        assert data[1]["name"] == "Item 4"

    def test_list_menu_items_with_all_items(self, client: TestClient, session: Session):
        """Test listing all menu items without pagination limit."""
        # Create 5 menu items
        for i in range(5):
            item = MenuItem(name=f"Item {i + 1}", price=10.99 + i)
            session.add(item)
        session.commit()

        response = client.get("/menu/item/?limit=100")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5

    def test_list_menu_items_limit_exceeded(self, client: TestClient):
        """Test that limit parameter cannot exceed 100."""
        response = client.get("/menu/item/?limit=101")
        assert response.status_code == 422  # Validation error

    def test_list_menu_items_with_offset_only(
        self, client: TestClient, session: Session
    ):
        """Test listing menu items with only offset parameter."""
        # Create 5 menu items
        for i in range(5):
            item = MenuItem(name=f"Item {i + 1}", price=10.99 + i)
            session.add(item)
        session.commit()

        response = client.get("/menu/item/?offset=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3  # Items 3, 4, 5


class TestMenuItemRetrieve:
    """Test cases for GET /menu/item/{menu_item_id}"""

    def test_retrieve_existing_menu_item(self, client: TestClient, session: Session):
        """Test retrieving an existing menu item by ID."""
        # Create a menu item
        item = MenuItem(name="Pasta Carbonara", price=12.99)
        session.add(item)
        session.commit()
        session.refresh(item)

        response = client.get(f"/menu/item/{item.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == item.id
        assert data["name"] == "Pasta Carbonara"
        assert data["price"] == 12.99

    def test_retrieve_nonexistent_menu_item(self, client: TestClient):
        """Test retrieving a menu item that doesn't exist."""
        response = client.get("/menu/item/999")
        assert response.status_code == 404
        assert "MenuItem with ID 999 not found." in response.json()["detail"]

    def test_retrieve_multiple_menu_items(self, client: TestClient, session: Session):
        """Test retrieving multiple menu items one by one."""
        items_data = [
            ("Pizza Margarita", 9.99),
            ("Carbonara", 12.99),
            ("Tiramisu", 5.99),
        ]

        items = []
        for name, price in items_data:
            item = MenuItem(name=name, price=price)
            session.add(item)
            items.append(item)
        session.commit()

        for item in items:
            response = client.get(f"/menu/item/{item.id}")
            assert response.status_code == 200
            data = response.json()
            assert data["name"] == item.name
            assert data["price"] == item.price


class TestMenuItemCreate:
    """Test cases for POST /menu/item/"""

    def test_create_menu_item_success(self, client: TestClient):
        """Test creating a new menu item."""
        payload = {"name": "Grilled Salmon", "price": 18.50}
        response = client.post("/menu/item/", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["id"] is not None
        assert data["name"] == "Grilled Salmon"
        assert data["price"] == 18.50

    def test_create_menu_item_with_various_prices(self, client: TestClient):
        """Test creating menu items with different price values."""
        prices = [0, 0.99, 9.99, 19.99, 99.99, 999.99]

        for i, price in enumerate(prices):
            payload = {"name": f"Item {i}", "price": price}
            response = client.post("/menu/item/", json=payload)
            assert response.status_code == 201
            data = response.json()
            assert data["price"] == price

    def test_create_menu_item_invalid_negative_price(self, client: TestClient):
        """Test creating menu item with negative price fails."""
        payload = {"name": "Invalid Item", "price": -5.00}
        response = client.post("/menu/item/", json=payload)
        assert response.status_code == 422  # Validation error

    def test_create_menu_item_missing_name(self, client: TestClient):
        """Test creating menu item without name fails."""
        payload = {"price": 10.00}
        response = client.post("/menu/item/", json=payload)
        assert response.status_code == 422  # Validation error

    def test_create_menu_item_empty_name(self, client: TestClient):
        """Test creating menu item with empty name fails."""
        payload = {"name": "", "price": 10.00}
        response = client.post("/menu/item/", json=payload)
        assert response.status_code == 422  # Validation error

    def test_create_multiple_menu_items(self, client: TestClient):
        """Test creating multiple menu items."""
        items_data = [
            {"name": "Burger", "price": 8.99},
            {"name": "Fries", "price": 3.99},
            {"name": "Shake", "price": 5.99},
        ]

        for payload in items_data:
            response = client.post("/menu/item/", json=payload)
            assert response.status_code == 201
            data = response.json()
            assert data["name"] == payload["name"]
            assert data["price"] == payload["price"]


class TestMenuItemDelete:
    """Test cases for DELETE /menu/item/{menu_item_id}"""

    def test_delete_existing_menu_item(self, client: TestClient, session: Session):
        """Test deleting an existing menu item."""
        # Create a menu item
        item = MenuItem(name="Item to Delete", price=10.00)
        session.add(item)
        session.commit()
        session.refresh(item)
        item_id = item.id

        # Delete it
        response = client.delete(f"/menu/item/{item_id}")
        assert response.status_code == 204

        # Verify it's deleted
        response = client.get(f"/menu/item/{item_id}")
        assert response.status_code == 404

    def test_delete_nonexistent_menu_item(self, client: TestClient):
        """Test deleting a menu item that doesn't exist."""
        response = client.delete("/menu/item/999")
        assert response.status_code == 404
        assert "MenuItem with ID 999 not found." in response.json()["detail"]

    def test_delete_multiple_menu_items(self, client: TestClient, session: Session):
        """Test deleting multiple menu items."""
        # Create 3 menu items
        items = []
        for i in range(3):
            item = MenuItem(name=f"Item {i}", price=10.00 + i)
            session.add(item)
            items.append(item)
        session.commit()

        # Delete each one and verify
        for item in items:
            response = client.delete(f"/menu/item/{item.id}")
            assert response.status_code == 204

            # Verify deletion
            response = client.get(f"/menu/item/{item.id}")
            assert response.status_code == 404


class TestMenuItemUpdate:
    """Test cases for PATCH /menu/item/{menu_item_id}"""

    def test_partial_update_menu_item_name(self, client: TestClient, session: Session):
        """Test updating only the name of a menu item."""
        # Create a menu item
        item = MenuItem(name="Original Name", price=10.00)
        session.add(item)
        session.commit()
        session.refresh(item)

        # Update only name
        payload = {"name": "Updated Name"}
        response = client.patch(f"/menu/item/{item.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert data["price"] == 10.00  # Unchanged

    def test_partial_update_menu_item_price(self, client: TestClient, session: Session):
        """Test updating only the price of a menu item."""
        # Create a menu item
        item = MenuItem(name="Test Item", price=10.00)
        session.add(item)
        session.commit()
        session.refresh(item)

        # Update only price
        payload = {"price": 15.99}
        response = client.patch(f"/menu/item/{item.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Item"  # Unchanged
        assert data["price"] == 15.99

    def test_partial_update_menu_item_both_fields(
        self, client: TestClient, session: Session
    ):
        """Test updating both name and price."""
        # Create a menu item
        item = MenuItem(name="Original", price=10.00)
        session.add(item)
        session.commit()
        session.refresh(item)

        # Update both fields
        payload = {"name": "Updated Item", "price": 20.00}
        response = client.patch(f"/menu/item/{item.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Item"
        assert data["price"] == 20.00

    def test_partial_update_nonexistent_menu_item(self, client: TestClient):
        """Test updating a menu item that doesn't exist."""
        payload = {"name": "Updated"}
        response = client.patch("/menu/item/999", json=payload)
        assert response.status_code == 404
        assert "MenuItem with ID 999 not found." in response.json()["detail"]

    def test_partial_update_with_empty_payload(
        self, client: TestClient, session: Session
    ):
        """Test partial update with empty payload (no changes)."""
        # Create a menu item
        item = MenuItem(name="Test Item", price=10.00)
        session.add(item)
        session.commit()
        session.refresh(item)

        # Update with empty payload
        payload = {}
        response = client.patch(f"/menu/item/{item.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Item"  # Unchanged
        assert data["price"] == 10.00  # Unchanged

    def test_partial_update_with_invalid_price(
        self, client: TestClient, session: Session
    ):
        """Test updating with invalid negative price."""
        # Create a menu item
        item = MenuItem(name="Test Item", price=10.00)
        session.add(item)
        session.commit()
        session.refresh(item)

        # Try to update with negative price
        payload = {"price": -5.00}
        response = client.patch(f"/menu/item/{item.id}", json=payload)
        assert response.status_code == 422  # Validation error
