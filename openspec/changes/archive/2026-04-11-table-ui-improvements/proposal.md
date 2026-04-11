## Why

The current Table Status UI is cluttered, poorly spaced, and functionally cramped due to having all components in a single file. Improving the visual hierarchy with color-coded statuses, better padding, and a hamburger menu for actions will make it more intuitive for users, while refactoring the code into distinct components will improve maintainability.

## What Changes

- Move the "Edit" and "Delete" action buttons into a hamburger menu on the top right of each table card.
- Apply semantic background colors to table cards based on their status (Green for Available, Red for Occupied, Yellow for Reserved).
- Add sufficient padding to the table cards to prevent the table name from overflowing.
- Add padding to the "Edit Table" form for a better visual layout.
- **BREAKING** (Internal): Refactor `tableStatus.tsx` by extracting the forms, dialogs, and table cards into separate reusable components under `/src/components/`.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `table-management`: Added requirement for visual status indicators (color-coded cards) and modified the action menu interaction pattern (hamburger menu).

## Impact

- `frontend/src/pages/tableStatus.tsx`: Will be heavily refactored.
- `frontend/src/components/*`: New directory and component files will be created for the table card, create/edit form, and delete confirmation dialog.
