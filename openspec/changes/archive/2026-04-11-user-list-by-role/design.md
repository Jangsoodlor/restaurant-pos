## Design: How to implement role filtering for users

Overview
--------
Follow the same pattern used by `OrderRepository.list`.

Repository change
-----------------
- Modify `UserRepository` (backend/user/repository.py) to add a `list` method with signature:

```
def list(
    self,
    offset: int = 0,
    limit: int | None = None,
    role: Role | None = None,
) -> Sequence[User]:
```

- Use `sqlmodel.select(self.model)` and conditionally add `.where(self.model.role == role)` when
  `role is not None`. Apply `offset` and `limit` similar to `OrderRepository`.

Router change
-------------
- Update `backend/user/router.py` `list_users` endpoint to accept `role` as an optional query param:

```
from .models import Role

@router.get("/")
def list_users(..., role: Role | None = Query(None), ...):
    return repo.list(offset, limit, role=role)
```

Ensure `role` is validated by Pydantic/Enum and that default is `None`.

Tests
-----
- Add tests that create users with different roles and assert that `GET /user/?role=waiter` returns only waiters.
- Reuse existing fixtures; add a test in `backend/tests/test_user.py` under `TestUserList`.

Backward compatibility
----------------------
Existing requests without `role` should behave unchanged and return all users (pagination still applies).

Potential pitfalls
------------------
- Ensure enum values used in query are the same strings (`use_enum_values=True` is already set on models).
- Update function signature order carefully to preserve default param behavior.
