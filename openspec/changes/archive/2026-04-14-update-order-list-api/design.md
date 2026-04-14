## Context

The backend `OrderAPI` has been updated to return `OrderWithLineItems[]` rather than a simple array of `Order` entities when fetching orders. This changes the shape of the data retrieved by the frontend, rendering the current `localhost:3000/order` page broken. We need to refactor the frontend's consumption of this API, specifically updating the `useOrders` hook and the components rendering the order list. 

Additionally, we need to improve the user experience on the order list page by introducing an interactive meatball menu (similar to the menu list view) for each order, allowing quick status changes (via explicit `OrderUpdate` patch model) and order deletion. Clicking an order's row will now open a modal that displays its detailed line items and modifiers, leaning on reusable components such as `OrderSummary.tsx`.

## Goals / Non-Goals

**Goals:**
- Update `useOrders.ts` hook's `useQuery` to consume `OrderWithLineItems[]`.
- Fix the `localhost:3000/order` list page mapping and typed consumption of the new order payload.
- Consolidate inline "Delete" text on the list page into a standardized reusable `ActionMenu` (meatball menu) with "Edit" and "Delete" actions.
- Support changing ONLY the `status` field of an order via the "Edit" action from the meatball menu (ignoring `closedAt`).
- Make the main body of an order row clickable, opening a modal to view the order's line items and modifiers (reusing `OrderSummary.tsx`-like components where possible).

**Non-Goals:**
- Completely rewriting the order creation flow. The `/order/create` page and the `useOrders` create mutation MUST remain untouched and functional as is.
- Allowing edits to `closedAt`, or deep edits to line items from the order list meatball menu. Only `status` is supported.
- Replacing the OpenAPI-generated `@/api/stub`; we must strictly consume it.

## Decisions

1. **Adjust Type Signatures in Hook:** We will update `useOrders` such that `listOrdersOrderGet` is cast or typed as returning `OrderWithLineItems[]` instead of `Order[]`.
    - *Rationale:* Conforms directly to backend changes without requiring an intermediate mapping layer if not necessary.

2. **Meatball Menu for Actions:** We will incorporate `ActionMenu.tsx` into the order list cards/rows.
    - *Rationale:* Enhances consistency across the app (matches the menu UI) and keeps action buttons neatly tucked away, giving more space for data.

3. **Status-Only Edit Modal:** When "Edit" is clicked from the meatball menu, a small dialog or inline edit state will appear allowing *only* the `status` enum to be mutated. The `OrderUpdate` payload will be used.
    - *Rationale:* Adheres strictly to the user prompt requirement to restrict updates to the `status` field only. By ignoring `closedAt`, we avoid unnecessary state complexity for time fields.

4. **Line-Items View Modal for Row Clicks:** Clicking the order row itself will trigger an `OrderSummaryModal` (or similar new component wrapping `OrderSummary.tsx`) that iterates over `OrderWithLineItems.lineItems` to display the detailed items and their modifiers.
    - *Rationale:* Since the payload now includes line items, we can eagerly render them upon click without making a secondary network request.

## Risks / Trade-offs

- [Risk] Existing parts of the system might rely on the `useQuery` of `useOrders` continuing to yield exactly `Order[]`.
  - *Mitigation:* We will verify if TypeScript complains elsewhere. Since `OrderWithLineItems` typically extends or is a superset of `Order` properties, duck typing might suffice, but we'll cleanly update the generic type references to ensure strict typing.
- [Risk] `OrderSummary.tsx` might expect a different data shape (like local state) rather than the server `OrderLineItem` stub model.
  - *Mitigation:* We'll write an adapter or adjust props to handle either the draft state items or the fetched `OrderLineItem` from `OrderWithLineItems`.

## Migration Plan

1. Update `useOrders.ts` type generics.
2. Refactor `frontend/src/pages/viewOrder.tsx` and related list components.
3. Integrate `ActionMenu` into list rows.
4. Implement the status edit form/modal.
5. Implement the line items display modal on row click.

## Open Questions

- Does `OrderSummary.tsx` cleanly accept external `OrderLineItem` objects from the stub, or does it tightly couple to local draft states? (Will adapt as necessary during implementation).