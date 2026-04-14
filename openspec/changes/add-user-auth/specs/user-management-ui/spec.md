## MODIFIED Requirements

### Requirement: User List Routing and Display
The frontend SHALL provide a dedicated route at `/user` to display a scrollable list of all system users. Each entry in the list MUST show the user's role. This route MUST be protected and redirect to login if no valid session exists.

#### Scenario: Navigating to User Management Page
- **WHEN** an authenticated administrator navigates to `/user`
- **THEN** the system fetches the list of users and displays them within a scrollable container.
- **AND** each user entry displays their assigned role.

#### Scenario: Navigating to User Management Page while unauthenticated
- **WHEN** an unauthenticated visitor navigates to `/user`
- **THEN** the system redirects them to the login page.

## ADDED Requirements

### Requirement: Login and Registration Pages
The frontend SHALL provide Login and Registration pages allowing users to authenticate or create a new account, redirecting to the main application on success.

#### Scenario: Unauthenticated User visits root
- **WHEN** an unauthenticated user visits `/`
- **THEN** they are directed to the login page first.

#### Scenario: Successful Login
- **WHEN** a user successfully logs in
- **THEN** they are redirected to the Home page with their session registered.

#### Scenario: Navigation links between Auth Pages
- **WHEN** a user is on the Login page
- **THEN** there is a hyperlink to navigate to Account Registration, and vice versa.
