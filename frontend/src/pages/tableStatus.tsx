import { useTables } from '@/hooks/useTable';

export function TableStatus() {
  const { data: tables, isPending, error } = useTables();

  if (isPending) return <p>Loading tables...</p>;
  if (error) return <p>Error loading tables: {error.message}</p>;

  return (
    <div>
      <h1>Restaurant Table Status</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {tables?.map(table => (
          <div key={table.id} style={{ border: '1px solid black', padding: '1rem' }}>
            <h3>Table {table.tableName}</h3>
            <p>Status: {table.status}</p>
            {/* Example: "Available", "Occupied", "Needs Cleaning" */}
          </div>
        ))}
      </div>
    </div>
  );
}
