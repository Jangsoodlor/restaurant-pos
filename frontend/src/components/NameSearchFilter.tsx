import React from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function NameSearchFilter({ value, onChange, placeholder }: Props) {
  return (
    <div className="field s12 m6">
      <input
        id="name-search"
        type="text"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search by name'}
      />
      <label htmlFor="name-search">Name</label>
    </div>
  );
}

export default NameSearchFilter;
