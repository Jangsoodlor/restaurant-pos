## ADDED Requirements

### Requirement: Custom Order Form Component
The `/orders/create` page SHALL display a custom `OrderFormCard` component (not EntityForm modal) for creating orders.

#### Scenario: Form displays on page load
- **WHEN** user navigates to `/orders/create`
- **THEN** the OrderFormCard component is displayed with fields for table and waiter selection

#### Scenario: Form is not modal-based
- **WHEN** user is on `/orders/create`
- **THEN** the form takes up dedicated page space (not a modal overlay) allowing room for menu browsing below

### Requirement: Select Table for Order
The form SHALL display a dropdown/select field for choosing a table.

#### Scenario: Table dropdown populated
- **WHEN** OrderFormCard renders
- **THEN** the table dropdown contains all available tables (fetched via hook)

#### Scenario: User selects table
- **WHEN** user opens the table dropdown and selects a table
- **THEN** the selected table is stored in form state

### Requirement: Select Waiter for Order
The form SHALL display a dropdown/select field for choosing a waiter/user.

#### Scenario: Waiter dropdown populated
- **WHEN** OrderFormCard renders
- **THEN** the waiter dropdown contains all available users/waiters (fetched via hook)

#### Scenario: User selects waiter
- **WHEN** user opens the waiter dropdown and selects a waiter
- **THEN** the selected waiter is stored in form state

### Requirement: Submit Form to Create Order
Submitting the form SHALL create an order skeleton (without line items) and transition to menu browsing step.

#### Scenario: Form validates before submit
- **WHEN** user attempts to submit form without selecting both table and waiter
- **THEN** validation error is shown (e.g., "Both table and waiter are required")

#### Scenario: Form submission creates order
- **WHEN** user selects both table and waiter and clicks Submit/Next
- **THEN** system creates an order with status "draft", receives back order ID, and transitions to menu browsing step

#### Scenario: Loading state during submission
- **WHEN** form is being submitted
- **THEN** submit button is disabled and shows loading indicator

### Requirement: Browse Menu Items During Creation
After creating order skeleton, the page SHALL display a menu browser (card-based layout matching Menu.tsx) for adding items.

#### Scenario: Menu browser displayed after order creation
- **WHEN** order skeleton is successfully created
- **THEN** the form is hidden and a menu browser section appears below showing available menu items as cards

#### Scenario: Menu items displayed as cards
- **WHEN** menu browser is displayed
- **THEN** each menu item shows name and price in a card layout similar to Menu.tsx

#### Scenario: Loading state during menu fetch
- **WHEN** menu browser is initializing
- **THEN** a loading message is displayed

### Requirement: Add Menu Items to Order
Users SHALL be able to select items from the menu and add them to the order with quantity.

#### Scenario: Quick add inline quantity selector
- **WHEN** user hovers over or clicks a menu item card
- **THEN** a quantity input field and "Add" button appear inline

#### Scenario: User specifies quantity
- **WHEN** user enters quantity (e.g., "2") in the quantity field
- **THEN** the quantity is stored in the input

#### Scenario: User adds item to order
- **WHEN** user clicks the "Add" button with a quantity specified
- **THEN** the item is added to the order, quantity is applied, and the item appears in the "Order Items" list below

#### Scenario: Multiple items can be added
- **WHEN** user adds one item and then adds another
- **THEN** both items appear in the order items list

### Requirement: Display Added Items
The page SHALL display a list of items added to the current order.

#### Scenario: Added items displayed below menu browser
- **WHEN** user adds items to the order
- **THEN** an "Order Items" section appears showing each added item with name, quantity, and subtotal

#### Scenario: Edit added item quantity
- **WHEN** user clicks Edit on an added item
- **THEN** the quantity becomes editable inline with Save/Cancel buttons

#### Scenario: Delete added item
- **WHEN** user clicks Delete on an added item
- **THEN** the item is removed from the order items list

### Requirement: Finish Order Creation
The page SHALL display a "Finish" button that completes order creation and redirects to order list.

#### Scenario: Finish button visible
- **WHEN** user has added at least one item to the order
- **THEN** a "Finish" button becomes enabled in the Order Items section

#### Scenario: Finish disabled until items added
- **WHEN** user has created order skeleton but added no items yet
- **THEN** the "Finish" button is disabled with a message (e.g., "Add items to finish")

#### Scenario: Finish completes creation
- **WHEN** user clicks "Finish" with items in the order
- **THEN** order is finalized, browser navigates to `/orders`, and the new order appears in the list

### Requirement: Cancel Order Creation
The page SHALL provide a way to cancel creation and return to the order list.

#### Scenario: Cancel button available
- **WHEN** user is at any step of order creation (form or menu browser)
- **THEN** a "Cancel" button is available (e.g., in header or sidebar)

#### Scenario: Cancel returns to list without saving
- **WHEN** user clicks "Cancel" after form submission but before finishing
- **THEN** browser navigates to `/orders` and the incomplete order is not saved/is discarded

### Requirement: All API calls use hooks
All order and menu item operations on this page SHALL use `useOrders()`, `useOrderLineItems()`, and menu item hooks; no direct API client imports.

#### Scenario: Component uses useOrders hook
- **WHEN** CreateOrder page initializes
- **THEN** it calls `useOrders()` for create mutation and receives hook interface

#### Scenario: Component uses menu item hook
- **WHEN** CreateOrder page displays menu browser
- **THEN** it fetches menu items via a hook (e.g., `useMenuItems()`), not direct API client

#### Scenario: No direct API imports
- **WHEN** CreateOrder component is examined
- **THEN** it does NOT import `orderApiClient`, `tableApiClient`, `userApiClient`, or `menuApiClient` directly

### Requirement: Form Component Layout
The OrderFormCard custom component SHALL be designed for inline form display, not modal.

#### Scenario: Form takes full page width
- **WHEN** OrderFormCard is rendered on CreateOrder page
- **THEN** it spans the available width (not constrained to modal size)

#### Scenario: Form styling matches page theme
- **WHEN** OrderFormCard is rendered
- **THEN** styling is consistent with Beercss and the rest of the POS UI
