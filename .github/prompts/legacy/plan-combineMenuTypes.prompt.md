# Plan: Combine MenuItem & MenuModifier Tables via Type Enum

**TL;DR**  
Consolidate identical MenuItem and MenuModifier tables into a single MenuItem model with a `type` field (ITEM/MODIFIER enum). This eliminates duplicate repository/router code while preserving all existing endpoints (/menu/item, /menu/modifier) and test coverage.

**Steps**

1. **Create MenuItemType enum** — Add to backend/menu/models.py with ITEM and MODIFIER values
2. **Consolidate models** — Update MenuItem to include `type: MenuItemType = Field(default=MenuItemType.ITEM)`, remove MenuModifier class
3. **Create database migration** — Alembic migration to merge tables: add type column to menu_item, migrate modifier data, drop menu_modifier
4. **Update MenuItemRepository** — Add `type == MenuItemType.ITEM` filter to list() method; validate type on create/patch
5. **Update MenuModifierRepository** — Add `type == MenuItemType.MODIFIER` filter to list() method; validate type on create/patch
6. **Verify routers** — menu_item_router.py and menu_modifier_router.py require no changes (repository filtering handles separation)
7. **Run test suite** — Execute `pytest backend/tests/test_menu_items.py backend/tests/test_menu_modifiers.py -v` to ensure all tests pass unchanged
  - You should now it by now. There's a `Makefile`, so use `make test`.
8. **Cleanup** — Remove unused imports from backend/menu/__init__.py

**Relevant files**
- backend/menu/models.py — Add enum, consolidate model
- backend/menu/repository.py — Both repositories: add type filtering in list(), validate type on create/patch
- backend/migrations/versions/ — New Alembic migration to merge tables

**Verification**
1. Run full test suite — all menu tests pass
2. Alembic upgrade/downgrade works cleanly
3. Manual API check: POST /menu/item creates ITEM type, POST /menu/modifier creates MODIFIER type, GET endpoints return filtered results only

**Decisions**
- **Separate repositories remain** — Both repos use unified MenuItem model but filter by type, preserving API contracts and lowering risk
- **Keep two routers** — /menu/item and /menu/modifier endpoints unchanged from API perspective
- **Single database table** — menu_item becomes the single source of truth; menu_modifier is removed via migration

## Context: Current Implementation Analysis

### Current Table Schema
Both `MenuItem` and `MenuModifier` are **identical tables**:
- `id: int (primary key)`
- `name: str (1-1000 chars)`
- `price: float (≥0)`

### All Endpoints (mirror each other exactly)

**MenuItem routes** (`/menu/item`):
- `GET /` - List with pagination (offset, limit ≤100)
- `GET /{id}` - Retrieve by ID
- `POST /` - Create (returns 201)
- `PATCH /{id}` - Partial update
- `DELETE /{id}` - Delete (returns 204)

**MenuModifier routes** (`/menu/modifier`):
- Same 5 operations with identical logic

### Repository Implementation
Two separate repository classes extending `AbstractRepository<Model, CreateDTO, UpdateDTO>`:
- `MenuItemRepository` 
- `MenuModifierRepository`

They use generic CRUD methods:
- `list(offset, limit)` → `Sequence[Model]`
- `retrieve(id)` → `Model`
- `create(entity)` → `Model`
- `patch(id, entity)` → `Model`
- `delete(id)` → void

### Test Coverage
**Both modules have identical test suites covering:**
1. **List**: empty results, pagination (offset/limit), max limit validation
2. **Retrieve**: existing/non-existent items, batch retrieval
3. **Create**: valid creation, multiple prices (0→999.99), validation (negative price, missing/empty name)
4. **Delete**: existing/non-existent items, batch deletion
5. **Update**: partial fields (name only, price only, both combinations)

Tests use in-memory SQLite with TestClient dependency injection.

### Foreign Key Relationships
**None currently** — Both tables are completely independent with no references from other modules.

### Validation Constraints
- Name: 1-1000 characters
- Price: ≥0 (ge=0)
- Pagination: limit max 100
- Invalid requests return 422 (validation error) or 404 (not found)
