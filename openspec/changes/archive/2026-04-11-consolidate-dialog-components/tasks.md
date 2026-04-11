## 1. Create Reusable Components

- [x] 1.1 Create `frontend/src/components/DeleteDialog.tsx` with generic item name parameter
- [x] 1.2 Create `frontend/src/components/EntityForm.tsx` with field descriptor and DI pattern
- [x] 1.3 Add TypeScript exports and prop type documentation for both components

## 2. Enhance User Hook Mutations

- [x] 2.1 Add `useCreateUser` mutation hook to `useUser.ts`
- [x] 2.2 Add `useUpdateUser` mutation hook to `useUser.ts`
- [x] 2.3 Export all three mutations (create, update, delete) from `useUser` hook return object

## 3. Refactor Table Status Page

- [x] 3.1 Update `tableStatus.tsx` imports: replace `TableForm` with `EntityForm`, replace `TableDeleteDialog` import
- [x] 3.2 Add table field descriptor to `tableStatus.tsx` (tableName, capacity, status fields)
- [x] 3.3 Update `tableStatus.tsx` to pass field descriptors to `EntityForm`
- [x] 3.4 Update `tableStatus.tsx` to use new `DeleteDialog` instead of `TableDeleteDialog`
- [x] 3.5 Verify Table Status page maintains same UX and functionality

## 4. Implement User Management CRUD

- [x] 4.1 Update `User.tsx` to import `EntityForm` and `DeleteDialog` components
- [x] 4.2 Add user field descriptor to `User.tsx` (name, role fields with options)
- [x] 4.3 Implement `handleEdit` in `User.tsx`: show `EntityForm` in edit mode with `useUpdateUser` mutation
- [x] 4.4 Implement `handleCreate` in `User.tsx`: show `EntityForm` in create mode with `useCreateUser` mutation
- [x] 4.5 Replace primitive delete dialog with structured `DeleteDialog` component in `User.tsx`
- [x] 4.6 Update User page to use new mutations from enhanced `useUser` hook
- [x] 4.7 Verify User Management page has complete create/update/delete functionality

## 5. Cleanup and Refactoring

- [x] 5.1 Delete `frontend/src/components/TableDeleteDialog.tsx`
- [x] 5.2 Search codebase for any remaining `TableDeleteDialog` imports and remove
- [x] 5.3 Search codebase for any remaining `TableForm` imports, verify using `EntityForm` instead

## 6. Testing and Validation

- [x] 6.1 Test Table Status page: create, edit, delete flows work correctly
- [x] 6.2 Test User Management page: create, edit, delete flows work correctly
- [x] 6.3 Verify all form validations work and errors display properly
- [x] 6.4 Verify loading states on all buttons during API calls
- [x] 6.5 Run `bun test` to ensure no test breakage (update imports in test files if needed)

## 7. Integration and Final Checks

- [x] 7.1 Run frontend dev server and manually test both pages end-to-end
- [x] 7.2 Verify no console errors or TypeScript errors
- [x] 7.3 Confirm component reusability: form and dialog work identically for tables and users
