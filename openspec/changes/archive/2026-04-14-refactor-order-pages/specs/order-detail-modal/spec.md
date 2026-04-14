## ADDED Requirements

### Requirement: View Order Details in Modal
When a user clicks an order, a modal SHALL display the full order details including table, waiter, status, and all line items.

#### Scenario: Modal opens with order info
- **WHEN** user clicks an order row from the list
- **THEN** OrderDetailModal opens showing Order ID, Table name, Waiter name, Status, and creation timestamp

#### Scenario: All line items displayed
- **WHEN** modal is open
- **THEN** all line items for the order are displayed as a list below order details (item name, quantity, unit price, subtotal)

#### Scenario: Modal shows loading state
- **WHEN** modal is fetching order or line item data
- **THEN** a loading indicator is displayed

#### Scenario: Modal shows error state
- **WHEN** fetching order or line item data fails
- **THEN** an error message is displayed in the modal

### Requirement: Edit Order Table Assignment
The modal SHALL allow editing the table assigned to an order.

#### Scenario: Table field editable in modal
- **WHEN** user is in edit mode in the modal
- **THEN** the table field becomes a dropdown/select showing available tables

#### Scenario: User changes table and saves
- **WHEN** user selects a new table and clicks Save
- **THEN** the order is updated with the new table, confirmation is shown, modal remains open

#### Scenario: Cancel edit reverts changes
- **WHEN** user is editing and clicks Cancel
- **THEN** the table field reverts to the previous value and exits edit mode

### Requirement: Edit Order Waiter Assignment
The modal SHALL allow editing the waiter assigned to an order.

#### Scenario: Waiter field editable in modal
- **WHEN** user is in edit mode in the modal
- **THEN** the waiter field becomes a dropdown/select showing available waiters/users

#### Scenario: User changes waiter and saves
- **WHEN** user selects a new waiter and clicks Save
- **THEN** the order is updated with the new waiter, confirmation is shown, modal remains open

### Requirement: Edit Order Status
The modal SHALL allow changing the order status (draft, in_progress, completed, cancelled).

#### Scenario: Status field editable in modal
- **WHEN** user is in edit mode in the modal
- **THEN** the status field becomes a dropdown/select showing available statuses

#### Scenario: User changes status and saves
- **WHEN** user selects a new status and clicks Save
- **THEN** the order is updated with the new status, confirmation is shown, modal remains open

### Requirement: Manage Order Line Items
The modal SHALL support adding, editing, and deleting line items within the order.

#### Scenario: Add line item to order
- **WHEN** user clicks "Add Item" button in the modal
- **THEN** an inline form appears allowing user to select menu item and quantity, with Save/Cancel buttons

#### Scenario: Edit line item quantity
- **WHEN** user clicks Edit on a line item
- **THEN** the item row becomes editable (quantity field modifiable), with Save/Cancel buttons

#### Scenario: Delete line item from order
- **WHEN** user clicks Delete on a line item
- **THEN** a confirmation dialog appears; if confirmed, the item is removed from the order

#### Scenario: Line item add/edit/delete updates list immediately
- **WHEN** user performs add/edit/delete on a line item and saves
- **THEN** the line items list is updated immediately without closing the modal

### Requirement: Delete Entire Order
The modal SHALL support deleting the entire order with confirmation.

#### Scenario: Delete order button visible
- **WHEN** user is viewing an order in the modal
- **THEN** a "Delete Order" button is visible in the modal

#### Scenario: Delete triggers confirmation
- **WHEN** user clicks "Delete Order"
- **THEN** a confirmation dialog appears asking for confirmation

#### Scenario: Order deleted on confirmation
- **WHEN** user confirms deletion
- **THEN** the order is deleted from the backend, the modal closes, and the list view updates to remove the order

#### Scenario: Deletion cancelled
- **WHEN** user cancels the deletion confirmation
- **THEN** the modal remains open with order intact

### Requirement: All API calls use hooks
All data operations in the modal SHALL use `useOrders()` and `useOrderLineItems()` hooks; no direct API client imports.

#### Scenario: Modal uses useOrders hook for updates
- **WHEN** user edits order details (table, waiter, status)
- **THEN** modal calls `hook.updateOrder()`, not `orderApiClient.update()`

#### Scenario: Modal uses useOrderLineItems hook for line item operations
- **WHEN** user adds/edits/deletes a line item
- **THEN** modal calls `lineItemHook.createLineItem()`, `updateLineItem()`, or `deleteLineItem()`, not direct API client calls

### Requirement: Modal can be closed
The modal SHALL have a way to dismiss without saving (Close/Cancel button).

#### Scenario: Close button dismisses modal
- **WHEN** user clicks the Close button
- **THEN** the modal closes and the list view is displayed with no unsaved changes lost
