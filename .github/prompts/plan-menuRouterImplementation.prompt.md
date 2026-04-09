# Plan: Implement Menu Router Aggregation & Tests

## TL;DR
Create backend/menu/router.py that aggregates menu_item_router and menu_modifier_router with docstrings, register both routers in main.py, and write comprehensive tests covering CRUD operations, pagination, 404 errors, and edge cases for menu items and modifiers.

## Steps

### Phase 1: Router Implementation (sequential, dependency-based)


2. **Add docstrings to existing routers** (*prepare for comprehensive documentation*)
   - Update backend/menu/routers/menu_item_router.py:
     - Add docstrings to each endpoint function (GET list, GET by id, POST, DELETE, PATCH)
     - Match style from backend/table/router.py and backend/user/router.py
   - Update backend/menu/routers/menu_modifier_router.py:
     - Same docstring treatment as menu_item_router

3. **Register routers in main.py** (*depends on Steps 1-2*)
   - Add imports after line where user_router is imported:
     ```
     from .menu router as menu_router
     ```
   - Register both routers in app setup (after existing include_router calls)
   - File: backend/main.py

### Phase 2: Test Implementation (parallel tasks within phase)

4. **Create test_menu_items.py** (*parallel with Step 5*)
   - File: backend/tests/test_menu_items.py
   - Test classes:
     - TestMenuItemList: GET /item/ with pagination (empty, with items, offset, limit, limit exceeded per spec)
     - TestMenuItemRetrieve: GET /item/{id} (existing, nonexistent, validate 404)
     - TestMenuItemCreate: POST /item/ (successful creation, validate 201, validate returned fields, validate ID)
     - TestMenuItemDelete: DELETE /item/{id} (successful delete 204, verify deletion, 404 on nonexistent)
     - TestMenuItemUpdate: PATCH /item/{id} (partial update, 404 on nonexistent, validate updated fields)
   - Use fixtures from backend/tests/test_table.py pattern (session_fixture, client_fixture)
   - Test edge cases: empty list, pagination boundaries, updating non-existent items

5. **Create test_menu_modifiers.py** (*parallel with Step 4*)
   - File: backend/tests/test_menu_modifiers.py
   - Same class structure as test_menu_items.py
   - Full CRUD coverage for modifier endpoints (/modifier prefix)
   - Use identical fixture pattern and edge case testing

### Phase 3: Verification (sequential, depends on Phases 1-2)

6. **Run tests** (*depends on Phases 1-2*)
   - Command: `make test` (or `pytest backend/tests/`)
   - Validate: All test_menu_*.py tests pass (100% coverage for new tests)
   - Validate: No regressions in existing tests

7. **Verify router registration**
   - Start dev server: `make dev` or manually start `python main.py`
   - Check: Both `/item` and `/modifier` prefixes are accessible
   - Check: No import errors or circular dependencies

## Relevant Files

**Core Implementation:**
- backend/menu/router.py — **CREATE** aggregation router
- backend/menu/routers/menu_item_router.py — Add docstrings to `list_menu_items()`, `retrieve_menu_item()`, `create_menu_item()`, `delete_menu_item()`, `partial_update_menu_item()`
- backend/menu/routers/menu_modifier_router.py — Add docstrings to same endpoints
- backend/main.py — Add imports and `app.include_router()` calls (lines where table/user routers registered)

**Tests:**
- backend/tests/test_menu_items.py — **CREATE** full test suite
- backend/tests/test_menu_modifiers.py — **CREATE** full test suite

**Reference Patterns:**
- backend/table/router.py — Docstring style, pagination defaults (limit=100), delete return format
- backend/tests/test_table.py — Test fixture pattern, test class organization, pagination testing, error case handling
- backend/user/router.py — Endpoint structure consistency
- backend/tests/test_user.py — Alternative test organization for reference

## Verification

1. **Unit Tests Pass**
   - Run `make test` → all tests in test_menu_items.py and test_menu_modifiers.py pass
   - Check: Each test class covers ≥2 scenarios (happy path + error/edge case)
   - Validate output: 100% pass rate, no skipped tests

2. **Integration Check**
   - Verify imports in main.py don't cause circular dependencies
   - Check no import errors when running `python -m py_compile backend/main.py`

3. **Manual Route Verification** (optional, if dev server run is needed)
   - GET /item/ → returns list or pagination error
   - GET /modifier/ → returns list or pagination error
   - 404 errors handled correctly on nonexistent IDs

## Decisions

- **Minimal Router Changes**: menu_item_router and menu_modifier_router exist and function—we're just aggregating them in router.py and registering in main.py (not rewriting existing routers)
- **Docstring Style**: Match backend/table/router.py format (function-level docs with endpoint description, parameters, return types)
- **Pagination Defaults**: Align with table/user router pattern (limit: int with Query(le=100))
- **Test Framework**: Continue using FastAPI TestClient + pytest fixtures (existing pattern)
- **Test Data**: Create via session directly (menu_item_router/menu_modifier_router pattern) for test isolation
- **Scope**: Focus on menu module endpoints only—no changes to other modules

## Further Considerations

1. **Existing Router Quality**
   - menu_item_router lacks docstrings—adding them improves discoverability
   - menu_modifier_router has some inconsistencies (returns dict vs. set)—docstrings won't fix but tests will validate current behavior

2. **Future Enhancement** (out of scope)
   - Consider standardizing delete response format across all routers (currently inconsistent)
   - Consider adding request validation examples to docstrings
