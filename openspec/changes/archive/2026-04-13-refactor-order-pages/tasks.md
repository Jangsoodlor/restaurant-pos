## 1. Hook Enhancement & Validation

- [x] 1.1 Verify `useOrders()` hook exports `orders`, `groupedOrders`, `isLoading`, `isError`, `createOrder`, `updateOrder`, `deleteOrder` and their pending states
- [x] 1.2 Ensure `createOrder()` mutation accepts full payload: `{table_id, user_id, lineItems: [{menuItemId, quantity, modifiers}, ...]}`
- [x] 1.3 Verify `useOrderLineItems()` hook exports `lineItems`, `isLoading`, `isError`, `createLineItem`, `updateLineItem`, `deleteLineItem` and their pending states (for OrderDetailModal edit flow)
- [x] 1.4 Ensure `useOrderLineItems()` is called with `orderId` parameter and handles `enabled: !!orderId` logic
- [x] 1.5 Create or verify `useMenuItems()` hook exists for menu item fetching and filtering
- [x] 1.6 Verify backend POST `/order/` endpoint accepts full order with line items in single call

## 2. OrderDetailModal Component Creation

- [x] 2.1 Create `frontend/src/components/OrderDetailModal.tsx` with modal structure (open/close props)
- [x] 2.2 Implement order details display section (Order ID, Table, Waiter, Status, created_at timestamp)
- [x] 2.3 Implement line items list display within modal (name, quantity, unit price, subtotal)
- [x] 2.4 Add edit mode toggle button to enter/exit edit mode
- [x] 2.5 Implement editable table dropdown (fetch from hook) in edit mode
- [x] 2.6 Implement editable waiter dropdown (fetch from hook) in edit mode
- [x] 2.7 Implement editable status dropdown in edit mode
- [x] 2.8 Add "Add Item" button that displays inline form for adding line items
- [x] 2.9 Implement inline line item edit (quantity) with Save/Cancel buttons
- [x] 2.10 Implement line item delete with confirmation dialog
- [x] 2.11 Add Update/Save button for order details edit mode (calls `hook.updateOrder()`)
- [x] 2.12 Add Delete Order button with confirmation dialog (calls `hook.deleteOrder()`)
- [x] 2.13 Add Close/Cancel button to dismiss modal without saving
- [x] 2.14 Style modal using Beercss classes (rounded, borders, padding, consistent with Menu.tsx)
- [x] 2.15 Verify no direct API client imports; all operations use hooks

## 3. OrderFormCard Component (Full Order Builder)

- [x] 3.1 Create `frontend/src/components/OrderFormCard.tsx` as full-page order builder (not modal-based)
- [x] 3.2 Implement table selection dropdown field (fetch via hook)
- [x] 3.3 Implement waiter selection dropdown field (fetch via hook)
- [x] 3.4 Implement menu browser section (card layout) showing all menu items
- [x] 3.5 Display each menu item card with: name, price, inline quantity input + modifier selector + "Add" button
- [x] 3.6 Implement modifier selector per menu item (checkboxes or multi-select for modifiers)
- [x] 3.7 Implement local line items state tracking: `{menuItemId, quantity, selectedModifiers}`
- [x] 3.8 On "Add" click: validate quantity > 0, add item to local lineItems array, display in Order Items list
- [x] 3.9 Implement Order Items list display below menu browser (name, qty, modifiers, subtotal)
- [x] 3.10 Implement edit quantity: inline edit with Save/Cancel on line item row
- [x] 3.11 Implement delete line item from Order Items list
- [x] 3.12 Add "Create Order" button at bottom (enabled only if table, waiter, and at least 1 item selected)
- [x] 3.13 Add "Cancel" button that clears form and redirects to `/orders`
- [x] 3.14 Handle single submission: collect table, waiter, lineItems into one payload, call `hook.createOrder(payload)`
- [x] 3.15 Handle loading state (disable Create button, show spinner)
- [x] 3.16 Handle success: navigate to `/orders` on successful order creation
- [x] 3.17 Handle error: display error message prominently
- [x] 3.18 Style component using Beercss (card layout, consistent with Menu.tsx, spacing)

## 4. CreateOrder Page Integration

