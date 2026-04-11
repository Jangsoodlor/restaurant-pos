# Plan: Implement Order Endpoints (Part 1)

## TL;DR
Implement OrderRepository and OrderLineItemRepository with comprehensive endpoints following the restaurant-pos patterns. Create two endpoint groups: standard CRUD for orders under `/order/` resource, and nested CRUD for line items under `/order/{order_id}/line-items/`. Repository pattern reuses AbstractRepository with custom filtering. Database migration adds order schema. Comprehensive tests cover happy paths, edge cases, and error handling.

## Steps

### Phase 1: Model Fixes & DTOs (Prerequisites)
**Dependency**: None | **Parallelism**: None

1. **Fix Order model bugs** in `backend/order/models/order.py`:
   - Fix import: `from .order_status import OrderStatus` (absolute → relative)
   - Fix default status: `OrderStatus.OPEN` → `OrderStatus.DRAFT` (line 14)
   - Fix relationship: `back_populates="line_items"` → `back_populates="order"` (line 23)

2. **Create Order DTOs** in `backend/order/models/order.py`:
   - Add `OrderCreate` schema with: `table_id` (int), `user_id` (int), `status` (optional, default DRAFT)
   - Add `OrderUpdate` schema with: all fields optional for PATCH compatibility

3. **Create OrderLineItem DTOs** in `backend/order/models/order_line_item.py`:
   - Add `OrderLineItemCreate` schema with: `order_id` (int), `menu_item_id` (int), `item_name` (str), `unit_price` (float), `quantity` (int, optional default 1), `modifier_ids` (list[int], optional empty list)
   - Note: `OrderLineUpdate` already exists

### Phase 2: Repositories (Parallel with Phase 1 after completion)
**Dependency**: Phase 1 complete | **Parallelism**: Both repos can be implemented in parallel

4. **Implement OrderRepository** in `backend/order/repositories/order_repository.py`:
   - Inherit from `AbstractRepository[Order, OrderCreate, OrderUpdate]`
   - Set `model = Order`
   - Override `list()` to support filtering:
     - Query params: `status` (OrderStatus enum, optional), `table_id` (int, optional), `user_id` (int, optional)
     - Apply WHERE conditions if params provided, else apply defaults
     - Return paginated results using existing pagination logic from AbstractRepository
   - Keep CRUD methods (create/retrieve/delete/patch) unchanged from base class

5. **Implement OrderLineItemRepository** in `backend/order/repositories/order_line_item_repository.py`:
   - Inherit from `AbstractRepository[OrderLineItem, OrderLineItemCreate, OrderLineUpdate]`
   - Set `model = OrderLineItem`
   - Override `create()` to sync `modifier_ids` to `OrderLineItemModifierLink` junction table after entity creation
   - Don't override other methods; use base class CRUD with special create() logic for modifiers

6. **Update module exports** in `backend/order/repositories/__init__.py`:
   - Export both repository classes for use in main.py

### Phase 3: Database Migration
**Dependency**: Phase 1 complete | **Parallelism**: Can start after Phase 1

7. **Create Alembic migration** in `backend/migrations/versions/` named with pattern `{revision_id}_add_order_tables.py`:
   - Follow pattern from `001_combine_menu_tables.py`
   - `upgrade()`: Create `order` and `orderlineitem` tables from SQLModel definitions
   - `downgrade()`: Drop both tables
   - Use Alembic's `op.create_table()` with column definitions matching Order/OrderLineItem models

### Phase 4: Endpoints (Depends on Phase 2)
**Dependency**: Phase 2 complete | **Parallelism**: Order and LineItem routers can be implemented in parallel

8. **Create Order Endpoints** in `backend/order/router.py`:
   - Follow pattern from `backend/user/router.py` and `backend/table/router.py`
   - `GET /order/` - List orders with pagination + optional filters
     - Query params: `offset` (int, default 0), `limit` (int, default 100, max 100), `status` (OrderStatus, optional), `table_id` (int, optional), `user_id` (int, optional)
     - Pass filter params to `repo.list()`
     - Return paginated list of Order objects
   - `POST /order/` - Create order
     - Request body: `OrderCreate` schema
     - Return 201 with created Order object
   - `GET /order/{order_id}` - Retrieve order
     - Return 200 with Order object, catch EntityNotFoundError → 404
   - `PATCH /order/{order_id}` - Update order
     - Request body: `OrderUpdate` schema
     - Return 200 with updated Order object, catch EntityNotFoundError → 404
   - `DELETE /order/{order_id}` - Delete order
     - Return 204, catch EntityNotFoundError → 404

