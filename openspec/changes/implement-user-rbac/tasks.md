## 1. Extend AuthContext with user data

- [x] 1.1 Add `CurrentUser` interface to `AuthContext.tsx` (id, name, role properties)
- [x] 1.2 Update `AuthContextType` to include `user: CurrentUser | null` property
- [x] 1.3 Implement JWT decoding logic in `AuthProvider` (parse token on login and page reload)
- [x] 1.4 Update `login()` function to decode JWT and extract user data on successful authentication
- [x] 1.5 Update `logout()` function to clear user data alongside token
- [x] 1.6 Restore user data from token on component mount (read from localStorage token)
- [x] 1.7 Update AuthContext test to verify user data is stored and restored correctly
- [x] 1.8 Export `CurrentUser` type from AuthContext for use in other modules

## 2. Create centralized permission system

- [x] 2.1 Create `src/utils/permissions.ts` module with permission matrix (pages, actions, fields)
- [x] 2.2 Implement `canAccessPage(pageName, role)` helper function
- [x] 2.3 Implement `canCreate(page, role)` helper function
- [x] 2.4 Implement `canDelete(page, role)` helper function
- [x] 2.5 Implement `canEdit(page, role)` helper function
- [x] 2.6 Implement `canEditField(page, field, role)` helper function
- [x] 2.7 Add unit tests for all permission helper functions (test all role combinations)
- [x] 2.8 Export all permission helpers for import in components

## 3. Implement page-level access control

- [x] 3.1 Import `canAccessPage` and `useAuth` hook in `App.tsx`
- [x] 3.2 Update `/user` route to conditionally render `UserManagementPage` or `AccessDenied` based on role
- [x] 3.3 Update User Management nav link in `App.tsx` to conditionally render based on role (only show for managers)
- [x] 3.4 Test navigation: manager can access `/user`, non-managers are denied
- [x] 3.5 Test navigation: non-managers see AccessDenied page when trying `/user` directly
- [x] 3.6 Test navigation: User Management link is hidden from non-managers in nav

## 4. Implement Table Status role-based controls

- [x] 4.1 Import `canCreate`, `canDelete`, `canEditField` and `useAuth` in `tableStatus.tsx`
- [x] 4.2 Conditionally render "Create" button (only show for managers)
- [x] 4.3 Update ActionMenu for table items: pass conditional `onDelete` (null for waiters, undefined for cooks)
- [x] 4.4 Remove action menu completely for cooks (no edit or delete buttons visible)
- [x] 4.5 Update table edit form to disable `tableName` and `capacity` fields for waiters
- [x] 4.6 Keep `status` field editable for waiters, disabled for cooks
- [x] 4.7 Test: cook sees read-only table list with no action menu
- [x] 4.8 Test: waiter sees table list with edit menu (edit only, no delete), can edit status field only
- [x] 4.9 Test: manager sees full CRUD with all fields editable
- [x] 4.10 Verify form submission validates that waiters can only modify status field

## 5. Implement Menu role-based controls

- [x] 5.1 Import `canCreate` and `useAuth` in `Menu.tsx`
- [x] 5.2 Conditionally render "Create Item" button (only show for managers)
- [x] 5.3 Conditionally render "Create Modifier" button (only show for managers)
- [x] 5.4 Update ActionMenu for menu items to pass conditional `onDelete` (null for cooks/waiters, function for managers)
- [x] 5.5 Remove action menu completely for cooks and waiters (no edit or delete buttons visible)
- [x] 5.6 Test: cook sees read-only menu list with search/filter available, no action menu
- [x] 5.7 Test: waiter sees read-only menu list with search/filter available, no action menu
- [x] 5.8 Test: manager sees full CRUD with action menus and create buttons

## 6. Refactor ActionMenu component for permission-aware visibility

- [x] 6.1 Update `ActionMenu.tsx` to make `onDelete` callback optional (default to undefined)
- [x] 6.2 Conditionally render delete button only if `onDelete` is provided
- [x] 6.3 Keep edit button always visible (if onEdit provided)
- [x] 6.4 Add `disabled` prop tests to verify buttons are properly disabled when needed
- [x] 6.5 Test ActionMenu with and without delete handler

## 7. Integration and cross-component testing

- [x] 7.1 Test full session: manager logs in, sees all controls on all pages
- [x] 7.2 Test full session: waiter logs in, restricted on User page, limited on Table Status
- [x] 7.3 Test full session: cook logs in, read-only on Menu and Table Status pages
- [x] 7.4 Test role changes: logout and re-login with different role on same browser/session
- [x] 7.5 Test page reload with active session: user data persists, role checks still work

## 8. Verify implementation against specs

- [x] 8.1 Verify User Management page access control matches spec (manager-only, access denied vs. hidden link)
- [x] 8.2 Verify Table Status create button visibility matches spec for all roles
- [x] 8.3 Verify Table Status delete control visibility matches spec (hidden for waiter, visible for manager)
- [x] 8.4 Verify Table Status field editability matches spec (waiter: status only, cook: read-only, manager: all)
- [x] 8.5 Verify Menu create button visibility matches spec (hidden for cook/waiter)
- [x] 8.6 Verify Menu read-only mode matches spec (no action menus for cook/waiter)
- [x] 8.7 Verify AuthContext stores user data correctly (id, name, role extracted from JWT)
- [x] 8.8 Verify permission helpers cover all scenarios from spec

## 9. Documentation and clean-up

- [x] 9.1 Add inline comments to `permissions.ts` explaining permission matrix structure
- [x] 9.2 Add JSDoc comments to permission helper functions
- [x] 9.3 Verify no console errors or warnings in browser dev tools
- [ ] 9.4 Check TypeScript compilation (no type errors)
- [x] 9.5 Run frontend linting (`bun run lint`)
- [x] 9.6 Run frontend tests (`bun test`) to ensure no regressions
