import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from backend.main import app
from backend.common.database import get_session


@pytest.fixture(name="session")
def session_fixture():
    """Create an in-memory SQLite database for testing."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Create a TestClient with database dependency override."""

    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


class TestUserList:
    """Test suite for GET /user/ endpoint."""

    def test_list_empty(self, client: TestClient):
        """Test listing users on empty database."""
        response = client.get("/user/")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_with_users(self, client: TestClient):
        """Test listing multiple users."""
        client.post("/user/", json={"name": "Alice", "role": "waiter"})
        client.post("/user/", json={"name": "Bob", "role": "cook"})

        response = client.get("/user/")
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_list_with_offset(self, client: TestClient):
        """Test pagination with offset."""
        for i in range(5):
            role = ["waiter", "cook", "manager"][i % 3]
            client.post("/user/", json={"name": f"User{i}", "role": role})

        response = client.get("/user/?offset=2")
        assert response.status_code == 200
        assert len(response.json()) == 3

    def test_list_with_limit(self, client: TestClient):
        """Test pagination with limit."""
        for i in range(5):
            role = ["waiter", "cook", "manager"][i % 3]
            client.post("/user/", json={"name": f"User{i}", "role": role})

        response = client.get("/user/?limit=2")
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_list_with_offset_and_limit(self, client: TestClient):
        """Test pagination with both offset and limit."""
        for i in range(10):
            role = ["waiter", "cook", "manager"][i % 3]
            client.post("/user/", json={"name": f"User{i}", "role": role})

        response = client.get("/user/?offset=3&limit=4")
        assert response.status_code == 200
        assert len(response.json()) == 4

    def test_list_limit_exceeds_max(self, client: TestClient):
        """Test that limit validation is enforced (max 100)."""
        response = client.get("/user/?limit=101")
        assert response.status_code == 422  # Validation error


class TestUserRetrieve:
    """Test suite for GET /user/{user_id} endpoint."""

    def test_retrieve_existing_user(self, client: TestClient):
        """Test retrieving an existing user."""
        create_response = client.post(
            "/user/", json={"name": "Charlie", "role": "manager"}
        )
        user_id = create_response.json()["id"]

        response = client.get(f"/user/{user_id}")
        assert response.status_code == 200
        assert response.json()["name"] == "Charlie"
        assert response.json()["role"] == "manager"

    def test_retrieve_nonexistent_user(self, client: TestClient):
        """Test retrieving a non-existent user returns 404."""
        response = client.get("/user/999")
        assert response.status_code == 404

    def test_retrieve_all_roles(self, client: TestClient):
        """Test retrieving users with all role types."""
        roles = ["waiter", "cook", "manager"]

        for i, role in enumerate(roles):
            create_response = client.post(
                "/user/", json={"name": f"User{i}", "role": role}
            )
            user_id = create_response.json()["id"]
            response = client.get(f"/user/{user_id}")
            assert response.status_code == 200
            assert response.json()["role"] == role


class TestUserCreate:
    """Test suite for POST /user/ endpoint."""

    def test_create_user_waiter(self, client: TestClient):
        """Test creating a waiter user."""
        payload = {"name": "David", "role": "waiter"}
        response = client.post("/user/", json=payload)
        assert response.status_code == 201
        assert response.json()["name"] == "David"
        assert response.json()["role"] == "waiter"
        assert "id" in response.json()

    def test_create_user_cook(self, client: TestClient):
        """Test creating a cook user."""
        payload = {"name": "Eve", "role": "cook"}
        response = client.post("/user/", json=payload)
        assert response.status_code == 201
        assert response.json()["role"] == "cook"

    def test_create_user_manager(self, client: TestClient):
        """Test creating a manager user."""
        payload = {"name": "Frank", "role": "manager"}
        response = client.post("/user/", json=payload)
        assert response.status_code == 201
        assert response.json()["role"] == "manager"

    def test_create_user_auto_increment_id(self, client: TestClient):
        """Test that user IDs auto-increment."""
        response1 = client.post("/user/", json={"name": "User1", "role": "waiter"})
        response2 = client.post("/user/", json={"name": "User2", "role": "waiter"})

        id1 = response1.json()["id"]
        id2 = response2.json()["id"]
        assert id2 == id1 + 1

    def test_create_user_missing_name(self, client: TestClient):
        """Test creating user with missing name fails validation."""
        payload = {"role": "waiter"}
        response = client.post("/user/", json=payload)
        assert response.status_code == 422

    def test_create_user_missing_role(self, client: TestClient):
        """Test creating user with missing role fails validation."""
        payload = {"name": "Grace"}
        response = client.post("/user/", json=payload)
        assert response.status_code == 422

    def test_create_user_invalid_role(self, client: TestClient):
        """Test creating user with invalid role fails validation."""
        payload = {"name": "Henry", "role": "invalid_role"}
        response = client.post("/user/", json=payload)
        assert response.status_code == 422

    def test_create_user_name_too_long(self, client: TestClient):
        """Test creating user with name exceeding max length."""
        long_name = "A" * 256
        payload = {"name": long_name, "role": "waiter"}
        response = client.post("/user/", json=payload)
        assert response.status_code == 422

    def test_create_user_name_max_length(self, client: TestClient):
        """Test creating user with name at max length (255)."""
        max_name = "A" * 255
        payload = {"name": max_name, "role": "waiter"}
        response = client.post("/user/", json=payload)
        assert response.status_code == 201
        assert response.json()["name"] == max_name


