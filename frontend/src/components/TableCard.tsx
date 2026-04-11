import type { Table } from '@/api/stub/models';

type TableCardProps = {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (tableId: number) => void;
  disabled?: boolean;
};

const statusBackground: Record<string, string> = {
  available: 'var(--bg-table-available)',
  occupied: 'var(--bg-table-occupied)',
  reserved: 'var(--bg-table-reserved)',
};
export function TableCard({ table, onEdit, onDelete, disabled = false }: TableCardProps) {
  const backgroundColor = statusBackground[table.status] ?? '#ffffff';

  return (
    <article
      className="s12 m6 l4 round border"
      style={{
        backgroundColor,
        padding: '1rem',
        position: 'relative',
        overflowWrap: 'anywhere',
      }}
    >
      <details style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
        <summary className="none"> {/* "none" removes the default arrow in some versions */}
          <button
            type="button"
            className="circle transparent"
            disabled={disabled}
            aria-label={`Table actions for ${table.tableName}`}
          >
            <i>more_vert</i> {/* Beer CSS usually uses Material Icons; '⋮' works too */}
          </button>
        </summary>

        {/* Adding 'dropdown' and 'right' classes is the magic trick */}
        <menu className="dropdown right">
          <button
            type="button"
            className="transparent"
            onClick={() => onEdit(table)}
            disabled={disabled}
          >
            <i>edit</i>
          </button>
          <button
            type="button"
            className="transparent error-text"
            onClick={() => onDelete(table.id!)}
            disabled={disabled}
          >
            <i>delete</i>
          </button>
        </menu>
      </details>
      <h6 style={{ marginRight: '2.5rem', marginTop: 0 }}>Table {table.tableName}</h6>
      <p className="no-margin">
        <span className="bold">Status:</span> {table.status}
      </p>
      <p className="no-margin">
        <span className="bold">Capacity:</span> {table.capacity}
      </p>
    </article>
  );
}