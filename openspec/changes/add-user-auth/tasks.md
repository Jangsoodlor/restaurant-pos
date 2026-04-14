## 1. Backend Auth Core

- [x] 1.1 In `backend` directory, run `uv add passlib[bcrypt] python-jose python-multipart` to install auth packages.
- [x] 1.2 In `backend/config.py`, add `SECRET_KEY` and `ALGORITHM` configuration for JWT. Keep the actual secret key in the `.env.dev` file.
- [x] 1.3 In `backend/user/models.py`, add `password_hash: str` to the `User` model table.
- [x] 1.4 In `backend/user/models.py`, create `UserCreate` schema with `name`, `role`, and `password` fields.
- [x] 1.5 In `backend/user/models.py`, create `UserRead` schema to return user details safely without exposing `password_hash`.
- [x] 1.6 In `backend/user/router.py`, update CRUD endpoints to use `UserRead` and `UserCreate` properly.
- [x] 1.7 Run `uv run --env-file .env.dev alembic revision --autogenerate -m "add password_hash to user"` in `backend` directory.
- [x] 1.8 Run `uv run --env-file .env.dev alembic upgrade head` in `backend` directory.
- [x] 1.9 Create `backend/user/auth_utils.py` (or similar). Add password hash/verify functions (`get_password_hash`, `verify_password`).
- [x] 1.10 In `backend/user/auth_utils.py`, add `create_access_token` function using `python-jose`.
- [x] 1.11 In `backend/user/router.py`, add `POST /user/register` endpoint. Hash password and save new user.
- [x] 1.12 In `backend/user/router.py`, add `POST /user/login` endpoint. Verify password and return JWT access token.

## 2. Backend Route Security

- [x] 2.1 Create `get_current_user` FastAPI dependency function to extract and verify the JWT from current requests.
- [x] 2.2 Inject `get_current_user` dependency into all FastAPI routers (`menu`, `order`, `user`, `table`).

## 3. Backend Testing

- [x] 3.1 Create `auth_client` fixture in Pytest (`conftest.py`) that acts as a logged-in user.
- [x] 3.2 Refactor all backend unit tests (`test_order.py`, `test_table.py`, `test_menu_items.py`, etc.) to use `auth_client` instead of `client` and update `test_user.py` for new registration/login rules.
- [x] 3.3 Run `make test` to ensure all BACKEND tests pass.

## 4. Manual API Sync

- [ ] 4.1 STOP. Wait for user to manually create/update `src/api/stub`. Do not continue to next tasks until user says "continue".

## 5. Frontend State & API

- [ ] 5.1 Build frontend Auth State (e.g., AuthProvider/Context or Zustand/Jotai) to store JWT and User details securely across reloads.
- [ ] 5.2 Update `frontend/src/api/client.ts` to inject `Authorization: Bearer <token>` into fetch requests.
- [ ] 5.3 Update `frontend/src/hooks/useUser.ts` (specifically `useCreateUser` and login hook) to handle password submission.

## 6. Frontend Authenticated UI

- [ ] 6.1 Build Login Page (`frontend/src/pages/Login.tsx`).
- [ ] 6.2 Build Account Creation / Registration Page (`frontend/src/pages/Register.tsx`). Include toggle links between both pages.
- [ ] 6.3 Update `frontend/src/App.tsx` routing. Apply protected route logic: bounce unauthenticated users from `/` or other routes to `/login`.

## 7. Frontend Testing

- [ ] 7.1 Update existing frontend tests to mock or provide authenticated state, fixing test breakages.
