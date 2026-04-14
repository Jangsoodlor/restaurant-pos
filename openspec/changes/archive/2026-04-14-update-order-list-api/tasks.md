## 1. Type Declarations and Hooks Updates

- [x] 1.1 Update `useOrders` hook in `frontend/src/hooks/useOrders.ts` to expect `OrderWithLineItems[]` as the return type from `orderApiClient.listOrdersOrderGet`.
- [x] 1.2 Verify that `orderApiClient.createOrderOrderCreatePost` mutation in `useOrders.ts` is untouched and fully functional.

## 2. Order List Item Actions (Meatball Menu)

- [x] 2.1 Identify the component rendering each order list row/card in `frontend/src/pages/viewOrder.tsx` (or related components).
- [x] 2.2 Refactor the standalone "Delete" button text to use standard `ActionMenu.tsx` (meatball menu) from components.
- [x] 2.3 Implement the "Delete" action inside the `ActionMenu` by calling `hook.deleteOrder()`.
- [x] 2.4 Implement the "Edit" action inside the `ActionMenu` to open an inline or modal form allowing ONLY the modification of the order's `status` (referencing `OrderUpdate` interface). Ignore `closedAt`.

## 3. Order Details Modal View

- [x] 3.1 Provide an `onClick` event handler on the main body of the order row/card.
- [x] 3.2 Create or modify an `OrderDetailModal` component that receives an `OrderWithLineItems`.
- [x] 3.3 Inside the modal, display the overarching order details.
- [x] 3.4 In the modal, render each `OrderLineItem` from `OrderWithLineItems.lineItems` (including its modifiers) using or adapting components like `OrderSummary.tsx`.
- [x] 3.5 Ensure clicking the row opens the modal properly and dismissing it functions seamlessly.
- [x] 3.6 Include an explicit exit/close button within the modal.

## 4. Review and Verification

- [x] 4.1 Confirm the order list renders correctly with `OrderWithLineItems` instances and resolves type conflicts.
- [x] 4.2 Verify meatball menu actions. Status update should exclusively update the status without attempting to patch other properties, using `OrderUpdate`.
- [x] 4.3 Ensure the `localhost:3000/order/create` page has zero regressions and behaves as before.