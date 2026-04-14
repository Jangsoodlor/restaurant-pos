## Why

The backend `OrderAPI` has been updated, and consequently the `@/api/stub` models have changed. Specifically, the API to fetch orders now returns `OrderWithLineItems[]` instead of `Order[]`. The order list view is currently broken and cannot display orders. We need to adapt the frontend to match the updated models, display order line items and their modifiers in a modal when an order is clicked, and introduce a meatball menu allowing users to update an order's status or delete it.

## What Changes

- Modify `useOrders.ts` hook's `useQuery` to expect `OrderWithLineItems[]` from `orderApiClient.listOrdersOrderGet`.
- Update the order list UI components to render the new response format without errors.
- Clicking an order row unrolls a modal displaying each `OrderLineItem` and its modifiers (reusing `OrderSummary.tsx` components if applicable).
- Add a meatball menu to each order item on the right side.
- Replace the standalone "Delete" text with the meatball menu options: Edit and Delete.
- Implementing an "Edit" function that allows modifying the order's status based on the `OrderUpdate` interface.

## Capabilities

### New Capabilities
<!-- Leave empty if no requirement changes. -->

### Modified Capabilities
- `order-list-view`: The order list view requirements are changing to include an interactive meatball menu for editing order status, deleting orders, and updating the data source to use `OrderWithLineItems`.
- `order-detail-modal`: Introducing the modal to display order summaries including `OrderLineItem`s and modifiers when an order is clicked.

## Impact

- **Frontend Hooks**: `frontend/src/hooks/useOrders.ts` will be updated to accommodate the `OrderWithLineItems` model return type.
- **Frontend Pages**: `frontend/src/pages/order/index.tsx` (or where the order list is rendered) to display the new data format.
- **Frontend Components**: 
  - Implementation or reuse of `OrderSummary.tsx` for line items.
  - Addition of meatball menu component in the list (`ActionMenu.tsx` reuse).
- **Non-Goals**: 
  - Do NOT touch the `create` mutation in `useOrders.ts`. 
  - `localhost:3000/order/create` page remains unchanged.