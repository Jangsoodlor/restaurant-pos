## Context

Currently, ViewOrder and CreateOrder pages are conflated in a single codebase, causing confusion about responsibilities. Components make direct API client imports (`tableApiClient`, `userApiClient`, `menuApiClient`) instead of using a hook-based pattern. The Menu.tsx page demonstrates the desired pattern: hooks manage all API interactions, components remain API-agnostic and data-agnostic, promoting reusability and testability.

This design establishes the refactored architecture following the Menu.tsx pattern while introducing modal-based detail views and separating creation workflows into dedicated pages.

## Goals / Non-Goals

**Goals:**
- Separate concerns: OrderList (viewing/filtering) and OrderCreate (full order builder on dedicated page)
- Enforce hook-first pattern: all API interactions via `useOrders()` and `useMenuItems()`, no direct client imports in components
- Improve UX: full-page order builder with all selections (table, menu items, modifiers) in one form, single API call to create
- Match established patterns: align with Menu.tsx component architecture (hooks + filters + reusable components)
- Enable modal-based order management: edit, update status, manage items without leaving list view

**Non-Goals:**
- Add new backend endpoints (use existing `/order` API)
- Implement order history or archival features
- Add real-time collaboration or conflict resolution
- Change order data models or validation logic

## Decisions

### 1. **Hooks-First Data Layer** 
- **Decision**: All pages import only hooks (`useOrders`, `useOrderLineItems`, useMenuItems`), never direct API clients
- **Rationale**: Menu.tsx pattern provides proven testability and stub/real API swappability. Centralizes error handling, loading states, and cache invalidation
- **Alternatives Considered**: Keep direct imports (rejected: harder to test, duplicates logic, defeats stub API strategy); Redux state (rejected: not used in codebase, hooks are sufficient)

### 2. **Modal for Order Detail View**
- **Decision**: Clicking an order row opens `OrderDetailModal` on the same page; no `/orders/{id}` route
- **Rationale**: Allows quick inspection and editing without page navigation, faster UX for common operations (view → update table → update status → close)
- **Trade-off**: Limited viewport for complex orders with many items (mitigated by scrollable modal content); changes app routing convention (intentional, documented in proposal as BREAKING)
- **Alternatives Considered**: Separate page (rejected: slower UX, unnecessary navigation), toast notifications (rejected: insufficient for multi-action workflows)

### 3. **OrderFormCard: Full Order Builder Component**
- **Decision**: Create `OrderFormCard` as a comprehensive order builder (not just form-filling). Users select table, menu items (with modifiers), then submit entire order in ONE action
- **Rationale**: Single-step creation is faster UX and simpler data flow. Build line items locally in component state, then POST to `/order/` with full order payload (table, waiter, line items) in one call. No intermediate order skeleton
- **Alternatives Considered**: Multi-step form (rejected: adds complexity, slower UX); modal-based (rejected: doesn't have room for menu browser); keeping EntityForm (rejected: EntityForm is generic modal, doesn't fit full-page builder pattern)

### 4. **OrderFormCard State Management**
- **Decision**: Use React `useState` for local line items array (building order), then submit entire order at once via `useOrders().createOrder()`
- **Rationale**: Simpler than per-item API calls; single transaction reduces inconsistent state; matches pattern of Menu.tsx for local filtering before submit
- **State shape**: `{ table_id, user_id, lineItems: [{menuItemId, quantity, modifiers}, ...] }`

### 5. **OrderDetailModal Component**
- **Decision**: New reusable modal component with toggle buttons for edit mode, edit fields for table/waiter/status, inline line item CRUD
- **Rationale**: Encapsulates modal complexity, reusable in future features (e.g., order history, bulk actions)
- **Content**: Read-only view → click edit → inline form fields → save/cancel

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Modal viewport too small for large orders** | Use scrollable modal content; consider collapsible line item details |
| **OrderFormCard gets cognitively complex with many menu items** | Use filters/search in menu browser section; collapsible sections for modifiers per item |
| **Losing order data if user closes page mid-creation** | Consider localStorage backup of draft order (out of scope for now, can add later) |
| **BREAKING: No `/orders/{id}` route breaks bookmarks/sharing** | Acceptable (POS system, not public-facing); use modal for all order details |
| **Single POST call fails = entire order creation fails** | Backend validates atomically; frontend displays clear error; user can retry |

## Migration Plan

1. **Phase 1**: Create enhanced `useOrders()` hook supporting full payload order creation with line items
2. **Phase 2**: Create `OrderFormCard` component: table selector + menu browser + modifiers + local line items state
3. **Phase 3**: Integrate OrderFormCard into CreateOrder.tsx; implement single-submit flow
4. **Phase 4**: Create OrderDetailModal component for viewing/editing existing orders
5. **Phase 5**: Refactor ViewOrder.tsx to use list + modal pattern
6. **Phase 6**: Remove direct API imports, validate hook usage, test full flows
7. **Deployment**: Single commit/PR
8. **Rollback**: Revert to previous ViewOrder/CreateOrder; no data migration needed

## Open Questions

- Should OrderFormCard support saving drafts (localStorage)? (Out of scope for v1)
- Do we need filtering/sorting on the OrderList (by status, table, waiter)? Status tabs are in scope.
- Should modifiers be required or optional per menu item? (Backend should define; frontend passes payload)
- Test coverage: unit tests for `useOrders()` with full payload? Component tests for OrderFormCard?
- Should backend validate modifiers exist before accepting order? (Yes, before insertion)
