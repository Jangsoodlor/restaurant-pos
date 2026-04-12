## 1. Hook Enhancement & Validation

- [ ] 1.1 Verify `useOrders()` hook exports `orders`, `groupedOrders`, `isLoading`, `isError`, `createOrder`, `updateOrder`, `deleteOrder` and their pending states
- [ ] 1.2 Verify `useOrderLineItems()` hook exports `lineItems`, `isLoading`, `isError`, `createLineItem`, `updateLineItem`, `deleteLineItem` and their pending states
- [ ] 1.3 Ensure `useOrders()` uses TanStack Query `useQuery` and `useMutation` with proper cache invalidation
- [ ] 1.4 Ensure `useOrderLineItems()` is called with `orderId` parameter and handles `enabled: !!orderId` logic
- [ ] 1.5 Create or verify `useMenuItems()` hook exists for menu item fetching and filtering (for CreateOrder page)

## 2. OrderDetailModal Component Creation

- [ ] 2.1 Create `frontend/src/components/OrderDetailModal.tsx` with modal structure (open/close props)
- [ ] 2.2 Implement order details display section (Order ID, Table, Waiter, Status, created_at timestamp)
- [ ] 2.3 Implement line items list display within modal (name, quantity, unit price, subtotal)
- [ ] 2.4 Add edit mode toggle button to enter/exit edit mode
- [ ] 2.5 Implement editable table dropdown (fetch from hook) in edit mode
- [ ] 2.6 Implement editable waiter dropdown (fetch from hook) in edit mode
- [ ] 2.7 Implement editable status dropdown in edit mode
- [ ] 2.8 Add "Add Item" button that displays inline form for adding line items
- [ ] 2.9 Implement inline line item edit (quantity) with Save/Cancel buttons
- [ ] 2.10 Implement line item delete with confirmation dialog
- [ ] 2.11 Add Update/Save button for order details edit mode (calls `hook.updateOrder()`)
- [ ] 2.12 Add Delete Order button with confirmation dialog (calls `hook.deleteOrder()`)
- [ ] 2.13 Add Close/Cancel button to dismiss modal without saving
- [ ] 2.14 Style modal using Beercss classes (rounded, borders, padding, consistent with Menu.tsx)
- [ ] 2.15 Verify no direct API client imports; all operations use hooks

## 3. OrderFormCard Component Creation

- [ ] 3.1 Create `frontend/src/components/OrderFormCard.tsx` as a lightweight, inline form component (not modal-based)
- [ ] 3.2 Implement table selection dropdown field (fetch via hook)
- [ ] 3.3 Implement waiter selection dropdown field (fetch via hook)
- [ ] 3.4 Add form validation (both fields required before submit)
- [ ] 3.5 Add Submit button that calls `hook.createOrder()` with table and waiter
- [ ] 3.6 Handle loading state during submission (disable button, show spinner)
- [ ] 3.7 Handle success: set `orderId` state and hide form
- [ ] 3.8 Handle error: display error message to user
- [ ] 3.9 Style form using Beercss (card layout, input styling, spacing)

## 4. CreateOrder Page Refactoring

- [ ] 4.1 Remove all direct API imports (`tableApiClient`, `userApiClient`, `menuApiClient`) from CreateOrder.tsx
- [ ] 4.2 Verify CreateOrder imports only hooks: `useOrders()`, `useOrderLineItems()`, `useMenuItems()`
- [ ] 4.3 Replace EntityForm-based order creation with `OrderFormCard` component (inline, not modal)
- [ ] 4.4 Implement menu browser section (appears after order creation, displays menu items as cards)
- [ ] 4.5 Display each menu item card with name, price, and inline "Add" button with quantity input
- [ ] 4.6 Implement "Add Item" behavior: user specifies quantity, clicks Add, item added to `useOrderLineItems()` and displayed in Order Items section
- [ ] 4.7 Implement Order Items list display below menu browser showing added items (name, qty, subtotal)
- [ ] 4.8 Implement edit quantity: user clicks Edit on item, quantity becomes editable inline with Save/Cancel
- [ ] 4.9 Implement delete item: user clicks Delete, item removed via `lineItemHook.deleteLineItem()`
- [ ] 4.10 Add "Finish" button that completes order (enabled only if items added) and navigates to `/orders`
- [ ] 4.11 Add "Cancel" button that navigates to `/orders` without saving incomplete order
- [ ] 4.12 Add visual step indicators (Step 1: Order Details, Step 2: Add Items)
- [ ] 4.13 Verify no direct API client imports
- [ ] 4.14 Style page matching Menu.tsx layout (card-based list, spacing, buttons)

