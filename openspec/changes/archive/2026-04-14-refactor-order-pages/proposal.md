## Why

The current order management system conflates two distinct workflows (creating new orders and viewing/managing existing orders) into a single codebase, resulting in unclear separation of concerns. Additionally, components make direct API client calls instead of delegating to hooks, violating the established pattern used elsewhere in the codebase (Menu.tsx, useMenuItems). The use of EntityForm (a modal-based generic component) for order creation is architecturally inappropriate since order creation requires a multi-step guided workflow on its own dedicated page, not a modal dialog.

## What Changes

- **Separate routes**: `/orders` becomes a list + modal detail view; `/orders/create` becomes a dedicated full-page form (not modal-based)
- **Hook-first API integration**: Remove all direct `tableApiClient`, `userApiClient`, `menuApiClient` imports from components and pages; all API calls delegated to hooks
- **Custom order form component**: Replace EntityForm with a lightweight `OrderFormCard` component designed specifically for inline order creation flow
- **Order detail modal**: New `OrderDetailModal` component for viewing and editing existing orders (table, waiter, status, line items)
- **Menu browsing in creation**: Integrate menu item selection into the CreateOrder page using a card-based layout (matching Menu.tsx patterns)
- **Enhanced OrderList UI**: Display table number, time elapsed (now - createdAt), and order status; single click opens modal detail view

## Capabilities

### New Capabilities
- `order-list-view`: Query, list, and display orders with filtering/status grouping; show table number, elapsed time, and status; click to view details
- `order-detail-modal`: Modal interface for viewing full order details, editing table/waiter/status, managing line items (add/edit/remove), and deleting orders
- `order-creation-flow`: Multi-step guided order creation on dedicated page: (1) select table & waiter, (2) browse and add menu items, (3) finish and redirect to list

### Modified Capabilities

## Impact

**Frontend Files**:
- `frontend/src/pages/viewOrder.tsx` – Refactored for list view + modal support
- `frontend/src/pages/createOrder.tsx` – Refactored for dedicated form page (no modal, no direct API imports)
- `frontend/src/components/OrderDetailModal.tsx` – New modal component
- `frontend/src/components/OrderFormCard.tsx` – New custom form component
- `frontend/src/hooks/useOrders.ts` – Enhanced with better state management

**No Backend Changes**: Existing `/order` endpoints and schemas remain unchanged

**Routes**: 
- `/orders` – OrderList (modal on row click)
- `/orders/create` – OrderCreate (full page form)
- **BREAKING**: No `/orders/{id}` route (details via modal instead)

**Dependencies**: TanStack Query, Beercss (already in use)
