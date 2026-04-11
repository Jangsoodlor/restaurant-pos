## Context

Currently, the frontend has table-specific CRUD components:
- `TableForm.tsx`: Handles table create/edit with hardcoded table fields (tableName, capacity, status)
- `TableDeleteDialog.tsx`: Delete confirmation dialog with "table" branding
- `useTable.ts`: Complete CRUD mutations (create, update, delete)
- `useUser.ts`: Only delete mutation; no create/update yet

User Management uses primitive browser dialogs (`confirm()`, `alert()`) instead of structured components. Dialog components are tightly coupled to table operations, forcing duplication when adding User CRUD or future admin pages.

## Goals / Non-Goals

**Goals:**
- Extract a generic delete dialog component (`DeleteDialog.tsx`) usable by any CRUD entity
- Refactor `TableForm` into a polymorphic form component using dependency injection for entity-specific fields/validation
- Implement create/update/delete mutations for users in `useUser.ts` (mirroring `useTable.ts` pattern)
- Replace primitive dialogs in User Management page with structured, reusable components
- Establish pattern for future CRUD entities (minimal effort to add more admin pages)

**Non-Goals:**
- Changing Table Status or User Management pages' UX/API behavior
- Modifying backend APIs or data models
- Creating a comprehensive entity framework (keep it simple and pragmatic)
- Supporting nested or complex form relationships

## Decisions

### Decision 1: Generic Delete Dialog Component
**What:** Create `DeleteDialog.tsx` accepting entity name as a parameter  
**Why:** Both tables and users need identical delete confirmation UX. Generic component eliminates duplication.  
**Props:**
- `itemName`: string (e.g., "Table 5", "John Doe")
- `isPending`: boolean
- `errorMessage?: string`
- `onConfirm(): void`
- `onCancel(): void`  
**Rationale:** Matches `TableDeleteDialog` structure but removes table-specific branding. Entity type is implicit in `itemName` phrasing.

### Decision 2: Polymorphic Form via Dependency Injection
**What:** Rename `TableForm` → `EntityForm` (or `ResourceForm`), accept field descriptor + validator functions  
**Why:** Avoids code duplication for create/update UX. Single form handles tables, users, and future entities.  
**Architecture:**
```tsx
type FormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required?: boolean;
  options?: { label: string; value: string }[];
  validate?: (value: any) => string | null;
};

type EntityFormProps = {
  mode: 'creating' | 'editing';
  fields: FormField[];
  values: Record<string, any>;
  isLoading: boolean;
  errorMessage?: string | null;
  title: string;
  onValuesChange: (values: Record<string, any>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};
```
**Rationale:** Field descriptors define entity shape. Parent components (tableStatus.tsx, User.tsx) inject field configs. Form remains dumb; every entity customization lives in page/hook layer.

### Decision 3: User Mutations in useUser Hook
**What:** Add `useCreateUser`, `useUpdateUser`, `useDeleteUser` to `useUser.ts` (matching `useTable.ts` pattern)  
**Why:** Consistency. Each hook exports all CRUD ops; pages call the hook and handle UI/forms.  
**Signature:** Same structure as table mutations—accept object with mutationFn, onSuccess cache invalidation.  
**User Type:** Will use API-generated `User` and `UserBase`/`UserUpdate` types from stub.

### Decision 4: Component Naming
**What:** Rename `TableForm` → `EntityForm`  
**Why:** Clearer intent; removes table-specific bias. More intuitive for future developers.  
**Alternatives considered:** `ResourceForm`, `CRUDForm`, `FormTemplate` — `EntityForm` is concise and semantically clear.

### Decision 5: Migration Strategy
**Step 1:** Create `DeleteDialog.tsx`  
**Step 2:** Add User mutations to `useUser.ts` (no breaking changes to existing delete)  
**Step 3:** Rename/refactor `TableForm` → `EntityForm` 
**Step 4:** Update `tableStatus.tsx` to use `EntityForm` + `useTable` hooks  
**Step 5:** Update `User.tsx` to use `EntityForm` + new User mutations + `DeleteDialog`  
**Step 6:** Remove old `TableDeleteDialog.tsx`

This sequence keeps Table Status working throughout; User Management UX improves at step 5.

## Risks / Trade-offs

**[Risk]** If field descriptor approach is too flexible, form becomes too generic and loses semantic clarity  
**[Mitigation]** Provide concrete field configs in each page/hook; form is dumb by design. Keep validators simple (string error only).

**[Risk]** User mutations might not match all future entity CRUD patterns  
**[Mitigation]** Decisions are pragmatic for tables + users; if a third entity has very different patterns, revisit then. YAGNI applies.

**[Risk]** TypeScript types for generic form values become loosely typed (`Record<string, any>`)  
**[Mitigation]** Parent components are responsible for type safety; they know their entity shape and validate/cast accordingly.

**[Risk]** Renaming `TableForm` → `EntityForm` requires updating imports in `tableStatus.tsx`  
**[Mitigation]** Single rename, straightforward update. Low impact.

## Open Questions

1. **Exact user deletion UX?** Should delete show the user's name or ID? (Proposal: show name, e.g., "John Doe")
2. **Form validation strategy?** Per-field errors or single error message? (Proposal: single error for simplicity; backend provides detail)
3. **Field constraints module location?** Should field configs live in page component or separate `formConfigs.ts`? (Proposal: co-locate with page for now; extract if patterns emerge)
