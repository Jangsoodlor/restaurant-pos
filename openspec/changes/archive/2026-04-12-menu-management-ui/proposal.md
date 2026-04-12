## Why

The restaurant POS system currently lacks a UI for managing menu items and modifiers. Staff cannot create, view, edit, or delete menu items and modifiers through the frontend. This capability is essential for daily operations—managers need to adjust menus, add seasonal items, and manage modifiers for customization options. A management interface modeled after the proven User management pattern will accelerate development and provide consistency.

## What Changes

- **New Menu Management Page**: A tabbed interface (`/menu`) for managing menu items and modifiers separately
- **Menu Items Tab**: CRUD operations for menu items with filtering by name and price range, plus ascending/descending sort
- **Modifiers Tab**: CRUD operations for modifiers with the same filtering and sort capabilities
- **Unified Component Reuse**: Leverages existing `EntityForm`, `DeleteDialog`, `ActionMenu`, and filter components to minimize new code
- **Visual Parity**: Menu page layout and workflows match the User management page for familiarity

## Capabilities

### New Capabilities
- `menu-management-ui`: Full CRUD management interface for both menu items and modifiers with client-side filtering (name, price range) and sorting options

### Modified Capabilities
<!-- No existing capability requirements are changing with this feature -->

## Impact

**Frontend Code**:
- New page: `frontend/src/pages/Menu.tsx`
- New hooks: `frontend/src/hooks/useMenuItems.ts`, `frontend/src/hooks/useMenuModifiers.ts`
- New filter components: `frontend/src/components/NameSearchFilter.tsx`, `frontend/src/components/PriceRangeFilter.tsx`, `frontend/src/components/SortDropdown.tsx`
- Updates to `frontend/src/App.tsx` to route `/menu`

**Existing Components Reused**:
- `EntityForm` (polymorphic form for create/edit)
- `DeleteDialog` (confirmation dialogs)
- `ActionMenu` (inline edit/delete actions)

**Dependencies**: TanStack Query (already in use), Beercss styling (already in use)

**No Backend Changes**: Existing menu API endpoints (`/menu/item/*`, `/menu/modifier/*`) are sufficient