## 5. ViewOrder Page Refactoring

- [ ] 5.1 Remove all direct API imports from ViewOrder.tsx
- [ ] 5.2 Verify ViewOrder imports only `useOrders()` hook
- [ ] 5.3 Implement OrderList component rendering `hook.groupedOrders.ongoing` and `hook.groupedOrders.completed`
- [ ] 5.4 Display each order as a card with: Order ID, Table name, Waiter name, Status, elapsed time (now - createdAt)
- [ ] 5.5 Implement "Create Order" button in header that navigates to `/orders/create`
- [ ] 5.6 Make order cards clickable (on row click → open `OrderDetailModal`)
- [ ] 5.7 Implement status tabs (Ongoing / Completed) with tab switching
- [ ] 5.8 Add loading state when fetching orders
- [ ] 5.9 Add error state display
- [ ] 5.10 Add "no orders" empty state message
- [ ] 5.11 Implement `OrderDetailModal` render conditional on selected order
- [ ] 5.12 Pass `useOrderLineItems(selectedOrder?.id)` to modal for line item operations
- [ ] 5.13 Style page matching Menu.tsx (card layout, consistent tabs, buttons, spacing)
- [ ] 5.14 Verify no direct API client imports

## 6. Integration & Testing

- [ ] 6.1 Test CreateOrder flow: form → create order → display menu browser → add items → finish → redirect to list
- [ ] 6.2 Test ViewOrder list: displays orders, filters by status tabs, time elapsed calculates correctly
- [ ] 6.3 Test OrderDetailModal: click order → modal opens → can edit table/waiter/status → save updates → can add/edit/delete items
- [ ] 6.4 Test OrderDetailModal: delete order → confirmation → order removed from list
- [ ] 6.5 Test error handling: API failures show error messages gracefully
- [ ] 6.6 Test loading states: spinners/disabled buttons appear during mutations
- [ ] 6.7 Test hook usage: useOrders invalidates on create/update/delete
- [ ] 6.8 Test useOrderLineItems: invalidates on line item add/edit/delete
- [ ] 6.9 Verify all routes work: `/orders`, `/orders/create` navigate correctly
- [ ] 6.10 Test modal close behavior: doesn't lose unsaved list state

## 7. Code Cleanup & Verification

- [ ] 7.1 Remove EntityForm usage from CreateOrder (old code)
- [ ] 7.2 Remove all direct API client imports from ViewOrder.tsx, CreateOrder.tsx
- [ ] 7.3 Search codebase for `tableApiClient`, `userApiClient`, `menuApiClient` imports in these pages; ensure none exist
- [ ] 7.4 Verify OrderDetailModal component has no direct API imports
- [ ] 7.5 Verify OrderFormCard component has no direct API imports
- [ ] 7.6 Remove old EntityForm modal patterns from CreateOrder
- [ ] 7.7 Delete any obsolete helper functions/state that's no longer needed
- [ ] 7.8 Run linter on modified files to catch style issues
- [ ] 7.9 Run type checker (TypeScript) to verify no type errors
- [ ] 7.10 Commit changes with descriptive message

## 8. Documentation & Handoff

- [ ] 8.1 Update session memory with patterns used (hooks, modal patterns, component structure)
- [ ] 8.2 Add brief comments in OrderDetailModal explaining modal workflow
- [ ] 8.3 Add brief comments in OrderFormCard explaining form+menu browser phases
- [ ] 8.4 Update any relevant README or dev documentation if workflow changed
- [ ] 8.5 Archive the change artifact or mark ready for review
