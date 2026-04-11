## Why

The system currently lacks a dedicated UI page for administrators to manage users. This change introduces a new `/user` page that provides a comprehensive list of users with necessary filtering (by role), sorting, and in-line management capabilities (edit/delete) to improve administrative efficiency.

## What Changes

- Add a new `/user` frontend route to display the user management page.
- Implement reusable filter and sort dropdown components (using Beercss) designed with polymorphism or dependency injection for usage across multiple pages.
- Build a scrollable container listing users and their assigned roles.
- Add an expandable "meatball" menu (using the Beercss icon) on the top-right corner of each user role entry to facilitate edit and delete actions, similar to the `TableCard.tsx` structure.
- From the previous point, refactor the existing dropdown meatball menu logic inside `TableCard.tsx` into a standalone, reusable component, and re-use it.

## Capabilities

### New Capabilities
- `user-management-ui`: Defines the frontend requirements for the user management page, including listing, filtering, sorting, and user actions (edit/delete).

### Modified Capabilities
- No existing specs are being modified for this frontend-specific change.

## Impact

- **Frontend routing**: A new route `/user` will be added.
- **Components**: `TableCard.tsx` will be refactored to extract the dropdown. A set of new generic dropdown, filter, and sort components will be created.
- **Frontend Pages**: A new `User.tsx` (or similar) page will be created.
