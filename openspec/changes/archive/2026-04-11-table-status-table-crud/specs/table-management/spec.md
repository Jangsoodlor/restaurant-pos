## ADDED Requirements

### Requirement: Create table from table status page
The system SHALL allow users to create a new table directly from the table status page using a validated input form.

#### Scenario: Successful table creation
- **WHEN** a user submits valid table creation data from the table status page
- **THEN** the system creates the table through the table create API and displays the new table in the status list

#### Scenario: Invalid creation input
- **WHEN** a user submits incomplete or invalid table creation data
- **THEN** the system prevents submission and displays validation feedback without changing existing table records

### Requirement: Update existing table from table status page
The system SHALL allow users to edit an existing table from the table status page and persist updates through the table update API.

#### Scenario: Successful table update
- **WHEN** a user submits valid changes for an existing table
- **THEN** the system persists the update and refreshes the table card with the updated values

#### Scenario: Update API failure
- **WHEN** the table update API returns an error
- **THEN** the system keeps previous table values visible and presents an actionable error message

### Requirement: Delete table from table status page
The system SHALL allow users to delete a table from the table status page only after explicit confirmation.

#### Scenario: Confirmed table deletion
- **WHEN** a user confirms deletion for a selected table
- **THEN** the system deletes the table and removes it from the visible status list after refresh

#### Scenario: Deletion canceled
- **WHEN** a user cancels deletion confirmation
- **THEN** the system performs no delete request and keeps all table cards unchanged

### Requirement: Reflect mutation state and feedback
The system SHALL provide visible pending and error feedback for create, update, and delete operations on the table status page.

#### Scenario: Mutation in progress
- **WHEN** any table mutation request is in progress
- **THEN** the system indicates loading state and prevents duplicate submissions for the same action

#### Scenario: Mutation fails
- **WHEN** a create, update, or delete request fails
- **THEN** the system displays an error message describing the failure and allows retry
