## 1. Setup New Components Structure

- [x] 1.1 Create `frontend/src/components/TableCard.tsx` for presenting table info.
- [x] 1.2 Create `frontend/src/components/TableForm.tsx` for the create/edit interface.
- [x] 1.3 Create `frontend/src/components/TableDeleteDialog.tsx` for deletion confirmation.

## 2. Table Status Visualization & Layout

- [x] 2.1 Update `TableCard.tsx` to conditionally apply background color classes based on status (`green` for available, `red` for occupied, `yellow` for reserved).
- [x] 2.2 Add padding in `TableCard.tsx` to ensure long table names do not overflow the card.
- [x] 2.3 Implement the hamburger menu at the top-right of `TableCard.tsx` to hold the "Edit" and "Delete" actions.

## 3. Forms & Dialog Implementation

- [x] 3.1 Implement `TableForm.tsx` with proper spacing, labels, and local validation. Ensure it delegates sumbit & cancel actions to the parent.
- [x] 3.2 Imlement `TableDeleteDialog.tsx` capturing the table name, with visually distinct confirm ("red" class) and cancel buttons.

## 4. Main Page Refactor

- [x] 4.1 Update `frontend/src/pages/tableStatus.tsx` to import and compose `TableCard`, `TableForm`, and `TableDeleteDialog`.
- [x] 4.2 Wire the TanStack query data and mutations (`create`, `update`, `delete`) to the new nested components.
- [x] 4.3 Remove the large monolithic rendering blocks from `tableStatus.tsx` leaving just state management and main grid wrapper.
