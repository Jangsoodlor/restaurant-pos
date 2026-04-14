## ADDED Requirements

### Requirement: User Registration Endpoint
The backend SHALL provide a registration endpoint that accepts user details and a plaintext password, hashes the password, and creates the user record.

#### Scenario: Successful Registration
- **WHEN** a valid registration payload is submitted
- **THEN** the system stores the user with a securely hashed password
- **AND** returns the created user details without exposing the password hash

### Requirement: User Login Endpoint
The backend SHALL provide a login endpoint that verifies user credentials and issues a JWT token.

#### Scenario: Successful Login
- **WHEN** valid credentials are provided
- **THEN** the system issues a short-lived JWT containing the user ID and role

#### Scenario: Invalid Credentials
- **WHEN** incorrect credentials (invalid username or password) are provided
- **THEN** the system returns a 401 Unauthorized error

### Requirement: Global Route Authentication
The backend SHALL require a valid JWT for accessing all endpoints.

#### Scenario: Protected Route Access
- **WHEN** an unauthenticated request is made to any endpoint
- **THEN** the system returns a 401 Unauthorized error

#### Scenario: Authenticated Route Access
- **WHEN** a request with a valid Bearer token is made
- **THEN** the system processes the request normally

### Requirement: Global Session State
The frontend SHALL securely maintain the authenticated user's session state (JWT, user ID, name, role) across page reloads.

#### Scenario: Session Persistence
- **WHEN** an authenticated user reloads the application
- **THEN** their session is restored and they remain logged in
