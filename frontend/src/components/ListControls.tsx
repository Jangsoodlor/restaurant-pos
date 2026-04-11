import React from 'react';

type ListControlsProps<T, U> = {
  filterOptions: { label: string; value: T }[];
  sortOptions: { label: string; value: U }[];
  filterValue: T;
  sortValue: U;
  onFilterChange: (value: T) => void;
  onSortChange: (value: U) => void;
  filterLabel?: string;
  sortLabel?: string;
};

export function ListControls<T extends string | number, U extends string | number>({
  filterOptions,
  sortOptions,
  filterValue,
  sortValue,
  onFilterChange,
  onSortChange,
  filterLabel = 'Filter',
  sortLabel = 'Sort',
}: ListControlsProps<T, U>) {
  return (
    <div className="grid">
      <div className="s6 m4 l3">
        <div className="field border label">
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value as unknown as T)}
            aria-label={filterLabel}
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label>{filterLabel}</label>
          <i>arrow_drop_down</i>
        </div>
      </div>
      <div className="s6 m4 l3">
        <div className="field border label">
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value as unknown as U)}
            aria-label={sortLabel}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label>{sortLabel}</label>
          <i>arrow_drop_down</i>
        </div>
      </div>
    </div>
  );
}