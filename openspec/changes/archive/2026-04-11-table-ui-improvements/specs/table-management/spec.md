## ADDED Requirements

### Requirement: Visual status indicators for tables
The system SHALL display table cards with distinct visual background colors corresponding to their current status.

#### Scenario: Available table displayed
- **WHEN** a table has the status 'available'
- **THEN** the system renders the table card with a green background

#### Scenario: Occupied table displayed
- **WHEN** a table has the status 'occupied'
- **THEN** the system renders the table card with a red background

#### Scenario: Reserved table displayed
- **WHEN** a table has the status 'reserved'
- **THEN** the system renders the table card with a yellow background

### Requirement: Hamburger menu for table actions
The system SHALL consolidate the edit and delete actions into a hamburger menu located at the top right of each table card to optimize screen real estate.

#### Scenario: User opens table action menu
- **WHEN** a user clicks the hamburger menu icon on a table card
- **THEN** the system displays the "Edit" and "Delete" action options

#### Scenario: User initiates edit from hamburger menu
- **WHEN** a user selects "Edit" from the table's hamburger menu
- **THEN** the system opens the edit form for that specific table

#### Scenario: User initiates delete from hamburger menu
- **WHEN** a user selects "Delete" from the table's hamburger menu
- **THEN** the system displays the deletion confirmation dialog
