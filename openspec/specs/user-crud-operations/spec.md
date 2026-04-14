# user-crud-operations Specification

## Purpose
TBD - created by archiving change consolidate-dialog-components. Update Purpose after archive.
## Requirements
### Requirement: User create mutation hook
The system SHALL provide `useCreateUser` hook in `useUser.ts` that accepts user data (including `password` in the payload) and creates a new user via the API. The hook SHALL invalidate the users query cache on success.

#### Scenario: Create user with valid data
- **WHEN** `useCreateUser` mutation is called with `{name: "Alice", role: "waiter", password: "password123"}`
- **THEN** API call is made to create user and users cache is invalidated

#### Scenario: Create user handles error
- **WHEN** API returns error (e.g., duplicate name)
- **THEN** mutation error state contains error information accessible to calling component

#### Scenario: Create user shows loading state
- **WHEN** `useCreateUser` mutation is in progress
- **THEN** `isPending` state is true

### Requirement: User update mutation hook
The system SHALL provide `useUpdateUser` hook in `useUser.ts` that accepts user ID and update data, calls the API to update the user, and invalidates the users cache on success.

#### Scenario: Update user with valid data
- **WHEN** `useUpdateUser` mutation is called with `userId: 5` and `{name: "Bob Smith", role: "cook"}`
- **THEN** API call is made to update user and users cache is invalidated

#### Scenario: Update user handles error
- **WHEN** API returns error (e.g., user not found)
- **THEN** mutation error state contains error information

#### Scenario: Update user shows loading state
- **WHEN** `useUpdateUser` mutation is in progress
- **THEN** `isPending` state is true

### Requirement: User delete mutation hook (enhanced)
The existing `useDeleteUser` (currently `deleteUser`) export SHALL be properly named in hook return object. The hook already exists but SHALL be documented for consistency with new mutations.

#### Scenario: Delete user executes mutation
- **WHEN** `deleteUser` is called with `userId: 3`
- **THEN** API delete call executes and users cache is invalidated

### Requirement: User mutation signatures match table mutation patterns
All three user mutations (create, update, delete) SHALL follow the same TanStack Query `useMutation` pattern as `useTable` hooks for consistency.

#### Scenario: Mutations use consistent API
- **WHEN** using `useCreateUser`, `useUpdateUser`, `useDeleteUser`
- **THEN** all three have signature: `useMutation({ mutationFn, onSuccess })` and return `{ mutate, isPending, error }`

### Requirement: Update base API routing to attach tokens
The `client.ts` API wrapper SHALL extract the user's active JWT from the global store and attach it as an `Authorization` Bearer token to all outgoing requests.

#### Scenario: Authenticated fetch
- **WHEN** the `client.ts` client is used to make a request
- **THEN** an `Authorization: Bearer <token>` header is added to the request headers

