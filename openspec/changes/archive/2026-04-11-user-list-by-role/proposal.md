## Proposal: Filter user list by role

**What**: Add an optional `role` query parameter to the backend `GET /user/` endpoint and
add a corresponding `role` parameter to `UserRepository.list` so it can filter users by role.

**Why**: The `OrderRepository` already supports filtering via optional params (status, table_id, user_id).
Providing a `role` filter for users reduces data transfer, enables UI views scoped to roles,
and keeps the backend API consistent with other repository patterns.

**Scope**:
- Update `backend/user/repository.py` to implement `list` with optional `role` filter.
- Update `backend/user/router.py` `list_users` to accept `role` query parameter and pass it to repo.
- Add unit/integration tests in `backend/tests/test_user.py` to verify filtering behavior.

**Non-goals**:
- Frontend changes are out of scope here (UI may optionally start using the new query param).
