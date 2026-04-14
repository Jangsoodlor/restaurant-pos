import type { Table } from '@/api/stub/models';
import { ActionMenu } from './ActionMenu';

type TableCardProps = {
  table: Table;
  onEdit?: (table: Table) => void;
  onDelete?: (tableId: number) => void;
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
      {(onEdit || onDelete) && (
        <ActionMenu
          onEdit={onEdit ? () => onEdit(table) : undefined}
          onDelete={onDelete ? () => onDelete(table.id!) : undefined}
          disabled={disabled}
          ariaLabel={`Table actions for ${table.tableName}`}
        />
      )}
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