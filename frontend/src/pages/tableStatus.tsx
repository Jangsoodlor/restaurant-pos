import { useTables } from '@/hooks/useTable';

export function TableStatus() {
  const { data: tables, isPending, error } = useTables();

  if (isPending) return <progress className="circle medium"></progress>;
  if (error) return <article className="round border red-text">Error loading tables: {error.message}</article>;

  return (
    <section>
      <h4>Restaurant Table Status</h4>
      <div className="grid">
        {tables?.map(table => (
          <article key={table.id} className="s12 m6 l4 round border">
            <h6>Table {table.tableName}</h6>
            <p className="no-margin">
              <span className="bold">Status:</span> {table.status}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
