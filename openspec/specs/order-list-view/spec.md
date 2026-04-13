## ADDED Requirements

### Requirement: List All Orders
The system SHALL fetch and display all orders from the backend API with their metadata (ID, table, waiter, status, creation time).

#### Scenario: Orders displayed on page load
- **WHEN** user navigates to `/orders` page
- **THEN** system fetches all orders and displays them as card-like entries showing Order ID, Table number, Waiter name, Status, and time elapsed since creation

#### Scenario: Loading state shown during fetch
- **WHEN** system is fetching orders
- **THEN** a loading message is displayed to the user

#### Scenario: Error state handled gracefully
- **WHEN** fetching orders fails
- **THEN** an error message is displayed to the user

### Requirement: Filter Orders by Status
The system SHALL allow filtering orders by status groups (ongoing vs completed).

#### Scenario: User switches to ongoing orders
- **WHEN** user clicks the "Ongoing" tab
- **THEN** the list displays only orders with status "draft" or "in_progress"

#### Scenario: User switches to completed orders
- **WHEN** user clicks the "Completed" tab
- **THEN** the list displays only orders with status "completed" or "cancelled"

#### Scenario: Filters persist during navigation
- **WHEN** user selects a filter and navigates away and back to `/orders`
- **THEN** the last selected filter is retained (or defaults to ongoing)

### Requirement: Display Order Metadata
Each order card SHALL display table number, waiter name, status, and elapsed time since order creation.

#### Scenario: Table number displayed
- **WHEN** an order is rendered on the list
- **THEN** the associated table name is visible in the order card

#### Scenario: Time elapsed displayed
- **WHEN** an order is rendered on the list
- **THEN** the card shows elapsed time (e.g., "3 min ago", "2h ago") calculated as (now - createdAt)

#### Scenario: Waiter name displayed
- **WHEN** an order is rendered on the list
- **THEN** the associated waiter/user name is visible in the order card

### Requirement: Navigate to Order Details
Clicking an order row SHALL open a modal displaying full order details and enabling edits.

#### Scenario: Click order row opens modal
- **WHEN** user clicks an order card/row
- **THEN** the OrderDetailModal opens with the selected order's details

#### Scenario: Modal closes when dismissed
- **WHEN** user closes the modal (cancel/close button)
- **THEN** the modal disappears and the list view remains visible

### Requirement: Create New Order
A "Create Order" button on the list page SHALL navigate to the dedicated creation page.

#### Scenario: Create button visible on list page
- **WHEN** user is on `/orders` page
- **THEN** a "Create Order" button is visible in the header

#### Scenario: Create button navigates to creation page
- **WHEN** user clicks the "Create Order" button
- **THEN** browser navigates to `/orders/create`

### Requirement: All API calls use hooks, not direct clients
All data fetching and mutations SHALL be delegated to `useOrders()` hook; no direct `orderApiClient` imports in the component.

#### Scenario: Component uses hook for fetching
- **WHEN** ViewOrder component renders
- **THEN** it calls `useOrders()` and receives `orders`, `isLoading`, `isError`

#### Scenario: Component uses hook for mutations
- **WHEN** user deletes an order
- **THEN** component calls `hook.deleteOrder()`, not `orderApiClient.deleteOrder()`