- [x] 4.1 Remove all direct API imports (`tableApiClient`, `userApiClient`, `menuApiClient`) from CreateOrder.tsx
- [x] 4.2 Verify CreateOrder imports only hooks: `useOrders()`, `useMenuItems()`
- [x] 4.3 Replace entire page content with single `OrderFormCard` component
- [x] 4.4 Pass `hook.createOrder()` callback to OrderFormCard
- [x] 4.5 Verify no direct API client imports in the page
- [x] 4.6 Style page header with title "Create Order"
- [x] 4.7 Ensure OrderFormCard is responsive and full-width

## 5. ViewOrder Page Refactoring

- [x] 5.1 Remove all direct API imports from ViewOrder.tsx
- [x] 5.2 Verify ViewOrder imports only `useOrders()` hook
- [x] 5.3 Implement OrderList component rendering `hook.groupedOrders.ongoing` and `hook.groupedOrders.completed`
- [x] 5.4 Display each order as a card with: Order ID, Table name, Waiter name, Status, elapsed time (now - createdAt)
- [x] 5.5 Implement "Create Order" button in header that navigates to `/orders/create`
- [x] 5.6 Make order cards clickable (on row click → open `OrderDetailModal`)
- [x] 5.7 Implement status tabs (Ongoing / Completed) with tab switching
- [x] 5.8 Add loading state when fetching orders
- [x] 5.9 Add error state display
- [x] 5.10 Add "no orders" empty state message
- [x] 5.11 Implement `OrderDetailModal` render conditional on selected order
- [x] 5.12 Pass `useOrderLineItems(selectedOrder?.id)` to modal for line item operations
- [x] 5.13 Style page matching Menu.tsx (card layout, consistent tabs, buttons, spacing)
- [x] 5.14 Verify no direct API client imports

## 6. Integration & Testing

Use native bun test.

- [x] 6.1 Test CreateOrder flow: select table → select waiter → browse menu → add items with modifiers → click Create Order → single POST /order/ call with full payload → redirect to list
- [x] 6.2 Test OrderFormCard: items added locally to state, reflected immediately in Order Items list
- [x] 6.3 Test OrderFormCard: edit quantity, delete item, changes reflected in Order Items
- [x] 6.4 Test OrderFormCard: validation (require table, waiter, at least 1 item before Create enabled)
- [x] 6.5 Test ViewOrder list: displays orders, filters by status tabs, time elapsed calculates correctly
- [x] 6.6 Test OrderDetailModal: click order → modal opens → can edit table/waiter/status → save updates → can add/edit/delete items
- [x] 6.7 Test OrderDetailModal: delete order → confirmation → order removed from list
- [x] 6.8 Test error handling: API failures show error messages gracefully (both create and edit flows)
- [x] 6.9 Test loading states: spinners/disabled buttons appear during POST /order/
- [x] 6.10 Test hook: useOrders().createOrder() called with full order payload (table, user, lineItems with modifiers)
- [x] 6.11 Verify all routes work: `/orders`, `/orders/create` navigate correctly
- [x] 6.12 Test Cancel: abandons draft order, redirects to `/orders` without saving

## 7. Code Cleanup & Verification

- [x] 7.1 Remove EntityForm usage from CreateOrder (old code)
- [x] 7.2 Remove all direct API client imports from ViewOrder.tsx, CreateOrder.tsx
- [x] 7.3 Remove any useOrderLineItems() calls (no longer used; line items built locally in OrderFormCard)
- [x] 7.4 Search codebase for `tableApiClient`, `userApiClient`, `menuApiClient` imports in these pages; ensure none exist
- [x] 7.5 Verify OrderDetailModal component has no direct API imports
- [x] 7.6 Verify OrderFormCard component has no direct API imports
- [x] 7.7 Delete any obsolete helper functions/state that's no longer needed (e.g., old form state, step tracking)
- [x] 7.8 Run linter on modified files to catch style issues
- [x] 7.9 Run type checker (TypeScript) to verify no type errors
- [x] 7.10 Commit changes with descriptive message

## 8. Documentation & Handoff

- [x] 8.1 Update session memory with patterns used (hooks, modal patterns, component structure)
- [x] 8.2 Add brief comments in OrderDetailModal explaining modal workflow and editing pattern
- [x] 8.3 Add brief comments in OrderFormCard explaining full-order-builder pattern (local state → single submit)
- [x] 8.4 Update any relevant README or dev documentation if workflow changed
- [x] 8.5 Archive the change artifact or mark ready for review
