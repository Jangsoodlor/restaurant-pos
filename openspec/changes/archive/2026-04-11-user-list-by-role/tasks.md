## Tasks to implement `user-list-by-role`

1. Update `backend/user/repository.py`:
   - Implement `list` method with `offset`, `limit`, and optional `role` parameter.
   - Add docstring and follow `OrderRepository` filtering pattern.

2. Update `backend/user/router.py`:
   - Import `Role` from `.models`.
   - Update `list_users` to accept `role: Role | None = Query(None)` and pass `role` to `repo.list`.

3. Add tests in `backend/tests/test_user.py`:
   - Add `test_list_with_role_filter` verifying filtering returns only matching roles.
   - Ensure pagination tests still pass unmodified.

4. Run tests (`pytest`) and fix any type or import issues.

5. Optional: add a short changelog entry or update README if necessary.

Notes
-----
Follow the existing `OrderRepository` implementation as the canonical example for filtering.
