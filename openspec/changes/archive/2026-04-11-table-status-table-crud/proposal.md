## Why

The table status page currently only visualizes table states and cannot perform basic table lifecycle operations. Implementing create, update, and delete in the same flow closes a critical POS management gap and reduces context switching for staff.

## What Changes

- Add create table flow from the table status page with form validation and API integration.
- Add update table flow from the table status page for editable table fields.
- Add delete table flow from the table status page with confirmation safeguards.
- Add loading, success, and error handling for table mutations in the UI.
- Ensure table list/state is refreshed after mutations to keep status view accurate.

## Capabilities

### New Capabilities
- `table-management`: Manage table entities from the table status interface, including create, update, and delete operations with user feedback.

### Modified Capabilities
- None.

## Impact

- Frontend: `frontend/src/pages/tableStatus.tsx`, table-related hooks and API usage.
- API usage: Existing table endpoints for create/update/delete will be consumed from UI.
- Testing: Frontend behavior and integration scenarios for mutation flows should be covered.
