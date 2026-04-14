## MODIFIED Requirements

### Requirement: View Order Details in Modal
When a user clicks an order, a modal SHALL display the order details and all associated line items including modifiers without making additional API calls for line items.

#### Scenario: Modal opens with order info
- **WHEN** user clicks an order row from the list
- **THEN** OrderDetailModal opens showing Order ID, Table name, Waiter name, Status, and creation timestamp reusing `OrderSummary.tsx` components implicitly passing `OrderWithLineItems` data.

#### Scenario: All line items displayed
- **WHEN** modal is open
- **THEN** all line items for the order (including their modifiers) are displayed as a list below order details (item name, quantity, unit price, subtotal)

#### Scenario: Modal shows error state
- **WHEN** fetching order or line item data fails
- **THEN** an error message is displayed in the modal

### Requirement: Edit Order Status
The modal or inline meatball-triggered "Edit" feature SHALL allow changing ONLY the order status (draft, in_progress, completed, cancelled) using the `OrderUpdate` API schema.

#### Scenario: Status field editable
- **WHEN** user is in edit mode for an order's status
- **THEN** the status field becomes a dropdown/select showing available statuses, while other fields such as `closedAt` are explicitly ignored/hidden.

#### Scenario: User changes status and saves
- **WHEN** user selects a new status and clicks Save
- **THEN** the order is updated with the new status, confirmation is shown.

## REMOVED Requirements

### Requirement: Manage Order Line Items
**Reason**: Deep line-item editing from the order list view is out of scope for the current meatball-menu "Edit" feature (which only supports `status`). The creation flow handles new line items.
**Migration**: To fully manage line items, use the creation flow or dedicated view, as inline list edits are restricted to deleting the order or altering strictly the status.

### Requirement: Edit Order Table Assignment
**Reason**: Out of scope for current simplified "Edit" interface triggered by the meatball menu (which restricts changes to `status`).
**Migration**: Table assignments are set in the creation flow.

### Requirement: Edit Order Waiter Assignment
**Reason**: Out of scope for current simplified "Edit" interface triggered by the meatball menu (which restricts changes to `status`).
**Migration**: Waiter assignments are fixed or handled deeply outside the list view's interactive edit.