## Why

The `OrderFormCard` component has grown to handle two distinct concerns: menu browsing (left panel) and order summary management (right panel). These sections have different state management needs, reusability potential, and complexity. Extracting them into separate components will improve maintainability, testability, and make them available for reuse elsewhere.

## What Changes

- Extract the menu browser UI and logic into a new `MenuBrowser` component
- Extract the order summary UI and logic into a new `OrderSummary` component
- Refactor `OrderFormCard` to compose these two components while managing the overall order creation flow
- Update state management to clearly separate concerns between components
- Ensure consistent behavior and styling are maintained throughout the refactoring

## Capabilities

### New Capabilities

- `menu-browser-component`: A reusable component for browsing and selecting menu items with quantity controls
- `order-summary-component`: A reusable component for displaying order line items, managing quantities, and showing order totals

### Modified Capabilities

(No requirement-level changes. This is a refactoring of implementation details within the existing `order-creation-flow` capability.)

## Impact

- Affected files: `frontend/src/components/OrderFormCard.tsx` will be refactored
- New files: `frontend/src/components/MenuBrowser.tsx` and `frontend/src/components/OrderSummary.tsx`
- No API changes or breaking changes
- No changes to external component interfaces or props contract
- Internal state handling is reorganized but visible behavior remains identical
