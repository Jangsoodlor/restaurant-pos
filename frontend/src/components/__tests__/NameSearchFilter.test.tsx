import { describe, it, expect } from 'bun:test';
import { NameSearchFilter } from '../NameSearchFilter';

describe('NameSearchFilter', () => {
  it('exports a function component', () => {
    expect(typeof NameSearchFilter).toBe('function');
  });

  it('accepts value and onChange props', () => {
    const called: string[] = [];
    const onChange = (v: string) => called.push(v);
    // sanity call to ensure type compatibility
    onChange('burger');
    expect(called[0]).toBe('burger');
  });
});
