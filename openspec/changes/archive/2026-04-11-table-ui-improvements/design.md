## Context

The current Table Status UI is a monolithic React component housed in `frontend/src/pages/tableStatus.tsx`. It suffers from poor spatial organization: table names overflow their containers, action buttons ("Edit", "Delete") take up too much valuable screen real estate, and there are no immediate visual cues (like color coding) for table availability. Additionally, keeping the API logic, table cards, creating/editing forms, and delete confirmation dialogs in a single file makes the code harder to read and maintain.

## Goals / Non-Goals

**Goals:**
- Modularize the UI by separating concerns into distinct, reusable React components under `src/components/`.
- Introduce a visual hierarchy with color-coded table cards representing the table's status (Green for Available, Red for Occupied, Yellow for Reserved).
- Implement a cleaner interaction model for "Edit" and "Delete" operations using a compact hamburger menu on each card.
- Add better padding and spacing to prevent text overflow and create a polished look for all sub-components.

**Non-Goals:**
- Modifying backend endpoints, database schema, or TanStack query hook implementations (`useTable.ts`).
- Introducing new table management operational flows (e.g., merging or transferring tables).

## Decisions

**Component Architecture:**
We will refactor `tableStatus.tsx` to act strictly as a container/page component that manages the TanStack query data fetching and mutation coordination. The rendering logic will be delegated to new components:
- `TableCard`: A presentational component rendering the table info, applying the dynamic background color class, and containing the hamburger menu for actions.
- `TableForm`: A reusable form component for creating and editing tables, handling local validation before delegating the submit action back to the parent.
- `TableDeleteDialog`: A confirmation dialog for delete operations.
  
*Rationale*: This separation of concerns simplifies testing, makes styling adjustments localized, and prepares the UI for potential future feature additions where these components might be reused.

**Styling Approach:**
We will leverage Beercss helper classes for coloring (`green`, `red`, `yellow`) and spacing, and possibly some minor inline or custom CSS classes if more specific structural padding is needed, ensuring text overflow is gracefully handled.

## Risks / Trade-offs

- **Risk: Prop drilling and state mismatch:** Breaking a single component into multiple means state (like `selectedTableId`, `mode`) and handlers must be passed down safely.
  *Mitigation:* Utilize strict TypeScript interfaces for component props to guarantee all necessary data and event callbacks (`onEdit`, `onDelete`, `onSubmit`, `onCancel`) are correctly integrated and type-checked during compile time.
