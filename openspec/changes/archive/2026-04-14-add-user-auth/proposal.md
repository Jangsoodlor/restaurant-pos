## Why

We need to secure the Restaurant POS endpoints to ensure that only authorized personnel (cooks, managers, waiters) can access specific actions and data. This requires an authentication system that allows users to create accounts, log in, and maintain secured sessions while using the system.

## What Changes

- **BREAKING**: Add a hashed password field to the `User` model, using the existing `name` field as the unique identifier (username) for logging in, keeping the model simple.
- Add registration, login, and logout endpoints (e.g., `/user/register`, `/user/login`, and potentially `/user/logout`).
- **BREAKING**: Secure all backend endpoints to require valid JWT credentials. No endpoints will remain public.
- Create new frontend pages for Login and Account Creation (Registration) that redirect to each other.
- Implement global frontend state to store the authenticated session (JWT, user ID, name, role).
- Auto-redirect unauthenticated visitors attempting to access secured routes back to the Login page.
- Update `client.ts` to attach the JWT to outgoing API requests.
- Update frontend and backend tests to handle authentication flows and headers.

## Capabilities

### New Capabilities
- `user-auth`: Full-flow authentication covering registration, login, logout, password hashing, JWT generation, and session management across the stack.

### Modified Capabilities
- `user-crud-operations`: Modification of the `user` backend schema and endpoints to handle password storage, token issuance, and hiding credentials from API responses.
- `user-management-ui`: Addition of Login/Registration pages and restructuring the app routing to enforce authentication guards.

## Impact

- **Database**: An Alembic migration is needed to add the password hash column to the `User` table.
- **Backend APIs**: A JWT verification dependency will be injected globally across all FastAPI routers (`menu_router`, `order_router`, `user_router`, `table_router`).
- **Frontend App**: `App.tsx` will be restructured to hold session state and guard routes; API client wrappers will require headers.
- **Testing**: End-to-end impact on tests. All backend tests (`test_order.py`, `test_table.py`, etc.) will need to be refactored to authenticate before making requests. Frontend components will need context wrapping for auth states.