9. **Create OrderLineItem Endpoints** in new file `backend/order/routers/order_line_item_router.py`:
   - Check if `routers/` directory exists in order module; create if needed
   - Follow nested resource pattern `/order/{order_id}/line-items/`
   - `GET /order/{order_id}/line-items/` - List line items for order
     - Query params: `offset`, `limit`
     - Return paginated list of OrderLineItem objects, return 404 if order doesn't exist
   - `POST /order/{order_id}/line-items/` - Create line item for order
     - Request body: `OrderLineItemCreate` schema (automatically includes order_id in response)
     - Verify order exists first, return 404 if not
     - Handle modifier_ids sync in repository create(), return 201
   - `GET /order/{order_id}/line-items/{line_item_id}` - Retrieve specific line item
     - Return 200, catch EntityNotFoundError → 404
   - `PATCH /order/{order_id}/line-items/{line_item_id}` - Update line item
     - Request body: `OrderLineUpdate` schema
     - Handle modifier_ids sync in repository patch() if included, return 200
   - `DELETE /order/{order_id}/line-items/{line_item_id}` - Delete line item
     - Return 204, catch EntityNotFoundError → 404

10. **Register routers in main.py**:
    - Import both routers: `from .order import router as order_router` and line item router
    - Mount both: `app.include_router(order_router)` and line item router
    - Verify no route conflicts

### Phase 5: Comprehensive Tests (Depends on Phase 4)
**Dependency**: Phase 4 complete | **Parallelism**: Order and LineItem tests run separately but can be written+run in parallel

11. **Create test fixtures** in `backend/tests/test_order.py`:
    - Reuse pattern from `test_user.py`: session fixture, client fixture with dependency override
    - Add sample data fixtures:
      - `user_fixture`: Create sample User
      - `table_fixture`: Create sample Table
      - `menu_item_fixture`: Create sample MenuItem (with price for line item unit_price)
      - `order_fixture`: Create sample Order linked to user & table in DRAFT status
      - `line_item_fixture`: Create sample OrderLineItem linked to order

12. **Test OrderRepository** class `TestOrderRepository`:
    - `test_list_empty`: Verify empty list returns []
    - `test_create_order`: Create order with OrderCreate, verify fields set correctly
    - `test_retrieve_order`: Create then retrieve by ID, verify fields match
    - `test_retrieve_order_not_found`: Attempt retrieve non-existent ID, verify raises EntityNotFoundError
    - `test_patch_order_status`: Patch order status, verify status changed, other fields unchanged
    - `test_delete_order`: Create, delete, verify retrieve fails
    - `test_list_with_filters`: 
      - Create multiple orders with different statuses/tables/users
      - Test filtering by each param: `status=DRAFT`, `table_id=X`, `user_id=Y`
      - Test combinations: `status=DRAFT AND table_id=X`
    - `test_list_pagination`: Create 10+ orders, verify offset/limit works correctly

13. **Test OrderLineItemRepository** class `TestOrderLineItemRepository`:
    - `test_create_line_item`: Create with OrderLineItemCreate, verify all fields set
    - `test_create_line_item_with_modifiers`: Create with modifier_ids, verify junction table records created
    - `test_retrieve_line_item`: Create then retrieve, verify fields match
    - `test_patch_line_item_quantity`: Update quantity, verify changed
    - `test_patch_line_item_modifiers`: Update modifier_ids list, verify junction table updated
    - `test_delete_line_item`: Create, delete, verify can't retrieve
    - `test_line_item_subtotal`: Create line item with quantity & modifiers, verify computed subtotal correct
    - `test_list_line_items_for_order`: Create multiple line items for one order, list, verify count

14. **Test Order Endpoints** class `TestOrderList`, `TestOrderCreate`, `TestOrderRetrieve`, `TestOrderUpdate`, `TestOrderDelete`:
    - `TestOrderList`:
      - `test_get_orders_empty`: GET /order/ returns 200 with empty list
      - `test_get_orders_with_pagination`: Create 5+ orders, test offset/limit boundaries
      - `test_get_orders_filter_by_status`: Test filtering with ?status=DRAFT
      - `test_get_orders_filter_by_table`: Test filtering with ?table_id=X
      - `test_get_orders_filter_by_user`: Test filtering with ?user_id=X
      - `test_get_orders_multiple_filters`: Test combining filters
    - `TestOrderCreate`:
      - `test_post_order_success`: POST valid OrderCreate, verify 201, returned object has ID
      - `test_post_order_invalid_user_id`: POST with non-existent user_id, verify 500 or validation error
      - `test_post_order_invalid_table_id`: POST with non-existent table_id, verify error handling
      - `test_post_order_sets_draft_status`: Verify status defaults to DRAFT
    - `TestOrderRetrieve`:
      - `test_get_order_found`: GET /order/{id} returns 200 with order
      - `test_get_order_not_found`: GET /order/{id} non-existent, verify 404
    - `TestOrderUpdate`:
      - `test_patch_order_status`: PATCH status to IN_PROGRESS, verify 200, status changed
      - `test_patch_order_partial`: PATCH only status (not closed_at), verify only status changed
      - `test_patch_order_not_found`: PATCH non-existent, verify 404
    - `TestOrderDelete`:
      - `test_delete_order_success`: DELETE /order/{id}, verify 204
      - `test_delete_order_not_found`: DELETE non-existent, verify 404

