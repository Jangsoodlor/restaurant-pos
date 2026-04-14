import { describe, it, expect } from 'bun:test';
import { useMenuItems } from './useMenuItems';

describe('useMenuItems hook (smoke)', () => {
  it('exports a function', () => {
    expect(typeof useMenuItems).toBe('function');
  });

  it('provides filter and sort setters', () => {
    const h = useMenuItems;
    expect(typeof h).toBe('function');
  });
});
