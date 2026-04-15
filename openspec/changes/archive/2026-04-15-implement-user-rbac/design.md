## Context

The frontend currently authenticates users via JWT tokens stored in `AuthContext`, but doesn't expose the user's role information to components. The JWT payload includes user `id`, `name`, and `role`, but this data is only accessible by manually decoding the token in individual components.

Three pages need role-based UI restrictions:
1. **User Management** (`/user`): manager-only access
2. **Table Status** (`/tables`): cook is read-only, waiter can edit status field only, manager has full CRUD
3. **Menu** (`/menu`): cook/waiter are read-only, manager has full CRUD

Additionally, `ActionMenu` component (used for edit/delete actions) needs to be permission-aware to hide/disable actions based on role.

## Goals / Non-Goals

**Goals:**
- Enforce role-based UI visibility across pages (hide/show controls, disable actions)
- Restrict page access (404/AccessDenied for unauthorized navigation)
- Implement a centralized, auditable permission schema
- Enable role-aware field editability (e.g., waiter can only edit status field in forms)
- Minimize prop-drilling by storing user role in context

**Non-Goals:**
- Backend endpoint protection (already secured by JWT dependency in FastAPI)
- Complex permission inheritance or hierarchies (3 flat roles only)
- Dynamic role/permission management from database
- Permission caching or async role loading

## Decisions

### Decision 1: Extend AuthContext to store decoded user data

**Choice**: Parse JWT token in `AuthContext` and store `{ id, name, role }` as `user` property alongside `token`.

**Rationale:**
- Centralized decoding prevents duplication across components
- Components avoid repeated parsing overhead (`useMemo` in every component)
- Single source of truth for user state
- Easy to test (mock `useAuth()` once, all role checks work)
- Natural fit: `useAuth()` already returns auth state, so including user info is consistent

**Alternatives considered:**
- A: Decode on-demand in each component (`useCurrentUser()` hook) — simpler setup but scattered logic, repeated parsing
- B: Store only token, let each component decode — minimal context changes but poor DX and testability
- **Chosen: A-like approach but centralized in context** ✓

**Implementation:**
```tsx
export interface CurrentUser {
  id: number;
  name: string;
  role: 'cook' | 'waiter' | 'manager';
}

export interface AuthContextType {
  token: string | null;
  user: CurrentUser | null;    // NEW
  isAuthenticated: boolean;
  login(token: string): void;
  logout(): void;
}
```

Decode token on login and page reload.

---

### Decision 2: Centralized permission schema in `src/utils/permissions.ts`

**Choice**: Create a single permission module that exports:
- A permission matrix (object mapping pages/actions to allowed roles)
- Helper functions (`canAccessPage()`, `canCreateItem()`, `canEditField()`, etc.)

**Rationale:**
- All permission rules in one file — easy to audit and modify
- No cascading permission checks throughout codebase
- Type-safe helpers prevent typos
- Business logic isolated from UI logic

**Alternatives considered:**
- A: Inline role checks in each component (e.g., `role === 'manager'`) — scattered, hard to audit
- B: Permission decorators or middleware — over-engineered for 3 roles
- **Chosen: Centralized utility module** ✓

**Implementation structure:**
```tsx
// src/utils/permissions.ts

export const PERMISSIONS = {
  pages: {
    user: ['manager'],
    tableStatus: ['cook', 'waiter', 'manager'],
    menu: ['cook', 'waiter', 'manager'],
  },
  actions: {
    tableStatus: {
      create: ['manager'],
      edit: ['waiter', 'manager'],
      delete: ['manager'],
    },
    menu: {
      create: ['manager'],
      edit: ['manager'],
      delete: ['manager'],
    },
  },
  fields: {
    tableStatus: {
      id: [],  // non-editable
      tableName: ['manager'],
      capacity: ['manager'],
      status: ['waiter', 'manager'],
    },
  },
};

export function canAccessPage(pageName: string, role: string | null): boolean {
  if (!role) return false;
  return PERMISSIONS.pages[pageName]?.includes(role) ?? false;
}

export function canCreate(page: string, role: string | null): boolean {
  if (!role) return false;
  return PERMISSIONS.actions[page]?.create?.includes(role) ?? false;
}

export function canDelete(page: string, role: string | null): boolean {
  if (!role) return false;
  return PERMISSIONS.actions[page]?.delete?.includes(role) ?? false;
}

export function canEditField(page: string, field: string, role: string | null): boolean {
  if (!role) return false;
  return PERMISSIONS.fields[page]?.[field]?.includes(role) ?? false;
}
```

---

### Decision 3: Implement page-level access control via conditional routing

**Choice**: Modify `App.tsx` routing to check role before rendering restricted pages. Render `AccessDenied` component if user lacks permission.

**Rationale:**
- Prevents navigation to restricted pages
- Clear separation between public routes (login/register) and role-restricted routes
- Reuses existing `AccessDenied` component
- Centralized in one place (App.tsx)

**Implementation:**
```tsx
// App.tsx
<Route path="/user" component={
  isAuthenticated && canAccessPage('user', user?.role) 
    ? UserManagementPage 
    : AccessDenied
} />
```

Alternatively, create a `ProtectedRoute` wrapper:
```tsx
<ProtectedRoute 
  path="/user" 
  requiredPage="user" 
  component={UserManagementPage} 
/>
```

---

### Decision 4: Conditional UI rendering in components

**Choice**: Use role from `useAuth()` hook to conditionally render buttons, action menus, and form fields.

