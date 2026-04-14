## Context

The `OrderFormCard` component currently manages the complete order creation UI in a single file, including:
- Table and waiter selection dropdowns
- Menu browser with quantity inputs and item cards
- Order summary with line item display and total calculation
- Line item editing and deletion functions

This monolithic structure makes the component harder to test in isolation and limits reusability of the menu browser or order summary as standalone components.

## Goals / Non-Goals

**Goals:**
- Separate menu browsing concerns from order summary concerns into independent, reusable components
- Improve component testability by isolating state and behavior
- Maintain exact visual and behavioral parity with current implementation
- Clearly define prop contracts between components for future extensibility
- Make menu browser and order summary available for reuse in other contexts

**Non-Goals:**
- Change user-facing behavior or the order creation flow
- Modify backend API contracts
- Implement new features (e.g., modifier selection UI enhancements)
- Refactor styling or layout approach
- Rewrite hooks or data fetching logic

## Decisions

### 1. Component Boundary Split
**Decision:** Create two new sibling components (`MenuBrowser` and `OrderSummary`) that are both composed by `OrderFormCard`.

**Rationale:** This maintains the current ownership of order creation flow in `OrderFormCard` while extracting presentation and interaction logic into reusable pieces. It avoids overly deep prop drilling and allows independent testing.

**Alternatives considered:**
- Lift state up to a custom hook → More complex to coordinate; loses access to parent context
- Create a context-based solution → Adds indirection; harder to track data flow
- Make OrderFormCard a wrapper around a layout component → Less flexible for future variations

### 2. State Ownership in OrderFormCard
**Decision:** `OrderFormCard` retains ownership of all order-related state (`lineItems`, `tableId`, `userId`), while `MenuBrowser` manages its own UI state (`quantityForItem`, `modifiersForItem`, `editingLineItemId`).

**Rationale:** Order state is the source of truth and needs to be shared with buttons/handlers in `OrderFormCard`. Menu browser state is purely for UI interaction within that component. This separation keeps concerns clear.

**Alternatives considered:**
- Full state lift-up → Creates prop drilling; makes MenuBrowser less independent
- Full state in each component → Causes synchronization problems and inconsistency

### 3. Prop Contracts
**Decision:** 
- `MenuBrowser` receives: `menuItems`, `menuLoading`, `quantityForItem`, `onAddLineItem`, handlers for quantity/modifier updates
- `OrderSummary` receives: `lineItems`, `orderTotal`, handlers for edit/delete operations

**Rationale:** Props represent the minimal necessary interface. Handlers stay at the `OrderFormCard` level where the state lives. Components receive only what they need to render and accept callbacks for actions.

### 4. File Organization
**Decision:** Create `MenuBrowser.tsx` and `OrderSummary.tsx` in the same `components/` directory as `OrderFormCard.tsx`.

**Rationale:** Keeps related UI components together. Each is a self-contained feature component used within the order creation flow.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Props become complex if requirements change | Document prop interfaces clearly; consider extracting a custom hook if prop count grows |
| Tight coupling through callbacks in OrderFormCard | Callbacks are unidirectional and follow React best practices; interface is explicit |
| Testing requires more mocking of parent state | Each component can be tested independently with fixture data; integration tests use OrderFormCard directly |
| Future developers might duplicate logic between components | Strong code review; periodic refactoring to extract common patterns into hooks or utilities |

## Migration Plan

1. Create `MenuBrowser.tsx` with extracted left-panel UI and state
2. Create `OrderSummary.tsx` with extracted right-panel UI and logic
3. Update `OrderFormCard` to import and compose both new components
4. Verify all existing tests pass
5. Add unit tests for `MenuBrowser` and `OrderSummary` in isolation
6. Update any relevant documentation or storybook entries