15. **Test OrderLineItem Endpoints** class `TestLineItemList`, `TestLineItemCreate`, etc.:
    - `TestLineItemList`:
      - `test_get_line_items_for_order`: Create order with 3 line items, GET /order/{id}/line-items/, verify 200 with list of 3
      - `test_get_line_items_order_not_found`: GET /order/{bad_id}/line-items/, verify 404
      - `test_get_line_items_pagination`: Create 10+ line items, test offset/limit
    - `TestLineItemCreate`:
      - `test_post_line_item_success`: POST valid OrderLineItemCreate, verify 201, parent order unchanged
      - `test_post_line_item_with_modifiers`: POST with modifier_ids list, verify modifiers linked in response
      - `test_post_line_item_bad_order_id`: POST to non-existent order, verify 404
      - `test_post_line_item_defaults_quantity`: POST without quantity, verify defaults to 1
    - `TestLineItemRetrieve`:
      - `test_get_line_item_found`: GET /order/{id}/line-items/{item_id}, verify 200
      - `test_get_line_item_not_found`: GET non-existent line item, verify 404
    - `TestLineItemUpdate`:
      - `test_patch_line_item_quantity`: PATCH quantity, verify 200, changed
      - `test_patch_line_item_modifiers`: PATCH modifier_ids, verify junction table updated
      - `test_patch_line_item_not_found`: PATCH non-existent, verify 404
    - `TestLineItemDelete`:
      - `test_delete_line_item_success`: DELETE /order/{id}/line-items/{item_id}, verify 204
      - `test_delete_line_item_not_found`: DELETE non-existent, verify 404

## Relevant Files
- `backend/order/models/order.py` — Fix model bugs + add OrderCreate, OrderUpdate DTOs
- `backend/order/models/order_line_item.py` — Add OrderLineItemCreate DTO
- `backend/order/repositories/order_repository.py` — Implement repository with filtering
- `backend/order/repositories/order_line_item_repository.py` — Implement with modifier junction table sync
- `backend/order/repositories/__init__.py` — Export repositories
- `backend/order/router.py` — Create main order endpoints
- `backend/order/routers/order_line_item_router.py` — Create nested line item endpoints (new file)
- `backend/main.py` — Register routers
- `backend/migrations/versions/` — Add new migration file
- `backend/tests/test_order.py` — Comprehensive test suite (new file)

## Verification

1. **Model fixes compile**: Import order models in Python REPL, verify no errors
2. **Migration runs**: Execute `make migrate` (or equivalent Alembic command), verify tables created in schema
3. **Repository instantiation**: Verify both repository classes instantiate without error via dependency injection
4. **Endpoint routes registered**: Run `python -c "from backend.main import app; print([r.path for r in app.routes if 'order' in r.path])"` — verify all 10 routes present
5. **All tests pass**: Run `make test` — verify 100% of test_order.py tests pass (expect 30+ tests)
6. **Manual API test**: Use curl or Postman to:
   - POST /order/ with valid OrderCreate payload → verify 201, order created in DB
   - GET /order/?status=DRAFT → verify filtering works
   - POST /order/{id}/line-items/ with valid payload → verify 201, line item linked correctly
   - PATCH /order/{id}/line-items/{item_id} with modifier_ids → verify modifiers synced to junction table
   - GET /order/{id} → verify embedded line_items relationship populated with modifiers

## Decisions

- **Endpoint structure**: Standard CRUD under `/order/` + nested CRUD for line items
- **Filtering**: Query parameters on list endpoint, not separate endpoints (`/order/by-status/`, etc.)
- **Modifier sync**: Handled in OrderLineItemRepository.create() and patch() via custom logic; modifier_ids passed as list in DTOs
- **Pagination defaults**: Reuse AbstractRepository defaults (offset=0, limit=100, max=100)
- **Model bug fixes**: Fixed as part of implementation (import, OrderStatus.OPEN → DRAFT, back_populates)
- **Foreign key handling**: Invalid user_id/table_id on POST will fail at DB constraint level; tests verify error responses

## Further Considerations

1. **Modifier syncing complexity**: OrderLineItemRepository.patch() must handle three cases: (a) modifier_ids not provided (skip sync), (b) modifier_ids=[] (clear all), (c) modifier_ids=[1,2,3] (replace with new set). Current plan assumes full replace. Confirm if incremental add/remove is needed instead.

2. **Order total calculation**: Order.total property sums line_items.subtotal. Ensure relationship is eager-loaded or tests will N+1 query. Verify SQLModel handles this correctly.

3. **Table status out of scope**: Plan deliberately excludes table status updates (e.g., marking table "occupied" when order created). Confirm this doesn't need callback hooks in OrderRepository.create().
