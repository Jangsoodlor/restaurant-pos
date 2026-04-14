## MODIFIED Requirements

### Requirement: List All Orders
The system SHALL fetch and display all orders from the backend API with their metadata (ID, table, waiter, status, creation time) and line items. The frontend `useOrders` hook SHALL consume `OrderWithLineItems[]` from the API.

#### Scenario: Orders displayed on page load
- **WHEN** user navigates to `/orders` page
- **THEN** system fetches all orders and displays them as card-like entries showing Order ID, Table number, Waiter name, Status, and time elapsed since creation
- **AND** the data hook expects `OrderWithLineItems[]`.

#### Scenario: Loading state shown during fetch
- **WHEN** system is fetching orders
- **THEN** a loading message is displayed to the user

#### Scenario: Error state handled gracefully
- **WHEN** fetching orders fails
- **THEN** an error message is displayed to the user

### Requirement: Navigate to Order Details
Clicking an order row SHALL open a modal displaying full order details and all associated line items and their modifiers.

#### Scenario: Click order row opens modal
- **WHEN** user clicks an order card/row
- **THEN** an OrderDetailModal (or equivalent) opens with the selected order's line items and modifiers, reusing `OrderSummary.tsx` components if possible.

#### Scenario: Modal closes when dismissed
- **WHEN** user closes the modal (cancel/close button)
- **THEN** the modal disappears and the list view remains visible

## ADDED Requirements

### Requirement: Interactive Meatball Menu
Each order card in the list SHALL feature an interactive meatball menu (ActionMenu) on the right side offering "Edit" and "Delete" options.

#### Scenario: Meatball menu displays options
- **WHEN** user clicks the meatball icon on an order card
- **THEN** a menu opens displaying "Edit" and "Delete" actions

#### Scenario: Delete action
- **WHEN** user selects "Delete" from the meatball menu
- **THEN** the order is removed

#### Scenario: Edit action restricts to status updates
- **WHEN** user selects "Edit" from the meatball menu
- **THEN** a form or modal appears allowing the user to ONLY change the `status` of the order via the `OrderUpdate` API schema, ignoring the `closedAt` field altogether.