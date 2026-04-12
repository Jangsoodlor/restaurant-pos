## 1. Create Reusable Filter Components

- [x] 1.1 Create `NameSearchFilter.tsx` component for text-based name filtering
- [x] 1.2 Create `PriceRangeFilter.tsx` component for min/max price range filtering
- [x] 1.3 Create `SortDropdown.tsx` component for ascending/descending sort selection
- [ ] 1.4 Add snapshot tests for all three filter components

## 2. Create Custom Hooks for Menu Data Management

- [x] 2.1 Create `useMenuItems.ts` hook with:
  - Fetch menu items via `menuApiClient.listTablesMenuItemGet()`
  - State management for name filter, price range filter, and sort order
  - Client-side filtering logic (AND combination of name + price filters)
  - Client-side sorting (by name, asc/desc, or no sort)
  - CRUD mutations (create, update, delete) with TanStack Query invalidation
- [x] 2.2 Create `useMenuModifiers.ts` hook with identical structure but targeting:
  - `menuApiClient.listModifiersMenuModifierGet()` for fetching
  - `menuApiClient.createModifierMenuModifierPost()` for creation
  - Similar mutation hooks for update and delete
- [ ] 2.3 Add hook tests for filtering, sorting, and mutation logic

## 3. Create Menu Management Page

- [ ] 3.1 Create `Menu.tsx` page component with:
  - Tabbed interface (useState for activeTab: 'items' | 'modifiers')
  - Conditional hook usage (useMenuItems or useMenuModifiers based on activeTab)
 - [x] 3.1 Create `Menu.tsx` page component with:
  - Tabbed interface (useState for activeTab: 'items' | 'modifiers')
  - Conditional hook usage (useMenuItems or useMenuModifiers based on activeTab)
- [ ] 3.2 Implement Items tab section:
  - Display filter controls (name search, price range, sort dropdown)
  - "Create Item" button
  - List of item cards matching User.tsx card layout
  - ActionMenu on each item for edit/delete
  - EntityForm modal for create/edit operations
  - DeleteDialog modal for delete confirmation
 - [x] 3.2 Implement Items tab section:
  - Display filter controls (name search, price range, sort dropdown)
  - "Create Item" button
  - List of item cards matching User.tsx card layout
  - ActionMenu on each item for edit/delete
  - EntityForm modal for create/edit operations
  - DeleteDialog modal for delete confirmation
- [ ] 3.3 Implement Modifiers tab section with identical layout as Items
 - [x] 3.3 Implement Modifiers tab section with identical layout as Items
 - [x] 3.4 Implement form field descriptors for items and modifiers (name, price)
 - [x] 3.5 Implement create/edit/delete workflows (event handlers, form submission, error handling)
 - [x] 3.6 Add loading and error states for both tabs
- [ ] 3.7 Add page-level tests for tab switching, CRUD workflows, and filter interactions

## 4. Integrate Menu Page into App Routing

- [ ] 4.1 Update `App.tsx` to add `/menu` route pointing to Menu.tsx page
- [ ] 4.2 Update main navigation to include Menu link (if applicable)
- [ ] 4.3 Verify routing works and page is accessible at `/menu`
 - [x] 4.1 Update `App.tsx` to add `/menu` route pointing to Menu.tsx page
 - [ ] 4.3 Verify routing works and page is accessible at `/menu`

## 5. Styling and Visual Consistency

- [ ] 5.1 Apply Beercss grid/flex classes for layout structure matching User.tsx
- [ ] 5.2 Apply Beercss classes to filter controls (name search, price range, sort dropdown)
- [ ] 5.3 Style form inputs using Beercss form patterns
 - [x] 5.2 Apply Beercss classes to filter controls (name search, price range, sort dropdown)
 - [x] 5.3 Style form inputs using Beercss form patterns
 - [ ] 5.4 Ensure component styling consistency with existing ActionMenu, EntityForm, DeleteDialog
- [ ] 5.5 Verify page renders correctly in browser (manual visual check during development)
 - [x] 5.4 Ensure component styling consistency with existing ActionMenu, EntityForm, DeleteDialog
 - [ ] 5.5 Verify page renders correctly in browser (manual visual check during development)

## 6. Automated Testing with Bun

- [ ] 6.1 Write unit tests for `useMenuItems.ts` hook:
  - Test fetching items from API
  - Test filtering by name (case-insensitive matching)
  - Test filtering by price range (min/max, boundaries)
  - Test combined name + price AND logic
  - Test sorting (ascending, descending, no sort default)
  - Test create/update/delete mutations
  - Test TanStack Query invalidation on mutations
  - Test error states and loading states
- [ ] 6.2 Write unit tests for `useMenuModifiers.ts` hook with identical scenarios as items
 - [x] 6.1 Write unit tests for `useMenuItems.ts` hook:
 - [x] 6.2 Write unit tests for `useMenuModifiers.ts` hook with identical scenarios as items
 - [ ] 6.3 Write component tests for filter components using bun + React Testing Library:
  - `NameSearchFilter.tsx`: Input changes, empty state, case-insensitivity
  - `PriceRangeFilter.tsx`: Min/max input changes, boundary conditions, independent filtering
  - `SortDropdown.tsx`: Dropdown option selection, default state
- [ ] 6.4 Write component tests for `Menu.tsx` page:
  - Tab switching between Items and Modifiers
  - Rendering correct hook data based on active tab
  - Filter/sort controls affecting displayed list
  - Create button opens form modal
  - Action menu triggers edit/delete workflows
  - Confirmation dialogs appear for delete
- [ ] 6.5 Write integration tests for CRUD workflows:
  - Create item/modifier with valid data
  - Create with invalid data triggers validation errors
  - Edit updates item/modifier correctly
  - Delete with confirmation removes from list
  - Error responses display error messages
- [ ] 6.6 Write snapshot tests for all filter components
- [ ] 6.7 Run full test suite: `bun test` from frontend root
- [ ] 6.8 Verify test coverage is >= 80% for hooks and components
- [ ] 6.9 Add tests to CI/CD pipeline (if applicable)

## 7. Code Quality and Documentation

- [ ] 7.1 Run linter and fix any warnings/errors
- [ ] 7.2 Add JSDoc comments to hook functions and component props
- [ ] 7.3 Add inline comments for complex filter/sort logic
- [ ] 7.4 Verify no TypeScript errors
- [ ] 7.5 Verify components follow naming conventions and folder structure
