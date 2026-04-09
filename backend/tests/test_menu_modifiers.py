"""
Comprehensive tests for the /menu/modifier endpoint using FastAPI TestClient.
Tests all CRUD operations and edge cases.
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool

from backend.main import app
from backend.common.database import get_session
from backend.menu.models import MenuModifier
from backend.config import get_settings


@pytest.fixture(name="session")
def session_fixture():
    """Create an in-memory SQLite database for testing."""
    engine = create_engine(
        get_settings().database_url,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Create a TestClient with a test database session."""

    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


class TestMenuModifierList:
    """Test cases for GET /menu/modifier/"""

    def test_list_menu_modifiers_empty(self, client: TestClient):
        """Test listing menu modifiers when none exist."""
        response = client.get("/menu/modifier/")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_menu_modifiers_with_pagination_offset(
        self, client: TestClient, session: Session
    ):
        """Test listing menu modifiers with offset parameter."""
        # Create 5 menu modifiers
        for i in range(5):
            modifier = MenuModifier(name=f"Modifier {i + 1}", price=1.99 + i)
            session.add(modifier)
        session.commit()

        # Get first 2 modifiers
        response = client.get("/menu/modifier/?offset=0&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] == "Modifier 1"
        assert data[1]["name"] == "Modifier 2"

    def test_list_menu_modifiers_with_pagination_limit(
        self, client: TestClient, session: Session
    ):
        """Test listing menu modifiers respects limit parameter."""
        # Create 5 menu modifiers
        for i in range(5):
            modifier = MenuModifier(name=f"Modifier {i + 1}", price=1.99 + i)
            session.add(modifier)
        session.commit()

        # Get modifiers with offset=2, limit=2
        response = client.get("/menu/modifier/?offset=2&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] == "Modifier 3"
        assert data[1]["name"] == "Modifier 4"

    def test_list_menu_modifiers_with_all_modifiers(
        self, client: TestClient, session: Session
    ):
        """Test listing all menu modifiers without pagination limit."""
        # Create 5 menu modifiers
        for i in range(5):
            modifier = MenuModifier(name=f"Modifier {i + 1}", price=1.99 + i)
            session.add(modifier)
        session.commit()

        response = client.get("/menu/modifier/?limit=100")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5

    def test_list_menu_modifiers_limit_exceeded(self, client: TestClient):
        """Test that limit parameter cannot exceed 100."""
        response = client.get("/menu/modifier/?limit=101")
        assert response.status_code == 422  # Validation error

    def test_list_menu_modifiers_with_offset_only(
        self, client: TestClient, session: Session
    ):
        """Test listing menu modifiers with only offset parameter."""
        # Create 5 menu modifiers
        for i in range(5):
            modifier = MenuModifier(name=f"Modifier {i + 1}", price=1.99 + i)
            session.add(modifier)
        session.commit()

        response = client.get("/menu/modifier/?offset=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3  # Modifiers 3, 4, 5


class TestMenuModifierRetrieve:
    """Test cases for GET /menu/modifier/{modifier_id}"""

    def test_retrieve_existing_menu_modifier(
        self, client: TestClient, session: Session
    ):
        """Test retrieving an existing menu modifier by ID."""
        # Create a menu modifier
        modifier = MenuModifier(name="Extra Cheese", price=2.50)
        session.add(modifier)
        session.commit()
        session.refresh(modifier)

        response = client.get(f"/menu/modifier/{modifier.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == modifier.id
        assert data["name"] == "Extra Cheese"
        assert data["price"] == 2.50

    def test_retrieve_nonexistent_menu_modifier(self, client: TestClient):
        """Test retrieving a menu modifier that doesn't exist."""
        response = client.get("/menu/modifier/999")
        assert response.status_code == 404
        assert "MenuModifier with ID 999 not found." in response.json()["detail"]

    def test_retrieve_multiple_menu_modifiers(
        self, client: TestClient, session: Session
    ):
        """Test retrieving multiple menu modifiers one by one."""
        modifiers_data = [
            ("Extra Cheese", 2.50),
            ("Bacon", 3.00),
            ("Mushrooms", 1.50),
        ]

        modifiers = []
        for name, price in modifiers_data:
            modifier = MenuModifier(name=name, price=price)
            session.add(modifier)
            modifiers.append(modifier)
        session.commit()

        for modifier in modifiers:
            response = client.get(f"/menu/modifier/{modifier.id}")
            assert response.status_code == 200
            data = response.json()
            assert data["name"] == modifier.name
            assert data["price"] == modifier.price


class TestMenuModifierCreate:
    """Test cases for POST /menu/modifier/"""

    def test_create_menu_modifier_success(self, client: TestClient):
        """Test creating a new menu modifier."""
        payload = {"name": "Avocado", "price": 3.50}
        response = client.post("/menu/modifier/", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["id"] is not None
        assert data["name"] == "Avocado"
        assert data["price"] == 3.50

    def test_create_menu_modifier_with_various_prices(self, client: TestClient):
        """Test creating menu modifiers with different price values."""
        prices = [0, 0.50, 1.99, 5.99, 10.99]

        for i, price in enumerate(prices):
            payload = {"name": f"Modifier {i}", "price": price}
            response = client.post("/menu/modifier/", json=payload)
            assert response.status_code == 201
            data = response.json()
            assert data["price"] == price

    def test_create_menu_modifier_invalid_negative_price(self, client: TestClient):
        """Test creating menu modifier with negative price fails."""
        payload = {"name": "Invalid Modifier", "price": -1.00}
        response = client.post("/menu/modifier/", json=payload)
        assert response.status_code == 422  # Validation error

    def test_create_menu_modifier_missing_name(self, client: TestClient):
        """Test creating menu modifier without name fails."""
        payload = {"price": 1.00}
        response = client.post("/menu/modifier/", json=payload)
        assert response.status_code == 422  # Validation error

    def test_create_menu_modifier_empty_name(self, client: TestClient):
        """Test creating menu modifier with empty name fails."""
        payload = {"name": "", "price": 1.00}
        response = client.post("/menu/modifier/", json=payload)
        assert response.status_code == 422  # Validation error

    def test_create_multiple_menu_modifiers(self, client: TestClient):
        """Test creating multiple menu modifiers."""
        modifiers_data = [
            {"name": "Pickles", "price": 0.50},
            {"name": "Lettuce", "price": 0.25},
            {"name": "Tomato", "price": 0.75},
        ]

        for payload in modifiers_data:
            response = client.post("/menu/modifier/", json=payload)
            assert response.status_code == 201
            data = response.json()
            assert data["name"] == payload["name"]
            assert data["price"] == payload["price"]


class TestMenuModifierDelete:
    """Test cases for DELETE /menu/modifier/{modifier_id}"""

    def test_delete_existing_menu_modifier(self, client: TestClient, session: Session):
        """Test deleting an existing menu modifier."""
        # Create a menu modifier
        modifier = MenuModifier(name="Modifier to Delete", price=1.00)
        session.add(modifier)
        session.commit()
        session.refresh(modifier)
        modifier_id = modifier.id

        # Delete it
        response = client.delete(f"/menu/modifier/{modifier_id}")
        assert response.status_code == 204

        # Verify it's deleted
        response = client.get(f"/menu/modifier/{modifier_id}")
        assert response.status_code == 404

    def test_delete_nonexistent_menu_modifier(self, client: TestClient):
        """Test deleting a menu modifier that doesn't exist."""
        response = client.delete("/menu/modifier/999")
        assert response.status_code == 404
        assert "MenuModifier with ID 999 not found." in response.json()["detail"]

    def test_delete_multiple_menu_modifiers(self, client: TestClient, session: Session):
        """Test deleting multiple menu modifiers."""
        # Create 3 menu modifiers
        modifiers = []
        for i in range(3):
            modifier = MenuModifier(name=f"Modifier {i}", price=1.00 + i)
            session.add(modifier)
            modifiers.append(modifier)
        session.commit()

        # Delete each one and verify
        for modifier in modifiers:
            response = client.delete(f"/menu/modifier/{modifier.id}")
            assert response.status_code == 204

            # Verify deletion
            response = client.get(f"/menu/modifier/{modifier.id}")
            assert response.status_code == 404


class TestMenuModifierUpdate:
    """Test cases for PATCH /menu/modifier/{modifier_id}"""

    def test_partial_update_menu_modifier_name(
        self, client: TestClient, session: Session
    ):
        """Test updating only the name of a menu modifier."""
        # Create a menu modifier
        modifier = MenuModifier(name="Original Name", price=1.00)
        session.add(modifier)
        session.commit()
        session.refresh(modifier)

        # Update only name
        payload = {"name": "Updated Name"}
        response = client.patch(f"/menu/modifier/{modifier.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert data["price"] == 1.00  # Unchanged

    def test_partial_update_menu_modifier_price(
        self, client: TestClient, session: Session
    ):
        """Test updating only the price of a menu modifier."""
        # Create a menu modifier
        modifier = MenuModifier(name="Test Modifier", price=1.00)
        session.add(modifier)
        session.commit()
        session.refresh(modifier)

        # Update only price
        payload = {"price": 2.50}
        response = client.patch(f"/menu/modifier/{modifier.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Modifier"  # Unchanged
        assert data["price"] == 2.50

    def test_partial_update_menu_modifier_both_fields(
        self, client: TestClient, session: Session
    ):
        """Test updating both name and price."""
        # Create a menu modifier
        modifier = MenuModifier(name="Original", price=1.00)
        session.add(modifier)
        session.commit()
        session.refresh(modifier)

        # Update both fields
        payload = {"name": "Updated Modifier", "price": 3.00}
        response = client.patch(f"/menu/modifier/{modifier.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Modifier"
        assert data["price"] == 3.00

    def test_partial_update_nonexistent_menu_modifier(self, client: TestClient):
        """Test updating a menu modifier that doesn't exist."""
        payload = {"name": "Updated"}
        response = client.patch("/menu/modifier/999", json=payload)
        assert response.status_code == 404
        assert "MenuModifier with ID 999 not found." in response.json()["detail"]

    def test_partial_update_with_empty_payload(
        self, client: TestClient, session: Session
    ):
        """Test partial update with empty payload (no changes)."""
        # Create a menu modifier
        modifier = MenuModifier(name="Test Modifier", price=1.00)
        session.add(modifier)
        session.commit()
        session.refresh(modifier)

        # Update with empty payload
        payload = {}
        response = client.patch(f"/menu/modifier/{modifier.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Modifier"  # Unchanged
        assert data["price"] == 1.00  # Unchanged

    def test_partial_update_with_invalid_price(
        self, client: TestClient, session: Session
    ):
        """Test updating with invalid negative price."""
        # Create a menu modifier
        modifier = MenuModifier(name="Test Modifier", price=1.00)
        session.add(modifier)
        session.commit()
        session.refresh(modifier)

        # Try to update with negative price
        payload = {"price": -1.00}
        response = client.patch(f"/menu/modifier/{modifier.id}", json=payload)
        assert response.status_code == 422  # Validation error
