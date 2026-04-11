## ADDED Requirements

### Requirement: Generic delete confirmation dialog
The system SHALL provide a reusable `DeleteDialog` component that displays a confirmation dialog for deleting any entity type. The component accepts a generic item name parameter, removal of table-specific branding, and maintains consistent UX with existing table delete dialog.

#### Scenario: Delete dialog renders with item name
- **WHEN** `DeleteDialog` component is rendered with `itemName="John Doe"`
- **THEN** the dialog displays "Are you sure you want to delete John Doe?" or equivalent

#### Scenario: Confirm delete action
- **WHEN** user clicks "Delete" button with `isPending=false`
- **THEN** `onConfirm` callback is executed and button shows loading state

#### Scenario: Cancel delete action
- **WHEN** user clicks "Cancel" button
- **THEN** `onCancel` callback is executed and dialog is dismissed

#### Scenario: Delete in progress state
- **WHEN** `isPending=true`
- **THEN** both buttons are disabled and "Delete" button shows loading indicator

#### Scenario: Error message display
- **WHEN** `errorMessage="User deletion failed"` is provided
- **THEN** error message appears below dialog buttons in red styling

### Requirement: DeleteDialog component location and exports
The component SHALL be exported from `DeleteDialog.tsx` in `frontend/src/components/` directory and SHALL have TypeScript prop types documenting all parameters.

#### Scenario: Component is properly exported
- **WHEN** importing from `@/components/DeleteDialog`
- **THEN** import succeeds and component is a React functional component
