## Plan: Build view and create order pages

Me see you want order pages. Simple, no fancy code. Me use `EntityForm.tsx` and `DeleteDialog.tsx` like `Menu.tsx`. Code good, token small.

User Beercss in the frontend.

**Steps**
1. *Setup Hooks*: Make `useOrders.ts` and `useOrderLineItems.ts` to talk to backend.
2. *Build viewOrder*: Make `viewOrder.tsx`. Add "Ongoing" and "Completed" tabs. Filter `useOrders` data by status.
3. *Show details*: In `viewOrder.tsx`, show order list. Calculate time since `created_at`. Show user who make order.
4. *Build createOrder Form*: Make `createOrder.tsx`. Use `EntityForm` for main order (table, user). 
5. *Add Line Items*: In `createOrder.tsx`, list `OrderLineItems` for order. Use `EntityForm` to add/edit items. Use `DeleteDialog` to remove items.
6. *Routing*: Add path for `viewOrder.tsx` and `createOrder.tsx` in `App.tsx`.

**Relevant files**
- `frontend/src/hooks/useOrders.ts` — New file. Get `Order` data, filter by status.
- `frontend/src/pages/viewOrder.tsx` — Match `Menu.tsx` tab pattern. Group by `Ongoing` and `Completed` status.
- `frontend/src/pages/createOrder.tsx` — Use `EntityForm` and `DeleteDialog` for KISS editing.
- `frontend/src/App.tsx` — Map routes.

**Verification**
Use bun test to do unit tests.

1. Run app. Go to `/orders`. See empty list.
2. Go to `/orders/create`. Make new order. Add `OrderLineItems`.
3. Check `viewOrder.tsx` "Ongoing" tab. Verify time show correct, user name correct.
4. Mark order complete. Verify order move to "Completed" tab.

**Decisions**
- Keep things simple ("KISS"). No heavy custom form. Just reuse `EntityForm`.
- "Ongoing" tab = `DRAFT` or `OPEN`. "Completed" tab = `CLOSED` or `CANCELLED`.
- Time calculation use simple JS `Date.now() - new Date(order.created_at)`.
