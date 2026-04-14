## MODIFIED Requirements

### Requirement: User create mutation hook
The system SHALL provide `useCreateUser` hook in `useUser.ts` that accepts user data (including password in the payload) and creates a new user via the API. The hook SHALL invalidate the users query cache on success.

#### Scenario: Create user with valid data
- **WHEN** `useCreateUser` mutation is called with `{name: "Alice", role: "waiter", password: "password123"}`
- **THEN** API call is made to create user and users cache is invalidated

#### Scenario: Create user handles error
- **WHEN** API returns error (e.g., duplicate name)
- **THEN** mutation error state contains error information accessible to calling component

#### Scenario: Create user shows loading state
- **WHEN** `useCreateUser` mutation is in progress
- **THEN** `isPending` state is true

## ADDED Requirements

### Requirement: Update base API routing to attach tokens
The `client.ts` API wrapper SHALL extract the user's active JWT from the global store and attach it as an `Authorization` Bearer token to all outgoing requests.

#### Scenario: Authenticated fetch
- **WHEN** the `client.ts` client is used to make a request
- **THEN** an `Authorization: Bearer <token>` header is added to the request headers
