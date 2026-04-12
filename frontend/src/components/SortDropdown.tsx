import React from 'react';

type SortValue = 'none' | 'asc' | 'desc';

type Props = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

export function SortDropdown({ value, onChange }: Props) {
  return (
    <div className="field s12 m4">
      <select
        id="sort-order"
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortValue)}
      >
        <option value="none">No sort</option>
        <option value="asc">Name ↑</option>
        <option value="desc">Name ↓</option>
      </select>
      <label htmlFor="sort-order">Sort</label>
    </div>
  );
}

export default SortDropdown;
