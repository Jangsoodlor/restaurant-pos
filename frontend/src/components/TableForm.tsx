import type { TableStatus as TableStatusEnum } from '@/api/stub/models';

type InteractionMode = 'creating' | 'editing';

export type TableFormData = {
  tableName: string;
  capacity: number;
  status: TableStatusEnum;
};

type TableFormProps = {
  mode: InteractionMode;
  formData: TableFormData;
  isLoading: boolean;
  errorMessage?: string | null;
  onChange: (next: TableFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function TableForm({
  mode,
  formData,
  isLoading,
  errorMessage,
  onChange,
  onSubmit,
  onCancel,
}: TableFormProps) {
  return (
    // "elevate" adds a nice shadow, "padding" is a Beer CSS utility
    <article className="round border elevate padding secondary-container">
      <header>
        <h5 className="no-margin">{mode === 'creating' ? 'Create New Table' : 'Edit Table'}</h5>
      </header>

      {errorMessage && (
        <div className="space">
          <article className="round border red-text pink-light">
            {errorMessage}
          </article>
        </div>
      )}

      {/* Adding a margin-top to separate header from form */}
      <form onSubmit={onSubmit} className="margin-top">
        <div className="grid">
          {/* Table Name - Takes up 6 columns on large screens, 12 on small */}
          <div className="s12 m6 field label border">
            <input
              id="tableName"
              type="text"
              value={formData.tableName}
              onChange={(e) => onChange({ ...formData, tableName: e.target.value })}
              disabled={isLoading}
              required
            />
            <label htmlFor="tableName">Table Name *</label>
          </div>

          {/* Capacity - Takes up 3 columns */}
          <div className="s12 m3 field label border">
            <input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => onChange({ ...formData, capacity: parseInt(e.target.value, 10) || 1 })}
              disabled={isLoading}
              required
            />
            <label htmlFor="capacity">Capacity *</label>
          </div>

          {/* Status - Takes up 3 columns */}
          <div className="s12 m3 field label border">
            <select
              id="status"
              value={formData.status}
              onChange={(e) => onChange({ ...formData, status: e.target.value as TableStatusEnum })}
              disabled={isLoading}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
            <label htmlFor="status">Status *</label>
          </div>
        </div>

        {/* Navigation / Actions */}
        <nav className="right-align no-padding top-margin">
          <button type="button" className="border" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <progress className="circle small white-text"></progress>
            ) : (
              'Save'
            )}
          </button>
        </nav>
      </form>
    </article>
  );
}