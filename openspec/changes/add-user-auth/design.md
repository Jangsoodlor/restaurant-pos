## Context

Currently, the Restaurant POS application runs without authentication, allowing any user to hit any endpoint. As the system evolves to support specific roles (cooks, managers, waiters), we need to identify the active user to secure operations. The backend is built with FastAPI and SQLModel, and the frontend uses React and Bun. We will build an initial authentication and session management layer to enforce valid user access. 

## Goals / Non-Goals

**Goals:**
- Add password management (hashing, verifying) securely to the backend without altering the username paradigm (using the `name` column as the username).
- Implement standard registration and login endpoints that issue JWTs.
- Secure all endpoints via FastAPI dependencies (no public endpoints).
- Update the frontend app to store and attach JWTs to API requests automatically.
- Provide a Login and Registration UI that redirects unauthenticated users automatically.
- Refactor existing backend and frontend tests to handle the new authenticated state requirements.

**Non-Goals:**
- Full Role-Based Access Control (RBAC). In this iteration, we only care that a user is *authenticated* via a valid JWT, not whether their specific role is *authorized* for a given action. RBAC will be implemented in a subsequent iteration.
- Token blacklisting or complex refresh-token rotation strategies. Simple JWT expiration is sufficient for this stage.

## Decisions

1. **Password Hashing Strategy**: Use `passlib` with `bcrypt` for hashing new passwords and verifying login credentials. The `User` model will be modified to include a `password_hash` string. The `password_hash` will be excluded from the basic response schemas (like `UserRead`) to prevent leakage.
2. **Token Management (JWT)**: We will use the `python-jose` library to encode and decode JSON Web Tokens. The token payload will include the user `sub` (the user's string ID) and their `role`. 
3. **Route Security**: We will use FastAPI's dependency injection (`Depends`) at the router level. `oauth2_scheme` will extract the Bearer token, which our dependency will decode to verify the user. There will be no public routes.
4. **Frontend Architecture**: 
   - A React Context (or a small centralized store using `localStorage`) will securely retain the active JWT and basic user data across page reloads.
   - `client.ts` will be updated to read this token and attach an `Authorization: Bearer <token>` header to all outgoing `fetch` operations.
   - Using Wouter, we will construct a protected route wrapper or handle 401 interceptors to bounce unauthenticated traffic back to `/login`.
5. **Testing Modifications**: For backend tests (Pytest), a helper fixture will generate a temporary user, log them in, and attach the authorization token to the `TestClient` for all secured API calls.

## Risks / Trade-offs

- **Risk**: Test Suite breakages due to mandatory token requirements.
  - **Mitigation**: Introduce a centralized test fixture (`auth_client`) that mimics an authenticated session, replacing the default `client` in the existing tests with minimal refactoring overhead.
- **Risk**: Password hash leakage via `/user/` CRUD endpoints.
  - **Mitigation**: Ensure strict adherence to Pydantic separation of inputs (`UserCreate` containing `password`) vs. responses (`UserRead` excluding `password_hash`).
- **Risk**: Storing JWT in `localStorage` in the frontend can expose it to XSS.
  - **Mitigation**: Acceptable trade-off for current scope. If security dictates, we can move to `HttpOnly` cookies eventually, but `localStorage` provides a simpler client implementation phase for this iteration.