/**
 * Centralized permission matrix and helpers for role-based access control
 * Defines what each role can do across pages and actions
 */

type Role = 'cook' | 'waiter' | 'manager';
type Page = 'user' | 'tableStatus' | 'menu';
type TableStatusField = 'tableName' | 'capacity' | 'status' | 'id';
type MenuItem = 'item' | 'modifier';

// 1. Define a type for your entire permissions matrix
type PermissionMatrix = {
  pages: Record<Page, Role[]>;
  actions: Partial<Record<Page, { create?: Role[]; edit?: Role[]; delete?: Role[] }>>;
  fields: Partial<Record<Page, Record<string, Role[]>>>;
};

// 2. Apply the type to your PERMISSIONS constant
export const PERMISSIONS: PermissionMatrix = {
  pages: {
    user: ['manager'],
    tableStatus: ['cook', 'waiter', 'manager'],
    menu: ['cook', 'waiter', 'manager'],
  },
  actions: {
    tableStatus: {
      create: ['manager'],
      edit: ['waiter', 'manager'],
      delete: ['manager'],
    },
    menu: {
      create: ['manager'],
      edit: ['manager'],
      delete: ['manager'],
    },
  },
  fields: {
    tableStatus: {
      id: [],  // non-editable
      tableName: ['manager'],
      capacity: ['manager'],
      status: ['waiter', 'manager'],
    } satisfies Record<TableStatusField, Role[]>, // Your satisfies block still works perfectly here!
  },
};
/**
 * Check if a role can access a specific page
 * @param pageName - The page identifier
 * @param role - The user's role (null if not authenticated)
 * @returns true if the role is allowed to access the page
 */
export function canAccessPage(pageName: string, role: Role | null): boolean {
  if (!role) return false;
  const allowedRoles = PERMISSIONS.pages[pageName as Page];
  return allowedRoles ? allowedRoles.includes(role) : false;
}

/**
 * Check if a role can create items on a specific page
 * @param page - The page identifier
 * @param role - The user's role (null if not authenticated)
 * @returns true if the role is allowed to create items
 */
export function canCreate(page: string, role: Role | null): boolean {
  if (!role) return false;
  const actions = PERMISSIONS.actions[page as Page];
  return actions?.create?.includes(role) ?? false;
}

/**
 * Check if a role can edit items on a specific page
 * @param page - The page identifier
 * @param role - The user's role (null if not authenticated)
 * @returns true if the role is allowed to edit items
 */
export function canEdit(page: string, role: Role | null): boolean {
  if (!role) return false;
  const actions = PERMISSIONS.actions[page as Page];
  return actions?.edit?.includes(role) ?? false;
}

/**
 * Check if a role can delete items on a specific page
 * @param page - The page identifier
 * @param role - The user's role (null if not authenticated)
 * @returns true if the role is allowed to delete items
 */
export function canDelete(page: string, role: Role | null): boolean {
  if (!role) return false;
  const actions = PERMISSIONS.actions[page as Page];
  return actions?.delete?.includes(role) ?? false;
}

/**
 * Check if a role can edit a specific field on a specific page
 * @param page - The page identifier
 * @param field - The field identifier
 * @param role - The user's role (null if not authenticated)
 * @returns true if the role is allowed to edit the field
 */
export function canEditField(page: string, field: string, role: Role | null): boolean {
  if (!role) return false;
  const fields = PERMISSIONS.fields[page as Page];
  if (!fields) return false;
  const allowedRoles = fields[field as keyof typeof fields];
  return allowedRoles ? allowedRoles.includes(role) : false;
}

/**
 * Check if a role can perform any edit action (view/edit/delete) on a specific page
 * Used to determine if action menu should be visible at all
 * @param page - The page identifier
 * @param role - The user's role (null if not authenticated)
 * @returns true if the role can perform any CUD (Create, Update, Delete) operation
 */
export function canPerformAnyAction(page: string, role: Role | null): boolean {
  if (!role) return false;
  return canCreate(page, role) || canEdit(page, role) || canDelete(page, role);
}
