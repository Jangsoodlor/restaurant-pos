## Context

The current table status page is read-only and displays table name and status fetched through `useTables`. Restaurant operations need table administration in the same workflow so staff can add new tables, correct existing table metadata, and remove obsolete tables without moving to another page. The backend already exposes REST endpoints for table resources, so this change focuses on frontend integration and interaction design.

## Goals / Non-Goals

**Goals:**
- Enable create table action from the table status page.
- Enable update table action for an existing table from the table status page.
- Enable delete table action with explicit confirmation.
- Keep UI state consistent by refreshing table data after successful mutations.
- Present clear pending/error/success feedback for mutation operations.

**Non-Goals:**
- Redesign global routing or add a dedicated table administration page.
- Introduce backend schema or endpoint changes.
- Modify generated OpenAPI client code under `frontend/src/api/stub`.

## Decisions

1. Use existing API client operations for table create/update/delete.
- Rationale: Avoids backend changes and keeps frontend aligned with current API contract.
- Alternative considered: Add new backend composite endpoint for batch table management. Rejected because scope is UI-focused and existing endpoints already satisfy CRUD needs.

2. Keep CRUD interactions in `tableStatus.tsx` with local UI state plus query invalidation.
- Rationale: The request explicitly targets completion of this page and keeps interaction latency low.
- Alternative considered: Build a separate modal manager component tree and route-level state. Rejected for added complexity without clear reuse.

3. Use mutation hooks (TanStack Query style) and invalidate/refetch table query after successful mutations.
- Rationale: Provides predictable data consistency and leverages existing query infrastructure.
- Alternative considered: Optimistic local array patching only. Rejected due to higher risk of divergence with server truth.

4. Require destructive-action confirmation before delete submission.
- Rationale: Prevents accidental table removal in operational environments.
- Alternative considered: Immediate delete on button click with undo toast. Rejected because undo support is not currently established.

## Risks / Trade-offs

- [Risk] Multiple inline forms can increase page complexity and confusion. -> Mitigation: Use explicit mode states (create/edit/idle) and clear action boundaries.
- [Risk] Mutation race conditions could briefly show stale status cards. -> Mitigation: Disable action buttons during pending mutations and refetch after completion.
- [Risk] API validation errors may be opaque to users. -> Mitigation: Map server error messages to visible inline alerts.

## Migration Plan

- Deploy frontend changes without backend migration.
- Rollout is backward-compatible because it only consumes existing endpoints.
- Rollback strategy: revert frontend commit; read-only table status remains functional.

## Open Questions

- Should table status be editable as part of update, or restricted to table naming/metadata only?
- Is hard delete acceptable for table records already tied to historical orders, or should UI block deletion based on backend response?
