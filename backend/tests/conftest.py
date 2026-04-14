import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from backend.main import app
from backend.common.database import get_session
from backend.user.dependencies import get_current_user
from backend.user.models import User, Role


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="current_user_mock")
def current_user_fixture():
    return User(id=1, name="test_admin", role=Role.MANAGER, password_hash="mocked_hash")


@pytest.fixture(name="client")
def client_fixture(session: Session, current_user_mock: User):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    app.dependency_overrides[get_current_user] = lambda: current_user_mock
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="auth_client")
def auth_client_fixture(client: TestClient):
    yield client
