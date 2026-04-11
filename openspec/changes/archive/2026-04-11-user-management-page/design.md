## Context

The current restaurant POS frontend lacks a dedicated user management UI. As an administrator, there is a need to browse, filter by role, sort, and manage (edit/delete) system users. The application primarily uses React, TypeScript, TanStack Query for API interactions, and Beercss for styling. Currently, a "meatball" menu with a dropdown for edit/delete functions exists inside `TableCard.tsx`, but it is coupled to that specific component.

## Goals / Non-Goals

**Goals:**
- Design and integrate a new `/user` page route.
- Establish a reusable pattern for filtering and sorting list components, leveraging Beercss dropdowns that can be used across multiple pages via dependency injection or polymorphic component design.
- Decouple and extract the existing "meatball" dropdown from `TableCard.tsx` into a standalone, reusable `ActionMenu` or `DropdownMenu` component.
- Display a scrollable list/grid container of users showing their roles.

**Non-Goals:**
- Modifying backend user management API endpoints (assumed to be pre-existing or covered by different scopes).
- Implementing new user roles or permissions logic beyond filtering the list by existing ones.

## Decisions

**1. Reusable Meatball Menu (`ActionMenu.tsx`)**
- **Decision**: Extract the `id` and specific action handlers from `TableCard.tsx`'s dropdown and create a generic `<ActionMenu options={...} />` component.
- **Rationale**: Reduces code duplication and ensures visual consistency across the new User list items and existing Table cards.
- **Alternative Considered**: Rebuilding a separate dropdown for the user page, which would violate DRY principles and increase maintenance overhead.

**2. Filter and Sort Controls (`ListControls.tsx` or separated Context)**
- **Decision**: Implement a generic abstraction for list controls comprising filter and sort dropdowns using Beercss elements. The component will accept properties/callbacks like `onFilterChange` and `onSortChange`, allowing the parent page (e.g., User page) to define the specific options (e.g., `[Admin, Staff, Manager]`, `[Ascending, Descending]`).
- **Rationale**: Satisfies the requirement to leverage polymorphism/dependency injection, allowing other pages to easily adopt the same UI controls.

**3. State Management**
- **Decision**: Encapsulate state logic within a custom hook (`src/hooks/useUser.ts`). This hook will manage the `filterRole` and `sortOrder` states, and handle the data fetching via TanStack Query. The `/user` page component will solely consume this hook.
- **Rationale**: Separates business and state management logic from UI components, improving testability, preventing component bloat, and adhering to clean architecture principles.

## Risks / Trade-offs

- **[Risk] Refactoring `TableCard.tsx` breaks its existing functionality.** 
  **Mitigation**: Implement the standalone `ActionMenu` component, migrate `TableCard.tsx` to use it, and manually verify (or run existing frontend tests) to ensure edit/delete hooks are still operating correctly before moving on to the User page implementation.
- **[Risk] Over-engineering the reusable Dropdowns.**
  **Mitigation**: Keep the API of the new filter/sort components and the ActionMenu strictly typed and minimal. Only support what is currently needed (text labels, icons, callbacks) rather than a fully dynamic render engine.