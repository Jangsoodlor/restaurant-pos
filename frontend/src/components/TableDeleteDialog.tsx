type TableDeleteDialogProps = {
  tableName?: string;
  isPending: boolean;
  errorMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function TableDeleteDialog({
  tableName,
  isPending,
  errorMessage,
  onConfirm,
  onCancel,
}: TableDeleteDialogProps) {
  return (
    <article className="round border secondary-container" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--bg-table-reserved)' }}>
      <p>
        Are you sure you want to delete table <strong>{tableName}</strong>? This action cannot be undone.
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
  );
}