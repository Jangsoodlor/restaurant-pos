## 1. Table CRUD API Integration

- [x] 1.1 Verify table create, update, and delete operations in the existing frontend API client and identify the exact request/response types to use.
- [x] 1.2 Add or update table mutation hooks to call create/update/delete endpoints and expose pending/error/success state.
- [x] 1.3 Ensure table query invalidation/refetch is triggered after successful create, update, and delete mutations.

## 2. Table Status Page Interaction Flows

- [x] 2.1 Add create-table UI controls and validated input handling in `frontend/src/pages/tableStatus.tsx`.
- [x] 2.2 Add edit mode for a selected table with prefilled values and submit/cancel behaviors.
- [x] 2.3 Add delete action with explicit confirmation before executing the delete mutation.
- [x] 2.4 Disable duplicate submissions while mutations are in progress and keep interaction modes mutually exclusive.

## 3. Feedback, Error Handling, and Verification

- [x] 3.1 Render user-visible mutation feedback (loading and error states) for create, update, and delete operations.
- [x] 3.2 Confirm UI behavior for validation failures and API failures without losing existing table state.
- [x] 3.3 Add or update frontend tests for create/update/delete table flows and mutation feedback behaviors. (46 tests passing)
- [x] 3.4 Run project checks relevant to frontend changes and resolve any failures before merge. (All tests: 46/46 ✓)
