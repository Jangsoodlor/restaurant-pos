## ADDED Requirements

### Requirement: User Management page access control

The system SHALL restrict access to the User Management page based on the user's role. Managers can access the full page with CRUD functionality. Cooks and waiters cannot access this page — attempting to navigate to it SHALL display an "Access Denied" message. The User Management link SHALL be hidden from navigation for non-managers.

#### Scenario: Manager accesses User Management
- **WHEN** a user with the `manager` role navigates to `/user`
- **THEN** the User Management page loads with full CRUD controls (create, edit, delete buttons visible and functional)

#### Scenario: Waiter attempts to access User Management via URL
- **WHEN** a user with the `waiter` role navigates to `/user`
- **THEN** the Access Denied page is displayed instead of User Management

#### Scenario: Cook attempts to access User Management via URL
- **WHEN** a user with the `cook` role navigates to `/user`
- **THEN** the Access Denied page is displayed instead of User Management

#### Scenario: User Management link visibility in navigation
- **WHEN** a user with the `manager` role views the navigation menu
- **THEN** the User Management link is visible and clickable
- **WHEN** a user with the `waiter` or `cook` role views the navigation menu
- **THEN** the User Management link is hidden

### Requirement: Create button visibility on Table Status page

The system SHALL hide the "Create Table" button from cooks and waiters on the Table Status page. Only managers can create new tables. Cooks and waiters can view existing tables but cannot initiate table creation.

#### Scenario: Manager sees create button on Table Status
- **WHEN** a user with the `manager` role navigates to `/tables`
- **THEN** the "Create" button is visible and functional

#### Scenario: Waiter does not see create button on Table Status
- **WHEN** a user with the `waiter` role navigates to `/tables`
- **THEN** the "Create" button is not visible

#### Scenario: Cook does not see create button on Table Status
- **WHEN** a user with the `cook` role navigates to `/tables`
- **THEN** the "Create" button is not visible

### Requirement: Delete control visibility on Table Status for waiters

The system SHALL hide the delete action in the Table Status action menu for waiters. Managers retain delete functionality. Cooks do not see the action menu at all (read-only viewing).

#### Scenario: Manager sees delete button in Table Status action menu
- **WHEN** a user with the `manager` role opens the action menu for a table
- **THEN** both "Edit" and "Delete" options are visible and functional

#### Scenario: Waiter does not see delete in Table Status action menu
- **WHEN** a user with the `waiter` role opens the action menu for a table
- **THEN** only the "Edit" option is visible; "Delete" is hidden or disabled

#### Scenario: Cook does not see action menu on Table Status
- **WHEN** a user with the `cook` role views the Table Status page
- **THEN** no action menus or edit controls are visible for any table

### Requirement: Table field editability for waiters

The system SHALL restrict waiter editing on the Table Status page to the status field only. Waiters cannot modify table name or capacity. Managers can edit all fields. Cooks cannot edit any fields.

#### Scenario: Waiter opens edit form for a table
- **WHEN** a user with the `waiter` role clicks "Edit" on a table
- **THEN** the edit form displays the status field as editable (e.g., dropdown with "available", "occupied", "reserved")
- **AND** the table name and capacity fields are disabled or hidden

#### Scenario: Manager opens edit form for a table
- **WHEN** a user with the `manager` role clicks "Edit" on a table
- **THEN** the edit form displays all fields (table name, capacity, status) as editable

#### Scenario: Cook cannot access edit form on Table Status
- **WHEN** a user with the `cook` role views the Table Status page
- **THEN** no edit controls or action menus are available

### Requirement: Create button visibility on Menu page

The system SHALL hide the "Create Item" and "Create Modifier" buttons from cooks and waiters on the Menu page. Only managers can create menu items or modifiers.

#### Scenario: Manager sees create buttons on Menu page
- **WHEN** a user with the `manager` role navigates to `/menu`
- **THEN** the "Create Item" and "Create Modifier" buttons are visible and functional

#### Scenario: Waiter does not see create buttons on Menu page
- **WHEN** a user with the `waiter` role navigates to `/menu`
- **THEN** the "Create Item" and "Create Modifier" buttons are not visible

#### Scenario: Cook does not see create buttons on Menu page
- **WHEN** a user with the `cook` role navigates to `/menu`
- **THEN** the "Create Item" and "Create Modifier" buttons are not visible

### Requirement: Read-only menu viewing for cooks and waiters

The system SHALL present a read-only interface for menu viewing to cooks and waiters. They can search and filter menu items but cannot perform CRUD operations. No action menus (edit/delete) shall be visible.

#### Scenario: Waiter views Menu page
- **WHEN** a user with the `waiter` role navigates to `/menu`
- **THEN** the menu items display with search and filter controls available
- **AND** no action menus (edit/delete buttons) are visible on any menu item
- **AND** creating new items is impossible

#### Scenario: Cook views Menu page
- **WHEN** a user with the `cook` role navigates to `/menu`
- **THEN** the menu items display with search and filter controls available
- **AND** no action menus (edit/delete buttons) are visible on any menu item
- **AND** creating new items is impossible

#### Scenario: Manager sees edit controls on Menu page
- **WHEN** a user with the `manager` role navigates to `/menu`
- **THEN** each menu item displays an action menu with "Edit" and "Delete" options
- **AND** the "Create Item" and "Create Modifier" buttons are visible

### Requirement: AuthContext stores decoded user information

The system SHALL extend the AuthContext to decode and store the current user's `id`, `name`, and `role` from the JWT token. This information SHALL be available to all components via the `useAuth()` hook, enabling role-based UI decisions throughout the app.

#### Scenario: User logs in and user data persists
- **WHEN** a user successfully logs in with valid credentials
- **THEN** the JWT token is stored in localStorage
- **AND** the AuthContext decodes the token and extracts user id, name, and role
- **AND** components can access this data via `useAuth().user`

#### Scenario: Component reads user role from context
- **WHEN** a component calls `useAuth()`
- **THEN** it receives an object containing `token`, `user` (with id, name, role), `isAuthenticated`, `login`, and `logout`

#### Scenario: User data persists on page reload
- **WHEN** a user has an active session and the page reloads
- **THEN** the token is restored from localStorage
- **AND** the AuthContext re-decodes it to restore user data
- **AND** the user is not logged out

### Requirement: Centralized permission policy engine

The system SHALL provide a centralized utility module (`src/utils/permissions.ts`) that defines the permission matrix for all roles across all pages. This module SHALL export helper functions to check if a given role can perform a specific action (view page, see button, edit field, etc.).

#### Scenario: Check page access permission
- **WHEN** a component calls a permission helper like `canAccessPage('user', userRole)`
- **THEN** it receives `true` if the role is allowed to access that page, `false` otherwise

#### Scenario: Check action visibility permission
- **WHEN** a component queries if a role can see a create button using `canCreate('menu', userRole)`
- **THEN** it receives `true` for managers, `false` for cooks and waiters

#### Scenario: Check field editability permission
- **WHEN** a component queries if a role can edit the table capacity field using `canEditField('tableStatus', 'capacity', userRole)`
- **THEN** it receives `true` for managers, `false` for waiters and cooks
