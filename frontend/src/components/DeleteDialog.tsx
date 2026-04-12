import { useDialog } from '../hooks/useDialog';

type DeleteDialogProps = {
  itemName?: string;
  isPending: boolean;
  isOpen: boolean;
  errorMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Generic delete confirmation dialog component.
 * Reusable for any entity type (tables, users, etc.)
 * Renders as a modal dialog.
 *
 * @param itemName - Display name of the item being deleted (e.g., "Table 5", "John Doe")
 * @param isPending - Whether the delete operation is in progress
 * @param isOpen - Whether the dialog is visible
 * @param errorMessage - Optional error message to display
 * @param onConfirm - Callback when user confirms deletion
 * @param onCancel - Callback when user cancels deletion
 */
export function DeleteDialog({
  itemName,
  isPending,
  isOpen,
  errorMessage,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  const dialog = useDialog(isOpen);

  return (
    <dialog className={`round ${dialog.className}`} closedby="any">
      <article
        className="border secondary-container"
        style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-table-reserved)',
        }}
      >
        <p>
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onConfirm} disabled={isPending} className="red">
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={onCancel} disabled={isPending}>
            Cancel
          </button>
        </div>
        {errorMessage && (
          <article className="round border red-text" style={{ marginTop: '0.5rem' }}>
            {errorMessage}
          </article>
        )}
      </article>
    </dialog>
  );
}