**Rationale:**
- Components stay self-contained (don't rely on parent to hide things)
- Easy to reason about: "if manager, show this button"
- Matches React patterns (conditional renders)

**Implementation patterns:**
```tsx
// Conditionally render create button
{canCreate('menu', user?.role) && <button>Create Item</button>}

// Conditionally hide action menu options
if (canDelete('tableStatus', user?.role)) {
  showDeleteOption = true;
}
```

---

### Decision 5: Field-level editability in forms

**Choice**: For pages with field-level restrictions (tables: waiter can only edit status), disable form fields conditionally based on role.

**Rationale:**
- Users see which fields exist but can't modify them (better UX than hiding fields)
- Form state management unchanged
- Clear visibility of system constraints

**Implementation:**
```tsx
// In tableStatus edit form
<input
  name="tableName"
  disabled={!canEditField('tableStatus', 'tableName', user?.role)}
  value={formValues.tableName}
  onChange={handleChange}
/>
```

---

### Decision 6: Update ActionMenu component for permission-aware visibility

**Choice**: Modify `ActionMenu` to accept optional `onDelete` callback; if `onDelete` is falsy, hide delete button.

**Rationale:**
- Minimal invasive change to existing component
- Caller controls what actions are available
- Easily extensible (can add `onEdit` condition in future)

**Implementation:**
```tsx
// ActionMenu.tsx
export function ActionMenu({ 
  onEdit: () => void; 
  onDelete?: () => void;  // Optional now
  disabled?: boolean; 
}) {
  return (
    (<details>
      {/* ... menu header ... */}
      <menu className="dropdown right">
        <button onClick={onEdit} disabled={disabled}>
          <i>edit</i>
        </button>
        {onDelete && (
          <button onClick={onDelete} disabled={disabled} className="error-text">
            <i>delete</i>
          </button>
        )}
      </menu>
    </details>)
  );
}
```

Usage:
```tsx
<ActionMenu
  onEdit={() => { /* ... */ }}
  onDelete={canDelete('tableStatus', user?.role) ? () => { /* ... */ } : undefined}
/>
```

---

### Decision 7: Hide User Management nav link for non-managers

**Choice**: Conditionally render the User Management link in `App.tsx` navigation based on role.

**Rationale:**
- UX clarity: users don't see a link they can't access
- Reduces user confusion
- Handles both the route guard (RouteSwitch) and nav visibility in one place

**Implementation:**
```tsx
{canAccessPage('user', user?.role) && (
  <Link href="/user">User Management</Link>
)}
```

---

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Role data out of sync with token** — If JWT is refreshed and role changes mid-session, context won't update immediately | Decode token on each login; on page reload, re-decode from storage. If fine-grained role changes needed, fetch current user from endpoint on app init. |
| **Permission matrix becomes inconsistent** — If a new page/action is added but PERMISSIONS object isn't updated, permission checks fail silently | Document PERMISSIONS clearly; require permission schema updates in PR reviews; consider exporting a list of permission keys for TypeScript exhaustiveness checking. |
| **Malformed JWT doesn't fail gracefully** — If `parseJwt()` throws, app could crash | Wrap parsing in try-catch; default to `user = null` on parse failure; show login error. |
| **Performance: repeated permission checks** — Multiple components calling `canAccessPage()` etc. repeatedly | Helpers are pure functions (no external dependencies), so browser/V8 can optimize. If bottleneck emerges, memoize at component level with `useMemo`. |
| **Frontend-only enforcement** — User could bypass UI restrictions (e.g., POST to delete endpoint directly) | This is **not a risk** because backend already enforces auth via JWT dependency in FastAPI. Frontend RBAC is UX only. |
| **Role-based decisions in components reduce testability** — Tests need to mock `useAuth()` return value | Is actually **good**: encourages mocking in tests, prevents brittle integration tests. |

---

## Migration Plan

**Phase 1: Infrastructure (non-breaking)**
1. Extend `AuthContext` to decode and store user data (add `user` property alongside `token`)
2. Ensure token restoration on page reload re-decodes user
3. Backward compatible: existing code using `token` and `isAuthenticated` still works

**Phase 2: Permission system (non-breaking)**
1. Create `src/utils/permissions.ts` with PERMISSIONS matrix and helpers
2. Add tests for permission helpers
3. No component changes yet

**Phase 3: Page access control (apply to User.tsx first, highest risk)**
1. Conditionally render User Management page in App.tsx routing
2. Conditionally hide nav link
3. Test navigation and AccessDenied behavior

**Phase 4: Component visibility (Table Status)**
1. Hide create button for cook/waiter
2. Make ActionMenu permission-aware (hide delete for waiter)
3. Disable non-editable fields in edit form
4. Test form state and interactions

**Phase 5: Component visibility (Menu)**
1. Hide create buttons for cook/waiter
2. Hide action menus for cook/waiter
3. Test read-only viewing

**Rollback strategy:**
- If permission logic is buggy, revert `App.tsx` routing changes to use `isAuthenticated` only (removes role checks)
- Users see all controls again (pre-RBAC behavior) until fix is deployed

---

## Open Questions

1. **JWT refresh during session** — Does backend refresh tokens? If yes, should we re-decode on background refresh events to catch role changes?
2. **Future: fine-grained permissions** — If more roles (e.g., "shift_manager", "admin") are added, should we use a permission system like "can:edit:tables" instead of role lists?
3. **Waiter table editing scope** — Can waiter see the full table details (name, capacity) while editing status, or should we hide those fields entirely?
4. **Cook read-only**: When cook views Menu/Tables, do we want a visual indicator they're in "read-only mode", or just the absence of action buttons is sufficient?
