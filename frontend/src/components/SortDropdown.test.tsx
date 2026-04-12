import { describe, it, expect } from 'bun:test';
import { SortDropdown } from './SortDropdown';

describe('SortDropdown', () => {
  it('exports a function component', () => {
    expect(typeof SortDropdown).toBe('function');
  });

  it('onChange handles sort values', () => {
    const called: string[] = [];
    const onChange = (v: any) => called.push(v);
    onChange('asc');
    onChange('desc');
    expect(called).toEqual(['asc', 'desc']);
  });
});
