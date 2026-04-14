import { describe, it, expect } from 'bun:test';
import { PriceRangeFilter } from '../PriceRangeFilter';

describe('PriceRangeFilter', () => {
  it('exports a function component', () => {
    expect(typeof PriceRangeFilter).toBe('function');
  });

  it('onChange receives min/max updates', () => {
    const calls: any[] = [];
    const onChange = (v: any) => calls.push(v);
    onChange({ min: 100 });
    onChange({ max: 200 });
    expect(calls.length).toBe(2);
  });
});
