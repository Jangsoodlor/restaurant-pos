# User Authorisation: Part 1

There are 3 roles (as defined in `/src/api/stub/models/Role.ts`): waiter, cook, manager
I want to create role-based access control in the frontend for the following pages

## pages/tableStatus.tsx
1. cook: Can only view table (hide the meatball menu and create button completely)
2. waiter: Can view all tables, and update table status (hide the create button, and disable/hide the delete button in the meatball menu)
3. manager: Keep the full CRUD functionality as-is.

## pages/Menu.tsx:
1. cook and waiter: can only view and filter menus (hide the meatball menu and create button completely)
2. manager: Keep the full CRUD functionality as-is.

## page/User.tsx:
1. Hide this page to everyone EXCEPT manager
2. If cook or waiter tried to access it using the url, show the access denied page.
3. Remove the "Create user" button from the page.
4. Keep the full CRUD functionality for the manager as-is

DO NOT touch the other pages.