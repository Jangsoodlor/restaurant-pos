## Why

Currently, dialog components are tightly coupled to specific pages, forcing duplication of logic and inconsistent UX patterns. `TableDeleteDialog` and `TableForm` can only be used for table operations, while User Management uses primitive browser dialogs (`confirm()` and `alert()`). Consolidating these into reusable, polymorphic components will reduce code duplication, enable consistent patterns across all admin pages, and provide a foundation for future CRUD operations (creating new admin interfaces becomes faster and more maintainable).

## What Changes

- **Remove** `TableDeleteDialog.tsx` (consolidate into generic `DeleteDialog`)
- **Move** User Management's delete confirmation logic into `DeleteDialog.tsx` (new shared component)
- **Refactor** `TableForm.tsx` into a polymorphic form component with dependency injection, usable for both Table Status and User Management (or any future CRUD entities)
- **Implement** User CRUD mutations in `useUser.ts`: `useCreateUser`, `useUpdateUser`, `useDeleteUser` (paralleling `useTable.ts` patterns)
- **Replace** primitive dialogs in User Management page with structured components
- **Update** Table Status page to use refactored components (no breaking changes, same UX)

## Capabilities

### New Capabilities
- `reusable-delete-dialog`: Generic delete confirmation component usable by any CRUD entity
- `polymorphic-form-component`: Form component accepting entity-specific validators and formatters via dependency injection
- `user-crud-operations`: Mutations for creating, updating, and deleting users (paralleling table CRUD)

### Modified Capabilities
- `table-management-ui`: Refactored to use new shared dialog and form components (no API/UX changes, internal refactor)
- `user-management-ui`: Refactored to use new shared components instead of primitive dialogs, gains consistent Delete UI

## Impact

**Affected Components**:
- `frontend/src/components/TableDeleteDialog.tsx` — removed
- `frontend/src/components/TableForm.tsx` — refactored (signature changes)
- `frontend/src/components/DeleteDialog.tsx` — new
- `frontend/src/pages/tableStatus.tsx` — updated to use refactored components
- `frontend/src/pages/User.tsx` — updated to use refactored components

**Affected Hooks**:
- `frontend/src/hooks/useTable.ts` — no changes needed
- `frontend/src/hooks/useUser.ts` — add Create/Update/Delete mutations

**UI/UX Impact**: Minimal. Table Status page UX unchanged. User Management gains a consistent delete confirmation dialog matching table delete UX.

**Breaking Changes**: None for external consumers; internal prop signatures change for form component.
