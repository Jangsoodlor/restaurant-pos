# Plan: Refactor User Module to Use AbstractRepository

## TL;DR
Refactor the user module to follow the same architectural pattern as the table module by:
1. Creating a `UserRepository` class that extends `AbstractRepository`
2. Updating the user controller to inject and use the repository instead of direct session handling
3. Creating comprehensive test suite following the table test pattern

This standardizes the codebase and enables reusable CRUD operations.

## Steps

### Phase 1: Create UserRepository (1 step)
1. **Create `backend/user/repository.py`**
   - Define `UserRepository` class extending `AbstractRepository[User, UserBase, UserUpdate]`
   - Import `AbstractRepository` from `common.repository`
   - Pass `User` model and session to parent constructor (matching TableRepository pattern)
   - Add `get_user_repository()` dependency injection function for FastAPI
   - This is a thin, reusable CRUD layer abstracting away session management

### Phase 2: Update UserController (1 step, *depends on Phase 1*)
2. **Refactor `backend/user/controller.py`**
   - Replace direct `SessionDep` with `UserRepository` dependency injection (`RepoDep` pattern)
   - Update all endpoints to use repo methods: `list()`, `retrieve()`, `create()`, `patch()`, `delete()`
   - Update error handling: catch `EntityNotFoundError` from common.exceptions instead of manual session checks
   - Update HTTP status codes: use `status.HTTP_201_CREATED` for POST, `status.HTTP_204_NO_CONTENT` for DELETE
   - Remove direct sqlalchemy calls (select, session.add, session.commit)
   - Update variable names from "hero" to "user" for clarity
   - Result: 5 clean endpoints delegating to repository

### Phase 3: Write Comprehensive Tests (1 step, *depends on Phase 1 & 2*)
3. **Create `backend/tests/test_user.py`** following `backend/tests/test_table.py` pattern
   - Replicate test structure: fixtures, test classes by endpoint, and integration tests
   - Test endpoints: GET /, GET /{id}, POST /, PATCH /{id}, DELETE /{id}
   - Test data: Use Role enum values (waiter, cook, manager) and name field validation (max 255)
   - Coverage should include:
     - Pagination (offset, limit validation)
     - CRUD success cases
     - Partial updates (individual fields, multiple fields, empty payload)
     - Error cases (404 for missing, 422 for validation)
     - Role enum validation
     - Name length validation
     - Status code assertions (200, 201, 204, 404, 422)
   - Reuse session/client fixtures from test_table.py or import them if centralized

### Phase 4: Verification (independent, can run after Phase 3)
4. **Test execution and validation**
   - Run `make test` to execute all tests including new user tests
   - Run `make dev` to start development server and verify routes are accessible
   - Check that all 5 user endpoints work (GET /, GET /{id}, POST /, PATCH /{id}, DELETE /{id})
   - Verify error handling: 404 on missing users, 422 on validation errors

## Relevant Files

### Files to Modify
- `backend/user/controller.py` — Replace SessionDep with UserRepository dependency, update endpoints to use repo methods
- `backend/user/models.py` — No changes needed; UserBase/User/UserUpdate already properly structured

### Files to Create
- `backend/user/repository.py` — New thin repository layer (similar structure to `backend/table/repository.py`)
- `backend/tests/test_user.py` — New comprehensive test suite (replicate `backend/tests/test_table.py` pattern with Role enum and name validation)

### Reference Implementations
- `backend/common/repository.py` — AbstractRepository with list(), retrieve(), create(), delete(), patch() methods
- `backend/table/repository.py` — Concrete example implementing AbstractRepository (3 lines)
- `backend/table/controller.py` — Concrete example using repository dependency injection (RepoDep pattern)
- `backend/tests/test_table.py` — Test structure template with fixtures, multiple test classes

## Verification

1. Run `make test` — All new user tests pass and existing table tests still pass
2. Verify error messages:
   - DELETE/GET with invalid ID returns 404 with "User not found" message (via EntityNotFoundError)
   - POST with invalid role/name returns 422 validation error
3. Run `make dev` and manually test endpoints:
   - `GET /user/` returns paginated list
   - `POST /user/` with valid payload creates new user with assigned id
   - `GET /user/1` retrieves user or returns 404
   - `PATCH /user/1` with partial update works correctly
   - `DELETE /user/1` removes user with 204 response

## Decisions
- **UserRepository pattern**: Thin implementation matching TableRepository (3-4 lines) for consistency and easy replication to other modules
- **Dependency injection**: Use exact same RepoDep annotation pattern as table controller for consistency
- **Model mapping**: Unchanged—UserBase is already CreateDTO, User is Model, UserUpdate is UpdateDTO
- **Error handling**: Standardize on EntityNotFoundError from common.exceptions rather than manual 404s
- **Test coverage**: Full CRUD + role enum validation + name field constraints, mirroring table test comprehensiveness

## Further Considerations
1. **Import organization**: Ensure `from ..common.exceptions import EntityNotFoundError` is added to controller (currently missing)
2. **Status code imports**: Add `from fastapi import status` to controller for `status.HTTP_201_CREATED` and `status.HTTP_204_NO_CONTENT` constants
3. **Variable naming**: "hero" variables in old code should be renamed to "user" for semantic clarity
