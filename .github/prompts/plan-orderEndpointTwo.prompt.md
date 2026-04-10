# Plan: Fix Order Creation Endpoint with OrderLineItems

## TL;DR
The POST `/order/` endpoint has a critical bug: it tries to create OrderLineItems before creating the Order, causing failures because line items need the order_id that doesn't exist yet. The fix is to:
1. Create the order first to get its ID
2. Inject the order_id into each OrderLineItemCreate
3. Create the line items with the correct order_id
4. Add/revise tests to verify line items are created with the order

## Steps

1. **Update the POST /order/ endpoint** to fix the creation logic with transaction rollback
   - Create the Order first to get its ID
   - Inject the created order_id into each OrderLineItemCreate
   - Try to create the line items via `create_many()`
   - **If create_many fails**: Delete the order AND re-raise the exception (rollback behavior)
   - Return the Order with its line_items populated on success

2. **Revise test_create_order** to pass order_line_items in the request
   - Update payload to include `order_line_items` array with menu_item data
   - Verify response includes created line items
   - Verify order total is calculated correctly

3. **Add additional tests** to ensure robustness
   - Test creating order with empty line items list
   - Test creating order with multiple line items
   - Test creating order with line items that have modifiers
   - Test error handling (invalid menu_item_id, invalid table_id, etc.)

4. **Run tests** to verify all tests pass
   - Run `pytest backend/tests/test_order.py::TestOrderCreate::test_create_order`
   - Run all order tests to ensure no regressions
   - Repeat fixing bugs until all tests pass

## Relevant files
- [backend/order/router.py](backend/order/router.py#L47-L55) — The POST /order/ endpoint that needs logic fix
- [backend/tests/test_order.py](backend/tests/test_order.py#L481-L495) — Tests that need revision (TestOrderCreate class)
- [backend/order/repositories/order_line_item_repository.py](backend/order/repositories/order_line_item_repository.py) — Used to understand line item creation
- [backend/order/models/order_line_item.py](backend/order/models/order_line_item.py) — OrderLineItemCreate model structure

## Verification

1. **Unit tests for order creation**
   - test_create_order passes — order created with line items
   - test_create_order_with_multiple_line_items passes — multiple items created
   - test_create_order_empty_line_items passes — order created with no line items to start
   - test_create_order_with_modifiers passes — modifiers linked correctly
   - test_create_order_invalid_menu_item fails gracefully — 422 or appropriate error
   - test_create_order_line_item_failure_rolls_back passes — order is deleted if line item creation fails

2. **Integration tests**
   - Run full test suite: `pytest backend/tests/test_order.py` 
   - Verify no regressions in other order endpoints
   - Verify line items are properly associated with orders

3. **Manual verification** (optional)
   - POST to /order/ with valid order_line_items array
   - Verify response includes line_items with correct order_id
   - Verify GET /order/{id} includes line_items with correct total

## Decisions & Scope

- **Included**: Fixing the endpoint logic, adding tests for line items creation, fixing any bugs found
- **Excluded**: Changes to other endpoints, database schema changes, frontend changes
- **Assumptions**: 
  - OrderLineItemCreate already has the correct structure with optional order_id field (or we inject it)
  - Tests should be in the existing TestOrderCreate class in test_order.py
  - No changes needed to database models - just logic fix in endpoint

## Further Considerations

1. **Optional: Request body structure** - Should order_line_items be a nested array in the order payload, or separate parameter? (Recommendation: Nest as object property for cleaner API) — But this might require changes to OrderCreate model
2. **Empty line items** - Should we allow orders with zero line items to be created? (My command: NO, since it does not make any sense irl).
