## 1. Create MenuBrowser Component

- [x] 1.1 Create `frontend/src/components/MenuBrowser.tsx` with component skeleton and prop types
- [x] 1.2 Extract menu items card grid UI from OrderFormCard into MenuBrowser
- [x] 1.3 Implement menu item card rendering with name, price, and description
- [x] 1.4 Add loading state (spinner) for MenuBrowser
- [x] 1.5 Add empty state message when no items available
- [x] 1.6 Implement quantity input field with change handler
- [x] 1.7 Implement "Add" button with disabled state during creation
- [x] 1.8 Wire up all callback handlers (onAddItem, onQuantityChange, onModifiersChange)

## 2. Create OrderSummary Component

- [x] 2.1 Create `frontend/src/components/OrderSummary.tsx` with component skeleton and prop types
- [x] 2.2 Extract order items list UI from OrderFormCard into OrderSummary
- [x] 2.3 Implement line item rendering with name, quantity, unit price, and total
- [x] 2.4 Add modifier display logic for line items
- [x] 2.5 Implement empty state (dashed border message) when no items
- [x] 2.6 Implement edit button and inline edit mode for quantity
- [x] 2.7 Implement delete button with handler
- [x] 2.8 Add order total calculation and display
- [x] 2.9 Implement header with item count display
- [x] 2.10 Wire up all callback handlers (onEditQuantity, onDeleteItem)

## 3. Refactor OrderFormCard Component

- [x] 3.1 Update OrderFormCard to import MenuBrowser and OrderSummary components
- [x] 3.2 Replace left-panel menu UI with `<MenuBrowser />` component
- [x] 3.3 Replace right-panel order summary UI with `<OrderSummary />` component
- [x] 3.4 Update grid layout to accommodate the new component structure
- [x] 3.5 Verify all event handlers and callbacks are properly passed to child components
- [x] 3.6 Remove duplicate state handling from OrderFormCard that's now in child components
- [x] 3.7 Test that all user interactions work end-to-end

## 4. Styling and Layout Verification

- [x] 4.1 Verify MenuBrowser card grid styling matches original layout
- [x] 4.2 Verify OrderSummary line item styling and spacing match original
- [x] 4.3 Test responsive layout on different screen sizes
- [x] 4.4 Verify Beercss classes are properly applied in both new components

## 5. Testing

- [x] 5.1 Add unit tests for MenuBrowser component with fixture data
- [x] 5.2 Add unit tests for OrderSummary component with fixture data
- [x] 5.3 Add integration tests for OrderFormCard with new components
- [x] 5.4 Verify all existing tests still pass
- [x] 5.5 Manual testing: Add item to order flow
- [x] 5.6 Manual testing: Edit line item quantity
- [x] 5.7 Manual testing: Delete line item from order
- [x] 5.8 Manual testing: Create order completes successfully

## 6. Cleanup and Documentation

- [x] 6.1 Remove any unused imports from OrderFormCard
- [x] 6.2 Add JSDoc comments to MenuBrowser component
- [x] 6.3 Add JSDoc comments to OrderSummary component
- [x] 6.4 Update OrderFormCard comments if needed
- [x] 6.5 Verify no console warnings or errors during development
