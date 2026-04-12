## Context

Currently, ViewOrder and CreateOrder pages are conflated in a single codebase, causing confusion about responsibilities. Components make direct API client imports (`tableApiClient`, `userApiClient`, `menuApiClient`) instead of using a hook-based pattern. The Menu.tsx page demonstrates the desired pattern: hooks manage all API interactions, components remain API-agnostic and data-agnostic, promoting reusability and testability.

This design establishes the refactored architecture following the Menu.tsx pattern while introducing modal-based detail views and separating creation workflows into dedicated pages.

## Goals / Non-Goals

**Goals:**
- Separate concerns: OrderList (viewing/filtering) and OrderCreate (guided multi-step workflow)
- Enforce hook-first pattern: all API interactions via `useOrders()` and `useOrderLineItems()`, no direct client imports in components
- Improve UX: modal for quick order inspection; dedicated page for order creation encourages thoughtful workflow
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

### 3. **Custom OrderFormCard Component (vs EntityForm)**
- **Decision**: Create lightweight `OrderFormCard` component for inline order creation; don't reuse EntityForm for this flow
- **Rationale**: Order creation is a multi-step workflow (form → menu browser → finish), not a simple create/edit modal. EntityForm is modal-based; order creation needs full-page space for menu browsing
- **Alternatives Considered**: Extend EntityForm to support multi-step (rejected: increases complexity, EntityForm is meant for single modals); keep EntityForm for initial form (rejected: still modal-based, doesn't leave room for menu browsing step)

### 4. **Menu Browsing in CreateOrder Page**
- **Decision**: After creating order skeleton, display a card-based menu browser (matching Menu.tsx layout) for users to add items
- **Rationale**: Users can browse, filter, and add items in familiar interface; integrated experience rather than modal pop-ups
- **Trade-off**: Requires component reuse from Menu.tsx or independent menu browser; increases page complexity (mitigated by clear step indicators)

### 5. **State Management: Component State + TanStack Query**
- **Decision**: Use React `useState` for UI state (form visibility, editing line item), TanStack Query hooks for server state (orders, line items)
- **Rationale**: Matches existing pattern (Menu.tsx, User.tsx); simple component logic, predictable caching/invalidation
- **Alternatives Considered**: Redux (rejected: not in use), Zustand (rejected: hooks sufficient, would add dependency)

### 6. **OrderDetailModal Component**
- **Decision**: New reusable modal component with toggle buttons for edit mode, edit fields for table/waiter/status, inline line item CRUD
- **Rationale**: Encapsulates modal complexity, reusable in future features (e.g., order history, bulk actions)
- **Content**: Read-only view → click edit → inline form fields → save/cancel

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Modal viewport too small for large orders** | Use scrollable modal content; consider collapsible line item details |
| **Menu browser on CreateOrder page adds cognitive load** | Clear step indicator (e.g., "Step 2: Add Items") and visual separation between form and menu |
| **Hook state management misses edge cases** | Comprehensive tests on `useOrders()` and `useOrderLineItems()` hooks; validate TanStack Query invalidation logic |
| **BREAKING: No `/orders/{id}` route breaks bookmarks/sharing** | Acceptable (POS system, not public-facing); update any team documentation |
| **Component reuse: menu browser duplicated or coupled** | Extract shared menu browser logic into reusable hook (e.g., `useMenuBrowser()`) if needed |

## Migration Plan

1. **Phase 1**: Create hooks and components (OrderDetailModal, OrderFormCard, enhanced useOrders)
2. **Phase 2**: Refactor ViewOrder.tsx to use new modal pattern; test list rendering and modal interactions
3. **Phase 3**: Refactor CreateOrder.tsx to use custom form and menu browser; remove EntityForm usage
4. **Phase 4**: Remove direct API imports from both pages; validate hook usage
5. **Deployment**: Single commit/PR (feature is internal, no public API changes)
6. **Rollback**: Revert to previous ViewOrder/CreateOrder; no data migration needed

## Open Questions

- Should the OrderDetailModal be exported/reused in future features (e.g., admin panel), or is it page-specific?
- Do we need filtering/sorting on the OrderList (by status, table, waiter)? Proposal mentions status tabs; confirm scope.
- Should CreateOrder support bulk line item import or templated orders? (Likely out of scope, but worth confirming)
- Test coverage: unit tests for hooks? Component tests for modals/forms?
