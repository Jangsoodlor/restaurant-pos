## ADDED Requirements

### Requirement: User List Routing and Display
The frontend SHALL provide a dedicated route at `/user` to display a scrollable list of all system users. Each entry in the list MUST show the user's role.

#### Scenario: Navigating to User Management Page
- **WHEN** an authenticated administrator navigates to `/user`
- **THEN** the system fetches the list of users and displays them within a scrollable container.
- **AND** each user entry displays their assigned role.

### Requirement: Reusable List Controls for Filtering and Sorting
The system SHALL implement generic, reusable Beercss dropdown components for filtering and sorting list data via a polymorphic or dependency injection approach. The user list page SHALL utilize these controls to filter users by their role and sort users.

#### Scenario: Filtering Users by Role
- **WHEN** the user selects a specific role from the filter dropdown
- **THEN** the displayed list of users is updated to only show users matching the selected role.

#### Scenario: Sorting Users
- **WHEN** the user selects "Ascending" or "Descending" from the sort dropdown
- **THEN** the displayed list of users is updated and ordered accordingly.

### Requirement: Reusable Action Menu Component
The existing item action dropdown (meatball menu) currently implemented inside `TableCard.tsx` SHALL be refactored into a standalone, reusable `ActionMenu` component.

#### Scenario: Extracting Action Menu
- **WHEN** reviewing the `TableCard.tsx` and the newly created `ActionMenu` component
- **THEN** the `TableCard.tsx` utilizes the `ActionMenu` component without duplicating dropdown rendering logic.
- **AND** the table management feature continues to function as before.

### Requirement: User Inline Management Actions
The user list entries SHALL integrate the newly extracted `ActionMenu` component. The menu icon MUST be the Beercss meatball icon located in the top-right corner of each entry, providing inline actions to edit or delete the specific user.

#### Scenario: Invoking User Actions
- **WHEN** the administrator clicks the meatball icon on a user's entry
- **THEN** an action dropdown is displayed with options to edit and delete the user.
- **WHEN** the edit or delete option is selected
- **THEN** the respective action workflow is initiated for that user.