## Context

The restaurant POS frontend has an established pattern for entity management via the `User.tsx` page. This page demonstrates:
- Custom hooks managing data fetching and mutations (useUser)
- Client-side filtering and sorting on small datasets
- Reusable components for forms, dialogs, and action menus
- TanStack Query for server state management

The menu management feature replicates this proven pattern for two related entities: menu items and modifiers. The system already has backend API endpoints for both entities (`/menu/item/*` and `/menu/modifier/*`), each with full CRUD support.

**Existing Reusable Components:**
- `EntityForm`: Generic polymorphic form for create/edit via field descriptors
- `DeleteDialog`: Confirmation modal for destructive actions
- `ActionMenu`: Inline edit/delete actions dropdown
- `ListControls`: Unified filter/sort controls (will be extended or replaced with focused filters)

**Constraints:**
- Frontend stack: React + TypeScript + Beercss + TanStack Query
- Redux not in use; component-level state via useState
- Small datasets (restaurants have dozens to low hundreds of items/modifiers)
- No pagination exposed in API; clients pull all data and process locally

## Goals / Non-Goals

**Goals:**
- Provide a tabbed Menu page (`/menu`) with two tabs: Items and Modifiers
- Enable CRUD operations for both entities via consistent UI patterns
- Implement client-side filtering by name (text search) and price range (min/max)
- Support sorting by ascending/descending order (sorts by name by default; no sort applied unless user selects)
- Reuse existing component library to minimize new code
- Match the visual layout, workflow, and interaction patterns of the User management page
- Provide real-time UI updates via TanStack Query invalidation on mutations

**Non-Goals:**
- Pagination or lazy loading (defer if dataset grows beyond ~500 items)
- Bulk operations (import/export, batch editing)
- Advanced scheduling or conditional visibility of modifiers
- Backend API changes (use existing endpoints as-is)
- Modifier grouping or hierarchy (flat list only)
- Real-time sync across multiple client instances

## Decisions

### Decision 1: Two Separate Hooks vs. Generic Hook
**Choice: Two separate hooks** (`useMenuItems`, `useMenuModifiers`)

**Rationale:**
- Items and modifiers have distinct API endpoints and types; separating hooks keeps concerns isolated
- Easier to extend each with entity-specific logic later (e.g., item categories, modifier groups)
- Mirrors the useUser pattern for familiarity

**Alternatives Considered:**
- Single generic `useMenu(entityType)` hook would reduce code duplication but add complexity in component logic; less clear behavior and harder to debug

### Decision 2: Tab-Based UI for Items vs. Modifiers
**Choice: Single Menu page with tab switcher**

**Rationale:**
- Managers often need to switch between items and modifiers to understand context (e.g., "which items use this modifier?")
- Single page reduces route complexity and navigation
- Tabs allow shared filter UI while maintaining separate data contexts

**Alternatives Considered:**
- Separate `/menu/items` and `/menu/modifiers` routes would reduce state complexity but increase navigation friction and duplicate UI code

### Decision 3: Client-Side Filtering and Sorting
**Choice: All filtering and sorting happens client-side**

**Rationale:**
- Datasets are small (typically <200 items/modifiers for a restaurant)
- Backend API doesn't support server-side filtering/sorting parameters
- Simpler implementation; full control over filter logic
- Instant UI feedback when user types or adjusts filters

**Alternatives Considered:**
- Backend-side filtering would require backend API changes (out of scope); also unnecessary for small datasets

### Decision 4: Dedicated Filter Components
**Choice: Create focused filter components** (`NameSearchFilter`, `PriceRangeFilter`, `SortDropdown`)

**Rationale:**
- ListControls is generic and designed for simple dropdowns; our requirements (text input + range inputs) diverge
- Dedicated components are more explicit, testable, and reusable
- Clearer separation of concerns

**Alternatives Considered:**
- Extend ListControls with conditional rendering; creates confusion about ListControls' scope and makes it harder to reuse

### Decision 5: Form Field Definitions
**Choice: Use FormField descriptors matching EntityForm's pattern**

**Rationale:**
- Proven pattern from User.tsx; consistent with existing codebase
- Decouples form structure from component logic
- Easy to add/remove fields without touching component code

**Fields for Menu Items:**
- `name`: Text input, required
- `price`: Number input, required (min value 0 implied but validation skipped per requirements)

### Decision 6: Default Sort State
**Choice: No sort applied by default; display backend response order**

**Rationale:**
- Simpler initial behavior; users consciously choose sort order
- Backend doesn't guarantee order, so client default sorting (e.g., by name) might differ from expected backend behavior
- Aligns with stated requirements

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Client-side filtering on large datasets** - If a restaurant grows to 500+ items, filters might lag | Monitor performance; defer pagination/virtualization until needed. Can add limit warnings in UI. |
| **No filtering on type field** - Cannot show only items or only modifiers; both types always appear in API response | Acceptable per current requirements. Backend already separates `/item` and `/modifier` endpoints, so no single "menu" data structure to filter. |
| **Price range filter ambiguity** - Users might expect "items between $X and $Y" but unclear if this is AND/OR logic with name filter | Design one filter to be AND (default behavior); clarify in spec/UX with explicit labels. |
| **Tab state lost on page refresh** - User's tab choice resets | Acceptable for MVP; can add URL query param `?tab=modifiers` in future if needed. |
| **No undo/redo** - Deleted items cannot be recovered without server restore | Standard pattern for confirmation dialogs; acceptable trade-off. |
| **Form validation skipped for price** - Negative prices accepted until backend rejects | Per requirements; acceptable. Backend validation acts as safety net. |

## Migration Plan

**Phase 1: Development**
- Create hooks, components, and page in feature branch
- Add route to App.tsx (no public publication yet; internal testing only)
- Write comprehensive bun test suites for all components and hooks as part of development

**Phase 2: Automated Testing**
- Run full bun test suite covering:
  - Hook logic (filtering, sorting, mutations)
  - Component rendering and state management
  - CRUD workflows and error scenarios
  - Filter/sort behavior validation
  - Tab switching and independent state
- All tests must pass before proceeding to Phase 3
- Generate test coverage report to ensure adequate coverage of critical paths

**Phase 3: Deployment**
- Merge to main branch; no database migrations needed (backend unchanged)
- Menu page is now accessible at `/menu`
- Run full test suite as part of CI/CD pipeline

**Rollback:** Remove `/menu` route from App.tsx and revert components if critical issues arise; no data loss possible

## Open Questions

1. Should filters be persistent across tab switches? (e.g., name filter "Burger" stays when switching to Modifiers tab, or reset?)
   - **Leaning:** Reset per tab for clarity; each entity type has different meaningful filters

2. Should deleted items be soft-deleted or hard-deleted?
   - **Leaning:** Hard-deleted (per existing backend behavior); acceptable for menu adjustments

3. Price field input: What's the UX for the "price range" filter? Two text boxes (min/max) or slider?
   - **Leaning:** Two number text inputs (min/max) for clarity and simplicity; aligns with Beercss form patterns
