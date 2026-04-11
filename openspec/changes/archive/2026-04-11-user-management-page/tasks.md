## 1. Components Refactoring & Creation

- [x] 1.1 Extract `ActionMenu` component from `TableCard.tsx` into `src/components/ActionMenu.tsx`. Replace meatball logic in `TableCard.tsx`.
- [x] 1.2 Create reusable select/dropdown component `src/components/ListControls.tsx` (using Beercss) for filtering by role and sorting direction.
- [x] 1.3 Ensure `TableCard.tsx` continues to function correctly without regression.

## 2. Hooks and State Management

- [x] 2.1 Update/expand `src/hooks/useUser.ts` custom hook to export users, maintaining local states for `filterRole` and `sortOrder`.
- [x] 2.2 Wire TanStack Query in `useUser.ts` to fetch lists and apply client-side filtering/sorting over the acquired data.

## 3. Page Implementation

- [x] 3.1 Create new page `src/pages/User.tsx` container for the user lists.
- [x] 3.2 Place `ListControls` component at the top of `User.tsx` and map them to `filterRole` and `sortOrder` returned from `useUser.ts`.
- [x] 3.3 Render a scrollable list inside `User.tsx` to iterate over sorted/filtered users.
- [x] 3.4 Append `ActionMenu.tsx` onto each user row inside `User.tsx` allowing for Edit/Delete interactions.

## 4. Final Integration

- [x] 4.1 Update `src/frontend.tsx` or related root router configurations mapping `/user` path down to the newly created `User.tsx` component.
- [x] 4.2 Validate responsive Beercss layout on `/user`.
- [x] 4.3 Verify list filtering, sorting, and user dropdown capabilities interact smoothly.