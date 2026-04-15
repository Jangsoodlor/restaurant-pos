## Why

Currently, all authenticated users see the same interface controls regardless of their role (cook, waiter, manager). This violates the principle of least privilege — cooks should not see user management, and waiters should have limited editing capabilities. We need to enforce role-based access control (RBAC) on the frontend to provide role-appropriate UIs and prevent unauthorized operations.

## What Changes

- **User Management page** is now restricted to managers only. Non-managers attempting to access `/user` will see an "Access Denied" message.
- **Create buttons** are hidden from cooks and waiters on Table Status and Menu pages (visible for managers only).
- **Delete controls** (in action menus) are hidden from waiters on Table Status (visible only to managers).
- **Table editing** for waiters is restricted to **status field only** — they cannot modify table name or capacity.
- **Navigation** conditionally shows/hides the User Management link based on the user's role.

## Capabilities

### New Capabilities
- `frontend-role-based-access-control`: Implements centralized role-based UI policy engine for controlling page access, action visibility, and field editability based on user role.

### Modified Capabilities
- None. This is a new frontend feature that complements existing authentication (`user-auth-1`).

## Impact

**Code changes:**
- `AuthContext`: Extended to store decoded user data (id, name, role)
- 3 pages affected: `tableStatus.tsx`, `Menu.tsx`, `User.tsx`
- `ActionMenu` component refactored for role-aware visibility
- New utility module: `src/utils/permissions.ts` (centralized permission schema)
- New router wrapper for role-gated page access

**User experience:**
- Cooks see read-only interface on Table Status and Menu pages
- Waiters see limited editing (status only) on Table Status, no access to User Management
- Managers see full CRUD functionality as before
- Non-managers trying to access User Management via URL get immediate feedback

**No backend changes required** — role information already flows through JWT tokens.
