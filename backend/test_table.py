"""
Comprehensive tests for the /table endpoint using FastAPI TestClient.
Tests all CRUD operations and edge cases.
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool

# Import from the backend package properly
from backend.main import app
from backend.database import get_session
from backend.table.models import Table, TableStatus
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


class TestTableList:
    """Test cases for GET /table/"""

    def test_list_tables_empty(self, client: TestClient):
        """Test listing tables when none exist."""
        response = client.get("/table/")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_tables_with_pagination_offset(
        self, client: TestClient, session: Session
    ):
        """Test listing tables with offset parameter."""
        # Create 5 tables
        for i in range(5):
            table = Table(
                table_name=f"Table {i + 1}", capacity=4, status=TableStatus.AVAILABLE
            )
            session.add(table)
        session.commit()

        # Get first 2 tables
        response = client.get("/table/?offset=0&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["table_name"] == "Table 1"
        assert data[1]["table_name"] == "Table 2"

    def test_list_tables_with_pagination_limit(
        self, client: TestClient, session: Session
    ):
        """Test listing tables respects limit parameter."""
        # Create 5 tables
        for i in range(5):
            table = Table(
                table_name=f"Table {i + 1}", capacity=4, status=TableStatus.AVAILABLE
            )
            session.add(table)
        session.commit()

        # Get tables with offset=2, limit=2
        response = client.get("/table/?offset=2&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["table_name"] == "Table 3"
        assert data[1]["table_name"] == "Table 4"

    def test_list_tables_with_all_tables(self, client: TestClient, session: Session):
        """Test listing all tables without pagination limit."""
        # Create 5 tables
        for i in range(5):
            table = Table(
                table_name=f"Table {i + 1}", capacity=4, status=TableStatus.AVAILABLE
            )
            session.add(table)
        session.commit()

        response = client.get("/table/?limit=100")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5

    def test_list_tables_limit_exceeded(self, client: TestClient):
        """Test that limit parameter cannot exceed 100."""
        response = client.get("/table/?limit=101")
        assert response.status_code == 422  # Validation error


class TestTableRetrieve:
    """Test cases for GET /table/{table_id}"""

    def test_retrieve_existing_table(self, client: TestClient, session: Session):
        """Test retrieving an existing table by ID."""
        # Create a table
        table = Table(table_name="VIP Table", capacity=8, status=TableStatus.AVAILABLE)
        session.add(table)
        session.commit()
        session.refresh(table)

        response = client.get(f"/table/{table.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == table.id
        assert data["table_name"] == "VIP Table"
        assert data["capacity"] == 8
        assert data["status"] == "available"

    def test_retrieve_nonexistent_table(self, client: TestClient):
        """Test retrieving a table that doesn't exist."""
        response = client.get("/table/999")
        assert response.status_code == 404
        assert "Table not found" in response.json()["detail"]

    def test_retrieve_table_with_different_statuses(
        self, client: TestClient, session: Session
    ):
        """Test retrieving tables with different status values."""
        statuses = [TableStatus.AVAILABLE, TableStatus.RESERVED, TableStatus.OCCUPIED]

        for status in statuses:
            table = Table(table_name=f"Table {status.value}", capacity=4, status=status)
            session.add(table)
        session.commit()

        tables = session.query(Table).all()
        for table in tables:
            response = client.get(f"/table/{table.id}")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == table.status.value


