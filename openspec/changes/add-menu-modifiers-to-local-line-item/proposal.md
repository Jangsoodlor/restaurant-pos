## Why

Users need the ability to add and customize menu modifiers on their order line items during order creation. This will allow for recording custom requests (like extra cheese, no onions, etc) directly when crafting an order instead of just an un-customizable menu item.

## What Changes

- Enable the `selectedModifierIds` property on `LocalLineItem` tracking in `OrderFormCard` state.
- Change the edit behavior in `OrderSummary` so that clicking "edit" opens a dedicated modal rather than inline editing.
- Enhance the editing interface to let users change not only the quantity but also the menu modifiers applied to that draft line item using `useMenuModifiers`.
- Propagate the selected modifier list into the order creation payload in `OrderFormCard` when submitting the drafted order.

## Capabilities

### New Capabilities

- `order-line-item-modifiers`: Adding and editing modifier selections for line items on newly drafted orders.

### Modified Capabilities

- `order-creation-flow`: Updating the UX in `OrderSummary` and `OrderFormCard` to include a modal for robust line-item editing (quantity and modifiers) instead of inline editing.

## Impact

- Frontend: Modifications to `OrderFormCard.tsx` and `OrderSummary.tsx`. Will require a new editing modal component (reusing standard UI paradigms).
- API integration: Final call to `orderApiClient.createOrderOrdersPost` payload mapping will be adapted.
