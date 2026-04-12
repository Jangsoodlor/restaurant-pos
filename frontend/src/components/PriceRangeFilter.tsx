import React from 'react';

type Props = {
  min?: number | '';
  max?: number | '';
  onChange: (next: { min?: number | ''; max?: number | '' }) => void;
};

export function PriceRangeFilter({ min = '', max = '', onChange }: Props) {
  return (
    <div className="s12 m6 grid">
      <div className="field s6">
        <input
          id="price-min"
          type="number"
          className="input"
          value={min as any}
          onChange={(e) =>
            onChange({ min: e.target.value === '' ? '' : Number(e.target.value) })
          }
          placeholder="Min"
        />
        <label htmlFor="price-min">Price (min)</label>
      </div>

      <div className="field s6">
        <input
          id="price-max"
          type="number"
          className="input"
          value={max as any}
          onChange={(e) =>
            onChange({ max: e.target.value === '' ? '' : Number(e.target.value) })
          }
          placeholder="Max"
        />
        <label htmlFor="price-max">Price (max)</label>
      </div>
    </div>
  );
}

export default PriceRangeFilter;