class TestTableCreate:
    """Test cases for POST /table/"""

    def test_create_table_success(self, client: TestClient):
        """Test creating a new table."""
        payload = {"table_name": "Corner Table", "capacity": 6, "status": "available"}
        response = client.post("/table/", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["id"] is not None
        assert data["table_name"] == "Corner Table"
        assert data["capacity"] == 6
        assert data["status"] == "available"

    def test_create_table_with_all_statuses(self, client: TestClient):
        """Test creating tables with all valid status values."""
        statuses = [
            ("available", "available"),
            ("reserved", "reserved"),
            ("occupied", "occupied"),
        ]

        for status_input, status_expected in statuses:
            payload = {
                "table_name": f"Table {status_input}",
                "capacity": 4,
                "status": status_input,
            }
            response = client.post("/table/", json=payload)
            assert response.status_code == 201
            data = response.json()
            assert data["status"] == status_expected

    def test_create_table_with_different_capacities(self, client: TestClient):
        """Test creating tables with different capacity values."""
        capacities = [1, 2, 4, 6, 8, 12]

        for capacity in capacities:
            payload = {
                "table_name": f"Table capacity {capacity}",
                "capacity": capacity,
                "status": "available",
            }
            response = client.post("/table/", json=payload)
            assert response.status_code == 201
            data = response.json()
            assert data["capacity"] == capacity

    def test_create_table_invalid_capacity_zero(self, client: TestClient):
        """Test that capacity must be >= 1."""
        payload = {"table_name": "Invalid Table", "capacity": 0, "status": "available"}
        response = client.post("/table/", json=payload)
        assert response.status_code == 422  # Validation error

    def test_create_table_invalid_capacity_negative(self, client: TestClient):
        """Test that capacity cannot be negative."""
        payload = {"table_name": "Invalid Table", "capacity": -5, "status": "available"}
        response = client.post("/table/", json=payload)
        assert response.status_code == 422

    def test_create_table_invalid_status(self, client: TestClient):
        """Test that invalid status is rejected."""
        payload = {
            "table_name": "Invalid Table",
            "capacity": 4,
            "status": "invalid_status",
        }
        response = client.post("/table/", json=payload)
        assert response.status_code == 422

    def test_create_table_missing_required_field(self, client: TestClient):
        """Test that required fields are enforced."""
        payload = {
            "table_name": "Incomplete Table",
            "capacity": 4,
            # Missing status
        }
        response = client.post("/table/", json=payload)
        assert response.status_code == 422

    def test_create_table_auto_incremented_id(self, client: TestClient):
        """Test that each created table gets a unique auto-incremented ID."""
        ids = []

        for i in range(3):
            payload = {
                "table_name": f"Table {i + 1}",
                "capacity": 4,
                "status": "available",
            }
            response = client.post("/table/", json=payload)
            assert response.status_code == 201
            ids.append(response.json()["id"])

        # IDs should be sequential
        assert ids[0] < ids[1] < ids[2]


class TestTableUpdate:
    """Test cases for PATCH /table/{table_id}"""

    def test_partial_update_table_name(self, client: TestClient, session: Session):
        """Test updating only the table name."""
        table = Table(table_name="Old Name", capacity=4, status=TableStatus.AVAILABLE)
        session.add(table)
        session.commit()
        session.refresh(table)

        payload = {"table_name": "New Name"}
        response = client.patch(f"/table/{table.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["table_name"] == "New Name"
        assert data["capacity"] == 4  # Unchanged
        assert data["status"] == "available"  # Unchanged

    def test_partial_update_capacity(self, client: TestClient, session: Session):
        """Test updating only the capacity."""
        table = Table(table_name="Table", capacity=4, status=TableStatus.AVAILABLE)
        session.add(table)
        session.commit()
        session.refresh(table)

        payload = {"capacity": 8}
        response = client.patch(f"/table/{table.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["table_name"] == "Table"  # Unchanged
        assert data["capacity"] == 8
        assert data["status"] == "available"  # Unchanged

    def test_partial_update_status(self, client: TestClient, session: Session):
        """Test updating only the status."""
        table = Table(table_name="Table", capacity=4, status=TableStatus.AVAILABLE)
        session.add(table)
        session.commit()
        session.refresh(table)

        payload = {"status": "occupied"}
        response = client.patch(f"/table/{table.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["table_name"] == "Table"  # Unchanged
        assert data["capacity"] == 4  # Unchanged
        assert data["status"] == "occupied"

    def test_partial_update_multiple_fields(self, client: TestClient, session: Session):
        """Test updating multiple fields at once."""
        table = Table(table_name="Old Table", capacity=4, status=TableStatus.AVAILABLE)
        session.add(table)
        session.commit()
        session.refresh(table)

        payload = {"table_name": "New Table", "capacity": 12, "status": "reserved"}
        response = client.patch(f"/table/{table.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["table_name"] == "New Table"
        assert data["capacity"] == 12
        assert data["status"] == "reserved"

    def test_partial_update_empty_payload(self, client: TestClient, session: Session):
        """Test that empty update payload leaves record unchanged."""
        table = Table(table_name="Table", capacity=4, status=TableStatus.AVAILABLE)
        session.add(table)
        session.commit()
        session.refresh(table)

        payload = {}
        response = client.patch(f"/table/{table.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["table_name"] == "Table"
        assert data["capacity"] == 4
        assert data["status"] == "available"

    def test_partial_update_nonexistent_table(self, client: TestClient):
        """Test updating a table that doesn't exist."""
        payload = {"table_name": "New Name"}
        response = client.patch("/table/999", json=payload)
        assert response.status_code == 404
        assert "Table not found" in response.json()["detail"]

    def test_partial_update_invalid_capacity(
        self, client: TestClient, session: Session
    ):
        """Test that invalid capacity is rejected during update."""
        table = Table(table_name="Table", capacity=4, status=TableStatus.AVAILABLE)
        session.add(table)
        session.commit()
        session.refresh(table)

        payload = {"capacity": 0}
        response = client.patch(f"/table/{table.id}", json=payload)
        assert response.status_code == 422

    def test_partial_update_invalid_status(self, client: TestClient, session: Session):
        """Test that invalid status is rejected during update."""
        table = Table(table_name="Table", capacity=4, status=TableStatus.AVAILABLE)
        session.add(table)
        session.commit()
        session.refresh(table)

        payload = {"status": "invalid"}
        response = client.patch(f"/table/{table.id}", json=payload)
        assert response.status_code == 422


class TestTableDelete:
    """Test cases for DELETE /table/{table_id}"""

    def test_delete_table_success(self, client: TestClient, session: Session):
        """Test deleting an existing table."""
        table = Table(
            table_name="Table to Delete", capacity=4, status=TableStatus.AVAILABLE
        )
        session.add(table)
        session.commit()
        session.refresh(table)
        table_id = table.id

        response = client.delete(f"/table/{table_id}")
        assert response.status_code == 204

        # Verify the table is actually deleted
        response = client.get(f"/table/{table_id}")
        assert response.status_code == 404

    def test_delete_nonexistent_table(self, client: TestClient):
        """Test deleting a table that doesn't exist."""
        response = client.delete("/table/999")
        assert response.status_code == 404
        assert "Table not found" in response.json()["detail"]

    def test_delete_table_returns_no_content(
        self, client: TestClient, session: Session
    ):
        """Test that DELETE returns 204 with no content."""
        table = Table(table_name="Table", capacity=4, status=TableStatus.AVAILABLE)
        session.add(table)
        session.commit()
        session.refresh(table)

        response = client.delete(f"/table/{table.id}")
        assert response.status_code == 204
        # 204 should have no content
        assert response.content == b""

    def test_delete_multiple_tables(self, client: TestClient, session: Session):
        """Test deleting multiple tables sequentially."""
        tables = []
        for i in range(3):
            table = Table(
                table_name=f"Table {i + 1}", capacity=4, status=TableStatus.AVAILABLE
            )
            session.add(table)
            tables.append(table)
        session.commit()

        # Delete each table
        for table in tables:
            response = client.delete(f"/table/{table.id}")
            assert response.status_code == 204

        # Verify all are deleted
        response = client.get("/table/")
        assert response.status_code == 200
        assert len(response.json()) == 0


class TestTableIntegration:
    """Integration tests combining multiple operations."""

    def test_full_crud_workflow(self, client: TestClient):
        """Test a complete CRUD workflow."""
        # CREATE
        create_payload = {
            "table_name": "Corner Booth",
            "capacity": 6,
            "status": "available",
        }
        create_response = client.post("/table/", json=create_payload)
        assert create_response.status_code == 201
        table_id = create_response.json()["id"]

        # READ
        read_response = client.get(f"/table/{table_id}")
        assert read_response.status_code == 200
        assert read_response.json()["table_name"] == "Corner Booth"

        # UPDATE
        update_payload = {"status": "reserved", "capacity": 8}
        update_response = client.patch(f"/table/{table_id}", json=update_payload)
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "reserved"
        assert update_response.json()["capacity"] == 8

        # DELETE
        delete_response = client.delete(f"/table/{table_id}")
        assert delete_response.status_code == 204

        # Verify deletion
        read_after_delete = client.get(f"/table/{table_id}")
        assert read_after_delete.status_code == 404

    def test_multiple_tables_list_accuracy(self, client: TestClient, session: Session):
        """Test that listing reflects all CRUD operations accurately."""
        # Create initial tables
        for i in range(3):
            table = Table(
                table_name=f"Table {i + 1}", capacity=4, status=TableStatus.AVAILABLE
            )
            session.add(table)
        session.commit()

        # List should show 3
        response = client.get("/table/?limit=100")
        assert len(response.json()) == 3

        # Create more
        payload = {"table_name": "Table 4", "capacity": 4, "status": "available"}
        client.post("/table/", json=payload)

        # List should show 4
        response = client.get("/table/?limit=100")
        assert len(response.json()) == 4
