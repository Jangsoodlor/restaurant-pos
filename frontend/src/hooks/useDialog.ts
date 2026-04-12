/**
 * Hook for managing modal dialog visibility with Beercss.
 * Maps boolean state to the `.active` class that Beercss uses for transitions.
 *
 * @param isOpen - Whether the dialog should be visible
 * @returns Object with className for the dialog element
 */
export function useDialog(isOpen: boolean) {
  return {
    className: isOpen ? 'active' : '',
  };
}