class TestUserPartialUpdate:
    """Test suite for PATCH /user/{user_id} endpoint."""

    def test_patch_update_name(self, client: TestClient):
        """Test updating only the name."""
        create_response = client.post("/user/", json={"name": "Iris", "role": "waiter"})
        user_id = create_response.json()["id"]

        update_response = client.patch(
            f"/user/{user_id}", json={"name": "Iris Updated"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["name"] == "Iris Updated"
        assert update_response.json()["role"] == "waiter"  # Unchanged

    def test_patch_update_role(self, client: TestClient):
        """Test updating only the role."""
        create_response = client.post("/user/", json={"name": "Jack", "role": "waiter"})
        user_id = create_response.json()["id"]

        update_response = client.patch(f"/user/{user_id}", json={"role": "cook"})
        assert update_response.status_code == 200
        assert update_response.json()["name"] == "Jack"  # Unchanged
        assert update_response.json()["role"] == "cook"

    def test_patch_update_both_fields(self, client: TestClient):
        """Test updating both name and role."""
        create_response = client.post("/user/", json={"name": "Kate", "role": "waiter"})
        user_id = create_response.json()["id"]

        update_response = client.patch(
            f"/user/{user_id}",
            json={"name": "Kate Manager", "role": "manager"},
        )
        assert update_response.status_code == 200
        assert update_response.json()["name"] == "Kate Manager"
        assert update_response.json()["role"] == "manager"

    def test_patch_empty_payload(self, client: TestClient):
        """Test PATCH with empty payload (no fields to update)."""
        create_response = client.post("/user/", json={"name": "Leo", "role": "cook"})
        user_id = create_response.json()["id"]

        update_response = client.patch(f"/user/{user_id}", json={})
        assert update_response.status_code == 200
        assert update_response.json()["name"] == "Leo"  # Unchanged
        assert update_response.json()["role"] == "cook"  # Unchanged

    def test_patch_nonexistent_user(self, client: TestClient):
        """Test PATCH on non-existent user returns 404."""
        response = client.patch("/user/999", json={"name": "Updated"})
        assert response.status_code == 404

    def test_patch_invalid_role(self, client: TestClient):
        """Test PATCH with invalid role fails validation."""
        create_response = client.post(
            "/user/", json={"name": "Megan", "role": "waiter"}
        )
        user_id = create_response.json()["id"]

        update_response = client.patch(f"/user/{user_id}", json={"role": "invalid"})
        assert update_response.status_code == 422

    def test_patch_name_too_long(self, client: TestClient):
        """Test PATCH with name exceeding max length."""
        create_response = client.post(
            "/user/", json={"name": "Nathan", "role": "waiter"}
        )
        user_id = create_response.json()["id"]

        long_name = "A" * 256
        update_response = client.patch(f"/user/{user_id}", json={"name": long_name})
        assert update_response.status_code == 422


class TestUserDelete:
    """Test suite for DELETE /user/{user_id} endpoint."""

    def test_delete_existing_user(self, client: TestClient):
        """Test deleting an existing user."""
        create_response = client.post(
            "/user/", json={"name": "Oliver", "role": "manager"}
        )
        user_id = create_response.json()["id"]

        delete_response = client.delete(f"/user/{user_id}")
        assert delete_response.status_code == 204

        # Verify user is gone
        get_response = client.get(f"/user/{user_id}")
        assert get_response.status_code == 404

    def test_delete_nonexistent_user(self, client: TestClient):
        """Test deleting a non-existent user returns 404."""
        response = client.delete("/user/999")
        assert response.status_code == 404

    def test_delete_multiple_users(self, client: TestClient):
        """Test deleting multiple users sequentially."""
        # Create 3 users
        ids = []
        for i in range(3):
            response = client.post(
                "/user/", json={"name": f"User{i}", "role": "waiter"}
            )
            ids.append(response.json()["id"])

        # Delete all 3
        for user_id in ids:
            delete_response = client.delete(f"/user/{user_id}")
            assert delete_response.status_code == 204

        # Verify all are gone
        list_response = client.get("/user/")
        assert len(list_response.json()) == 0


class TestUserIntegration:
    """Integration tests for complete CRUD workflows."""

    def test_full_crud_workflow(self, client: TestClient):
        """Test complete create, read, update, delete workflow."""
        # Create
        create_response = client.post("/user/", json={"name": "Paul", "role": "waiter"})
        assert create_response.status_code == 201
        user_id = create_response.json()["id"]

        # Read
        read_response = client.get(f"/user/{user_id}")
        assert read_response.status_code == 200
        assert read_response.json()["name"] == "Paul"

        # Update
        update_response = client.patch(f"/user/{user_id}", json={"role": "cook"})
        assert update_response.status_code == 200
        assert update_response.json()["role"] == "cook"

        # Verify update
        verify_response = client.get(f"/user/{user_id}")
        assert verify_response.json()["role"] == "cook"

        # Delete
        delete_response = client.delete(f"/user/{user_id}")
        assert delete_response.status_code == 204

        # Verify deletion
        final_response = client.get(f"/user/{user_id}")
        assert final_response.status_code == 404

    def test_multiple_users_lifecycle(self, client: TestClient):
        """Test managing multiple users through their lifecycle."""
        users = [
            {"name": "Quinn", "role": "waiter"},
            {"name": "Rachel", "role": "cook"},
            {"name": "Steve", "role": "manager"},
        ]

        created_ids = []
        for user in users:
            response = client.post("/user/", json=user)
            assert response.status_code == 201
            created_ids.append(response.json()["id"])

        # Verify all exist
        list_response = client.get("/user/")
        assert len(list_response.json()) == 3

        # Update some
        for user_id in created_ids[:2]:
            response = client.patch(f"/user/{user_id}", json={"role": "manager"})
            assert response.status_code == 200

        # Delete one
        client.delete(f"/user/{created_ids[0]}")

        # Verify final state
        final_list = client.get("/user/").json()
        assert len(final_list) == 2
        assert all(u["role"] == "manager" or u["name"] == "Steve" for u in final_list)
