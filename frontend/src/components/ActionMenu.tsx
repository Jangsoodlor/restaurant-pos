type ActionMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export function ActionMenu({ onEdit, onDelete, disabled = false, ariaLabel = "Actions" }: ActionMenuProps) {
  return (
    <details style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
      <summary className="none">
        <button
          type="button"
          className="circle transparent"
          disabled={disabled}
          aria-label={ariaLabel}
        >
          <i>more_vert</i>
        </button>
      </summary>

      <menu className="dropdown right">
        <button
          type="button"
          className="transparent"
          onClick={onEdit}
          disabled={disabled}
        >
          <i>edit</i>
        </button>
        <button
          type="button"
          className="transparent error-text"
          onClick={onDelete}
          disabled={disabled}
        >
          <i>delete</i>
        </button>
      </menu>
    </details>
  );
}